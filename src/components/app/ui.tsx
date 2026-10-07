import type { ReactNode } from "react";
import { AlertCircle, FileText, TrendingUp, Lock } from "lucide-react";
import { cn } from "../../utils/cn";
import type { Role } from "../../types";

export const inputCls =
  "w-full rounded-xl border border-terracotta-100 bg-white px-4 py-3 text-sm font-semibold text-ink placeholder:font-medium placeholder:text-ink-mute/60 shadow-soft transition-all duration-300 focus:border-terracotta-300 focus:outline-none focus:ring-4 focus:ring-terracotta-100/80";

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-ink-soft">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-terracotta-600">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1.5 block text-[11px] font-semibold text-ink-mute">{hint}</span>
      ) : null}
    </label>
  );
}

export function StatusChip({
  tone,
  children,
  className,
}: {
  tone: "green" | "amber" | "gray" | "terra";
  children: ReactNode;
  className?: string;
}) {
  const map = {
    green: "bg-forest-50 text-forest-600 border-forest-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    gray: "bg-gray-50 text-ink-mute border-gray-200",
    terra: "bg-terracotta-50 text-terracotta-600 border-terracotta-200",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider",
        map[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function DashStat({
  icon: Icon = FileText,
  label,
  value,
  delta,
  role,
}: {
  icon?: typeof FileText;
  label: string;
  value: string;
  delta: string;
  role: Role;
}) {
  const landlord = role === "landlord";
  return (
    <div className="card group p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110",
            landlord ? "bg-terracotta-50 text-terracotta-500" : "bg-forest-50 text-forest-500"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <TrendingUp className={cn("h-4 w-4", landlord ? "text-terracotta-300" : "text-forest-300")} />
      </div>
      <p className="mt-3.5 text-2xl font-extrabold tracking-tight text-ink">{value}</p>
      <p className="text-xs font-semibold text-ink-mute">{label}</p>
      <p className={cn("mt-1 text-[11px] font-bold", landlord ? "text-terracotta-500" : "text-forest-500")}>
        {delta}
      </p>
    </div>
  );
}

export function SectionTitle({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h3 className="text-lg font-extrabold tracking-tight text-ink sm:text-xl">{title}</h3>
        {sub && <p className="mt-0.5 text-sm font-medium text-ink-mute">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof FileText;
  title: string;
  copy: string;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 border-dashed py-12 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-linen text-ink-mute">
        <Icon className="h-6 w-6" />
      </span>
      <p className="text-sm font-extrabold text-ink">{title}</p>
      <p className="max-w-xs text-xs font-medium leading-relaxed text-ink-mute">{copy}</p>
    </div>
  );
}

export function KycBanner({
  role,
  verified,
  onVerify,
}: {
  role: Role;
  verified: boolean;
  onVerify: () => void;
}) {
  if (verified) return null;
  const landlord = role === "landlord";
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3.5 rounded-2xl border p-4.5 shadow-soft",
        landlord ? "border-terracotta-200 bg-terracotta-50/70" : "border-forest-200 bg-forest-50/70"
      )}
    >
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white",
          landlord ? "bg-terracotta-500" : "bg-forest-500"
        )}
      >
        <Lock className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-ink">Identity verification required</p>
        <p className="text-xs font-semibold text-ink-mute">
          {landlord
            ? "Verify once with mock Aadhaar & PAN to countersign agreements."
            : "Verify once with mock Aadhaar & PAN to request leases and e-sign."}
        </p>
      </div>
      <button
        onClick={onVerify}
        className={cn(
          "shrink-0 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 active:scale-95",
          landlord
            ? "bg-terracotta-500 shadow-terracotta-500/30 hover:bg-terracotta-600"
            : "bg-forest-500 shadow-forest-500/30 hover:bg-forest-600"
        )}
      >
        Verify now · ~1 min
      </button>
    </div>
  );
}
