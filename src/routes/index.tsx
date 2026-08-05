import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/ProductCard";
import { StudioStatusBadge } from "@/components/layout/StudioStatus";
import { products, moods } from "@/data/catalog";
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
  component: Home,
});

function Home() {
  const featured = products.filter((p) => p.category === "bouquets").slice(0, 4);
  const plants = products.filter((p) => p.category === "plants").slice(0, 3);
  const todayPicks = products.filter((p) => ["b-", "s-"].some(() => true)).slice(0, 6);

  return (
    <Page>
      <section className="relative">
        <div className="relative h-[70vh] min-h-[440px] w-full overflow-hidden">
          <img
            src="/images/hero.jpg"
            alt="Интерьер цветочной студии в Раменском"
            width={1920}
            height={1280}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-4 pb-12">
            <p className="font-hand text-2xl text-background/90">{site.city}</p>
            <h1 className="mt-2 max-w-2xl text-4xl text-background md:text-6xl">
              Цветы, собранные руками, а не по шаблону
            </h1>
            <p className="mt-4 max-w-xl text-background/85">
              Небольшая студия, где каждый букет собирается под человека и повод. Заходите в гости
              или закажите доставку по Раменскому.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/catalog"
                className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Смотреть каталог
              </Link>
              <Link
                to="/constructor"
                className="rounded-full border border-background/60 px-6 py-3 text-sm text-background transition-colors hover:bg-background/10"
              >
                Собрать свой букет
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
                search={{ category: "all", mood: m, sort: "default" }}
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
            Мы работаем в Раменском и знаем своих покупателей в лицо. Не собираем «конвейерные»
            букеты и не уговариваем взять дороже: если у вас бюджет 2500 ₽ — соберём красивый букет
            за 2500 ₽.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Каждый заказ проходит через руки флориста: зачищаем стебли, подбираем сочетания,
            проверяем, как букет смотрится с разных сторон. К букету прикладываем памятку по уходу,
            а открытку подписываем от руки.
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
          <Link to="/catalog" search={{ category: "plants", mood: "all", sort: "default" }} className="text-sm text-primary underline underline-offset-4">
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
      {todayPicks.length === 0 && null}
    </Page>
  );
}
