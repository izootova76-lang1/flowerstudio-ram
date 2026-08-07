import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { categoryLabels, type Mood } from "@/data/catalog";
import type { PublicProduct } from "@/lib/product-types";
import { productsQueryOptions } from "@/lib/products";
import { formatPrice, site } from "@/data/site";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/catalog/$slug")({
  loader: async ({ params, context }) => {
    const all = await context.queryClient.ensureQueryData(productsQueryOptions);
    const product = all.find((p) => p.slug === params.slug);
    if (!product) throw notFound();
    const related = all
      .filter((p) => p.slug !== product.slug && p.category === product.category)
      .slice(0, 4);
    return { product, related };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.title} — Flower Studio` : "Товар — Flower Studio";
    const description = p ? `${p.short}. ${formatPrice(p.price)}. Доставка по Раменскому.` : "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <Page title="Не получилось открыть товар">
      <p className="mx-auto max-w-6xl px-4 text-muted-foreground">{error.message}</p>
    </Page>
  ),
  notFoundComponent: () => (
    <Page title="Такой позиции нет">
      <p className="mx-auto max-w-6xl px-4 text-muted-foreground">
        Возможно, она уже разобрана. Загляните в каталог — там есть похожие варианты.
      </p>
    </Page>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product, related } = Route.useLoaderData() as {
    product: PublicProduct;
    related: PublicProduct[];
  };
  const { add } = useCart();

  return (
    <Page>
      <article className="mx-auto max-w-6xl px-4 pt-10">
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link to="/catalog" className="hover:text-foreground">
            Каталог
          </Link>
          <span className="px-2">/</span>
          <span>{categoryLabels[product.category]}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.title}
              width={1024}
              height={1280}
              className="size-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl">{product.title}</h1>
              <p className="mt-2 text-muted-foreground">{product.short}</p>
            </div>
            <p className="text-2xl text-primary">{formatPrice(product.price)}</p>
            <p className="leading-relaxed text-foreground/90">{product.description}</p>

            <div className="flex flex-wrap gap-2">
              {product.moods.map((m: Mood) => (
                <span
                  key={m}
                  className="rounded-full bg-accent px-3 py-1 text-xs text-accent-foreground"
                >
                  {m}
                </span>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => {
                add({
                  slug: product.slug,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                });
                toast.success("Добавили в корзину", { description: product.title });
              }}
            >
              Добавить в корзину
            </Button>

            <dl className="space-y-4 border-t border-border pt-6 text-sm">
              <div>
                <dt className="text-muted-foreground">Состав</dt>
                <dd className="mt-1">{product.composition.join(", ")}</dd>
              </div>
              {product.size && (
                <div>
                  <dt className="text-muted-foreground">Размер</dt>
                  <dd className="mt-1">{product.size}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Уход</dt>
                <dd className="mt-1">{product.care}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Самовывоз</dt>
                <dd className="mt-1">{site.address}</dd>
              </div>
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <section className="py-20">
            <h2 className="mb-6 text-2xl">Похожее в студии</h2>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </Page>
  );
}