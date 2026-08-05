import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/data/content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Вопросы и ответы — Flower Studio" },
      {
        name: "description",
        content:
          "Как заказать букет, сколько стоит доставка по Раменскому, что делать, если цветы завяли, и другие частые вопросы.",
      },
      { property: "og:title", content: "Вопросы и ответы — Flower Studio" },
      {
        property: "og:description",
        content: "Заказ, доставка, оплата и уход за цветами — коротко и по делу.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const groups = Array.from(new Set(faq.map((f) => f.group)));

  return (
    <Page
      title="Вопросы и ответы"
      lead="Собрали то, о чём чаще всего спрашивают в студии и в переписке."
    >
      <div className="mx-auto max-w-3xl space-y-10 px-4 pb-20">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">{group}</h2>
            <Accordion type="single" collapsible className="w-full">
              {faq
                .filter((f) => f.group === group)
                .map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </section>
        ))}
      </div>
    </Page>
  );
}