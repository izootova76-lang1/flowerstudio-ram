import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { reviews } from "@/data/content";

export default defineTool({
  name: "list_reviews",
  title: "Отзывы",
  description: "Опубликованные отзывы клиентов Flower Studio с оценками и ответами студии.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Сколько отзывов вернуть."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ limit }) => {
    const items = reviews.slice(0, limit ?? reviews.length);
    const average = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return {
      content: [{ type: "text", text: JSON.stringify({ average, items }, null, 2) }],
      structuredContent: { average, items },
    };
  },
});
