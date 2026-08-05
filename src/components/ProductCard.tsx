import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/data/site";
import type { Product } from "@/data/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/catalog/$slug"
      params={{ slug: product.slug }}
      className="group block overflow-hidden rounded-lg bg-card transition-shadow hover:shadow-md"
    >
      <div className="aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          width={1024}
          height={1280}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="space-y-1 px-1 py-3">
        <h3 className="text-lg leading-tight">{product.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short}</p>
        <p className="pt-1 text-sm font-medium text-primary">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}