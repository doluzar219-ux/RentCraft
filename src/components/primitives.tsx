import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../utils/cn";

/* ── Scroll reveal ─────────────────────────────────────────── */
type RevealProps = {
  children: ReactNode;
  variant?: "up" | "left" | "right" | "zoom";
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={cn(
        "reveal",
        variant === "left" && "reveal-left",
        variant === "right" && "reveal-right",
        variant === "zoom" && "reveal-zoom",
        className
      )}
    >
      {children}
    </Tag>
  );
}

/* ── Animated counter ──────────────────────────────────────── */
export function CountUp({
  end,
  duration = 1600,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setValue(end * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, end, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ── Section eyebrow + heading ─────────────────────────────── */
export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  copy,
  align = "center",
  tone = "terracotta",
}: {
  eyebrow: string;
  eyebrowIcon?: ReactNode;
  title: ReactNode;
  copy?: string;
  align?: "center" | "left";
  tone?: "terracotta" | "forest";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      <Reveal>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]",
            tone === "terracotta"
              ? "border-terracotta-200 bg-terracotta-50 text-terracotta-600"
              : "border-forest-200 bg-forest-50 text-forest-600"
          )}
        >
          {eyebrowIcon}
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={90}>
        <h2 className="mt-5 text-3xl font-extrabold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
          {title}
        </h2>
      </Reveal>
      {copy && (
        <Reveal delay={170}>
          <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ── Buttons ───────────────────────────────────────────────── */
export function CTAButton({
  children,
  tone = "terracotta",
  variant = "solid",
  href,
  onClick,
  icon = true,
  className,
}: {
  children: ReactNode;
  tone?: "terracotta" | "forest" | "white";
  variant?: "solid" | "outline";
  href?: string;
  onClick?: () => void;
  icon?: boolean;
  className?: string;
}) {
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-4 active:scale-[0.97]";

  const tones: Record<string, string> = {
    terracotta:
      "bg-terracotta-500 text-white shadow-[0_10px_28px_-8px_rgba(221,107,32,0.55)] hover:bg-terracotta-600 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-10px_rgba(221,107,32,0.6)] focus-visible:ring-terracotta-200",
    forest:
      "bg-forest-500 text-white shadow-[0_10px_28px_-8px_rgba(44,94,75,0.5)] hover:bg-forest-600 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-10px_rgba(44,94,75,0.55)] focus-visible:ring-forest-200",
    white:
      "bg-white text-ink shadow-soft border border-terracotta-100 hover:-translate-y-0.5 hover:shadow-lift focus-visible:ring-terracotta-100",
    "outline-terracotta":
      "border-2 border-terracotta-300 bg-transparent text-terracotta-600 hover:border-terracotta-500 hover:bg-terracotta-50 hover:-translate-y-0.5 focus-visible:ring-terracotta-200",
    "outline-forest":
      "border-2 border-forest-300 bg-transparent text-forest-600 hover:border-forest-500 hover:bg-forest-50 hover:-translate-y-0.5 focus-visible:ring-forest-200",
  };

  const key = variant === "outline" ? `outline-${tone}` : tone;

  const inner = (
    <>
      {children}
      {icon && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={cn(base, tones[key], className)}>
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cn(base, tones[key], className)}>
      {inner}
    </button>
  );
}
