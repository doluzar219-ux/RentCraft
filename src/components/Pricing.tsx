import { useState } from "react";
import { Check, Sparkles, BadgePercent, KeyRound, Building2, Crown } from "lucide-react";
import { CTAButton, Reveal, SectionHeading } from "./primitives";
import { useApp } from "../store/AppContext";
import { cn } from "../utils/cn";
import type { Role } from "../types";

type Cycle = "monthly" | "yearly";

function PlanFeature({ text, tone }: { text: string; tone: "terracotta" | "forest" | "white" }) {
  return (
    <li className="flex items-start gap-2.5 text-sm font-medium">
      <span
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
          tone === "forest"
            ? "bg-forest-100 text-forest-600"
            : tone === "terracotta"
              ? "bg-terracotta-100 text-terracotta-600"
              : "bg-white/20 text-white"
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3.5} />
      </span>
      <span className={tone === "white" ? "text-cream/90" : "text-ink-soft"}>{text}</span>
    </li>
  );
}

export default function Pricing() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const yearly = cycle === "yearly";
  const price = (m: number) => (yearly ? Math.round(m * 10) : m);
  const { setRole, session, enterApp, openAuth } = useApp();

  const startRole = (r: Role) => {
    setRole(r);
    if (session) enterApp();
    else openAuth();
  };

  return (
    <section id="pricing" className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-forest-200 to-transparent" />
      <div className="texture-dots pointer-events-none absolute -right-16 bottom-24 h-72 w-72 opacity-50 [mask-image:radial-gradient(closest-side,black,transparent)]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Pricing"
          eyebrowIcon={<BadgePercent className="h-3.5 w-3.5" />}
          title={
            <>
              Honest pricing, <span className="hand-underline text-terracotta-500">zero</span> brokerage
            </>
          }
          copy="Tenants pay a small service fee only when a lease is actually signed. Landlords pick a plan that grows with their portfolio."
        />

        {/* cycle toggle */}
        <Reveal delay={120}>
          <div className="mt-9 flex items-center justify-center gap-3">
            <div className="relative flex rounded-full border border-terracotta-100 bg-white p-1 shadow-soft">
              <span
                className={cn(
                  "absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  yearly ? "left-[calc(50%+2px)]" : "left-1"
                )}
              />
              <button
                onClick={() => setCycle("monthly")}
                className={cn(
                  "relative z-10 rounded-full px-5 py-2 text-xs font-bold transition-colors duration-300",
                  !yearly ? "text-white" : "text-ink-mute hover:text-ink"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle("yearly")}
                className={cn(
                  "relative z-10 rounded-full px-5 py-2 text-xs font-bold transition-colors duration-300",
                  yearly ? "text-white" : "text-ink-mute hover:text-ink"
                )}
              >
                Yearly
              </button>
            </div>
            <span className="rounded-full bg-forest-500 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-md shadow-forest-500/30">
              2 months free
            </span>
          </div>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {/* ── Tenant plan ── */}
          <Reveal delay={0} className="h-full">
            <article className="card group flex h-full flex-col p-8 transition-all duration-500 hover:-translate-y-2 hover:border-forest-200 hover:shadow-lift-green">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-50 text-forest-500 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <KeyRound className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-ink">Renter</h3>
              <p className="mt-1 text-sm font-medium text-ink-mute">For tenants finding their next home</p>
              <div className="mt-6 flex items-end gap-1.5">
                <span key={`t-${cycle}`} className="fade-stack text-4xl font-extrabold tracking-tight text-forest-500">
                  <span>₹0</span>
                </span>
                <span className="pb-1.5 text-sm font-semibold text-ink-mute">to browse</span>
              </div>
              <p className="mt-1.5 text-xs font-bold text-forest-600">
                + ₹499 service fee only when you sign a lease
              </p>
              <ul className="mt-7 flex-1 space-y-3.5">
                <PlanFeature tone="forest" text="Unlimited browsing of verified listings" />
                <PlanFeature tone="forest" text="One-time mock Aadhaar + PAN KYC" />
                <PlanFeature tone="forest" text="Digital e-signing with audit trail" />
                <PlanFeature tone="forest" text="Personal encrypted document vault" />
                <PlanFeature tone="forest" text="Auto rent receipts & reminders" />
              </ul>
              <CTAButton tone="forest" variant="outline" className="mt-8 w-full" onClick={() => startRole("tenant")}>
                Start as a Tenant
              </CTAButton>
            </article>
          </Reveal>

          {/* ── Landlord Pro (featured) ── */}
          <Reveal delay={110} className="h-full lg:-mt-4">
            <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-terracotta-500 p-8 text-white shadow-lift transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-18px_rgba(221,107,32,0.55)]">
              <div className="texture-dots pointer-events-none absolute -right-10 -top-10 h-44 w-44 opacity-30 [mask-image:radial-gradient(closest-side,black,transparent)]" />
              <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-terracotta-600/60 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur transition-transform duration-500 group-hover:rotate-6">
                  <Crown className="h-5.5 w-5.5" />
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-terracotta-600">
                  <Sparkles className="h-3 w-3" /> Most crafted
                </span>
              </div>
              <h3 className="relative mt-5 text-lg font-extrabold">Craft Pro</h3>
              <p className="relative mt-1 text-sm font-medium text-terracotta-100">For landlords with growing portfolios</p>
              <div className="relative mt-6 flex items-end gap-1.5">
                <span key={`p-${cycle}`} className="fade-stack text-4xl font-extrabold tracking-tight">
                  <span>₹{price(2499).toLocaleString("en-IN")}</span>
                </span>
                <span className="pb-1.5 text-sm font-semibold text-terracotta-100">
                  /{yearly ? "year" : "month"}
                </span>
              </div>
              <p className="relative mt-1.5 text-xs font-bold text-terracotta-100">
                Up to 25 properties · priority verification queue
              </p>
              <ul className="relative mt-7 flex-1 space-y-3.5">
                <PlanFeature tone="white" text="Everything in Craft Basic, plus:" />
                <PlanFeature tone="white" text="Custom clause library & template studio" />
                <PlanFeature tone="white" text="Portfolio analytics & rent insights" />
                <PlanFeature tone="white" text="Bulk agreement generation" />
                <PlanFeature tone="white" text="Dedicated relationship manager" />
              </ul>
              <CTAButton tone="white" className="relative mt-8 w-full text-terracotta-600!" onClick={() => startRole("landlord")}>
                Craft with Pro
              </CTAButton>
            </article>
          </Reveal>

          {/* ── Landlord Basic ── */}
          <Reveal delay={220} className="h-full">
            <article className="card group flex h-full flex-col p-8 transition-all duration-500 hover:-translate-y-2 hover:border-terracotta-200 hover:shadow-lift">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-terracotta-50 text-terracotta-500 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                <Building2 className="h-5.5 w-5.5" />
              </span>
              <h3 className="mt-5 text-lg font-extrabold text-ink">Craft Basic</h3>
              <p className="mt-1 text-sm font-medium text-ink-mute">For landlords listing their first properties</p>
              <div className="mt-6 flex items-end gap-1.5">
                <span key={`b-${cycle}`} className="fade-stack text-4xl font-extrabold tracking-tight text-terracotta-500">
                  <span>₹{price(999).toLocaleString("en-IN")}</span>
                </span>
                <span className="pb-1.5 text-sm font-semibold text-ink-mute">/{yearly ? "year" : "month"}</span>
              </div>
              <p className="mt-1.5 text-xs font-bold text-terracotta-600">Up to 3 properties · Unlimited agreements</p>
              <ul className="mt-7 flex-1 space-y-3.5">
                <PlanFeature tone="terracotta" text="Verified-tenant-request inbox" />
                <PlanFeature tone="terracotta" text="End-to-end digital lease creation" />
                <PlanFeature tone="terracotta" text="Mock Aadhaar & PAN screening" />
                <PlanFeature tone="terracotta" text="Legally vetted agreement templates" />
                <PlanFeature tone="terracotta" text="Secure cloud vault & rent ledger" />
              </ul>
              <CTAButton tone="terracotta" variant="outline" className="mt-8 w-full" onClick={() => startRole("landlord")}>
                Start as a Landlord
              </CTAButton>
            </article>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <p className="mt-10 text-center text-sm font-semibold text-ink-mute">
            All plans include bank-grade encryption, 7-day money-back guarantee &
            <span className="text-forest-600"> cancel-anytime peace of mind.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
