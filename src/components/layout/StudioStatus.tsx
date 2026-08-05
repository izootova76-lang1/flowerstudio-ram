import { useEffect, useState } from "react";
import { getStudioStatus, type StudioStatus as Status } from "@/data/site";

export function StudioStatusBadge({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(getStudioStatus(new Date()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) return null;

  return (
    <span className={`inline-flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
      <span
        className={`size-2 rounded-full ${status.open ? "bg-sage" : "bg-muted-foreground/50"}`}
        aria-hidden
      />
      {status.text}
    </span>
  );
}