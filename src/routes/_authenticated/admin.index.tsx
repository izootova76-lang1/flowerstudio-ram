import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { categoryLabels, moods as allMoods, type Category } from "@/data/catalog";
import { formatPrice } from "@/data/site";
import {
  createProduct,
  deleteProduct,
  fetchAdminProducts,
  updateProduct,
  uploadProductImage,
  type AdminProduct,
  type ProductInput,
} from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminProducts,
});

const categories = Object.keys(categoryLabels) as Category[];

function emptyProduct(sortOrder: number): ProductInput {
  return {
    slug: "",
    title: "",
    category: "bouquets",
    price: 0,
    image: "",
    short: "",
    description: "",
    composition: [],
    care: "",
    moods: [],
    tags: [],
    size: null,
    sort_order: sortOrder,
    visible: true,
    available: true,
  };
}

function toInput(p: AdminProduct): ProductInput {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    price: p.price,
    image: p.image,
    short: p.short,
    description: p.description,
    composition: p.composition,
    care: p.care,
    moods: p.moods,
    tags: p.tags,
    size: p.size ?? null,
    sort_order: p.sortOrder,
    visible: p.visible,
    available: p.available,
  };
}

function slugify(value: string) {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
    к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
    х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return value
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function AdminProducts() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: products = [], isPending } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchAdminProducts,
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["public-products"] });
  };

  const toggle = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<ProductInput> }) =>
      updateProduct(id, patch),
    onSuccess: () => {
      refresh();
      toast.success("Сохранили");
    },
    onError: (e: Error) => toast.error("Не сохранилось", { description: e.message }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      refresh();
      toast.success("Товар удалён");
    },
    onError: (e: Error) => toast.error("Не удалось удалить", { description: e.message }),
  });

  const nextOrder = (products.at(-1)?.sortOrder ?? 0) + 10;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {isPending ? "Загружаем каталог…" : `Всего позиций: ${products.length}`}
        </p>
        <Button
          onClick={() => {
            setCreating((v) => !v);
            setEditingId(null);
          }}
          className="h-11"
        >
          <Plus className="mr-1 size-4" /> {creating ? "Закрыть" : "Новый товар"}
        </Button>
      </div>

      {creating && (
        <ProductForm
          initial={emptyProduct(nextOrder)}
          onCancel={() => setCreating(false)}
          onSubmit={async (input) => {
            await createProduct(input);
            refresh();
            setCreating(false);
            toast.success("Товар добавлен");
          }}
        />
      )}

      <ul className="space-y-4">
        {products.map((p) => (
          <li key={p.id} className="rounded-lg border border-border bg-card p-3">
            <div className="flex gap-3">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.title}
                  className="size-20 shrink-0 rounded-md object-cover sm:size-24"
                />
              ) : (
                <div className="size-20 shrink-0 rounded-md bg-muted sm:size-24" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg leading-tight">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {categoryLabels[p.category]} · {formatPrice(p.price)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                  <label className="flex items-center gap-2">
                    <Switch
                      checked={p.visible}
                      onCheckedChange={(v) => toggle.mutate({ id: p.id, patch: { visible: v } })}
                    />
                    <span className="text-muted-foreground">
                      {p.visible ? (
                        <span className="inline-flex items-center gap-1">
                          <Eye className="size-3" /> на сайте
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <EyeOff className="size-3" /> скрыт
                        </span>
                      )}
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Switch
                      checked={p.available}
                      onCheckedChange={(v) => toggle.mutate({ id: p.id, patch: { available: v } })}
                    />
                    <span className="text-muted-foreground">
                      {p.available ? "в наличии" : "нет в наличии"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-10"
                onClick={() => {
                  setCreating(false);
                  setEditingId(editingId === p.id ? null : p.id);
                }}
              >
                {editingId === p.id ? "Свернуть" : "Редактировать"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10"
                onClick={() =>
                  toggle.mutate({ id: p.id, patch: { sort_order: p.sortOrder - 15 } })
                }
              >
                Выше
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-10"
                onClick={() =>
                  toggle.mutate({ id: p.id, patch: { sort_order: p.sortOrder + 15 } })
                }
              >
                Ниже
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 text-destructive"
                onClick={() => {
                  if (window.confirm(`Удалить «${p.title}» без возможности вернуть?`)) {
                    remove.mutate(p.id);
                  }
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            {editingId === p.id && (
              <div className="mt-4 border-t border-border pt-4">
                <ProductForm
                  initial={toInput(p)}
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (input) => {
                    await updateProduct(p.id, input);
                    refresh();
                    setEditingId(null);
                    toast.success("Изменения сохранены");
                  }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ProductForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: ProductInput;
  onSubmit: (input: ProductInput) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductInput>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function onFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      set("image", url);
      toast.success("Фото загружено");
    } catch (e) {
      toast.error("Фото не загрузилось", {
        description: e instanceof Error ? e.message : undefined,
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const slug = form.slug.trim() || slugify(form.title);
        if (!form.title.trim()) {
          toast.error("Нужно название");
          return;
        }
        setSaving(true);
        try {
          await onSubmit({ ...form, slug, size: form.size?.trim() ? form.size : null });
        } catch (err) {
          toast.error("Не сохранилось", {
            description: err instanceof Error ? err.message : undefined,
          });
        } finally {
          setSaving(false);
        }
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        {form.image ? (
          <img src={form.image} alt="" className="size-28 rounded-md object-cover" />
        ) : (
          <div className="size-28 rounded-md bg-muted" />
        )}
        <div className="flex-1 space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
            }}
            className="block w-full text-sm file:mr-3 file:h-11 file:rounded-full file:border file:border-border file:bg-background file:px-4 file:text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {uploading ? "Загружаем фото…" : "Можно выбрать снимок из галереи телефона или сделать новый."}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Название">
          <Input
            className="h-11"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Название товара"
          />
        </Field>
        <Field label="Цена, ₽">
          <Input
            className="h-11"
            type="number"
            inputMode="numeric"
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </Field>
        <Field label="Категория">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("category", c)}
                className={`rounded-full border px-4 py-2 text-sm ${
                  form.category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {categoryLabels[c]}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Порядок показа">
          <Input
            className="h-11"
            type="number"
            inputMode="numeric"
            value={form.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
          />
        </Field>
      </div>

      <Field label="Короткое описание">
        <Input
          className="h-11"
          value={form.short}
          onChange={(e) => set("short", e.target.value)}
          placeholder="Одна фраза для карточки"
        />
      </Field>

      <Field label="Описание">
        <Textarea
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Состав (через запятую)">
          <Input
            className="h-11"
            value={form.composition.join(", ")}
            onChange={(e) =>
              set(
                "composition",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              )
            }
          />
        </Field>
        <Field label="Теги (через запятую)">
          <Input
            className="h-11"
            value={form.tags.join(", ")}
            onChange={(e) =>
              set("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
            }
          />
        </Field>
        <Field label="Уход">
          <Input className="h-11" value={form.care} onChange={(e) => set("care", e.target.value)} />
        </Field>
        <Field label="Размер">
          <Input
            className="h-11"
            value={form.size ?? ""}
            onChange={(e) => set("size", e.target.value)}
            placeholder="Например, высота ~45 см"
          />
        </Field>
      </div>

      <Field label="Настроение">
        <div className="flex flex-wrap gap-2">
          {allMoods.map((m) => {
            const active = form.moods.includes(m);
            return (
              <button
                key={m}
                type="button"
                onClick={() =>
                  set("moods", active ? form.moods.filter((x) => x !== m) : [...form.moods, m])
                }
                className={`rounded-full border px-4 py-2 text-sm ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {m}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Адрес страницы (латиницей)">
        <Input
          className="h-11"
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          placeholder={slugify(form.title) || "novyy-tovar"}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={form.visible} onCheckedChange={(v) => set("visible", v)} />
          Показывать на сайте
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={form.available} onCheckedChange={(v) => set("available", v)} />
          В наличии
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="h-11 flex-1 sm:flex-none" disabled={saving || uploading}>
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          Сохранить
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}