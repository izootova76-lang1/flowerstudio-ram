import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function Page({
  children,
  title,
  lead,
}: {
  children: ReactNode;
  title?: string;
  lead?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {title && (
          <div className="mx-auto max-w-6xl px-4 pb-8 pt-12">
            <h1 className="text-4xl md:text-5xl">{title}</h1>
            {lead && <p className="mt-3 max-w-2xl text-muted-foreground">{lead}</p>}
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
}