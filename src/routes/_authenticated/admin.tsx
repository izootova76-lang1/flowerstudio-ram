import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { fetchIsAdmin } from "@/lib/admin";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Панель управления — Flower Studio" },
      { name: "description", content: "Управление каталогом и заявками цветочной студии." },
      { property: "og:title", content: "Панель управления — Flower Studio" },
      { property: "og:description", content: "Служебный раздел студии." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const { data: isAdmin, isPending } = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: () => fetchIsAdmin(user.id),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isPending) {
    return (
      <Page title="Панель управления">
        <p className="mx-auto max-w-6xl px-4 pb-20 text-muted-foreground">Загружаем…</p>
      </Page>
    );
  }

  if (!isAdmin) {
    return (
      <Page title="Нет доступа" lead="Этот раздел доступен только владельцу студии.">
        <div className="mx-auto max-w-6xl px-4 pb-20">
          <Button variant="outline" onClick={signOut}>
            Выйти
          </Button>
        </div>
      </Page>
    );
  }

  const tabs = [
    { to: "/admin", label: "Товары" },
    { to: "/admin/orders", label: "Заявки" },
  ] as const;

  return (
    <Page>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl">Панель управления</h1>
          <Button variant="outline" size="sm" onClick={signOut}>
            Выйти
          </Button>
        </div>

        <nav className="mt-6 flex gap-2 border-b border-border pb-4">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                pathname === t.to
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="pt-8">
          <Outlet />
        </div>
      </div>
    </Page>
  );
}