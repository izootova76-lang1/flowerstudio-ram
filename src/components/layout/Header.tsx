import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { SearchDialog } from "@/components/SearchDialog";
import { StudioStatusBadge } from "@/components/layout/StudioStatus";
import { useCart } from "@/lib/cart";
import { site } from "@/data/site";

const nav = [
  { to: "/catalog", label: "Каталог" },
  { to: "/constructor", label: "Собрать букет" },
  { to: "/works", label: "Наши работы" },
  { to: "/reviews", label: "Отзывы" },
  { to: "/delivery", label: "Доставка" },
  { to: "/faq", label: "Вопросы" },
  { to: "/contacts", label: "Контакты" },
] as const;

export function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="mr-auto flex flex-col leading-none">
          <span className="font-display text-xl tracking-tight">Flower Studio</span>
          <StudioStatusBadge className="mt-1" />
        </Link>

        <nav className="hidden items-center gap-5 text-sm lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <SearchDialog />

        <Link
          to="/cart"
          aria-label="Корзина"
          className="relative inline-flex size-9 items-center justify-center rounded-full border border-border transition-colors hover:border-primary/40"
        >
          <ShoppingBag className="size-4" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-primary-foreground">
              {count}
            </span>
          )}
        </Link>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-full border border-border lg:hidden"
          aria-label="Меню"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 lg:hidden">
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <a href={site.phoneHref} className="mt-3 block px-2 text-sm text-primary">
            {site.phone}
          </a>
        </nav>
      )}
    </header>
  );
}