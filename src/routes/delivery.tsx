import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import { formatPrice, site } from "@/data/site";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { title: "Доставка и оплата — Flower Studio, Раменское" },
      {
        name: "description",
        content:
          "Доставка букетов по Раменскому и окрестностям: зоны, стоимость, сроки, способы оплаты и самовывоз из студии.",
      },
      { property: "og:title", content: "Доставка и оплата — Flower Studio" },
      {
        property: "og:description",
        content: "Зоны и стоимость доставки цветов по Раменскому, оплата и самовывоз.",
      },
    ],
  }),
  component: DeliveryPage,
});

function DeliveryPage() {
  return (
    <Page
      title="Доставка и оплата"
      lead="Возим сами и через проверенных курьеров. Букет едет в коробке-фиксаторе, чтобы доехать таким же, каким его собрали."
    >
      <div className="mx-auto max-w-4xl space-y-14 px-4 pb-20">
        <section>
          <h2 className="mb-4 text-2xl">Зоны и стоимость</h2>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-cream text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Куда</th>
                  <th className="px-4 py-3 font-medium">Стоимость</th>
                  <th className="px-4 py-3 font-medium">Срок</th>
                </tr>
              </thead>
              <tbody>
                {site.deliveryZones.map((z) => (
                  <tr key={z.zone} className="border-t border-border">
                    <td className="px-4 py-3">{z.zone}</td>
                    <td className="px-4 py-3">{formatPrice(z.price)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{z.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            При заказе от 6000 ₽ доставка по Раменскому бесплатная.
          </p>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-2xl">Как это работает</h2>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li>1. Вы оставляете заказ на сайте или пишете нам в мессенджер.</li>
              <li>2. Мы подтверждаем состав, дату и интервал доставки.</li>
              <li>3. Собираем букет и, если нужно, присылаем фото до отправки.</li>
              <li>4. Курьер связывается с получателем за 20–30 минут до вручения.</li>
            </ol>
          </div>
          <div>
            <h2 className="mb-3 text-2xl">Оплата</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>Наличными или картой в студии.</li>
              <li>Переводом по ссылке — пришлём в мессенджер.</li>
              <li>По счёту для организаций, с закрывающими документами.</li>
              <li>Предоплата 50% — только для индивидуальных композиций и оформления.</li>
            </ul>
          </div>
        </section>

        <section className="rounded-lg bg-cream p-6">
          <h2 className="mb-2 text-2xl">Самовывоз</h2>
          <p className="text-sm text-muted-foreground">{site.address}</p>
          <p className="mt-2 text-sm text-muted-foreground">{site.route}</p>
        </section>
      </div>
    </Page>
  );
}