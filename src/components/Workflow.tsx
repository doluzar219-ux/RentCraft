import {
  Search,
  ScanFace,
  PenLine,
  Home,
  UserCheck,
  Stamp,
  KeyRound,
  Building2,
  PartyPopper,
} from "lucide-react";
import { Reveal, SectionHeading } from "./primitives";
import { cn } from "../utils/cn";

type Step = {
  icon: typeof Search;
  title: string;
  copy: string;
  time: string;
};

const TENANT_STEPS: Step[] = [
  {
    icon: Search,
    title: "Browse verified homes",
    copy: "Explore listings where every owner is identity-checked before their property ever goes live.",
    time: "~2 min",
  },
  {
    icon: ScanFace,
    title: "Complete instant KYC",
    copy: "One-tap mock Aadhaar & PAN check builds your trusted renter profile — no photocopies, no fax-era nonsense.",
    time: "~90 sec",
  },
  {
    icon: PenLine,
    title: "E-sign & move in",
    copy: "Review the auto-drafted lease, sign digitally from anywhere, and get your keys with a downloadable agreement.",
    time: "~4 min",
  },
];

const LANDLORD_STEPS: Step[] = [
  {
    icon: Home,
    title: "List your property",
    copy: "Add photos, rent terms and house rules. RentCraft drafts a compliant lease skeleton automatically.",
    time: "~3 min",
  },
  {
    icon: UserCheck,
    title: "Review verified requests",
    copy: "Every inquiry arrives pre-verified — mock Aadhaar, PAN and renter history neatly packed in one card.",
    time: "Real-time",
  },
  {
    icon: Stamp,
    title: "Approve the agreement",
    copy: "Tweak clauses, countersign digitally, and watch rent receipts file themselves into your vault.",
    time: "~2 min",
  },
];

function StepCard({ step, index, tone }: { step: Step; index: number; tone: "forest" | "terracotta" }) {
  const isForest = tone === "forest";
  const Icon = step.icon;
  return (
    <Reveal delay={index * 130}>
      <li className="group relative flex gap-5">
        {/* connector */}
        <div className="flex flex-col items-center">
          <span
            className={cn(
              "relative grid h-13 w-13 shrink-0 place-items-center rounded-2xl text-white shadow-lg transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 sm:h-14 sm:w-14",
              isForest
                ? "bg-forest-500 shadow-forest-500/30"
                : "bg-terracotta-500 shadow-terracotta-500/30"
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={2.2} />
            <span
              className={cn(
                "absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-cream text-[11px] font-extrabold",
                isForest ? "bg-forest-700 text-forest-100" : "bg-terracotta-700 text-terracotta-100"
              )}
            >
              {index + 1}
            </span>
          </span>
          {index < 2 && (
            <span
              className={cn(
                "mt-2 w-px flex-1 border-l-2 border-dashed",
                isForest ? "border-forest-200" : "border-terracotta-200"
              )}
            />
          )}
        </div>

        <div
          className={cn(
            "card mb-5 flex-1 p-5 transition-all duration-500 group-hover:-translate-y-1 sm:p-6",
            isForest
              ? "hover:border-forest-200 hover:shadow-lift-green"
              : "hover:border-terracotta-200 hover:shadow-lift"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <h4 className="text-base font-extrabold text-ink sm:text-lg">{step.title}</h4>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider",
                isForest ? "bg-forest-50 text-forest-600" : "bg-terracotta-50 text-terracotta-600"
              )}
            >
              {step.time}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.copy}</p>
        </div>
      </li>
    </Reveal>
  );
}

export default function Workflow() {
  return (
    <section id="workflow" className="relative overflow-hidden py-24 sm:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta-200 to-transparent" />
      <div className="texture-dots pointer-events-none absolute -left-16 bottom-24 h-72 w-72 opacity-50 [mask-image:radial-gradient(closest-side,black,transparent)]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The Workflow"
          eyebrowIcon={<KeyRound className="h-3.5 w-3.5" />}
          title={
            <>
              Two journeys, <span className="hand-underline text-terracotta-500">one</span> calm platform
            </>
          }
          copy="Whether you hold the keys or you're hunting for them — RentCraft choreographs every step, end to end."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* ── TENANT column ── */}
          <Reveal variant="left">
            <div className="relative overflow-hidden rounded-3xl border border-forest-100 bg-gradient-to-b from-forest-50/80 to-cream p-6 sm:p-9">
              <div className="texture-dots-green pointer-events-none absolute -right-12 -top-12 h-44 w-44 opacity-70 [mask-image:radial-gradient(closest-side,black,transparent)]" />
              <div className="relative mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-forest-500 text-white shadow-lg shadow-forest-500/25">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-forest-500">Journey A</p>
                    <h3 className="text-xl font-extrabold text-ink sm:text-2xl">For Tenants</h3>
                  </div>
                </div>
                <span className="font-hand rotate-2 text-2xl font-semibold text-forest-400">find → verify → sign</span>
              </div>

              <ol className="relative">
                {TENANT_STEPS.map((s, i) => (
                  <StepCard key={s.title} step={s} index={i} tone="forest" />
                ))}
              </ol>

              <div className="relative flex items-center gap-2.5 rounded-2xl border border-forest-200 bg-white px-5 py-4">
                <PartyPopper className="h-5 w-5 text-forest-500" />
                <p className="text-sm font-bold text-forest-600">
                  Welcome home! Keys + signed lease in your pocket.
                </p>
              </div>
            </div>
          </Reveal>

          {/* ── LANDLORD column ── */}
          <Reveal variant="right" delay={120}>
            <div className="relative overflow-hidden rounded-3xl border border-terracotta-100 bg-gradient-to-b from-terracotta-50/80 to-cream p-6 sm:p-9">
              <div className="texture-dots pointer-events-none absolute -right-12 -top-12 h-44 w-44 opacity-70 [mask-image:radial-gradient(closest-side,black,transparent)]" />
              <div className="relative mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-terracotta-500 text-white shadow-lg shadow-terracotta-500/25">
                    <KeyRound className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-terracotta-500">Journey B</p>
                    <h3 className="text-xl font-extrabold text-ink sm:text-2xl">For Landlords</h3>
                  </div>
                </div>
                <span className="font-hand -rotate-2 text-2xl font-semibold text-terracotta-400">list → approve → relax</span>
              </div>

              <ol className="relative">
                {LANDLORD_STEPS.map((s, i) => (
                  <StepCard key={s.title} step={s} index={i} tone="terracotta" />
                ))}
              </ol>

              <div className="relative flex items-center gap-2.5 rounded-2xl border border-terracotta-200 bg-white px-5 py-4">
                <Stamp className="h-5 w-5 text-terracotta-500" />
                <p className="text-sm font-bold text-terracotta-600">
                  Agreement sealed. Rent tracking switches on automatically.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
