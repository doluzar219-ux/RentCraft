import { ShieldCheck, KeyRound, Sparkles, Star, BadgeCheck, MousePointerClick } from "lucide-react";
import HeroArt from "./art/HeroArt";
import { CTAButton, Reveal } from "./primitives";
import type { Role } from "../types";

function AvatarCluster() {
  const palette = [
    { bg: "bg-terracotta-200", label: "OL" },
    { bg: "bg-forest-200", label: "AW" },
    { bg: "bg-terracotta-300", label: "+9" },
  ];
  return (
    <div className="flex -space-x-2.5">
      {palette.map((a, i) => (
        <span
          key={i}
          className={`grid h-9 w-9 place-items-center rounded-full ${a.bg} text-[11px] font-extrabold text-ink ring-[3px] ring-cream`}
        >
          {a.label}
        </span>
      ))}
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-[11px] font-extrabold text-terracotta-600 ring-[3px] ring-cream shadow-soft">
        <Star className="h-3.5 w-3.5 fill-terracotta-500 text-terracotta-500" />
      </span>
    </div>
  );
}

export default function Hero({ onPickRole }: { onPickRole: (role: Role) => void }) {
  return (
    <section id="top" className="relative overflow-hidden pt-[76px]">
      {/* ambient decorations */}
      <div className="texture-dots pointer-events-none absolute -left-24 top-40 h-72 w-72 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <div className="texture-dots-green pointer-events-none absolute -right-20 top-24 h-80 w-80 opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[1100px] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-terracotta-50/80 to-transparent blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-24 lg:pt-16">
        {/* ── copy column ── */}
        <div className="relative z-10 max-w-2xl text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-2 text-xs font-bold text-forest-600 shadow-[0_4px_14px_-6px_rgba(44,94,75,0.35)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Automated leases + smart Aadhaar/PAN verification
              <Sparkles className="h-3.5 w-3.5 text-terracotta-500" />
            </span>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.06] tracking-tight text-ink sm:text-6xl lg:text-[4.15rem]">
              Your Portal to Properties —{" "}
              <span className="hand-underline whitespace-nowrap text-terracotta-500">Paperless</span>,{" "}
              <span className="hand-underline-green text-forest-500">Secure</span>, and{" "}
              <span className="relative inline-block">
                Seamless
                <svg
                  className="absolute -right-7 -top-4 h-7 w-7 text-terracotta-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
                </svg>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg lg:mx-0">
              RentCraft turns weeks of rental paperwork into a five-minute flow —
              generate legally-vetted digital leases, verify identities with mock
              Aadhaar &amp; PAN checks, and e-sign from your couch. No brokers, no
              chaos, no chai-stained documents.
            </p>
          </Reveal>

          <Reveal delay={250}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row lg:justify-start">
              <CTAButton
                tone="terracotta"
                icon={false}
                className="w-full sm:w-auto"
                onClick={() => onPickRole("landlord")}
              >
                <KeyRound className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                I am a Landlord
              </CTAButton>
              <CTAButton
                tone="forest"
                variant="outline"
                icon={false}
                className="w-full bg-white/60 sm:w-auto"
                onClick={() => onPickRole("tenant")}
              >
                <BadgeCheck className="h-4 w-4" />
                I am a Tenant
              </CTAButton>
            </div>
          </Reveal>

          <Reveal delay={330}>
            <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <AvatarCluster />
              <div className="text-left">
                <div className="flex items-center justify-center gap-1 lg:justify-start">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-terracotta-400 text-terracotta-400" />
                  ))}
                  <span className="ml-1.5 text-xs font-bold text-ink">4.9/5</span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-ink-mute">
                  Loved by <span className="font-bold text-forest-600">12,000+</span> renters &amp; owners across India
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── art column ── */}
        <Reveal variant="zoom" delay={150} className="relative">
          <div className="relative mx-auto max-w-[620px]">
            <HeroArt />

            {/* floating chips over the art */}
            <div className="card absolute -left-2 top-6 hidden animate-float items-center gap-2.5 px-4 py-3 sm:flex lg:-left-8">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-100 text-forest-600">
                <ShieldCheck className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-forest-600">KYC verified</p>
                <p className="text-xs font-semibold text-ink-soft">Mock Aadhaar · PAN</p>
              </div>
            </div>

            <div className="card absolute -right-1 bottom-10 hidden animate-float-slow items-center gap-2.5 px-4 py-3 sm:flex lg:-right-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-terracotta-100 text-terracotta-600">
                <MousePointerClick className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-terracotta-600">E-signed in 4 min</p>
                <p className="text-xs font-semibold text-ink-soft">Both parties, remotely</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
