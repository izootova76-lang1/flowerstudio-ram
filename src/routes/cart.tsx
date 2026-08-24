import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice, site } from "@/data/site";
import { useCart } from "@/lib/cart";
import { publicAsset } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Корзина и оформление заказа — Flower Studio" },
      {
        name: "description",
        content:
          "Оформление заказа в цветочной студии Раменского: доставка или самовывоз, открытка от руки, подтверждение по телефону.",
      },
      { property: "og:title", content: "Корзина — Flower Studio" },
      { property: "og:description", content: "Оформите заказ букета с доставкой по Раменскому." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, total, clear } = useCart();
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [agree, setAgree] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [comment, setComment] = useState("");

  const deliveryPrice = method === "pickup" || total >= 6000 ? 0 : 300;

  if (done) {
    return (
      <Page title="Заказ отправлен">
        <div className="mx-auto max-w-2xl px-4 pb-20 text-muted-foreground">
          <p>
            Спасибо! Мы получили заявку и свяжемся с вами в рабочее время, чтобы подтвердить состав
            и время. Если хочется быстрее — позвоните нам:{" "}
            <a href={site.phoneHref} className="text-primary underline underline-offset-2">
              {site.phone}
            </a>
            .
          </p>
          <Link to="/catalog" className="mt-6 inline-block text-primary underline underline-offset-2">
            Вернуться в каталог
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <Page title="Корзина">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 lg:grid-cols-[1fr_380px]">
        <div>
          {items.length === 0 ? (
            <p className="text-muted-foreground">
              Пока пусто.{" "}
              <Link to="/catalog" className="text-primary underline underline-offset-2">
                Загляните в каталог
              </Link>{" "}
              или{" "}
              <Link to="/constructor" className="text-primary underline underline-offset-2">
                соберите букет сами
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="flex gap-4 rounded-lg border border-border bg-card p-3"
                >
                  <img
                    src={publicAsset(item.image)}
                    alt={item.title}
                    loading="lazy"
                    className="size-24 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-display text-lg leading-tight">{item.title}</p>
                    {item.note && (
                      <p className="font-hand text-base text-muted-foreground">«{item.note}»</p>
                    )}
                    <p className="mt-1 text-sm text-primary">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Меньше"
                        onClick={() => setQty(item.slug, item.qty - 1)}
                        className="tap-target inline-flex size-7 items-center justify-center rounded-full border border-border"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Больше"
                        onClick={() => setQty(item.slug, item.qty + 1)}
                        className="tap-target inline-flex size-7 items-center justify-center rounded-full border border-border"
                      >
                        <Plus className="size-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Удалить"
                        onClick={() => remove(item.slug)}
                        className="tap-target ml-2 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="h-fit space-y-5 rounded-lg bg-cream p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl">Оформление</h2>

          <div className="flex gap-2">
            {(["delivery", "pickup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`tap-target flex-1 rounded-full border px-3 py-2 text-sm transition-colors ${
                  method === m
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {m === "delivery" ? "Доставка" : "Самовывоз"}
              </button>
            ))}
          </div>

          <form
            className="space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (items.length === 0) {
                toast.error("Добавьте хотя бы одну позицию");
                return;
              }
              if (!agree) {
                toast.error("Нужно согласие на обработку персональных данных");
                return;
              }
              setSending(true);
              try {
                const { error } = await supabase.from("orders").insert({
                  customer_name: name,
                  phone,
                  method,
                  address: method === "delivery" ? address : site.address,
                  recipient: recipient || null,
                  comment: comment || null,
                  items: items.map((i) => ({
                    slug: i.slug,
                    title: i.title,
                    price: i.price,
                    qty: i.qty,
                    note: i.note ?? null,
                  })),
                  items_total: total,
                  delivery_price: deliveryPrice,
                  total: total + deliveryPrice,
                  status: "new",
                });
                if (error) throw new Error(error.message);
                clear();
                setDone(true);
              } catch (err) {
                toast.error("Заявка не отправилась", {
                  description: err instanceof Error ? err.message : "Позвоните нам, пожалуйста",
                });
              } finally {
                setSending(false);
              }
            }}
          >
            <Input
              required
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              required
              type="tel"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {method === "delivery" ? (
              <>
                <Input
                  required
                  placeholder="Адрес доставки"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Input
                  placeholder="Имя и телефон получателя (если сюрприз)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </>
            ) : (
              <p className="rounded-md bg-background p-3 text-sm text-muted-foreground">
                {site.address}
              </p>
            )}
            <Textarea
              placeholder="Комментарий и текст открытки"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Checkbox
                checked={agree}
                onCheckedChange={(v) => setAgree(v === true)}
                aria-label="Согласие с офертой и обработкой персональных данных"
                className="tap-target-lg mt-0.5 shrink-0"
              />
              <span>
                Согласен(а) с{" "}
                <Link to="/legal/$slug" params={{ slug: "offer" }} className="underline">
                  офертой
                </Link>
                ,{" "}
                <Link to="/legal/$slug" params={{ slug: "privacy" }} className="underline">
                  политикой конфиденциальности
                </Link>{" "}
                и{" "}
                <Link to="/legal/$slug" params={{ slug: "consent" }} className="underline">
                  обработкой персональных данных
                </Link>
              </span>
            </div>

            <dl className="space-y-1 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Товары</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Доставка</dt>
                <dd>{deliveryPrice === 0 ? "бесплатно" : formatPrice(deliveryPrice)}</dd>
              </div>
              <div className="flex justify-between pt-1 text-base">
                <dt>Итого</dt>
                <dd className="text-primary">{formatPrice(total + deliveryPrice)}</dd>
              </div>
            </dl>

            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? "Отправляем…" : "Отправить заказ"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Оплата — после подтверждения заказа флористом. Сайт не списывает деньги автоматически.
            </p>
          </form>
        </aside>
      </div>
    </Page>
  );
}