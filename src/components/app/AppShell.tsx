import { ArrowLeft, Home, LogOut, Search, ShieldCheck } from "lucide-react";
import { Logo } from "../Navbar";
import { useApp } from "../../store/AppContext";
import { cn } from "../../utils/cn";
import type { Role } from "../../types";
import LandlordDashboard from "./LandlordDashboard";
import TenantDashboard from "./TenantDashboard";

export default function AppShell() {
  const { role, setRole, session, kyc, exitApp, logout, pushToast } = useApp();

  const switchRole = (r: Role) => {
    if (r === role) return;
    setRole(r);
    pushToast(`Switched to ${r} view — same cozy workspace, other side of the door`, r === "landlord" ? "terra" : "forest");
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* authenticated header */}
      <header className="sticky top-0 z-50 border-b border-terracotta-100/80 bg-cream/85 shadow-[0_10px_40px_-18px_rgba(221,107,32,0.25)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <Logo />
          </div>

          {/* role switcher */}
          <div className="relative hidden rounded-full border border-terracotta-100 bg-white p-1 shadow-soft sm:flex">
            <span
              className={cn(
                "absolute inset-y-1 w-[calc(50%-4px)] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                role === "landlord"
                  ? "left-1 bg-terracotta-500 shadow-md shadow-terracotta-500/40"
                  : "left-[calc(50%+2px)] bg-forest-500 shadow-md shadow-forest-500/40"
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
                onClick={() => switchRole(t.id)}
                className={cn(
                  "relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors duration-300 sm:px-5",
                  role === t.id ? "text-white" : "text-ink-mute hover:text-ink"
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {/* user chip */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2.5 rounded-full border border-terracotta-100 bg-white py-1.5 pl-1.5 pr-3 shadow-soft md:flex">
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full text-xs font-black text-white",
                  role === "landlord" ? "bg-terracotta-500" : "bg-forest-500"
                )}
              >
                {session?.name?.[0]?.toUpperCase() ?? "G"}
              </span>
              <div className="leading-tight">
                <p className="max-w-[120px] truncate text-xs font-extrabold text-ink">{session?.name ?? "Guest"}</p>
                <p className="flex items-center gap-1 text-[10px] font-bold text-ink-mute">
                  {kyc ? (
                    <>
                      <ShieldCheck className="h-3 w-3 text-forest-500" /> Verified · {kyc.trustScore}
                    </>
                  ) : (
                    "KYC pending"
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={exitApp}
              className="hidden items-center gap-1.5 rounded-full border border-terracotta-100 bg-white px-4 py-2.5 text-xs font-bold text-ink-soft shadow-soft transition-all hover:-translate-y-0.5 hover:text-terracotta-600 active:scale-95 sm:inline-flex"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to site
            </button>
            <button
              onClick={() => {
                logout();
                pushToast("Signed out — session cleared from this device", "ink");
              }}
              aria-label="Sign out"
              title="Sign out"
              className="grid h-10.5 w-10.5 place-items-center rounded-full border border-terracotta-100 bg-white text-ink-soft shadow-soft transition-all hover:-translate-y-0.5 hover:text-terracotta-600 active:scale-90"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* mobile role switcher */}
        <div className="border-t border-terracotta-100/60 px-5 py-2.5 sm:hidden">
          <div className="relative flex rounded-full border border-terracotta-100 bg-white p-1 shadow-soft">
            <span
              className={cn(
                "absolute inset-y-1 w-[calc(50%-4px)] rounded-full transition-all duration-500",
                role === "landlord" ? "left-1 bg-terracotta-500" : "left-[calc(50%+2px)] bg-forest-500"
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
                onClick={() => switchRole(t.id)}
                className={cn(
                  "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-colors duration-300",
                  role === t.id ? "text-white" : "text-ink-mute"
                )}
              >
                <t.icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* dashboard body */}
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {role === "landlord" ? <LandlordDashboard /> : <TenantDashboard />}
      </main>

      <footer className="border-t border-terracotta-100/60 py-6 text-center text-[11px] font-semibold text-ink-mute">
        RentCraft prototype workspace · everything you do here persists in this browser
      </footer>
    </div>
  );
}
