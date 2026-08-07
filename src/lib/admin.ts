import { supabase } from "@/integrations/supabase/client";
import { mapProductRow, type PublicProduct } from "./product-types";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export type AdminProduct = PublicProduct;

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,slug,title,category,price,image,short,description,composition,care,moods,tags,size,sort_order,visible,available",
    )
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapProductRow);
}

export type ProductInput = {
  slug: string;
  title: string;
  category: string;
  price: number;
  image: string;
  short: string;
  description: string;
  composition: string[];
  care: string;
  moods: string[];
  tags: string[];
  size: string | null;
  sort_order: number;
  visible: boolean;
  available: boolean;
};

export async function createProduct(input: ProductInput) {
  const { error } = await supabase.from("products").insert(input);
  if (error) throw new Error(error.message);
}

export async function updateProduct(id: string, patch: Partial<ProductInput>) {
  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) throw new Error(error.message);
  const { data, error: signError } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signError || !data) throw new Error(signError?.message ?? "Не удалось получить ссылку на фото");
  return data.signedUrl;
}

export type Order = {
  id: string;
  customer_name: string;
  phone: string;
  method: string;
  address: string | null;
  recipient: string | null;
  comment: string | null;
  items: { title: string; qty: number; price: number }[];
  items_total: number;
  delivery_price: number;
  total: number;
  status: string;
  created_at: string;
};

export const orderStatuses = [
  { value: "new", label: "Новый" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Выполнен" },
  { value: "cancelled", label: "Отменён" },
] as const;

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((o) => ({
    ...o,
    items: Array.isArray(o.items) ? (o.items as Order["items"]) : [],
  }));
}

export async function updateOrderStatus(id: string, status: string) {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (data) return true;
  const { data: claimed } = await supabase.rpc("claim_admin");
  return claimed === true;
}