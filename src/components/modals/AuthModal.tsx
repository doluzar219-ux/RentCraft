import { useState, type FormEvent } from "react";
import { KeyRound, Search, ArrowRight, ShieldCheck } from "lucide-react";
import Modal from "../app/Modal";
import { Field, inputCls } from "../app/ui";
import { useApp } from "../../store/AppContext";
import { cn } from "../../utils/cn";
import type { Role } from "../../types";

const ROLE_CARDS: {
  id: Role;
  title: string;
  copy: string;
  icon: typeof KeyRound;
}[] = [
  {
    id: "landlord",
    title: "I am a Landlord",
    copy: "List properties, verify tenants & countersign leases",
    icon: KeyRound,
  },
  {
    id: "tenant",
    title: "I am a Tenant",
    copy: "Browse verified homes & e-sign your lease in minutes",
    icon: Search,
  },
];

export default function AuthModal() {
  const { authOpen, closeAuth, login, role, setRole } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 3) next.name = "Please enter your full name (min 3 characters)";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "That email doesn't look right";
    setErrors(next);
    if (Object.keys(next).length) return;
    login(name.trim(), email.trim(), role);
  };

  return (
    <Modal open={authOpen} onClose={closeAuth} size="md" label="Sign in to RentCraft">
      <form onSubmit={submit} className="p-7 sm:p-9">
        <span className="inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-forest-600">
          <ShieldCheck className="h-3.5 w-3.5" /> Mock session · stored locally
        </span>
        <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">Welcome to RentCraft</h3>
        <p className="mt-1.5 text-sm font-medium text-ink-soft">
          Pick a side of the door and step into your dashboard.
        </p>

        {/* role cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {ROLE_CARDS.map((c) => {
            const active = role === c.id;
            const terra = c.id === "landlord";
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setRole(c.id)}
                className={cn(
                  "group relative rounded-2xl border-2 p-5 text-left transition-all duration-300 hover:-translate-y-1",
                  active
                    ? terra
                      ? "border-terracotta-500 bg-terracotta-50 shadow-lift"
                      : "border-forest-500 bg-forest-50 shadow-lift-green"
                    : "border-terracotta-100 bg-white shadow-soft hover:border-terracotta-200"
                )}
              >
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    terra ? "bg-terracotta-500 text-white" : "bg-forest-500 text-white"
                  )}
                >
                  <c.icon className="h-5 w-5" />
                </span>
                <p className="mt-3.5 text-sm font-extrabold text-ink">{c.title}</p>
                <p className="mt-1 text-xs font-medium leading-snug text-ink-mute">{c.copy}</p>
                <span
                  className={cn(
                    "absolute right-4 top-4 grid h-5.5 w-5.5 place-items-center rounded-full border-2 transition-all duration-300",
                    active
                      ? terra
                        ? "border-terracotta-500 bg-terracotta-500"
                        : "border-forest-500 bg-forest-500"
                      : "border-terracotta-200 bg-white"
                  )}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Full name" error={errors.name}>
            <input
              className={inputCls}
              placeholder="e.g. Priya Deshmukh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </Field>
          <Field label="Email (optional)" error={errors.email}>
            <input
              className={inputCls}
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Field>
        </div>

        <button
          type="submit"
          className={cn(
            "group mt-7 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]",
            role === "landlord"
              ? "bg-terracotta-500 shadow-terracotta-500/40 hover:bg-terracotta-600"
              : "bg-forest-500 shadow-forest-500/40 hover:bg-forest-600"
          )}
        >
          Enter my {role === "landlord" ? "Landlord" : "Tenant"} dashboard
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
        <p className="mt-3.5 text-center text-[11px] font-semibold text-ink-mute">
          No password needed — this prototype signs you in with a local mock session.
        </p>
      </form>
    </Modal>
  );
}
