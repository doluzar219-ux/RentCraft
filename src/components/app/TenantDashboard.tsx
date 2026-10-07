import { useState } from "react";
import {
  Search,
  ShieldCheck,
  FileSignature,
  Building2,
  BadgeCheck,
  Inbox,
  Eye,
  Send,
  Hourglass,
  Stamp,
  Lock,
  Compass,
} from "lucide-react";
import PropertyCard from "./PropertyCard";
import AgreementModal from "../modals/AgreementModal";
import KycModal from "../modals/KycModal";
import { DashStat, EmptyState, KycBanner, SectionTitle, StatusChip } from "./ui";
import { Reveal } from "../primitives";
import { useApp } from "../../store/AppContext";
import { STATUS_META, deriveStatus, formatINR } from "../../utils/agreement";
import { cn } from "../../utils/cn";
import type { Property } from "../../types";

export default function TenantDashboard() {
  const { session, kyc, properties, applications, agreements, applyForLease, pushToast } = useApp();

  const [kycOpen, setKycOpen] = useState(false);
  const [pendingApplyId, setPendingApplyId] = useState<string | null>(null);
  const [activeAgreementId, setActiveAgreementId] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const firstName = session?.name.split(" ")[0] ?? "Explorer";
  const myName = session?.name ?? "";
  const myApplications = applications.filter((a) => a.tenantName === myName);
  const myAgreements = agreements.filter((a) => a.tenantName === myName);
  const activeAgreement = agreements.find((a) => a.id === activeAgreementId) ?? null;
  const signedCount = myAgreements.filter((a) => deriveStatus(a) === "completed").length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const doApply = (propertyId: string) => {
    setApplyingId(propertyId);
    /* brief simulated request for tactile feedback */
    window.setTimeout(() => {
      try {
        const { agreement, created } = applyForLease(propertyId);
        pushToast(
          created
            ? `Application sent · draft agreement ${agreement.id} is ready to review`
            : `Draft ${agreement.id} re-opened for you`,
          "forest"
        );
        setApplyingId(null);
        setActiveAgreementId(agreement.id);
      } catch {
        setApplyingId(null);
        pushToast("Something went sideways — please try again", "terra");
      }
    }, 650);
  };

  const requestLease = (p: Property) => {
    if (!kyc) {
      setPendingApplyId(p.id);
      setKycOpen(true);
      return;
    }
    doApply(p.id);
  };

  return (
    <div>
      {/* greeting */}
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              {greeting}, {firstName}
            </h2>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-medium text-ink-soft">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-forest-600">
                <Compass className="h-3 w-3" /> Tenant console
              </span>
              {kyc ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-forest-600">
                  <ShieldCheck className="h-3 w-3" /> KYC verified · {kyc.trustScore}/100
                </span>
              ) : (
                "Verify your identity once to unlock lease requests."
              )}
            </p>
          </div>
          {kyc ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-forest-500 px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-forest-500/30">
              <BadgeCheck className="h-4 w-4" /> Trusted renter
            </span>
          ) : (
            <button
              onClick={() => setKycOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-forest-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-forest-500/40 transition-all hover:-translate-y-0.5 hover:bg-forest-600 active:scale-95"
            >
              <ShieldCheck className="h-4 w-4" /> Start smart KYC
            </button>
          )}
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-6">
          <KycBanner role="tenant" verified={!!kyc} onVerify={() => setKycOpen(true)} />
        </div>
      </Reveal>

      {/* stats */}
      <Reveal delay={140}>
        <div className="mt-7 grid grid-cols-2 gap-3.5 xl:grid-cols-4">
          <DashStat icon={Building2} label="Homes to browse" value={String(properties.filter((p) => p.status === "available").length)} delta="all with verified owners" role="tenant" />
          <DashStat icon={ShieldCheck} label="KYC trust score" value={kyc ? `${kyc.trustScore}/100` : "—"} delta={kyc ? "top tier renter" : "verify to reveal"} role="tenant" />
          <DashStat icon={Inbox} label="My applications" value={String(myApplications.length)} delta={`${myApplications.filter((a) => a.status === "sent").length} awaiting review`} role="tenant" />
          <DashStat icon={FileSignature} label="Executed leases" value={String(signedCount)} delta="e-signed & valid" role="tenant" />
        </div>
      </Reveal>

      {/* browse */}
      <Reveal delay={180}>
        <div className="mt-9">
          <SectionTitle
            title="Browse verified homes"
            sub="Apply once — RentCraft drafts the agreement instantly"
            right={
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-mute">
                <Search className="h-3.5 w-3.5 text-forest-500" /> {properties.length} listings live
              </span>
            }
          />
        </div>
      </Reveal>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {properties.map((p, i) => {
          const mine = myApplications.find((a) => a.propertyId === p.id);
          const mineAgreement = mine?.agreementId ? agreements.find((a) => a.id === mine.agreementId) : undefined;
          const rented = p.status === "rented";
          return (
            <Reveal key={p.id} delay={i * 70} variant="zoom">
              <PropertyCard
                property={p}
                index={i}
                footer={
                  <button
                    disabled={rented || applyingId === p.id}
                    onClick={() => {
                      if (mineAgreement) {
                        setActiveAgreementId(mineAgreement.id);
                      } else if (!mine) {
                        requestLease(p);
                      }
                    }}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold transition-all duration-300 active:scale-[0.98]",
                      rented
                        ? "cursor-not-allowed bg-linen text-ink-mute"
                        : mineAgreement
                          ? "border-2 border-forest-300 bg-forest-50 text-forest-600 hover:-translate-y-0.5 hover:border-forest-500"
                          : "bg-forest-500 text-white shadow-md shadow-forest-500/30 hover:-translate-y-0.5 hover:bg-forest-600"
                    )}
                  >
                    {applyingId === p.id ? (
                      <>
                        <Hourglass className="h-4 w-4 animate-spin" /> Sending application…
                      </>
                    ) : rented && mineAgreement ? (
                      <>
                        <Eye className="h-4 w-4" /> View my lease
                      </>
                    ) : rented ? (
                      <>
                        <Lock className="h-4 w-4" /> Already rented
                      </>
                    ) : mineAgreement ? (
                      <>
                        <Eye className="h-4 w-4" /> Open draft {mineAgreement.id}
                      </>
                    ) : mine ? (
                      <>
                        <Hourglass className="h-4 w-4" /> Request in review
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Apply / Request Lease
                      </>
                    )}
                  </button>
                }
              />
            </Reveal>
          );
        })}
      </div>

      {/* applications + agreements */}
      <div className="mt-9 grid gap-8 lg:grid-cols-2">
        <Reveal variant="left">
          <div>
            <SectionTitle title="My applications" sub="Live status of every request" />
            <div className="space-y-3">
              {myApplications.length === 0 && (
                <EmptyState icon={Inbox} title="No applications yet" copy="Browse the homes above and hit Apply — your drafts appear here." />
              )}
              {myApplications.map((app) => (
                <div key={app.id} className="card flex items-center gap-3.5 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift-green">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-500">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold text-ink">{app.propertyTitle}</span>
                    <span className="block text-[11px] font-semibold text-ink-mute">Applied with trust score {app.trustScore}</span>
                  </span>
                  <StatusChip tone={app.status === "approved" ? "green" : app.status === "declined" ? "gray" : "amber"}>
                    {app.status === "approved" ? "Owner engaged" : app.status === "declined" ? "Passed" : "In review"}
                  </StatusChip>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal variant="right" delay={100}>
          <div>
            <SectionTitle title="My agreements" sub="Your documents, ready to e-sign" />
            <div className="space-y-3">
              {myAgreements.length === 0 && (
                <EmptyState icon={FileSignature} title="Nothing to sign yet" copy="The moment you request a lease, a legally-formatted draft is generated here." />
              )}
              {myAgreements.map((a) => {
                const st = deriveStatus(a);
                const meta = STATUS_META[st];
                return (
                  <button
                    key={a.id}
                    onClick={() => setActiveAgreementId(a.id)}
                    className="card group flex w-full items-center gap-3.5 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-forest-200 hover:shadow-lift-green"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-500 transition-transform group-hover:scale-110">
                      {st === "completed" ? <ShieldCheck className="h-5 w-5" /> : st === "awaiting_counter" ? <Hourglass className="h-5 w-5" /> : <Stamp className="h-5 w-5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold text-ink">{a.propertyTitle}</span>
                      <span className="block truncate text-[11px] font-semibold text-ink-mute">
                        {a.id} · {formatINR(a.rent)}/mo · {formatINR(a.deposit)} deposit
                      </span>
                      <StatusChip tone={meta.tone} className="mt-1.5">{meta.label}</StatusChip>
                    </span>
                    <Eye className="h-4 w-4 shrink-0 text-ink-mute/50 transition-colors group-hover:text-forest-500" />
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>

      {/* modals */}
      <AgreementModal agreement={activeAgreement} onClose={() => setActiveAgreementId(null)} />
      <KycModal
        open={kycOpen}
        onClose={() => {
          setKycOpen(false);
          setPendingApplyId(null);
        }}
        onSuccess={() => {
          if (pendingApplyId) {
            doApply(pendingApplyId);
            setPendingApplyId(null);
          }
        }}
      />
    </div>
  );
}
