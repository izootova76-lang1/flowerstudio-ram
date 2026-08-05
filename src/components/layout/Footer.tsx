import { Link } from "@tanstack/react-router";
import { site } from "@/data/site";
import { StudioStatusBadge } from "@/components/layout/StudioStatus";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <p className="font-display text-xl">Flower Studio</p>
          <p className="text-sm text-muted-foreground">{site.tagline}</p>
          <StudioStatusBadge />
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Разделы</p>
          <Link to="/catalog" className="block text-muted-foreground hover:text-foreground">
            Каталог
          </Link>
          <Link to="/constructor" className="block text-muted-foreground hover:text-foreground">
            Собрать букет
          </Link>
          <Link to="/works" className="block text-muted-foreground hover:text-foreground">
            Наши работы
          </Link>
          <Link to="/reviews" className="block text-muted-foreground hover:text-foreground">
            Отзывы
          </Link>
          <Link to="/faq" className="block text-muted-foreground hover:text-foreground">
            Вопросы и ответы
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Контакты</p>
          <a href={site.phoneHref} className="block text-muted-foreground hover:text-foreground">
            {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="block text-muted-foreground hover:text-foreground"
          >
            {site.email}
          </a>
          <p className="text-muted-foreground">{site.address}</p>
          <Link to="/delivery" className="block text-muted-foreground hover:text-foreground">
            Условия доставки
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Документы</p>
          <Link
            to="/legal/$slug"
            params={{ slug: "privacy" }}
            className="block text-muted-foreground hover:text-foreground"
          >
            Политика конфиденциальности
          </Link>
          <Link
            to="/legal/$slug"
            params={{ slug: "offer" }}
            className="block text-muted-foreground hover:text-foreground"
          >
            Публичная оферта
          </Link>
          <Link
            to="/legal/$slug"
            params={{ slug: "terms" }}
            className="block text-muted-foreground hover:text-foreground"
          >
            Пользовательское соглашение
          </Link>
          <Link
            to="/legal/$slug"
            params={{ slug: "consent" }}
            className="block text-muted-foreground hover:text-foreground"
          >
            Согласие на обработку данных
          </Link>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Flower Studio, {site.city}. Все изображения на сайте —
        демонстрационные.
      </div>
    </footer>
  );
}