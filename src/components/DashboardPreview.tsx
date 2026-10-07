import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Inbox,
  FileText,
  Archive,
  Settings,
  Search,
  FileSignature,
  ReceiptIndianRupee,
  TrendingUp,
  ShieldCheck,
  Check,
  X,
  Download,
  Home,
  Lock,
  MousePointer2,
} from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";
import { cn } from "../utils/cn";
import type { Role } from "../types";

/* ── tiny building blocks ──────────────────────────────── */
function Pill({ tone, children }: { tone: "green" | "amber" | "gray" | "terra"; children: React.ReactNode }) {
  const map = {
    green: "bg-forest-50 text-forest-600 border-forest-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    gray: "bg-gray-50 text-ink-mute border-gray-200",
    terra: "bg-terracotta-50 text-terracotta-600 border-terracotta-200",
  } as const;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide", map[tone])}>
      {children}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  role,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  delta: string;
  role: Role;
}) {
  const landlord = role === "landlord";
  return (
    <div className="group rounded-2xl border border-terracotta-100/80 bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-center justify-between">
        <span className={cn("grid h-9 w-9 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110", landlord ? "bg-terracotta-50 text-terracotta-500" : "bg-forest-50 text-forest-500")}>
          <Icon className="h-4.5 w-4.5" />
        </span>
        <TrendingUp className={cn("h-3.5 w-3.5", landlord ? "text-terracotta-300" : "text-forest-300")} />
      </div>
      <p className="mt-3 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{value}</p>
      <p className="text-[11px] font-semibold text-ink-mute">{label}</p>
      <p className={cn("mt-1 text-[10px] font-bold", landlord ? "text-terracotta-500" : "text-forest-500")}>{delta}</p>
    </div>
  );
}

function Sidebar({ role }: { role: Role }) {
  const landlord = role === "landlord";
  const items = landlord
    ? [
        { icon: LayoutDashboard, label: "Overview", active: true },
        { icon: Building2, label: "Properties" },
        { icon: Inbox, label: "Requests", badge: "3" },
        { icon: FileText, label: "Agreements" },
        { icon: Archive, label: "Vault" },
        { icon: Settings, label: "Settings" },
      ]
    : [
        { icon: LayoutDashboard, label: "Overview", active: true },
        { icon: Search, label: "Browse homes" },
        { icon: FileSignature, label: "Applications", badge: "2" },
        { icon: FileText, label: "My lease" },
        { icon: Archive, label: "Vault" },
        { icon: Settings, label: "Settings" },
      ];
  return (
    <aside className="hidden w-52 shrink-0 flex-col gap-1 border-r border-terracotta-100/70 bg-linen/60 p-4 md:flex">
      <div className="mb-3 flex items-center gap-2 px-2">
        <span className={cn("grid h-7 w-7 place-items-center rounded-lg text-white", landlord ? "bg-terracotta-500" : "bg-forest-500")}>
          <Home className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-extrabold text-ink">
          Rent<span className={landlord ? "text-terracotta-500" : "text-forest-500"}>Craft</span>
        </span>
      </div>
      {items.map((item) => (
        <button
          key={item.label}
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-all duration-300",
            item.active
              ? landlord
                ? "bg-terracotta-500 text-white shadow-md shadow-terracotta-500/30"
                : "bg-forest-500 text-white shadow-md shadow-forest-500/30"
              : "text-ink-soft hover:bg-white hover:text-ink hover:shadow-soft"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
          {item.badge && (
            <span className={cn("ml-auto grid h-5 w-5 place-items-center rounded-full text-[10px] font-black", item.active ? "bg-white/25 text-white" : "bg-terracotta-100 text-terracotta-600")}>
              {item.badge}
            </span>
          )}
        </button>
      ))}
      <div className="mt-auto rounded-xl border border-forest-100 bg-forest-50/70 p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-forest-600">
          <ShieldCheck className="h-3.5 w-3.5" /> Session encrypted
        </div>
        <p className="mt-1 text-[10px] font-medium text-ink-mute">AES-256 · zero-knowledge vault</p>
      </div>
    </aside>
  );
}

