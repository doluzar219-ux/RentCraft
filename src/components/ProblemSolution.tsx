import {
  FileStack,
  PhoneCall,
  IndianRupee,
  FolderSearch,
  FileSignature,
  ScanFace,
  BadgeIndianRupee,
  CloudUpload,
  X,
  Check,
  HeartCrack,
  HeartHandshake,
  ArrowDown,
} from "lucide-react";
import { CountUp, Reveal, SectionHeading } from "./primitives";

const PROBLEMS = [
  { icon: FileStack, text: "Weeks of physical paperwork, notarisation queues & courier ping-pong" },
  { icon: PhoneCall, text: "Endless broker calls, hidden commissions and zero accountability" },
  { icon: FolderSearch, text: "Blind trust — no reliable way to verify who you're dealing with" },
  { icon: IndianRupee, text: "Lost rent receipts, deposit disputes and misplaced agreements" },
];

const SOLUTIONS = [
  { icon: FileSignature, text: "Digitally crafted lease agreements, e-signed by both parties in minutes" },
  { icon: ScanFace, text: "Smart mock Aadhaar & PAN verification — real identities, zero guesswork" },
  { icon: BadgeIndianRupee, text: "Transparent pricing with auto-generated receipts. Broker? Optional." },
  { icon: CloudUpload, text: "Every agreement sealed in your encrypted cloud vault, forever findable" },
];

function CompareRow({
  icon: Icon,
  text,
  good,
}: {
  icon: typeof FileStack;
  text: string;
  good: boolean;
}) {
  return (
    <li className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors duration-300 hover:bg-black/[0.025]">
      <span
        className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${
          good ? "bg-forest-100 text-forest-600" : "bg-terracotta-100 text-terracotta-600"
        }`}
      >
        <Icon className="h-4.5 w-4.5" strokeWidth={2.2} />
      </span>
      <p className="pt-1.5 text-sm font-medium leading-snug text-ink-soft">{text}</p>
    </li>
  );
}

const STATS = [
  { value: 38500, suffix: "+", label: "Digital leases crafted", tone: "text-terracotta-500" },
  { value: 12000, suffix: "+", label: "Verified users on board", tone: "text-forest-500" },
  { value: 18, suffix: " min", label: "Average time to e-sign", tone: "text-terracotta-500" },
  { value: 0, prefix: "₹", label: "Brokerage. Ever.", tone: "text-forest-500" },
];

export default function ProblemSolution() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="texture-dots pointer-events-none absolute right-0 top-16 h-64 w-64 opacity-50 [mask-image:radial-gradient(closest-side,black,transparent)]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Problem → Solved"
          eyebrowIcon={<HeartHandshake className="h-3.5 w-3.5" />}
          title={
            <>
              Renting felt like a chore.{" "}
              <span className="text-terracotta-500">We crafted the cure.</span>
            </>
          }
          copy="The old rental ritual is broken — opaque, slow and paper-hungry. RentCraft replaces the entire mess with one calm, automated flow."
        />

        {/* comparison */}
        <div className="relative mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-2 lg:gap-0">
          {/* VS badge */}
          <Reveal
            delay={200}
            variant="zoom"
            className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <span className="grid h-16 w-16 place-items-center rounded-full border-4 border-cream bg-gradient-to-br from-terracotta-500 to-terracotta-600 text-sm font-extrabold text-white shadow-lift">
              VS
            </span>
          </Reveal>

          {/* old way */}
          <Reveal variant="left" className="relative z-10">
            <article className="card h-full border-terracotta-200/80 bg-gradient-to-b from-white to-terracotta-50/50 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift sm:p-9 lg:rounded-r-none lg:border-r-0">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-terracotta-100 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-terracotta-700">
                  <HeartCrack className="h-3.5 w-3.5" /> The old way
                </span>
                <span className="font-hand text-2xl font-semibold text-terracotta-400 -rotate-3">ugh, never again</span>
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-ink sm:text-2xl">
                Traditional rental hassles
              </h3>
              <ul className="mt-5 space-y-1">
                {PROBLEMS.map((p) => (
                  <CompareRow key={p.text} {...p} good={false} />
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {["3–4 weeks lost", "Broker fees", "Paper trail chaos"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-terracotta-200 bg-white px-3 py-1.5 text-[11px] font-bold text-terracotta-600"
                  >
                    <X className="h-3 w-3" strokeWidth={3} /> {t}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>

          {/* new way */}
          <Reveal variant="right" className="relative z-10">
            <article className="card relative h-full overflow-hidden border-forest-200 bg-gradient-to-b from-white to-forest-50/60 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift-green sm:p-9 lg:rounded-l-none lg:scale-[1.02] lg:shadow-lift-green">
              <div className="texture-dots-green absolute -right-10 -top-10 h-40 w-40 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" />
              <div className="relative flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-forest-500 px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white">
                  <HeartHandshake className="h-3.5 w-3.5" /> The RentCraft way
                </span>
                <span className="font-hand text-2xl font-semibold text-forest-500 rotate-2">yes, please!</span>
              </div>
              <h3 className="relative mt-5 text-xl font-extrabold text-ink sm:text-2xl">
                Automated, verified, digital
              </h3>
              <ul className="relative mt-5 space-y-1">
                {SOLUTIONS.map((s) => (
                  <CompareRow key={s.text} {...s} good />
                ))}
              </ul>
              <div className="relative mt-6 flex flex-wrap gap-2">
                {["~18 min start to sign", "Verified identities", "One calm dashboard"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-white px-3 py-1.5 text-[11px] font-bold text-forest-600"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} /> {t}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        </div>

        {/* mobile arrow */}
        <div className="mt-8 flex justify-center lg:hidden">
          <span className="grid h-11 w-11 animate-bounce place-items-center rounded-full bg-terracotta-50 text-terracotta-500 border border-terracotta-100">
            <ArrowDown className="h-5 w-5" />
          </span>
        </div>

        {/* stats band */}
        <Reveal delay={100}>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="card group p-6 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <p className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${s.tone}`}>
                  <CountUp end={s.value} suffix={s.suffix ?? ""} prefix={s.prefix ?? ""} />
                </p>
                <p className="mt-1.5 text-xs font-semibold text-ink-mute sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
