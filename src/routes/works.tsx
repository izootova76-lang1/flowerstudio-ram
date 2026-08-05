import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import { works } from "@/data/content";

const categories = ["Все", "Свадьбы", "Праздники", "Оформление", "Будни студии"] as const;

export const Route = createFileRoute("/works")({
  head: () => ({
    meta: [
      { title: "Наши работы — Flower Studio, Раменское" },
      {
        name: "description",
        content:
          "Фотографии букетов, свадебного оформления, композиций и будней цветочной студии в Раменском.",
      },
      { property: "og:title", content: "Наши работы — Flower Studio" },
      {
        property: "og:description",
        content: "Галерея работ цветочной студии: свадьбы, праздники, оформление.",
      },
    ],
  }),
  component: WorksPage,
});

function WorksPage() {
  const [active, setActive] = useState<(typeof categories)[number]>("Все");
  const list = active === "Все" ? works : works.filter((w) => w.category === active);

  return (
    <Page
      title="Наши работы"
      lead="Настоящие заказы и обычные рабочие дни студии. Без ретуши и стоковых картинок — так, как получилось."
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap gap-2 border-y border-border py-4">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="columns-1 gap-5 py-10 sm:columns-2 lg:columns-3 [&>figure]:mb-5">
          {list.map((w) => (
            <figure key={w.slug} className="break-inside-avoid overflow-hidden rounded-lg bg-card">
              <img
                src={w.image}
                alt={w.title}
                loading="lazy"
                className="w-full object-cover"
              />
              <figcaption className="space-y-1 p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {w.category}
                </p>
                <p className="font-display text-lg">{w.title}</p>
                <p className="text-sm text-muted-foreground">{w.text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Page>
  );
}