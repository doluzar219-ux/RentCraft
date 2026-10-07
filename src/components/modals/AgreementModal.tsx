import { useEffect, useMemo, useRef, useState } from "react";
import {
  FileSignature,
  ShieldCheck,
  PenLine,
  Download,
  Plus,
  Trash2,
  Save,
  Lock,
  UserRound,
  Building2,
  IndianRupee,
  CalendarDays,
  Stamp,
  Hourglass,
  BadgeCheck,
  FileText,
  Loader2,
  Scroll,
  Eye,
} from "lucide-react";
import html2pdf from "html2pdf.js";
import Modal from "../app/Modal";
import SignaturePad from "../app/SignaturePad";
import KycModal from "./KycModal";
import StampPaper from "./StampPaper";
import { inputCls, StatusChip } from "../app/ui";
import { useApp } from "../../store/AppContext";
import {
  STATUS_META,
  deriveStatus,
  formatDate,
  formatDateTime,
  formatINR,
} from "../../utils/agreement";
import { cn } from "../../utils/cn";
import type { Agreement, Role } from "../../types";

/* ── view modes inside the modal ───────────────────────────────── */
type PanelView = "editor" | "stamp" | "signing";

/* ── Signature result block (shown after signing) ───────────────── */
function SigBlock({
  label,
  name,
  signature,
  canSign,
  accent,
  onSign,
}: {
  label: string;
  name: string;
  signature: Agreement["tenantSignature"];
  canSign: boolean;
  accent: "terra" | "forest";
  onSign: () => void;
}) {
  const terra = accent === "terra";
  return (
    <div className="rounded-2xl border border-terracotta-100 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-mute">
          {label}
        </p>
        {signature && (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-forest-600">
            <BadgeCheck className="h-3.5 w-3.5" /> SIGNED
          </span>
        )}
      </div>
      <p className="mt-1 text-sm font-extrabold text-ink">{name}</p>
      <div className="mt-3">
        {signature ? (
          <div className="rounded-xl bg-linen/70 px-4 py-2.5">
            <img
              src={signature.dataUrl}
              alt={`${name} signature`}
              className="h-14 object-contain"
            />
            <p className="mt-1 border-t border-terracotta-100 pt-1.5 text-[10px] font-bold text-forest-600">
              Timestamped · {formatDateTime(signature.at)}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-terracotta-100 bg-linen/50 px-4 py-5 text-center">
            <p className="text-xs font-bold text-ink-mute">Awaiting signature</p>
            {canSign && (
              <button
                onClick={onSign}
                className={cn(
                  "mt-3 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:-translate-y-0.5 active:scale-95",
                  terra
                    ? "bg-terracotta-500 shadow-terracotta-500/30 hover:bg-terracotta-600"
                    : "bg-forest-500 shadow-forest-500/30 hover:bg-forest-600"
                )}
              >
                <PenLine className="h-3.5 w-3.5" /> Sign as {label.split(" ")[0]}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN MODAL COMPONENT
   ══════════════════════════════════════════════════════════════════ */
export default function AgreementModal({
  agreement,
  onClose,
}: {
  agreement: Agreement | null;
  onClose: () => void;
}) {
  const { role, kyc, updateAgreement, signAgreement, pushToast } = useApp();

  /* ── view state ── */
  const [panelView, setPanelView] = useState<PanelView>("editor");
  const [signing, setSigning] = useState<Role | null>(null);
  const [kycOpen, setKycOpen] = useState(false);
  const [pendingSign, setPendingSign] = useState<Role | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  /* ── local editable draft (landlord builder) ── */
  const [draftTenant, setDraftTenant] = useState("");
  const [draftRent, setDraftRent] = useState("");
  const [draftAddress, setDraftAddress] = useState("");
  const [draftStart, setDraftStart] = useState("");
  const [draftEnd, setDraftEnd] = useState("");
  const [clauses, setClauses] = useState<string[]>([]);
  const [newClause, setNewClause] = useState("");

  /* ref to the stamp paper DOM node for html2pdf */
  const stampRef = useRef<HTMLDivElement>(null);

  /* reset on new agreement */
  useEffect(() => {
    if (!agreement) {
      setSigning(null);
      setPanelView("editor");
      return;
    }
    setDraftTenant(agreement.tenantName);
    setDraftRent(String(agreement.rent));
    setDraftAddress(agreement.propertyAddress);
    setDraftStart(agreement.startDate);
    setDraftEnd(agreement.endDate);
    setClauses(agreement.clauses);
    setNewClause("");
    setSigning(null);
    setPanelView("editor");
  }, [agreement?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const status = useMemo(
    () => (agreement ? deriveStatus(agreement) : "draft"),
    [agreement]
  );
  const meta = STATUS_META[status];
  const editable =
    !!agreement &&
    role === "landlord" &&
    !agreement.landlordSignature &&
    !agreement.tenantSignature;

  const dirty = useMemo(() => {
    if (!agreement) return false;
    return (
      draftTenant !== agreement.tenantName ||
      draftRent !== String(agreement.rent) ||
      draftAddress !== agreement.propertyAddress ||
      draftStart !== agreement.startDate ||
      draftEnd !== agreement.endDate ||
      clauses.join("‖") !== agreement.clauses.join("‖")
    );
  }, [
    agreement,
    draftTenant,
    draftRent,
    draftAddress,
    draftStart,
    draftEnd,
    clauses,
  ]);

  /* ── save draft ── */
  const saveDraft = () => {
    if (!agreement) return;
    const rent = Number(draftRent);
    if (
      !draftTenant.trim() ||
      !draftAddress.trim() ||
      isNaN(rent) ||
      rent <= 0 ||
      !draftStart ||
      !draftEnd
    ) {
      pushToast(
        "Complete tenant name, address, rent and dates before saving",
        "terra"
      );
      return;
    }
    updateAgreement(agreement.id, {
      tenantName: draftTenant.trim(),
      rent,
      propertyAddress: draftAddress.trim(),
      startDate: draftStart,
      endDate: draftEnd,
      clauses: clauses.filter((c) => c.trim().length > 0),
    });
    pushToast("Agreement draft saved", "terra");
  };

  /* ── begin signing (with KYC gate) ── */
  const beginSign = (party: Role) => {
    if (!kyc) {
      setPendingSign(party);
      setKycOpen(true);
      return;
    }
    setSigning(party);
    setPanelView("signing");
  };

  const commitSignature = (dataUrl: string) => {
    if (!agreement || !signing) return;
    if (dirty && editable) saveDraft();
    signAgreement(agreement.id, signing, dataUrl);
    const wasOtherSigned =
      signing === "tenant"
        ? !!agreement.landlordSignature
        : !!agreement.tenantSignature;
    pushToast(
      wasOtherSigned
        ? "Both parties signed — lease is now E-Signed & legally valid!"
        : `Signature saved & timestamped as ${signing}`,
      "forest"
    );
    setSigning(null);
    setPanelView("editor");
  };

  /* ── PDF download via html2pdf.js ── */
  const handleDownloadPDF = async () => {
    /* Make sure stamp paper is rendered */
    if (panelView !== "stamp") {
      setPanelView("stamp");
      /* wait one frame for React to render the stamp paper DOM */
      await new Promise((r) => setTimeout(r, 160));
    }
    const el = stampRef.current;
    if (!el) {
      pushToast("Stamp paper not ready — please try again", "terra");
      return;
    }
    setPdfLoading(true);
    try {
      const filename = `RentCraft-StampPaper-${agreement!.id}.pdf`;
      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 3,                   /* hi-DPI for crisp text & borders */
            useCORS: true,
            backgroundColor: "#fcf8f2", /* preserve stamp-paper cream bg */
            logging: false,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 900,           /* consistent viewport width */
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            compress: true,
          },
          pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        })
        .from(el)
        .save();
      pushToast(`PDF exported → ${filename}`, "forest");
    } catch (err) {
      console.error(err);
      pushToast("PDF export failed — please try again", "terra");
    } finally {
      setPdfLoading(false);
    }
  };

  if (!agreement) return null;

  /* ── Tab bar shared between editor / stamp views ── */
  const TABS: { id: PanelView; icon: typeof Eye; label: string }[] = [
    { id: "editor", icon: FileText, label: "Edit / Sign" },
    { id: "stamp", icon: Scroll, label: "E-Stamp Paper" },
  ];

  return (
    <>
      <Modal
        open={!!agreement}
        onClose={onClose}
        size="lg"
        label={`Agreement ${agreement.id}`}
      >
        <div className="flex max-h-[90vh] flex-col overflow-hidden">
          {/* ── STICKY HEADER ── */}
          <div className="shrink-0 border-b border-terracotta-100 bg-cream/95 px-7 py-4 backdrop-blur sm:px-9">
            <div className="flex flex-wrap items-center gap-3 pr-10">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-terracotta-500 text-white shadow-md shadow-terracotta-500/30">
                <FileSignature className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-terracotta-500">
                  RentCraft · Digital Lease
                </p>
                <h3 className="truncate text-lg font-extrabold tracking-tight text-ink">
                  Residential Rental Agreement · {agreement.id}
                </h3>
              </div>
              <StatusChip tone={meta.tone}>
                {status === "completed" ? (
                  <ShieldCheck className="h-3 w-3" />
                ) : status === "awaiting_counter" ? (
                  <Hourglass className="h-3 w-3" />
                ) : (
                  <Stamp className="h-3 w-3" />
                )}
                {meta.label}
              </StatusChip>
            </div>

            {/* ── Tab switcher (only when not signing) ── */}
            {panelView !== "signing" && (
              <div className="mt-3.5 flex gap-1.5">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPanelView(t.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300",
                      panelView === t.id
                        ? "bg-terracotta-500 text-white shadow-md shadow-terracotta-500/30"
                        : "border border-terracotta-100 bg-white text-ink-soft hover:border-terracotta-300 hover:text-ink"
                    )}
                  >
                    <t.icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                ))}

                {/* Download PDF button — always visible */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  title="Download Official E-Stamp PDF"
                  className={cn(
                    "ml-auto inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold text-white shadow-md transition-all duration-300 active:scale-95 disabled:cursor-wait disabled:opacity-70",
                    "bg-gradient-to-r from-[#8B6914] to-[#c8a84b] shadow-[0_6px_18px_-6px_rgba(139,105,20,0.55)] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(139,105,20,0.7)]"
                  )}
                >
                  {pdfLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Download className="h-3.5 w-3.5" />
                      Download Official PDF
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ── SCROLLABLE BODY ── */}
          <div className="flex-1 overflow-y-auto">

            {/* ══════════════════════════════════════
                PANEL A — SIGNING STEP
                ══════════════════════════════════════ */}
            {panelView === "signing" && signing && (
              <div className="px-7 py-6 sm:px-9">
                <button
                  onClick={() => {
                    setSigning(null);
                    setPanelView("editor");
                  }}
                  className="mb-4 text-xs font-extrabold uppercase tracking-wider text-ink-mute transition-colors hover:text-terracotta-600"
                >
                  ← Back to document
                </button>
                <div className="rounded-2xl border border-terracotta-100 bg-white p-6 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl text-white",
                        signing === "tenant"
                          ? "bg-forest-500"
                          : "bg-terracotta-500"
                      )}
                    >
                      <PenLine className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <h4 className="text-base font-extrabold text-ink">
                        Sign as{" "}
                        {signing === "tenant"
                          ? agreement.tenantName
                          : agreement.landlordName}
                      </h4>
                      <p className="text-xs font-semibold text-ink-mute">
                        KYC-verified ·{" "}
                        <ShieldCheck className="inline h-3 w-3 text-forest-500" />{" "}
                        {kyc?.pan} · timestamped on save
                      </p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <SignaturePad
                      accent={signing === "tenant" ? "forest" : "terra"}
                      onSave={commitSignature}
                    />
                  </div>
                  <p className="mt-3 text-[11px] font-semibold leading-relaxed text-ink-mute">
                    By saving, you consent to execute this agreement
                    electronically. The signature, timestamp and KYC reference
                    are legally bound to agreement {agreement.id} under the
                    Information Technology Act, 2000.
                  </p>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                PANEL B — EDITOR / INTERACTIVE VIEW
                ══════════════════════════════════════ */}
            {panelView === "editor" && (
              <div className="px-7 py-6 sm:px-9">
                {/* parties */}
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-terracotta-100 bg-white p-4 shadow-soft">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-terracotta-50 text-terracotta-500">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-500">
                        Landlord
                      </p>
                      <p className="text-sm font-extrabold text-ink">
                        {agreement.landlordName}
                      </p>
                    </div>
                    <ShieldCheck className="ml-auto h-4.5 w-4.5 text-forest-500" />
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl border border-forest-100 bg-white p-4 shadow-soft">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-50 text-forest-500">
                      <UserRound className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-forest-500">
                        Tenant
                      </p>
                      {editable ? (
                        <input
                          className={cn(inputCls, "mt-1 py-2 text-xs")}
                          value={draftTenant}
                          onChange={(e) => setDraftTenant(e.target.value)}
                          placeholder="Tenant full name"
                        />
                      ) : (
                        <p className="truncate text-sm font-extrabold text-ink">
                          {agreement.tenantName}
                        </p>
                      )}
                    </div>
                    <ShieldCheck className="ml-auto h-4.5 w-4.5 shrink-0 text-forest-500" />
                  </div>
                </div>

                {/* premises & term */}
                <div className="mt-4 rounded-2xl border border-terracotta-100 bg-white p-5 shadow-soft">
                  <p className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-mute">
                    <Building2 className="h-3.5 w-3.5 text-terracotta-500" />{" "}
                    Premises & Term
                  </p>
                  {editable ? (
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <span className="mb-1 block text-[11px] font-bold text-ink-soft">
                          Property address
                        </span>
                        <input
                          className={inputCls}
                          value={draftAddress}
                          onChange={(e) => setDraftAddress(e.target.value)}
                        />
                      </div>
                      <div>
                        <span className="mb-1 block text-[11px] font-bold text-ink-soft">
                          Monthly rent (₹)
                        </span>
                        <input
                          className={inputCls}
                          inputMode="numeric"
                          value={draftRent}
                          onChange={(e) =>
                            setDraftRent(e.target.value.replace(/[^\d]/g, ""))
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <span className="mb-1 block text-[11px] font-bold text-ink-soft">
                            Start
                          </span>
                          <input
                            type="date"
                            className={inputCls}
                            value={draftStart}
                            onChange={(e) => setDraftStart(e.target.value)}
                          />
                        </div>
                        <div>
                          <span className="mb-1 block text-[11px] font-bold text-ink-soft">
                            End
                          </span>
                          <input
                            type="date"
                            className={inputCls}
                            value={draftEnd}
                            onChange={(e) => setDraftEnd(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <dl className="grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <Building2 className="h-4 w-4 shrink-0 text-ink-mute" />
                        <span className="font-extrabold text-ink">
                          {agreement.propertyTitle}
                        </span>
                        <span className="truncate font-medium text-ink-soft">
                          · {agreement.propertyAddress}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-ink-mute" />
                        <span className="font-semibold text-ink-soft">Rent</span>
                        <span className="font-extrabold text-ink">
                          {formatINR(agreement.rent)}/mo
                        </span>
                        <span className="font-semibold text-ink-soft">· Deposit</span>
                        <span className="font-extrabold text-ink">
                          {formatINR(agreement.deposit)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-ink-mute" />
                        <span className="font-semibold text-ink-soft">Term</span>
                        <span className="font-extrabold text-ink">
                          {formatDate(agreement.startDate)} →{" "}
                          {formatDate(agreement.endDate)}
                        </span>
                      </div>
                    </dl>
                  )}
                </div>

                {/* clauses */}
                <div className="mt-4 rounded-2xl border border-terracotta-100 bg-white p-5 shadow-soft">
                  <p className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-ink-mute">
                    <Lock className="h-3.5 w-3.5 text-forest-500" /> Terms &
                    Clauses
                    {editable && (
                      <span className="normal-case tracking-normal text-terracotta-500">
                        · editable while unsigned
                      </span>
                    )}
                  </p>
                  <ol className="space-y-2.5">
                    {clauses.map((c, i) => (
                      <li
                        key={i}
                        className="group flex items-start gap-3 text-[13px] font-medium leading-relaxed text-ink-soft"
                      >
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-linen text-[10px] font-black text-terracotta-600">
                          {i + 1}
                        </span>
                        <span className="flex-1">{c}</span>
                        {editable && (
                          <button
                            onClick={() =>
                              setClauses((l) => l.filter((_, j) => j !== i))
                            }
                            aria-label="Remove clause"
                            className="mt-0.5 shrink-0 rounded-lg p-1 text-ink-mute/50 opacity-0 transition-all hover:bg-terracotta-50 hover:text-terracotta-600 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ol>
                  {editable && (
                    <div className="mt-4 flex gap-2">
                      <input
                        className={cn(inputCls, "py-2.5 text-xs")}
                        placeholder="Add a custom clause, e.g. Pets allowed with prior written consent…"
                        value={newClause}
                        onChange={(e) => setNewClause(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newClause.trim()) {
                            e.preventDefault();
                            setClauses((l) => [...l, newClause.trim()]);
                            setNewClause("");
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newClause.trim()) return;
                          setClauses((l) => [...l, newClause.trim()]);
                          setNewClause("");
                        }}
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-terracotta-500 text-white shadow-md shadow-terracotta-500/30 transition-all hover:scale-105 active:scale-95"
                        aria-label="Add clause"
                      >
                        <Plus className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* signatures */}
                <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
                  <SigBlock
                    label="Landlord signature"
                    name={agreement.landlordName}
                    signature={agreement.landlordSignature}
                    canSign={role === "landlord" && !agreement.landlordSignature}
                    accent="terra"
                    onSign={() => beginSign("landlord")}
                  />
                  <SigBlock
                    label="Tenant signature"
                    name={agreement.tenantName}
                    signature={agreement.tenantSignature}
                    canSign={role === "tenant" && !agreement.tenantSignature}
                    accent="forest"
                    onSign={() => beginSign("tenant")}
                  />
                </div>

                {/* editor action bar */}
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  {editable && dirty && (
                    <button
                      onClick={saveDraft}
                      className="inline-flex items-center gap-1.5 rounded-full bg-terracotta-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-terracotta-500/30 transition-all hover:-translate-y-0.5 hover:bg-terracotta-600 active:scale-95"
                    >
                      <Save className="h-3.5 w-3.5" /> Save changes
                    </button>
                  )}
                  {/* Preview stamp paper */}
                  <button
                    onClick={() => setPanelView("stamp")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#c8a84b] bg-gradient-to-r from-[#8B6914]/10 to-[#c8a84b]/10 px-5 py-2.5 text-xs font-bold text-[#6b4c10] transition-all hover:-translate-y-0.5 hover:from-[#8B6914]/20 active:scale-95"
                  >
                    <Scroll className="h-3.5 w-3.5" /> Preview Stamp Paper
                  </button>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ink-mute">
                    <ShieldCheck className="h-3.5 w-3.5 text-forest-500" />
                    Generated {formatDateTime(agreement.createdAt)} · IDs bound
                    at signing
                  </p>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════
                PANEL C — E-STAMP PAPER PREVIEW
                ══════════════════════════════════════ */}
            {panelView === "stamp" && (
              <div className="px-4 py-6 sm:px-7">
                {/* info banner */}
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#c8a84b]/40 bg-[#fffbf0] px-5 py-3.5 shadow-soft">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#8B6914] to-[#c8a84b] text-white shadow-md">
                      <Scroll className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-[#3d2200]">
                        Official Non-Judicial E-Stamp Paper
                      </p>
                      <p className="text-[11px] font-semibold text-[#8a7060]">
                        ₹500 stamp duty · Agreement {agreement.id} · all
                        signatures and data are live
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPanelView("editor")}
                      className="rounded-full border border-terracotta-200 bg-white px-4 py-2 text-xs font-bold text-terracotta-600 transition-all hover:border-terracotta-400 active:scale-95"
                    >
                      ← Back to editor
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      disabled={pdfLoading}
                      className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8B6914] to-[#c8a84b] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#8B6914]/40 transition-all hover:-translate-y-0.5 active:scale-95 disabled:cursor-wait disabled:opacity-70"
                    >
                      {pdfLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Generating PDF…
                        </>
                      ) : (
                        <>
                          <Download className="h-3.5 w-3.5" />
                          Download Official PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* The stamp paper itself */}
                <div
                  className="overflow-hidden rounded-xl shadow-[0_8px_40px_-12px_rgba(139,105,20,0.4)]"
                  style={{ background: "#fcf8f2" }}
                >
                  <StampPaper ref={stampRef} agreement={agreement} />
                </div>

                {/* Bottom download CTA — large & prominent */}
                <div className="mt-6 flex flex-col items-center gap-2">
                  <button
                    onClick={handleDownloadPDF}
                    disabled={pdfLoading}
                    className="group flex w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#8B6914] to-[#c8a84b] py-4 text-sm font-extrabold text-white shadow-[0_12px_32px_-10px_rgba(139,105,20,0.65)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_-12px_rgba(139,105,20,0.75)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                  >
                    {pdfLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating high-resolution PDF…
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
                        Download Official PDF — A4, High Resolution
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] font-semibold text-ink-mute">
                    Includes all signatures · stamp duty receipt · KYC
                    verification reference · legal disclaimer
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* KYC gate for signing */}
      <KycModal
        open={kycOpen}
        onClose={() => {
          setKycOpen(false);
          setPendingSign(null);
        }}
        onSuccess={() => {
          if (pendingSign) {
            setSigning(pendingSign);
            setPanelView("signing");
          }
          setPendingSign(null);
        }}
      />
    </>
  );
}
