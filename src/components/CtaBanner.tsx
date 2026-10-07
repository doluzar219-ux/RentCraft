import { FileSignature, ShieldCheck, Sparkle } from "lucide-react";
import { CTAButton, Reveal } from "./primitives";

export default function CtaBanner() {
  return (
    <section className="relative px-5 py-10 sm:px-8">
      <Reveal variant="zoom">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-forest-500 px-8 py-16 text-center shadow-lift-green sm:px-14 sm:py-20">
          {/* deco */}
          <div className="texture-dots pointer-events-none absolute -left-10 -top-10 h-56 w-56 opacity-25 [mask-image:radial-gradient(closest-side,black,transparent)]" />
          <div className="texture-dots pointer-events-none absolute -bottom-12 -right-8 h-56 w-56 opacity-25 [mask-image:radial-gradient(closest-side,black,transparent)]" />
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-forest-400/50 blur-3xl" />
          <Sparkle className="animate-pulse-soft absolute left-[12%] top-[22%] h-6 w-6 text-terracotta-200" />
          <Sparkle className="animate-pulse-soft absolute bottom-[24%] right-[14%] h-5 w-5 text-terracotta-200 [animation-delay:-1.4s]" />

          <span className="relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-cream backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5 text-terracotta-200" />
            Free to start · verified in minutes
          </span>

          <h2 className="relative mx-auto mt-6 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-cream sm:text-5xl">
            Ready to craft your first{" "}
            <span className="relative inline-block">
              paperless lease?
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden>
                <path d="M4 10 C 60 2, 150 2, 216 8" fill="none" stroke="#EFA670" strokeWidth="6" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-forest-100">
            Join thousands of landlords and tenants who traded notary queues for
            e-signatures, and blind trust for verified profiles.
          </p>

          <div className="relative mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <CTAButton tone="white" className="text-forest-600! w-full sm:w-auto">
              Get Started Free
            </CTAButton>
            <CTAButton
              variant="outline"
              tone="forest"
              className="w-full border-white/40 text-cream hover:bg-white/10 hover:border-cream sm:w-auto"
              icon={false}
              href="#dashboard"
            >
              <FileSignature className="h-4 w-4" />
              Replay the demo
            </CTAButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
