import { defineTool } from "@lovable.dev/mcp-js";
import { getStudioStatus, site } from "@/data/site";

export default defineTool({
  name: "get_studio_info",
  title: "О студии",
  description:
    "Контакты Flower Studio, адрес, часы работы, текущий статус (открыто/закрыто) и зоны доставки.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: () => {
    const status = getStudioStatus(new Date());
    const info = {
      name: site.name,
      tagline: site.tagline,
      address: site.address,
      route: site.route,
      phone: site.phone,
      email: site.email,
      instagram: site.instagramLabel,
      since: site.since,
      legalEntity: site.legalEntity,
      hours: site.hours,
      status,
      deliveryZones: site.deliveryZones,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(info, null, 2) }],
      structuredContent: info,
    };
  },
});
