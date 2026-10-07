import { useState } from "react";
import {
  Building2,
  Inbox,
  FileText,
  BadgeIndianRupee,
  Plus,
  ShieldCheck,
  Trash2,
  Eye,
  Hourglass,
  Stamp,
  Landmark,
} from "lucide-react";
import PropertyCard from "./PropertyCard";
import PropertyFormModal from "../modals/PropertyFormModal";
import AgreementModal from "../modals/AgreementModal";
import KycModal from "../modals/KycModal";
import { DashStat, EmptyState, KycBanner, SectionTitle, StatusChip } from "./ui";
import { Reveal } from "../primitives";
import { useApp } from "../../store/AppContext";
import { STATUS_META, deriveStatus, formatINR } from "../../utils/agreement";

export default function LandlordDashboard() {
  const {
    session,
    kyc,
    properties,
    applications,
    agreements,
    declineApplication,
    pushToast,
  } = useApp();

  const [formOpen, setFormOpen] = useState(false);
  const [kycOpen, setKycOpen] = useState(false);
  const [activeAgreementId, setActiveAgreementId] = useState<string | null>(null);

  const firstName = session?.name.split(" ")[0] ?? "Host";
  const pending = applications.filter((a) => a.status === "sent");
  const activeAgreement = agreements.find((a) => a.id === activeAgreementId) ?? null;
  const monthlyPipeline = properties
    .filter((p) => p.status !== "rented")
    .reduce((s, p) => s + p.rent, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

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
              <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-terracotta-600">
                <Landmark className="h-3 w-3" /> Landlord console
              </span>
              {kyc ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-forest-600">
                  <ShieldCheck className="h-3 w-3" /> KYC verified · {kyc.trustScore}/100
                </span>
              ) : (
                "Verify your identity to unlock countersigning."
              )}
            </p>
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-terracotta-500/40 transition-all hover:-translate-y-0.5 hover:bg-terracotta-600 active:scale-95"
          >
            <Plus className="h-4.5 w-4.5 transition-transform group-hover:rotate-90" />
            New listing
          </button>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-6">
          <KycBanner role="landlord" verified={!!kyc} onVerify={() => setKycOpen(true)} />
        </div>
      </Reveal>

      {/* stats */}
      <Reveal delay={140}>
        <div className="mt-7 grid grid-cols-2 gap-3.5 xl:grid-cols-4">
          <DashStat icon={Building2} label="Live listings" value={String(properties.length)} delta="across your portfolio" role="landlord" />
          <DashStat icon={Inbox} label="Requests awaiting" value={String(pending.length)} delta="pre-verified tenants" role="landlord" />
          <DashStat icon={FileText} label="Agreements in play" value={String(agreements.length)} delta={`${agreements.filter((a) => deriveStatus(a) === "completed").length} fully executed`} role="landlord" />
          <DashStat icon={BadgeIndianRupee} label="Rent pipeline" value={formatINR(monthlyPipeline)} delta="per month potential" role="landlord" />
        </div>
      </Reveal>

      <div className="mt-9 grid gap-8 lg:grid-cols-[1.65fr_1fr]">
        {/* listings */}
        <div>
          <Reveal delay={180}>
            <SectionTitle
              title="Your listings"
              sub="Everything you publish appears here instantly"
              right={
                <button
                  onClick={() => setFormOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-terracotta-200 bg-white px-4 py-2 text-xs font-bold text-terracotta-600 transition-all hover:border-terracotta-500 hover:bg-terracotta-50 active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" /> Add property
                </button>
              }
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {properties.map((p, i) => (
              <Reveal key={p.id} delay={i * 70} variant="zoom">
                <PropertyCard
                  property={p}
                  index={i}
                  footer={
                    <div className="flex gap-2">
                      <StatusChip tone={p.status === "rented" ? "terra" : p.status === "requested" ? "amber" : "green"} className="flex-1 justify-center normal-case! tracking-normal!">
                        {p.status === "rented" ? "Rent receipts auto-logging" : p.status === "requested" ? "Review requests to proceed" : "Accepting verified requests"}
                      </StatusChip>
                    </div>
                  }
                />
              </Reveal>
            ))}
            <Reveal delay={properties.length * 70} variant="zoom">
              <button
                onClick={() => setFormOpen(true)}
                className="group flex h-full min-h-[260px] w-full flex-col items-center justify-center gap-3.5 rounded-2xl border-2 border-dashed border-terracotta-200 bg-terracotta-50/40 p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-terracotta-400 hover:bg-terracotta-50"
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-terracotta-500 shadow-soft transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110">
                  <Plus className="h-6 w-6" />
                </span>
                <p className="text-sm font-extrabold text-ink">List another property</p>
                <p className="max-w-[210px] text-xs font-medium text-ink-mute">
                  Title, rent, location, deposit — live in under a minute
                </p>
              </button>
            </Reveal>
          </div>
        </div>

        {/* requests + agreements */}
        <div className="space-y-8">
          <Reveal delay={220} variant="right">
            <div>
              <SectionTitle title="Verified requests" sub={`${pending.length} awaiting your review`} />
              <div className="space-y-3">
                {pending.length === 0 && (
                  <EmptyState icon={Inbox} title="Inbox zero — nicely done" copy="New tenant requests land here the moment they apply." />
                )}
                {pending.map((app) => (
                  <div key={app.id} className="card group p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-100 text-xs font-black text-forest-700">
                        {app.tenantName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-extrabold text-ink">{app.tenantName}</p>
                        <p className="truncate text-[11px] font-semibold text-ink-mute">{app.propertyTitle}</p>
                      </div>
                      <StatusChip tone="green">
                        <ShieldCheck className="h-3 w-3" /> {app.trustScore}
                      </StatusChip>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setActiveAgreementId(app.agreementId)}
                        className="flex-1 rounded-full bg-terracotta-500 py-2.5 text-xs font-bold text-white shadow-md shadow-terracotta-500/25 transition-all hover:bg-terracotta-600 active:scale-95"
                      >
                        Review draft
                      </button>
                      <button
                        onClick={() => {
                          declineApplication(app.id);
                          pushToast(`Request from ${app.tenantName} passed`, "ink");
                        }}
                        aria-label={`Decline ${app.tenantName}`}
                        className="grid h-9 w-9 place-items-center rounded-full border border-terracotta-100 bg-white text-ink-mute transition-all hover:border-terracotta-300 hover:text-terracotta-600 active:scale-90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={280} variant="right">
            <div>
              <SectionTitle title="Agreements" sub="Tap to open the live document" />
              <div className="space-y-3">
                {agreements.length === 0 && (
                  <EmptyState icon={FileText} title="No agreements yet" copy="Approve a tenant request and RentCraft drafts the lease for you." />
                )}
                {agreements.map((a) => {
                  const st = deriveStatus(a);
                  const meta = STATUS_META[st];
                  return (
                    <button
                      key={a.id}
                      onClick={() => setActiveAgreementId(a.id)}
                      className="card group flex w-full items-center gap-3.5 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-terracotta-200 hover:shadow-lift"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-terracotta-50 text-terracotta-500 transition-transform group-hover:scale-110">
                        {st === "completed" ? <ShieldCheck className="h-5 w-5" /> : st === "awaiting_counter" ? <Hourglass className="h-5 w-5" /> : <Stamp className="h-5 w-5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold text-ink">{a.propertyTitle}</span>
                        <span className="block truncate text-[11px] font-semibold text-ink-mute">
                          {a.id} · {a.tenantName} · {formatINR(a.rent)}/mo
                        </span>
                        <StatusChip tone={meta.tone} className="mt-1.5">
                          {meta.label}
                        </StatusChip>
                      </span>
                      <Eye className="h-4 w-4 shrink-0 text-ink-mute/50 transition-colors group-hover:text-terracotta-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* modals */}
      <PropertyFormModal open={formOpen} onClose={() => setFormOpen(false)} />
      <AgreementModal agreement={activeAgreement} onClose={() => setActiveAgreementId(null)} />
      <KycModal open={kycOpen} onClose={() => setKycOpen(false)} />
    </div>
  );
}
