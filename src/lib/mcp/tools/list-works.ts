import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { works } from "@/data/content";

export default defineTool({
  name: "list_works",
  title: "Наши работы",
  description: "Список выполненных работ студии: свадьбы, праздники, оформление, будни студии.",
  inputSchema: {
    category: z
      .enum(["Свадьбы", "Праздники", "Оформление", "Будни студии"])
      .optional()
      .describe("Фильтр по категории работ."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const items = category ? works.filter((w) => w.category === category) : works;
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
      structuredContent: { items },
    };
  },
});
