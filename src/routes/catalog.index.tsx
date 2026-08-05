import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Page } from "@/components/layout/Page";
import { ProductCard } from "@/components/ProductCard";
import { categoryLabels, moods, products, type Category, type Mood } from "@/data/catalog";

type CatalogSearch = { category: string; mood: string; sort: string };

export const Route = createFileRoute("/catalog/")({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => ({
    category: typeof search["category"] === "string" ? search["category"] : "all",
    mood: typeof search["mood"] === "string" ? search["mood"] : "all",
    sort: typeof search["sort"] === "string" ? search["sort"] : "default",
  }),
  head: () => ({
    meta: [
      { title: "Каталог букетов, растений и шаров — Flower Studio" },
      {
        name: "description",
        content:
          "Авторские букеты, комнатные растения и гелиевые шары в Раменском. Подбор по настроению и бюджету, доставка по городу.",
      },
      { property: "og:title", content: "Каталог — Flower Studio" },
      {
        property: "og:description",
        content: "Букеты, растения и шары цветочной студии в Раменском.",
      },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const { category, mood, sort } = Route.useSearch();
  const navigate = useNavigate({ from: "/catalog" });

  const filtered = products
    .filter((p) => (category === "all" ? true : p.category === (category as Category)))
    .filter((p) => (mood === "all" ? true : p.moods.includes(mood as Mood)));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    return 0;
  });

  const set = (patch: Partial<CatalogSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  return (
    <Page
      title="Каталог"
      lead="Собираем букеты каждый день из свежей срезки. Состав может немного меняться по сезону — гамму и настроение сохраняем."
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center gap-2 border-y border-border py-4">
          <FilterGroup
            label="Раздел"
            value={category}
            onChange={(v) => set({ category: v })}
            options={[
              { value: "all", label: "Все" },
              ...(Object.keys(categoryLabels) as Category[]).map((c) => ({
                value: c,
                label: categoryLabels[c],
              })),
            ]}
          />
          <FilterGroup
            label="Настроение"
            value={mood}
            onChange={(v) => set({ mood: v })}
            options={[
              { value: "all", label: "Любое" },
              ...moods.map((m) => ({ value: m, label: m })),
            ]}
          />
          <FilterGroup
            label="Сортировка"
            value={sort}
            onChange={(v) => set({ sort: v })}
            options={[
              { value: "default", label: "По умолчанию" },
              { value: "price-asc", label: "Сначала дешевле" },
              { value: "price-desc", label: "Сначала дороже" },
            ]}
          />
        </div>

        <p className="py-6 text-sm text-muted-foreground">Найдено позиций: {sorted.length}</p>

        {sorted.length === 0 ? (
          <p className="pb-20 text-muted-foreground">
            По этим параметрам ничего нет. Попробуйте изменить фильтры или напишите нам — соберём
            вариант под запрос.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 pb-20 md:grid-cols-3 lg:grid-cols-4">
            {sorted.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

function FilterGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 pr-6">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-full border px-3 py-1 text-sm transition-colors ${
            value === o.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}