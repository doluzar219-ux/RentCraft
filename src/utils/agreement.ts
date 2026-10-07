import type { Agreement } from "../types";

export function uid(prefix = ""): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}${rand}`;
}

export function formatINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ── agreement status derivation ───────────────────────────────── */
export type DerivedStatus = "draft" | "awaiting_counter" | "completed";

export function deriveStatus(a: Agreement): DerivedStatus {
  const t = !!a.tenantSignature;
  const l = !!a.landlordSignature;
  if (t && l) return "completed";
  if (t || l) return "awaiting_counter";
  return "draft";
}

export const STATUS_META: Record<
  DerivedStatus,
  { label: string; tone: "gray" | "amber" | "green" }
> = {
  draft: { label: "Draft", tone: "gray" },
  awaiting_counter: { label: "Awaiting counter-signature", tone: "amber" },
  completed: { label: "E-Signed & Legally Valid", tone: "green" },
};

export function agreementId(): string {
  return `RC-${Math.floor(2000 + Math.random() * 7999)}`;
}

export function defaultDates(): { startDate: string; endDate: string } {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  const end = new Date(start);
  end.setMonth(end.getMonth() + 11);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { startDate: iso(start), endDate: iso(end) };
}

export function defaultClauses(rent: number, deposit: number): string[] {
  return [
    `The tenant shall pay a monthly rent of ${formatINR(rent)} on or before the 5th day of each calendar month, via the RentCraft payment rail.`,
    `A refundable security deposit of ${formatINR(deposit)} shall be held in escrow and returned within 30 days of move-out, less any dues or damages beyond normal wear and tear.`,
    "The lock-in period is 6 (six) months, after which either party may terminate this agreement with 30 (thirty) days' prior written notice.",
    "The tenant shall not sublet, assign or part with possession of the premises without the prior written consent of the landlord.",
    "Both parties affirm that the identities attached to this agreement have been verified via RentCraft Smart KYC (mock Aadhaar & PAN check).",
  ];
}

/* ── printable export (no dependencies — plain, clean HTML file) ── */
export function downloadAgreement(a: Agreement): void {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sig = (s: Agreement["tenantSignature"]) =>
    s
      ? `<img src="${s.dataUrl}" style="height:56px;border-bottom:1.5px solid #1A202C;padding:4px 12px" alt="signature"/><p style="font-size:11px;color:#718096;margin:6px 0 0">Signed digitally · ${formatDateTime(s.at)}</p>`
      : `<p style="font-size:12px;color:#A0AEC0;border-bottom:1.5px dashed #CBD5E0;padding:24px 12px 6px">Awaiting signature</p>`;
  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>RentCraft Agreement ${a.id}</title></head>
<body style="font-family:'Segoe UI',Arial,sans-serif;max-width:760px;margin:40px auto;padding:40px;border:1.5px solid #EFE7D6;border-radius:16px;color:#1A202C">
  <p style="letter-spacing:3px;font-size:11px;color:#DD6B20;font-weight:700;margin:0">RENTCRAFT · DIGITAL RENTAL AGREEMENT</p>
  <h1 style="margin:8px 0 2px;font-size:26px">Residential Lease Agreement</h1>
  <p style="color:#718096;font-size:13px;margin:0 0 28px">Agreement No. <b>${a.id}</b> · Generated ${formatDateTime(a.createdAt)}</p>
  <h3 style="font-size:13px;letter-spacing:2px;color:#2C5E4B;margin:24px 0 8px">PARTIES</h3>
  <p style="font-size:14px;line-height:1.7;margin:0">This agreement is entered into between <b>${esc(a.landlordName)}</b> (the "Landlord") and <b>${esc(a.tenantName)}</b> (the "Tenant") for the premises described below.</p>
  <h3 style="font-size:13px;letter-spacing:2px;color:#2C5E4B;margin:24px 0 8px">PREMISES & TERM</h3>
  <table style="font-size:14px;border-collapse:collapse;width:100%">
    <tr><td style="padding:8px 12px;border:1px solid #EFE7D6;color:#718096;width:38%">Property</td><td style="padding:8px 12px;border:1px solid #EFE7D6"><b>${esc(a.propertyTitle)}</b></td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #EFE7D6;color:#718096">Address</td><td style="padding:8px 12px;border:1px solid #EFE7D6">${esc(a.propertyAddress)}</td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #EFE7D6;color:#718096">Monthly rent</td><td style="padding:8px 12px;border:1px solid #EFE7D6"><b>${formatINR(a.rent)}</b></td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #EFE7D6;color:#718096">Security deposit</td><td style="padding:8px 12px;border:1px solid #EFE7D6"><b>${formatINR(a.deposit)}</b></td></tr>
    <tr><td style="padding:8px 12px;border:1px solid #EFE7D6;color:#718096">Lease term</td><td style="padding:8px 12px;border:1px solid #EFE7D6">${formatDate(a.startDate)} → ${formatDate(a.endDate)}</td></tr>
  </table>
  <h3 style="font-size:13px;letter-spacing:2px;color:#2C5E4B;margin:24px 0 8px">TERMS & CLAUSES</h3>
  <ol style="font-size:13.5px;line-height:1.8;margin:0;padding-left:20px">${a.clauses.map((c) => `<li>${esc(c)}</li>`).join("")}</ol>
  <h3 style="font-size:13px;letter-spacing:2px;color:#2C5E4B;margin:28px 0 8px">EXECUTION</h3>
  <table style="width:100%;margin-top:8px"><tr>
    <td style="width:50%;vertical-align:bottom;padding-right:18px">${sig(a.landlordSignature)}<p style="font-size:13px;margin:4px 0 0"><b>${esc(a.landlordName)}</b> · Landlord</p></td>
    <td style="width:50%;vertical-align:bottom;padding-left:18px">${sig(a.tenantSignature)}<p style="font-size:13px;margin:4px 0 0"><b>${esc(a.tenantName)}</b> · Tenant</p></td>
  </tr></table>
  <p style="margin-top:32px;font-size:11px;color:#A0AEC0;border-top:1px solid #EFE7D6;padding-top:14px">Digitally executed on RentCraft — identities verified via mock Aadhaar & PAN smart-KYC. This prototype document is for demonstration purposes.</p>
</body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `RentCraft-Agreement-${a.id}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
