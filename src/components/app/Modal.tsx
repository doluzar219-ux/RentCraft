import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Modal({
  open,
  onClose,
  children,
  size = "md",
  locked = false,
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  locked?: boolean;
  label?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !locked) onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, locked, onClose]);

  if (!open) return null;

  const widths = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" } as const;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className="backdrop-fade absolute inset-0 bg-ink/35 backdrop-blur-sm"
        onClick={() => !locked && onClose()}
      />
      <div
        className={cn(
          "modal-pop relative w-full overflow-hidden rounded-t-3xl border border-terracotta-100 bg-cream shadow-lift sm:rounded-3xl",
          widths[size]
        )}
      >
        <button
          onClick={onClose}
          disabled={locked}
          aria-label="Close dialog"
          className={cn(
            "absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-terracotta-100 bg-white text-ink-soft shadow-soft transition-all hover:scale-105 hover:text-terracotta-600 active:scale-95",
            locked && "cursor-not-allowed opacity-40 hover:scale-100 hover:text-ink-soft"
          )}
        >
          <X className="h-4.5 w-4.5" />
        </button>
        {children}
      </div>
    </div>
  );
}
