import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import { StudioStatusBadge } from "@/components/layout/StudioStatus";
import { site } from "@/data/site";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакты студии — Flower Studio, Раменское" },
      {
        name: "description",
        content:
          "Адрес цветочной студии в Раменском, часы работы, телефон и мессенджеры. Как найти нас в торговом центре.",
      },
      { property: "og:title", content: "Контакты — Flower Studio" },
      {
        property: "og:description",
        content: "Адрес, часы работы и связь с цветочной студией в Раменском.",
      },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <Page title="Контакты" lead="Заходите в студию или напишите — отвечаем в рабочее время.">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 md:grid-cols-2">
        <div className="space-y-8">
          <div>
            <h2 className="mb-2 text-2xl">Адрес</h2>
            <p className="text-muted-foreground">{site.address}</p>
            <p className="mt-3 rounded-lg bg-cream p-4 text-sm text-muted-foreground">
              <span className="mb-1 block font-medium text-foreground">Как дойти</span>
              {site.route}
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-2xl">Связь</h2>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <a href={site.phoneHref} className="hover:text-foreground">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-foreground">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={site.telegram} className="hover:text-foreground">
                  Telegram
                </a>
                {" · "}
                <a href={site.whatsapp} className="hover:text-foreground">
                  WhatsApp
                </a>
              </li>
              <li>{site.instagramLabel}</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-2 text-2xl">Часы работы</h2>
            <StudioStatusBadge />
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const h = site.hours.find((x) => x.day === d)!;
                return (
                  <li key={d} className="flex max-w-xs justify-between">
                    <span>{h.label}</span>
                    <span>
                      {h.open}–{h.close}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-muted">
          <img
            src="/images/w-6.jpg"
            alt="Витрина цветочной студии в торговом центре"
            loading="lazy"
            width={1280}
            height={1024}
            className="size-full object-cover"
          />
        </div>
      </div>
    </Page>
  );
}