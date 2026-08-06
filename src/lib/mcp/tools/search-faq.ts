import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { faq } from "@/data/content";

export default defineTool({
  name: "search_faq",
  title: "Вопросы и ответы",
  description: "Ответы на частые вопросы о заказе, доставке, уходе за цветами и оформлении.",
  inputSchema: {
    query: z.string().optional().describe("Текст вопроса; без него вернутся все вопросы."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query }) => {
    const q = query?.trim().toLowerCase();
    const items = q
      ? faq.filter((f) => `${f.q} ${f.a} ${f.group}`.toLowerCase().includes(q))
      : faq;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
