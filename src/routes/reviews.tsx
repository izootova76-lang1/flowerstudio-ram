import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { reviews } from "@/data/content";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Отзывы покупателей — Flower Studio, Раменское" },
      {
        name: "description",
        content:
          "Отзывы о букетах, растениях и доставке цветочной студии в Раменском. Публикуем после проверки, отвечаем на каждый.",
      },
      { property: "og:title", content: "Отзывы — Flower Studio" },
      {
        property: "og:description",
        content: "Что говорят покупатели о букетах и работе студии.",
      },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [agree, setAgree] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast.error("Нужно согласие на обработку персональных данных");
      return;
    }
    setSending(true);
    const { error } = await supabase
      .from("review_submissions")
      .insert({ name: name.trim(), rating: 5, text: text.trim() });
    setSending(false);
    if (error) {
      toast.error("Не получилось отправить отзыв", { description: "Попробуйте ещё раз позже." });
      return;
    }
    setName("");
    setText("");
    setAgree(false);
    toast.success("Спасибо! Отзыв отправлен", {
      description: "Опубликуем после проверки — обычно в течение дня.",
    });
  };

  return (
    <Page
      title="Отзывы"
      lead="Отзывы наших покупателей."
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-20 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {reviews.map((r) => (
            <article key={r.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-lg">{r.name}</span>
              </div>
              <p className="mt-3 leading-relaxed text-foreground/90">{r.text}</p>
              {r.answer && (
                <p className="mt-4 border-l-2 border-accent pl-4 text-sm text-muted-foreground">
                  <span className="mb-1 block font-medium text-foreground">Ответ студии</span>
                  {r.answer}
                </p>
              )}
            </article>
          ))}
        </div>

        <aside className="h-fit rounded-lg bg-cream p-6 lg:sticky lg:top-24">
          <h2 className="text-2xl">Оставить отзыв</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Отзыв появится на сайте после проверки модератором.
          </p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как вас зовут"
              maxLength={60}
            />
            <Textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Расскажите о заказе: что понравилось, что можно улучшить"
              rows={5}
              maxLength={1500}
            />
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <Checkbox
                checked={agree}
                onCheckedChange={(v) => setAgree(v === true)}
                className="mt-0.5"
              />
              <span>
                Согласен(а) с{" "}
                <Link
                  to="/legal/$slug"
                  params={{ slug: "consent" }}
                  className="underline underline-offset-2"
                >
                  обработкой персональных данных
                </Link>
              </span>
            </label>
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? "Отправляем…" : "Отправить отзыв"}
            </Button>
          </form>
        </aside>
      </div>
    </Page>
  );
}