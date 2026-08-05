import { createFileRoute, notFound } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import { legalPages } from "@/data/content";

export const Route = createFileRoute("/legal/$slug")({
  loader: ({ params }) => {
    const page = Object.values(legalPages).find((p) => p.slug === params.slug);
    if (!page) throw notFound();
    return { page };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.page ? `${loaderData.page.title} — Flower Studio` : "Документ";
    const description = loaderData?.page
      ? `${loaderData.page.title} цветочной студии Flower Studio. Редакция от ${loaderData.page.updated}.`
      : "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <Page title="Документ не открылся">
      <p className="mx-auto max-w-3xl px-4 text-muted-foreground">{error.message}</p>
    </Page>
  ),
  notFoundComponent: () => (
    <Page title="Документ не найден">
      <p className="mx-auto max-w-3xl px-4 text-muted-foreground">
        Проверьте ссылку — все документы перечислены в подвале сайта.
      </p>
    </Page>
  ),
  component: LegalPage,
});

function LegalPage() {
  const { page } = Route.useLoaderData();

  return (
    <Page title={page.title} lead={`Редакция от ${page.updated}`}>
      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-20">
        {page.body.map(([heading, text]) => (
          <section key={heading}>
            <h2 className="mb-2 text-xl">{heading}</h2>
            <p className="leading-relaxed text-muted-foreground">{text}</p>
          </section>
        ))}
      </div>
    </Page>
  );
}