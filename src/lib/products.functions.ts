import { products as localProducts } from "@/data/catalog";
import { supabase } from "@/integrations/supabase/client";
import { mapProductRow, type PublicProduct } from "./product-types";

export async function listPublicProducts(): Promise<PublicProduct[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,slug,title,category,price,image,short,description,composition,care,moods,tags,size,sort_order,visible,available",
      )
      .eq("visible", true)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapProductRow);
  } catch (error) {
    console.warn("[products] Using local catalog", error);
    return localProducts.map((product, index) => ({
      ...product,
      id: product.slug,
      available: true,
      visible: true,
      sortOrder: index,
    }));
  }
}
