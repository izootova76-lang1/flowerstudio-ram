import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { categoryLabels } from "@/data/catalog";
import { productsQueryOptions } from "@/lib/products";
import { faq, works } from "@/data/content";
import { formatPrice } from "@/data/site";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: products = [] } = useQuery(productsQueryOptions);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Поиск по сайту"
        className="tap-target inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Поиск</span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Букеты, растения, вопросы о доставке…" />
        <CommandList>
          <CommandEmpty>Ничего не нашлось. Попробуйте другое слово.</CommandEmpty>
          <CommandGroup heading="Каталог">
            {products.map((p) => (
              <CommandItem
                key={p.slug}
                value={`${p.title} ${p.short} ${p.tags.join(" ")} ${categoryLabels[p.category]}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: "/catalog/$slug", params: { slug: p.slug } });
                }}
                asChild
              >
                <Link
                  to="/catalog/$slug"
                  params={{ slug: p.slug }}
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-between gap-3"
                >
                  <span>
                    {p.title}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {categoryLabels[p.category]}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">{formatPrice(p.price)}</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Наши работы">
            {works.map((w) => (
              <CommandItem
                key={w.slug}
                value={`${w.title} ${w.text} ${w.category}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: "/works" });
                }}
                asChild
              >
                <Link to="/works" onClick={() => setOpen(false)}>
                  {w.title}
                  <span className="ml-2 text-xs text-muted-foreground">{w.category}</span>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Вопросы и ответы">
            {faq.map((f) => (
              <CommandItem
                key={f.q}
                value={`${f.q} ${f.a}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: "/faq" });
                }}
                asChild
              >
                <Link to="/faq" onClick={() => setOpen(false)}>
                  {f.q}
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}