/* ── LANDLORD VIEW ─────────────────────────────────────── */
type Req = { name: string; prop: string; score: number; state: "pending" | "approved" | "declined" };

function LandlordView() {
  const [reqs, setReqs] = useState<Req[]>([
    { name: "Meera Iyer", prop: "Sunrise Residency · 2BHK", score: 96, state: "pending" },
    { name: "Arjun Nair", prop: "Maple Court · Studio", score: 88, state: "pending" },
    { name: "Sana Sheikh", prop: "Willow Lane · 3BHK", score: 91, state: "pending" },
  ]);
  const bars = [42, 55, 48, 66, 58, 74, 70, 82, 78, 90, 86, 100];

  const act = (i: number, state: Req["state"]) =>
    setReqs((r) => r.map((x, j) => (j === i ? { ...x, state } : x)));

  return (
    <div className="fade-stack space-y-5">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-extrabold text-ink sm:text-xl">Good morning, Rohan</h4>
          <p className="text-xs font-medium text-ink-mute">Here is what your properties did overnight.</p>
        </div>
        <button className="rounded-full bg-terracotta-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-terracotta-500/30 transition-all hover:-translate-y-0.5 hover:bg-terracotta-600 active:scale-95">
          + New listing
        </button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={FileText} label="Active leases" value="8" delta="+2 this month" role="landlord" />
        <StatCard icon={Inbox} label="Verified requests" value="3" delta="awaiting review" role="landlord" />
        <StatCard icon={ReceiptIndianRupee} label="Rent collected · Jun" value="₹1.24L" delta="100% on time" role="landlord" />
        <StatCard icon={Archive} label="Vault documents" value="26" delta="AES-256 sealed" role="landlord" />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* chart */}
        <div className="rounded-2xl border border-terracotta-100/80 bg-white p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-extrabold text-ink">Rent inflow</p>
            <Pill tone="terra">FY 2025-26</Pill>
          </div>
          <div className="mt-4 flex h-28 items-end gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="grow-bar group relative flex-1 rounded-t-md bg-gradient-to-t from-terracotta-200 to-terracotta-400 transition-all duration-300 hover:from-terracotta-400 hover:to-terracotta-500"
                style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
                title={`Month ${i + 1}: ₹${(h * 1.4).toFixed(0)}k`}
              />
            ))}
          </div>
          <p className="mt-3 text-[10px] font-semibold text-ink-mute">Auto-generated from on-time receipts · no spreadsheets harmed</p>
        </div>

        {/* requests */}
        <div className="rounded-2xl border border-terracotta-100/80 bg-white p-5 shadow-soft lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-extrabold text-ink">Verified requests</p>
            <Pill tone="amber">3 awaiting</Pill>
          </div>
          <ul className="mt-3 space-y-2.5">
            {reqs.map((r, i) => (
              <li key={r.name} className="flex flex-wrap items-center gap-3 rounded-xl border border-terracotta-100/60 bg-linen/50 px-3.5 py-3 transition-all duration-300 hover:bg-white hover:shadow-soft">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-terracotta-100 text-xs font-black text-terracotta-700">
                  {r.name.split(" ").map((w) => w[0]).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink">{r.name}</p>
                  <p className="truncate text-[11px] font-medium text-ink-mute">{r.prop}</p>
                </div>
                <Pill tone="green">
                  <ShieldCheck className="h-3 w-3" /> {r.score}
                </Pill>
                {r.state === "pending" ? (
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => act(i, "approved")}
                      aria-label={`Approve ${r.name}`}
                      className="grid h-8 w-8 place-items-center rounded-full bg-forest-500 text-white shadow-md shadow-forest-500/30 transition-all hover:scale-110 active:scale-90"
                    >
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => act(i, "declined")}
                      aria-label={`Decline ${r.name}`}
                      className="grid h-8 w-8 place-items-center rounded-full border border-terracotta-200 bg-white text-terracotta-500 transition-all hover:scale-110 hover:bg-terracotta-50 active:scale-90"
                    >
                      <X className="h-4 w-4" strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <Pill tone={r.state === "approved" ? "green" : "gray"}>
                    {r.state === "approved" ? "Agreement sent" : "Passed"}
                  </Pill>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── TENANT VIEW ───────────────────────────────────────── */
function TenantView() {
  const [paid, setPaid] = useState(false);
  const steps = [
    { label: "Browse", done: true },
    { label: "KYC verified", done: true },
    { label: "E-sign", done: true },
    { label: "Move in", done: false },
  ];
  return (
    <div className="fade-stack space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-extrabold text-ink sm:text-xl">Good morning, Meera</h4>
          <p className="text-xs font-medium text-ink-mute">Your lease journey is almost complete.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-forest-500/30">
          <ShieldCheck className="h-3.5 w-3.5" /> KYC Verified · 96/100
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard icon={Search} label="Shortlisted homes" value="6" delta="3 verified owners" role="tenant" />
        <StatCard icon={ShieldCheck} label="KYC trust score" value="96/100" delta="top 4% renters" role="tenant" />
        <StatCard icon={FileSignature} label="Active applications" value="2" delta="1 approved" role="tenant" />
        <StatCard icon={Archive} label="Documents sealed" value="5" delta="in your vault" role="tenant" />
      </div>

      {/* journey stepper */}
      <div className="rounded-2xl border border-forest-100 bg-gradient-to-r from-forest-50/70 to-white p-5 shadow-soft">
        <p className="text-sm font-extrabold text-ink">Your move-in journey</p>
        <div className="mt-4 flex items-center">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-full text-[10px] font-black transition-all",
                    s.done ? "bg-forest-500 text-white shadow-md shadow-forest-500/30" : "border-2 border-dashed border-forest-300 bg-white text-forest-400"
                  )}
                >
                  {s.done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </span>
                <span className={cn("text-[10px] font-bold", s.done ? "text-forest-600" : "text-ink-mute")}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="mx-2 mb-5 h-1 flex-1 overflow-hidden rounded-full bg-forest-100">
                  <div className={cn("h-full rounded-full bg-forest-400", s.done ? "w-full" : "w-1/3")} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* lease card */}
        <div className="rounded-2xl border border-forest-100 bg-white p-5 shadow-soft lg:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-extrabold text-ink">Lease #RC-2481 · Sunrise Residency</p>
            <Pill tone="green">
              <Lock className="h-3 w-3" /> E-signed
            </Pill>
          </div>
          <div className="mt-3 space-y-1.5 text-xs font-medium text-ink-soft">
            <p>2BHK · Koramangala, Bengaluru · Owner: Rohan Kulkarni (verified)</p>
            <p>Term: 11 months · Deposit ₹72,000 tracked · Rent ₹24,000/mo</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <button className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-forest-50 px-4 py-2 text-xs font-bold text-forest-600 transition-all hover:-translate-y-0.5 hover:bg-forest-100 active:scale-95">
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
            <button
              onClick={() => setPaid(true)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-md transition-all active:scale-95",
                paid ? "bg-forest-500 shadow-forest-500/30" : "bg-ink hover:bg-forest-600 shadow-ink/20 hover:-translate-y-0.5"
              )}
            >
              {paid ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <ReceiptIndianRupee className="h-3.5 w-3.5" />}
              {paid ? "Receipt generated · ₹24,000" : "Pay July rent"}
            </button>
          </div>
        </div>

        {/* applications */}
        <div className="rounded-2xl border border-forest-100 bg-white p-5 shadow-soft lg:col-span-2">
          <p className="text-sm font-extrabold text-ink">My applications</p>
          <ul className="mt-3 space-y-2.5 text-xs">
            <li className="flex items-center justify-between gap-2 rounded-xl bg-linen/60 px-3.5 py-3 transition-all hover:bg-linen">
              <span className="font-bold text-ink">Maple Court Studio</span>
              <Pill tone="amber">Under review</Pill>
            </li>
            <li className="flex items-center justify-between gap-2 rounded-xl bg-linen/60 px-3.5 py-3 transition-all hover:bg-linen">
              <span className="font-bold text-ink">Willow Lane 3BHK</span>
              <Pill tone="green">Approved</Pill>
            </li>
            <li className="flex items-center justify-between gap-2 rounded-xl bg-linen/60 px-3.5 py-3 transition-all hover:bg-linen">
              <span className="font-bold text-ink">Sunrise Residency</span>
              <Pill tone="terra">Signed</Pill>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ── SECTION ───────────────────────────────────────────── */
export default function DashboardPreview({
  role,
  setRole,
}: {
  role: Role;
  setRole: (r: Role) => void;
}) {
  const landlord = role === "landlord";
  return (
    <section id="dashboard" className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta-200 to-transparent" />
      <div className="texture-dots pointer-events-none absolute -left-20 top-40 h-72 w-72 opacity-50 [mask-image:radial-gradient(closest-side,black,transparent)]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Live Prototype"
          eyebrowIcon={<MousePointer2 className="h-3.5 w-3.5" />}
          title={
            <>
              One dashboard.{" "}
              <span className={landlord ? "text-terracotta-500" : "text-forest-500"}>
                Both sides of the door.
              </span>
            </>
          }
          copy="Poke around — this is a working preview. Approve a request or pay the July rent and watch RentCraft respond."
        />

        {/* role tabs */}
        <Reveal delay={140}>
          <div className="mt-10 flex justify-center">
            <div className="relative flex rounded-full border border-terracotta-100 bg-white p-1.5 shadow-soft">
              <span
                className={cn(
                  "absolute inset-y-1.5 w-[calc(50%-6px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  landlord ? "left-1.5 bg-terracotta-500 shadow-md shadow-terracotta-500/40" : "left-[calc(50%+4.5px)] bg-forest-500 shadow-md shadow-forest-500/40"
                )}
              />
              {(
                [
                  { id: "landlord", label: "Landlord", icon: Home },
                  { id: "tenant", label: "Tenant", icon: Search },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setRole(t.id)}
                  className={cn(
                    "relative z-10 flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-colors duration-300 sm:px-8",
                    role === t.id ? "text-white" : "text-ink-mute hover:text-ink"
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* browser frame */}
        <Reveal variant="zoom" delay={180}>
          <div className="relative mx-auto mt-10 max-w-5xl">
            {/* glow */}
            <div
              className={cn(
                "pointer-events-none absolute -inset-6 rounded-[2.5rem] opacity-30 blur-3xl transition-colors duration-700",
                landlord ? "bg-terracotta-300" : "bg-forest-300"
              )}
            />
            <div className="relative overflow-hidden rounded-3xl border border-terracotta-100 bg-cream shadow-lift">
              {/* chrome */}
              <div className="flex items-center gap-3 border-b border-terracotta-100 bg-white px-5 py-3.5">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-terracotta-300" />
                  <span className="h-3 w-3 rounded-full bg-sand" />
                  <span className="h-3 w-3 rounded-full bg-forest-300" />
                </div>
                <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-linen px-4 py-1.5 text-[11px] font-bold text-ink-mute">
                  <Lock className={cn("h-3 w-3", landlord ? "text-terracotta-500" : "text-forest-500")} />
                  app.rentcraft.io/{role}
                </div>
                <span className={cn("hidden items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide sm:inline-flex", landlord ? "bg-terracotta-50 text-terracotta-600" : "bg-forest-50 text-forest-600")}>
                  {landlord ? "Owner console" : "Renter console"}
                </span>
              </div>

              <div className="flex">
                <Sidebar role={role} />
                <main className="min-w-0 flex-1 p-5 sm:p-7" key={role}>
                  {landlord ? <LandlordView /> : <TenantView />}
                </main>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
