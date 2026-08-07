import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatPrice } from "@/data/site";
import { fetchOrders, orderStatuses, updateOrderStatus } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const queryClient = useQueryClient();
  const { data: orders = [], isPending } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Статус обновлён");
    },
    onError: (e: Error) => toast.error("Не обновилось", { description: e.message }),
  });

  if (isPending) return <p className="text-muted-foreground">Загружаем заявки…</p>;
  if (orders.length === 0) return <p className="text-muted-foreground">Заявок пока нет.</p>;

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="font-display text-lg leading-tight">{o.customer_name}</p>
              <a href={`tel:${o.phone}`} className="text-sm text-primary underline underline-offset-2">
                {o.phone}
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(o.created_at).toLocaleString("ru-RU")}
            </p>
          </div>

          <ul className="mt-3 space-y-1 text-sm">
            {o.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-3">
                <span>
                  {i.title} × {i.qty}
                </span>
                <span className="text-muted-foreground">{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">
                {o.method === "pickup" ? "Самовывоз" : "Доставка"}
              </dt>
              <dd className="text-right">{o.address || "—"}</dd>
            </div>
            {o.recipient && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Получатель</dt>
                <dd className="text-right">{o.recipient}</dd>
              </div>
            )}
            {o.comment && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Комментарий</dt>
                <dd className="text-right">{o.comment}</dd>
              </div>
            )}
            <div className="flex justify-between text-base">
              <dt>Итого</dt>
              <dd className="text-primary">{formatPrice(o.total)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            {orderStatuses.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus.mutate({ id: o.id, status: s.value })}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  o.status === s.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
}