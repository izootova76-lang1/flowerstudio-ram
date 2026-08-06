import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getProduct } from "@/data/catalog";

export default defineTool({
  name: "get_product",
  title: "Карточка товара",
  description: "Подробности о товаре Flower Studio по его слагу: состав, уход, цена, описание.",
  inputSchema: { slug: z.string().min(1).describe("Слаг товара, например utro-v-ramenskom.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const product = getProduct(slug);
    if (!product) throw new ToolError(`Товар «${slug}» не найден.`);
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});
