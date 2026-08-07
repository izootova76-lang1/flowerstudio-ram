import { createServerFn } from "@tanstack/react-start";

export const listPublicProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { fetchPublicProducts } = await import("./products.server");
  return fetchPublicProducts();
});