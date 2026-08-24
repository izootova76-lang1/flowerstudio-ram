import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/data/site";
import { useCart } from "@/lib/cart";
import { publicAsset } from "@/lib/utils";

const palettes = [
  { id: "pastel", label: "Пастельная", hint: "пудра, крем, светлая зелень", image: "/images/b-1.jpg" },
  { id: "warm", label: "Тёплая", hint: "терракота, охра, карамель", image: "/images/b-2.jpg" },
  { id: "bright", label: "Яркая", hint: "оранжевый, малиновый, жёлтый", image: "/images/b-4.jpg" },
  { id: "white", label: "Белая", hint: "белый и зелёный", image: "/images/b-5.jpg" },
] as const;

const sizes = [
  { id: "s", label: "Небольшой", price: 2500, hint: "~30 см, комплимент" },
  { id: "m", label: "Средний", price: 4200, hint: "~45 см, самый частый выбор" },
  { id: "l", label: "Большой", price: 6500, hint: "~55 см, заметный подарок" },
] as const;

const wraps = [
  { id: "kraft", label: "Крафт и шпагат", price: 0 },
  { id: "matte", label: "Матовая плёнка", price: 250 },
  { id: "fabric", label: "Ткань", price: 450 },
  { id: "none", label: "Без упаковки, лентой", price: 0 },
] as const;

export const Route = createFileRoute("/constructor")({
  head: () => ({
    meta: [
      { title: "Собрать букет по своему вкусу — Flower Studio" },
      {
        name: "description",
        content:
          "Выберите гамму, размер и упаковку — флорист соберёт букет из свежей срезки и согласует детали до сборки.",
      },
      { property: "og:title", content: "Конструктор букета — Flower Studio" },
      {
        property: "og:description",
        content: "Гамма, размер, упаковка и открытка — соберите букет под свой повод.",
      },
    ],
  }),
  component: ConstructorPage,
});

function ConstructorPage() {
  const [palette, setPalette] = useState<string>("pastel");
  const [size, setSize] = useState<string>("m");
  const [wrap, setWrap] = useState<string>("kraft");
  const [note, setNote] = useState("");
  const { add } = useCart();

  const current = useMemo(() => {
    const p = palettes.find((x) => x.id === palette)!;
    const s = sizes.find((x) => x.id === size)!;
    const w = wraps.find((x) => x.id === wrap)!;
    return { p, s, w, price: s.price + w.price };
  }, [palette, size, wrap]);

  return (
    <Page
      title="Соберите свой букет"
      lead="Это не жёсткий конструктор, а заявка флористу: вы задаёте настроение, мы подбираем цветы из того, что сегодня свежее всего."
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <Step title="1. Гамма">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {palettes.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPalette(p.id)}
                  className={`overflow-hidden rounded-lg border text-left transition-colors ${
                    palette === p.id ? "border-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  <img
                    src={publicAsset(p.image)}
                    alt={p.label}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <span className="block px-3 py-2 text-sm">{p.label}</span>
                  <span className="block px-3 pb-3 text-xs text-muted-foreground">{p.hint}</span>
                </button>
              ))}
            </div>
          </Step>

          <Step title="2. Размер">
            <div className="grid gap-3 sm:grid-cols-3">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s.id)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    size === s.id ? "border-primary bg-cream" : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="block">{s.label}</span>
                  <span className="block text-xs text-muted-foreground">{s.hint}</span>
                  <span className="mt-2 block text-sm text-primary">от {formatPrice(s.price)}</span>
                </button>
              ))}
            </div>
          </Step>

          <Step title="3. Упаковка">
            <div className="flex flex-wrap gap-2">
              {wraps.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWrap(w.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                    wrap === w.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {w.label}
                  {w.price > 0 && ` · +${w.price} ₽`}
                </button>
              ))}
            </div>
          </Step>

          <Step title="4. Открытка">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Текст открытки — напишем от руки. Можно оставить пустым."
              rows={4}
            />
          </Step>
        </div>

        <aside className="h-fit space-y-4 rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24">
          <img
            src={publicAsset(current.p.image)}
            alt="Пример гаммы букета"
            loading="lazy"
            className="aspect-[4/5] w-full rounded-md object-cover"
          />
          <div className="space-y-1 text-sm">
            <p className="font-display text-xl">Ваш букет</p>
            <p className="text-muted-foreground">Гамма: {current.p.label.toLowerCase()}</p>
            <p className="text-muted-foreground">Размер: {current.s.label.toLowerCase()}</p>
            <p className="text-muted-foreground">Упаковка: {current.w.label.toLowerCase()}</p>
            {note && <p className="font-hand text-lg text-foreground">«{note}»</p>}
          </div>
          <p className="text-2xl text-primary">от {formatPrice(current.price)}</p>
          <Button
            className="w-full"
            onClick={() => {
              add({
                slug: `custom-${palette}-${size}-${wrap}`,
                title: `Букет на заказ · ${current.p.label.toLowerCase()}, ${current.s.label.toLowerCase()}`,
                price: current.price,
                image: current.p.image,
                ...(note ? { note } : {}),
              });
              toast.success("Заявка добавлена в корзину", {
                description: "Флорист свяжется, чтобы уточнить детали.",
              });
            }}
          >
            Добавить в корзину
          </Button>
          <p className="text-xs text-muted-foreground">
            Итоговую стоимость подтвердим до сборки. Если бюджет ограничен — скажите, соберём в него.
          </p>
        </aside>
      </div>
    </Page>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xl">{title}</h2>
      {children}
    </section>
  );
}