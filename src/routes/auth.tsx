import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Page } from "@/components/layout/Page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Вход для сотрудников — Flower Studio" },
      { name: "description", content: "Служебный вход в панель управления цветочной студии." },
      { property: "og:title", content: "Вход для сотрудников — Flower Studio" },
      { property: "og:description", content: "Служебный раздел студии." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Если сессия уже есть (в т.ч. после перехода по ссылке из письма),
  // сразу отправляем в панель управления.
  useEffect(() => {
    let active = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) navigate({ to: "/admin", replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to: "/admin", replace: true });
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        // Supabase возвращает "успех" и для уже существующего аккаунта,
        // но без сессии и с пустым списком identities. Письмо при этом не уходит.
        const alreadyRegistered = (data.user?.identities?.length ?? 0) === 0;
        if (alreadyRegistered) {
          const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
          if (signInError) {
            setMode("signin");
            toast.info("Такой доступ уже есть", {
              description: "Войдите с этой почтой и паролем.",
            });
            return;
          }
          navigate({ to: "/admin", replace: true });
          return;
        }
        if (!data.session) {
          toast.success("Проверьте почту", {
            description: "Мы отправили письмо для подтверждения адреса.",
          });
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/admin", replace: true });
    } catch (error) {
      toast.error("Не получилось войти", {
        description: error instanceof Error ? error.message : "Проверьте почту и пароль",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Вход" lead="Раздел для сотрудников студии.">
      <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4 px-4 pb-24">
        <Input
          required
          type="email"
          autoComplete="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          required
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="h-11 w-full" disabled={loading}>
          {mode === "signup" ? "Создать доступ" : "Войти"}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          className="w-full text-sm text-muted-foreground underline underline-offset-4"
        >
          {mode === "signup" ? "У меня уже есть доступ" : "Создать первый доступ владельца"}
        </button>
      </form>
    </Page>
  );
}