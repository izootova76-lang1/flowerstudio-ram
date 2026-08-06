import { cn } from "@/lib/utils";

/**
 * Фирменное написание студии, повторяющее вывеску:
 * антиква с крупными прописными, зелёная линия и подпись «СТУДИЯ ЦВЕТОВ».
 */
export function Wordmark({
  className,
  size = "sm",
  subtitle = true,
}: {
  className?: string;
  size?: "sm" | "lg";
  subtitle?: boolean;
}) {
  const big = size === "lg";
  return (
    <span className={cn("inline-flex flex-col items-center", className)}>
      <span
        className={cn(
          "font-display uppercase leading-[0.95] text-foreground",
          big
            ? "text-[13vw] tracking-[0.1em] sm:text-6xl md:text-7xl lg:text-[5.5rem]"
            : "text-xl tracking-[0.2em]",
        )}
        style={{ fontVariant: "small-caps" }}
      >
        Flower Studio
      </span>
      <span
        className={cn(
          "block w-full bg-sage/80",
          big ? "mt-3 h-[3px] md:mt-4" : "mt-1 h-px",
        )}
      />
      {subtitle && (
        <span
          className={cn(
            "font-display uppercase text-foreground/75",
            big
              ? "mt-2 text-[3.4vw] tracking-[0.42em] sm:text-base md:mt-3 md:text-xl"
              : "mt-1 text-[9px] tracking-[0.34em]",
          )}
        >
          Студия цветов
        </span>
      )}
    </span>
  );
}