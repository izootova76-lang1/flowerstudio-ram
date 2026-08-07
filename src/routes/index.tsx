import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/ProductCard";
import { StudioStatusBadge } from "@/components/layout/StudioStatus";
import { Wordmark } from "@/components/Wordmark";
import { useSuspenseQuery } from "@tanstack/react-query";
import { moods } from "@/data/catalog";
import { productsQueryOptions } from "@/lib/products";
import { reviews, works } from "@/data/content";
import { site } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Flower Studio — цветочная студия в Раменском" },
      {
        name: "description",
        content:
          "Авторские букеты, комнатные растения и шары в Раменском. Собираем из свежей срезки каждый день, доставляем по городу и окрестностям.",
      },
      { property: "og:title", content: "Flower Studio — цветочная студия в Раменском" },
      {
        property: "og:description",
        content:
          "Букеты из свежей срезки, растения и оформление праздников. Студия в центре Раменского.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Florist",
          name: "Flower Studio",
          address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: site.city },
          telephone: site.phone,
          email: site.email,
          openingHours: "Mo-Sa 09:00-21:00, Su 09:00-20:00",
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: Home,
});

function Home() {
  const { data: products } = useSuspenseQuery(productsQueryOptions);
  const featured = products.filter((p) => p.category === "bouquets").slice(0, 4);
  const plants = products.filter((p) => p.category === "plants").slice(0, 3);

  return (
    <Page>
      <section className="relative">
        <div className="relative flex h-[92vh] min-h-[620px] w-full items-center overflow-hidden md:h-[88vh]">
          <img
            src="/images/hero.jpg"
            alt="Рабочий стол флориста: авторский букет в крафтовой бумаге, эвкалипт и льняная лента"
            width={1920}
            height={1280}
            className="absolute inset-0 size-full object-cover object-[62%_center] md:object-[70%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/47 via-background/22 to-background/60" />
          <div className="relative mx-auto w-full max-w-4xl px-5 text-center md:-translate-y-4">
            <h1 className="flex justify-center">
              <Wordmark size="lg" />
            </h1>

            <ul className="mx-auto mt-9 flex max-w-md flex-wrap items-center justify-center gap-2 sm:mt-11 sm:max-w-none sm:gap-3">
              {["Свежие цветы", "Авторские букеты", "Растения для дома"].map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-sage/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] text-foreground/85 backdrop-blur-[2px] sm:px-7 sm:py-3 sm:text-xs"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <p className="mx-auto mt-12 max-w-xl font-display text-[1.7rem] leading-snug text-foreground sm:mt-14 md:text-4xl">
              Для тех моментов, которые хочется запомнить.
            </p>
            <p className="mt-5 text-sm tracking-[0.06em] text-foreground/75 sm:text-base">
              Собираем с любовью.
            </p>

            <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:mt-14 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/catalog"
                className="rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-primary/90 sm:py-3.5"
              >
                Выбрать букет
              </Link>
              <Link
                to="/constructor"
                className="rounded-full border border-foreground/40 bg-background/45 px-8 py-4 text-xs uppercase tracking-[0.18em] text-foreground backdrop-blur-[2px] transition-colors hover:border-foreground/70 hover:bg-background/65 sm:py-3.5"
              >
                Собрать букет
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl">Сегодня в студии</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Свежая срезка приезжает утром — эти позиции сейчас в наличии.
            </p>
          </div>
          <StudioStatusBadge />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl">Подобрать по настроению</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Иногда проще сказать, каким должен быть букет, чем какие в нём цветы.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {moods.map((m) => (
              <Link
                key={m}
                to="/catalog"
                search={{ mood: m }}
                className="rounded-full border border-border bg-background px-5 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center">
        <div className="overflow-hidden rounded-lg">
          <img
            src="/images/w-2.jpg"
            alt="Флорист собирает букет"
            loading="lazy"
            width={1024}
            height={1280}
            className="w-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl">О студии</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            <span className="uppercase tracking-[0.14em] text-foreground">Flower Studio</span> —
            семейная цветочная студия, которая с 2021 года помогает сделать важные моменты жизни
            ещё красивее.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Уже более пяти лет мы создаём авторские букеты, подбираем цветы для особых случаев и с
            любовью относимся к каждому заказу.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Для нас важно, чтобы каждый букет был собран с вниманием к деталям и передавал именно
            те чувства, которые вы хотите подарить.
          </p>
          <Link
            to="/contacts"
            className="mt-6 inline-block text-primary underline underline-offset-4"
          >
            Как нас найти
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl">Растения для дома</h2>
          <Link to="/catalog" search={{ category: "plants" }} className="text-sm text-primary underline underline-offset-4">
            Все растения
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3">
          {plants.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl">Наши работы</h2>
            <Link to="/works" className="text-sm text-primary underline underline-offset-4">
              Вся галерея
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {works.slice(0, 4).map((w) => (
              <Link key={w.slug} to="/works" className="group overflow-hidden rounded-lg">
                <img
                  src={w.image}
                  alt={w.title}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl">Что о нас говорят</h2>
          <Link to="/reviews" className="text-sm text-primary underline underline-offset-4">
            Все отзывы
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <blockquote key={r.id} className="rounded-lg border border-border bg-card p-5">
              <p className="leading-relaxed text-foreground/90">{r.text}</p>
              <footer className="mt-4 text-sm text-muted-foreground">— {r.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 rounded-lg bg-cream p-8 md:grid-cols-3">
          <div>
            <h2 className="text-2xl">Зайдите к нам</h2>
            <p className="mt-2 text-sm text-muted-foreground">{site.address}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Как дойти</p>
            <p>{site.route}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Связь</p>
            <a href={site.phoneHref} className="block hover:text-foreground">
              {site.phone}
            </a>
            <a href={site.telegram} className="block hover:text-foreground">
              Telegram
            </a>
            <StudioStatusBadge className="mt-2" />
          </div>
        </div>
      </section>
    </Page>
  );
}
