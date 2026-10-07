import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "../utils/cn";
import { useApp } from "../store/AppContext";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="group flex items-center gap-2.5">
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-terracotta-500 shadow-[0_8px_20px_-6px_rgba(221,107,32,0.6)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" fill="none" aria-hidden>
          <path
            d="M5 19V9.5L12 4l7 5.5V19a1 1 0 0 1-1 1h-3.6v-5.4H9.6V20H6a1 1 0 0 1-1-1Z"
            fill="#FDFBF7"
          />
          <path
            d="M15.2 15.8h4.4M17.4 13.6l2.2 2.2-2.2 2.2"
            stroke="#FDFBF7"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(-1 0)"
          />
        </svg>
      </span>
      <span
        className={cn(
          "text-xl font-extrabold tracking-tight",
          light ? "text-cream" : "text-ink"
        )}
      >
        Rent<span className="text-terracotta-500">Craft</span>
      </span>
    </a>
  );
}

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "Workflow", href: "#workflow" },
  { label: "Pricing", href: "#pricing" },
  { label: "Team", href: "#team" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { session, openAuth, enterApp } = useApp();

  const primaryCta = session ? enterApp : openAuth;
  const primaryLabel = session ? "Dashboard" : "Get Started";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-terracotta-100/80 bg-cream/85 shadow-[0_10px_40px_-18px_rgba(221,107,32,0.25)] backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />

        <div className="hidden items-center gap-9 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-underline text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="#dashboard"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-terracotta-600"
          >
            Live demo
          </a>
          <button
            onClick={primaryCta}
            className="group inline-flex items-center gap-1.5 rounded-full bg-terracotta-500 px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_26px_-8px_rgba(221,107,32,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-600 hover:shadow-[0_16px_34px_-10px_rgba(221,107,32,0.65)] active:scale-95"
          >
            {primaryLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </button>
        </div>

        {/* mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="grid h-11 w-11 place-items-center rounded-xl border border-terracotta-100 bg-white text-ink shadow-soft transition-all active:scale-90 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-b border-terracotta-100 bg-cream/95 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {LINKS.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${i * 40}ms` }}
              className="rounded-xl px-4 py-3 text-base font-semibold text-ink transition-colors hover:bg-terracotta-50 hover:text-terracotta-600"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              primaryCta();
            }}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-bold text-white"
          >
            {primaryLabel} <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
