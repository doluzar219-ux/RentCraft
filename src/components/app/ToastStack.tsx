import { BadgeCheck, Info, Sparkles, X } from "lucide-react";
import { useApp } from "../../store/AppContext";
import { cn } from "../../utils/cn";

export default function ToastStack() {
  const { toasts, dismissToast } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2.5 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "toast-in pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-lift",
            t.tone === "forest" && "border-forest-200",
            t.tone === "terra" && "border-terracotta-200",
            t.tone === "ink" && "border-gray-200"
          )}
        >
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-full",
              t.tone === "forest" && "bg-forest-500 text-white",
              t.tone === "terra" && "bg-terracotta-500 text-white",
              t.tone === "ink" && "bg-ink text-white"
            )}
          >
            {t.tone === "ink" ? (
              <Info className="h-4 w-4" />
            ) : t.tone === "terra" ? (
              <Sparkles className="h-4 w-4" />
            ) : (
              <BadgeCheck className="h-4 w-4" />
            )}
          </span>
          <p className="flex-1 text-sm font-bold leading-snug text-ink">{t.message}</p>
          <button
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss notification"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-mute transition-colors hover:bg-linen hover:text-ink"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
