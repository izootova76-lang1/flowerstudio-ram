import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { products, searchProducts, type Category } from "@/data/catalog";

const categories = ["bouquets", "plants", "balloons"] as const;

export default defineTool({
  name: "search_catalog",
  title: "Поиск по каталогу",
  description:
    "Найти букеты, растения и шары Flower Studio по тексту, категории, настроению и цене.",
  inputSchema: {
    query: z.string().optional().describe("Текстовый запрос: название, состав, повод, тег."),
    category: z.enum(categories).optional().describe("Категория товара."),
    mood: z.string().optional().describe("Настроение: нежное, яркое, спокойное и т.д."),
    maxPrice: z.number().positive().optional().describe("Максимальная цена в рублях."),
    limit: z.number().int().min(1).max(50).optional().describe("Сколько позиций вернуть (по умолчанию 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, mood, maxPrice, limit }) => {
    let items = query?.trim() ? searchProducts(query) : products;
    if (category) items = items.filter((p) => p.category === (category as Category));
    if (mood) items = items.filter((p) => p.moods.some((m) => m.includes(mood.toLowerCase())));
    if (maxPrice) items = items.filter((p) => p.price <= maxPrice);
    const result = items.slice(0, limit ?? 10).map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      price: p.price,
      short: p.short,
      moods: p.moods,
    }));
    if (result.length === 0) throw new ToolError("Ничего не найдено по этим условиям.");
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      structuredContent: { items: result, total: items.length },
    };
  },
});
