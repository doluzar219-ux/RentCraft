import {
  FileSignature,
  ScanFace,
  ListChecks,
  CloudCog,
  ReceiptIndianRupee,
  LayoutGrid,
  Check,
  BellRing,
  Fingerprint,
  ArrowUpRight,
} from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";
import { cn } from "../utils/cn";

/* ── small functional card ── */
function FeatureCard({
  icon: Icon,
  title,
  copy,
  tone,
  delay = 0,
  chips,
}: {
  icon: typeof FileSignature;
  title: string;
  copy: string;
  tone: "terracotta" | "forest";
  delay?: number;
  chips?: string[];
}) {
  const forest = tone === "forest";
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={cn(
          "card group relative h-full overflow-hidden p-7 transition-all duration-500 hover:-translate-y-2",
          forest ? "hover:border-forest-200 hover:shadow-lift-green" : "hover:border-terracotta-200 hover:shadow-lift"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-25",
            forest ? "bg-forest-400" : "bg-terracotta-400"
          )}
        />
        <span
          className={cn(
            "grid h-13 w-13 place-items-center rounded-2xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110",
            forest ? "bg-forest-50 text-forest-500" : "bg-terracotta-50 text-terracotta-500"
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={2.1} />
        </span>
        <h3 className="mt-5 text-lg font-extrabold text-ink">{title}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{copy}</p>
        {chips && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {chips.map((c) => (
              <span
                key={c}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold",
                  forest ? "bg-forest-50 text-forest-600" : "bg-terracotta-50 text-terracotta-600"
                )}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </article>
    </Reveal>
  );
}

/* ── big card: digital agreements w/ signing progress mock ── */
function AgreementCard() {
  const steps = ["Drafted", "Verified", "Signed"];
  return (
    <Reveal className="h-full">
      <article className="card group relative h-full overflow-hidden p-7 transition-all duration-500 hover:-translate-y-2 hover:border-terracotta-200 hover:shadow-lift sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-terracotta-400 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20" />
        <div className="flex items-start justify-between">
          <span className="grid h-13 w-13 place-items-center rounded-2xl bg-terracotta-50 text-terracotta-500 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
            <FileSignature className="h-6 w-6" strokeWidth={2.1} />
          </span>
          <span className="font-hand rotate-2 text-xl font-semibold text-terracotta-400">from draft to done</span>
        </div>
        <h3 className="mt-5 text-xl font-extrabold text-ink">End-to-End Digital Agreements</h3>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-ink-soft">
          Auto-drafted from your listing details, stamped with legally-vetted language, and
          e-signed by both parties — a full audit trail, wet-ink free.
        </p>

        {/* progress mock */}
        <div className="mt-6 rounded-2xl border border-terracotta-100 bg-linen p-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-full text-[10px] font-black transition-transform duration-500 group-hover:scale-110",
                      i === 2 ? "bg-forest-500 text-white" : "bg-terracotta-500 text-white",
                      i === 1 && "delay-100",
                      i === 2 && "delay-200"
                    )}
                  >
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                  <span className="text-[10px] font-bold text-ink-soft">{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="mx-2 mb-5 h-1 flex-1 rounded-full bg-terracotta-100">
                    <div className="h-full w-full origin-left scale-x-100 rounded-full bg-gradient-to-r from-terracotta-400 to-forest-400 transition-transform duration-1000 group-hover:animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-4 py-2.5 text-xs font-bold shadow-soft">
            <span className="text-ink-soft">Lease #RC-2481 · Koramangala 2BHK</span>
            <span className="inline-flex items-center gap-1 text-forest-600">
              <BellRing className="h-3.5 w-3.5" /> Signed 2 days ago
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ── big card: mock aadhaar verification w/ scan mock ── */
function VerificationCard() {
  return (
    <Reveal delay={110} className="h-full">
      <article className="card group relative h-full overflow-hidden p-7 transition-all duration-500 hover:-translate-y-2 hover:border-forest-200 hover:shadow-lift-green sm:p-8">
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-forest-400 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-20" />
        <div className="flex items-start justify-between">
          <span className="grid h-13 w-13 place-items-center rounded-2xl bg-forest-50 text-forest-500 transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110">
            <ScanFace className="h-6 w-6" strokeWidth={2.1} />
          </span>
          <span className="font-hand -rotate-2 text-xl font-semibold text-forest-500">trust, but verify</span>
        </div>
        <h3 className="mt-5 text-xl font-extrabold text-ink">Mock Aadhaar &amp; PAN Verification</h3>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-ink-soft">
          A simulated smart-KYC layer that cross-checks IDs, flags mismatches and stamps every
          profile with a verifiable trust score — privacy-first, tamper-evident.
        </p>

        {/* id scan mock */}
        <div className="mt-6 flex items-center gap-4 rounded-2xl border border-forest-100 bg-linen p-4">
          <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-forest-500/10">
            <Fingerprint className="h-8 w-8 text-forest-500" strokeWidth={1.8} />
            <span className="absolute inset-x-2 h-0.5 animate-[dash_2.2s_ease-in-out_infinite] rounded-full bg-forest-400 shadow-[0_0_12px_2px_rgba(89,150,121,0.7)]" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-bold text-ink">Aadhaar •••• 4821</span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-forest-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                <Check className="h-3 w-3" strokeWidth={3} /> MATCH
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-xs font-bold text-ink">PAN •••• 9074K</span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-forest-500 px-2 py-0.5 text-[10px] font-extrabold text-white">
                <Check className="h-3 w-3" strokeWidth={3} /> MATCH
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-forest-100">
              <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-forest-400 to-forest-500 transition-all duration-1000 group-hover:w-full" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-forest-500">Trust score 96 / 100</p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-forest-200 to-transparent" />
      <div className="texture-dots-green pointer-events-none absolute -right-20 top-32 h-72 w-72 opacity-50 [mask-image:radial-gradient(closest-side,black,transparent)]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Core Features"
          eyebrowIcon={<LayoutGrid className="h-3.5 w-3.5" />}
          tone="forest"
          title={
            <>
              Everything a lease needs,{" "}
              <span className="hand-underline-green text-forest-500">nothing</span> it doesn't
            </>
          }
          copy="Crafted as one continuous pipeline — from the first hello to the final signature, and every rent receipt after."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <AgreementCard />
          <VerificationCard />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={ListChecks}
            title="Customizable Clauses"
            copy="Pet policy? Lock-in period? Painting clause? Toggle from a vetted library or write your own — legalese translated to plain language."
            tone="terracotta"
            chips={["50+ vetted clauses", "Plain-language mode"]}
          />
          <FeatureCard
            icon={CloudCog}
            title="Secure Cloud Vault"
            copy="AES-256 encrypted storage with role-based access. Every agreement, receipt and ID check — searchable in seconds, safe for years."
            tone="forest"
            chips={["AES-256", "Audit trails"]}
            delay={100}
          />
          <FeatureCard
            icon={ReceiptIndianRupee}
            title="Auto Rent Receipts"
            copy="Rent reminders go out politely on their own, receipts generate instantly on payment, and deposits stay tracked till the last rupee."
            tone="terracotta"
            chips={["Auto-reminders", "Deposit tracker"]}
            delay={200}
          />
        </div>

        <Reveal delay={120}>
          <div className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-sm font-semibold text-ink-mute">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 shadow-soft border border-terracotta-100">
              + 9 more tools
              <ArrowUpRight className="h-3.5 w-3.5 text-terracotta-500" />
            </span>
            <span>waiting inside the dashboard below</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
