import { queryOptions } from "@tanstack/react-query";
import { listPublicProducts } from "./products.functions";

export const productsQueryOptions = queryOptions({
  queryKey: ["public-products"],
  queryFn: () => listPublicProducts(),
  staleTime: 30_000,
});