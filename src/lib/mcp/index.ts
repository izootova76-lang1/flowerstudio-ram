import { defineMcp, type AnyToolDefinition } from "@lovable.dev/mcp-js";
import searchCatalog from "./tools/search-catalog";
import getProduct from "./tools/get-product";
import studioInfo from "./tools/studio-info";
import listWorks from "./tools/list-works";
import searchFaq from "./tools/search-faq";
import listReviews from "./tools/list-reviews";

export default defineMcp({
  name: "blooming-visions",
  title: "Blooming Visions",
  version: "0.1.0",
  instructions:
    "Инструменты цветочной студии Flower Studio (Раменское). Помогают найти букеты, растения и шары в каталоге, получить карточку товара, узнать адрес, часы работы и зоны доставки, посмотреть работы студии, ответы на частые вопросы и отзывы клиентов. Все данные публичные.",
  tools: [
    searchCatalog,
    getProduct,
    studioInfo,
    listWorks,
    searchFaq,
    listReviews,
  ] as unknown as AnyToolDefinition[],
});
