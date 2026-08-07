import type { Category, Mood, Product } from "@/data/catalog";

export type PublicProduct = Product & {
  id: string;
  available: boolean;
  visible: boolean;
  sortOrder: number;
};

export type ProductRowLike = {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: number;
  image: string;
  short: string;
  description: string;
  composition: string[];
  care: string;
  moods: string[];
  tags: string[];
  size: string | null;
  sort_order: number;
  visible: boolean;
  available: boolean;
};

export function mapProductRow(row: ProductRowLike): PublicProduct {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category as Category,
    price: row.price,
    image: row.image,
    short: row.short,
    description: row.description,
    composition: row.composition ?? [],
    care: row.care,
    moods: (row.moods ?? []) as Mood[],
    tags: row.tags ?? [],
    ...(row.size ? { size: row.size } : {}),
    sortOrder: row.sort_order,
    visible: row.visible,
    available: row.available,
  };
}