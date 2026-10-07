/**
 * StampPaper.tsx
 * Renders an official-looking Indian Non-Judicial E-Stamp Paper layout.
 * Designed to be screenshot-able by html2pdf.js — all styling is
 * inline or via a scoped <style> tag so it survives canvas capture.
 *
 * This component is DISPLAY ONLY. Edit controls live in AgreementModal.
 */
import { forwardRef } from "react";
import type { Agreement } from "../../types";
import { formatDate, formatDateTime, formatINR } from "../../utils/agreement";

/* ── tiny helpers ───────────────────────────────────────────────── */
const ROW_STYLE: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "38% 62%",
  borderBottom: "1px solid #d4c5a9",
};
const CELL_KEY: React.CSSProperties = {
  padding: "7px 12px",
  fontSize: 12,
  color: "#6b5b3e",
  fontWeight: 600,
  borderRight: "1px solid #d4c5a9",
  backgroundColor: "#f5ede0",
};
const CELL_VAL: React.CSSProperties = {
  padding: "7px 12px",
  fontSize: 12,
  color: "#2c1a06",
  fontWeight: 700,
};

/* ── Ashoka Pillar SVG watermark (pure geometry, no images) ─────── */
function AshokaWatermark() {
  return (
    <svg
      viewBox="0 0 200 260"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 220,
        height: 286,
        opacity: 0.045,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {/* Lion capital top */}
      <ellipse cx="100" cy="28" rx="48" ry="12" fill="#8B6914" />
      <ellipse cx="100" cy="22" rx="36" ry="10" fill="#8B6914" />
      {/* Lion bodies */}
      <ellipse cx="72" cy="20" rx="18" ry="10" fill="#8B6914" transform="rotate(-12 72 20)" />
      <ellipse cx="128" cy="20" rx="18" ry="10" fill="#8B6914" transform="rotate(12 128 20)" />
      {/* Abacus drum */}
      <rect x="62" y="36" width="76" height="22" rx="4" fill="#8B6914" />
      {/* Ashoka Chakra on drum */}
      <circle cx="100" cy="47" r="9" fill="none" stroke="#8B6914" strokeWidth="2.5" />
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map((i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={100 + Math.cos(a) * 4}
            y1={47 + Math.sin(a) * 4}
            x2={100 + Math.cos(a) * 9}
            y2={47 + Math.sin(a) * 9}
            stroke="#8B6914"
            strokeWidth="1.2"
          />
        );
      })}
      {/* Pillar shaft */}
      <rect x="88" y="58" width="24" height="140" rx="4" fill="#8B6914" />
      {/* Fluting lines on pillar */}
      {[93, 97, 103, 107].map((x) => (
        <line key={x} x1={x} y1={60} x2={x} y2={196} stroke="#fcf8f2" strokeWidth="1.2" opacity="0.6" />
      ))}
      {/* Bell capital at bottom of shaft */}
      <ellipse cx="100" cy="200" rx="28" ry="10" fill="#8B6914" />
      <ellipse cx="100" cy="208" rx="34" ry="10" fill="#8B6914" />
      {/* Base */}
      <rect x="60" y="216" width="80" height="12" rx="3" fill="#8B6914" />
      <rect x="48" y="228" width="104" height="10" rx="3" fill="#8B6914" />
      <rect x="36" y="238" width="128" height="14" rx="3" fill="#8B6914" />
    </svg>
  );
}

/* ── Signature box ──────────────────────────────────────────────── */
function SigBox({
  label,
  name,
  role,
  signature,
  accentColor,
}: {
  label: string;
  name: string;
  role: string;
  signature: Agreement["tenantSignature"];
  accentColor: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        border: `1.5px solid ${accentColor}40`,
        borderRadius: 8,
        padding: "14px 16px",
        backgroundColor: `${accentColor}08`,
        minHeight: 120,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <p
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: accentColor,
          margin: 0,
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: 12, fontWeight: 700, color: "#1a0f00", margin: 0 }}>{name}</p>
      <p style={{ fontSize: 10, color: "#6b5b3e", margin: 0 }}>{role}</p>
      {signature ? (
        <div
          style={{
            marginTop: 4,
            borderTop: `1.5px solid ${accentColor}40`,
            paddingTop: 8,
          }}
        >
          <img
            src={signature.dataUrl}
            alt={`${name} e-signature`}
            style={{ height: 56, objectFit: "contain", display: "block" }}
          />
          <p
            style={{
              fontSize: 9,
              color: "#2C5E4B",
              fontWeight: 700,
              marginTop: 6,
            }}
          >
            ✓ Digitally signed · {formatDateTime(signature.at)}
          </p>
          <p style={{ fontSize: 8.5, color: "#6b5b3e", marginTop: 2 }}>
            KYC-verified identity · tamper-evident timestamp
          </p>
        </div>
      ) : (
        <div
          style={{
            marginTop: "auto",
            borderTop: `1.5px dashed ${accentColor}50`,
            paddingTop: 10,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 10, color: "#a08060", margin: 0 }}>
            Awaiting e-signature
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Corner ornament (SVG) ──────────────────────────────────────── */
function CornerOrnament({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="54"
      height="54"
      viewBox="0 0 54 54"
      style={{
        transform: flip ? "scale(-1,-1)" : "none",
        display: "block",
        opacity: 0.65,
      }}
      aria-hidden
    >
      <path
        d="M2 2 L20 2 Q28 2 28 10 L28 28"
        fill="none"
        stroke="#8B6914"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M2 2 L2 20 Q2 28 10 28 L28 28"
        fill="none"
        stroke="#8B6914"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <circle cx="6" cy="6" r="3" fill="#8B6914" />
      <path
        d="M14 14 L20 8 M14 14 L8 20 M14 14 L20 20 M14 14 L8 8"
        fill="none"
        stroke="#c8a84b"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ── Stamp box (top-right) ──────────────────────────────────────── */
function EStampBox({ agreementId }: { agreementId: string }) {
  const ref = `ESTAMP-MH-${agreementId}-${new Date().getFullYear()}`;
  const dt = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <div
      style={{
        border: "2.5px solid #8B6914",
        borderRadius: 6,
        padding: "10px 14px",
        minWidth: 178,
        backgroundColor: "#fffbf0",
        boxShadow: "inset 0 0 0 4px #fcf8f2, inset 0 0 0 5px #d4c5a9",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* diagonal stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background:
            "repeating-linear-gradient(90deg,#8B6914 0px,#8B6914 8px,#c8a84b 8px,#c8a84b 16px)",
        }}
      />
      <p
        style={{
          fontSize: 8,
          fontWeight: 800,
          letterSpacing: "0.22em",
          color: "#5a3e10",
          textTransform: "uppercase",
          marginTop: 8,
          marginBottom: 1,
        }}
      >
        Government of India
      </p>
      <p
        style={{
          fontSize: 7.5,
          color: "#7a5a20",
          fontWeight: 600,
          marginBottom: 4,
        }}
      >
        Non-Judicial E-Stamp Paper
      </p>
      <div
        style={{
          background: "linear-gradient(135deg,#8B6914,#c8a84b)",
          color: "#fff",
          borderRadius: 4,
          padding: "5px 10px",
          fontWeight: 900,
          fontSize: 18,
          letterSpacing: "0.04em",
          marginBottom: 5,
        }}
      >
        ₹ 500
      </div>
      <p style={{ fontSize: 7.5, color: "#6b5b3e", marginBottom: 1 }}>
        Certificate No.
      </p>
      <p
        style={{
          fontSize: 8.5,
          fontWeight: 800,
          color: "#2c1a06",
          letterSpacing: "0.05em",
          wordBreak: "break-all",
          marginBottom: 3,
        }}
      >
        {ref}
      </p>
      <p style={{ fontSize: 7, color: "#8a7060", marginBottom: 0 }}>
        Issued: {dt}
      </p>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 5,
          background:
            "repeating-linear-gradient(90deg,#8B6914 0px,#8B6914 8px,#c8a84b 8px,#c8a84b 16px)",
        }}
      />
    </div>
  );
}

/* ── Divider ────────────────────────────────────────────────────── */
function Divider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "18px 0 12px",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "#d4c5a9" }} />
      <span
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#8B6914",
          whiteSpace: "nowrap",
        }}
      >
        ❖ {label} ❖
      </span>
      <div style={{ flex: 1, height: 1, background: "#d4c5a9" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MAIN EXPORT — the stamp paper container
   ══════════════════════════════════════════════════════════════════ */
const StampPaper = forwardRef<HTMLDivElement, { agreement: Agreement }>(
  ({ agreement }, ref) => {
    const qrValue = `RC-VERIFY:${agreement.id}:${agreement.landlordName}:${agreement.tenantName}`;
    /* simple QR-like placeholder made from SVG squares */
    const qrBlocks = Array.from({ length: 49 }, (_, i) =>
      (i * 7 + i) % 3 === 0
    );

    return (
      <div
        ref={ref}
        id="stamp-paper-container"
        style={{
          /* A4-ish dimensions for PDF */
          width: "100%",
          maxWidth: 794,
          margin: "0 auto",
          backgroundColor: "#fcf8f2",
          backgroundImage: `
            radial-gradient(ellipse at 20% 20%, rgba(196,168,75,0.07) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 80%, rgba(139,105,20,0.06) 0%, transparent 55%),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 28px,
              rgba(139,105,20,0.03) 28px,
              rgba(139,105,20,0.03) 29px
            )
          `,
          /* outer + inner double border */
          border: "3px solid #8B6914",
          boxShadow: "inset 0 0 0 6px #fcf8f2, inset 0 0 0 9px #c8a84b, inset 0 0 0 12px #fcf8f2, inset 0 0 0 14px #d4c5a966",
          padding: "28px 32px 32px",
          fontFamily:
            '"Times New Roman", "Georgia", "Palatino Linotype", serif',
          color: "#2c1a06",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* ── WATERMARK ── */}
        <AshokaWatermark />

        {/* ── CORNER ORNAMENTS ── */}
        <div style={{ position: "absolute", top: 18, left: 18 }}>
          <CornerOrnament />
        </div>
        <div style={{ position: "absolute", top: 18, right: 18 }}>
          <CornerOrnament flip />
        </div>
        <div style={{ position: "absolute", bottom: 18, left: 18, transform: "scale(-1,1)" }}>
          <CornerOrnament />
        </div>
        <div style={{ position: "absolute", bottom: 18, right: 18, transform: "scale(1,-1)" }}>
          <CornerOrnament flip />
        </div>

        {/* ════════════════════════════════════
            ROW 1 — HEADER
            ════════════════════════════════════ */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 6 }}>
          {/* Left: Ashoka pillar icon (simplified) */}
          <svg
            viewBox="0 0 48 64"
            style={{ width: 42, height: 56, flexShrink: 0, marginTop: 4 }}
            aria-hidden
          >
            <rect x="18" y="30" width="12" height="28" rx="2" fill="#8B6914" />
            <rect x="12" y="56" width="24" height="5" rx="1.5" fill="#8B6914" />
            <ellipse cx="24" cy="30" rx="14" ry="5" fill="#8B6914" />
            <ellipse cx="24" cy="25" rx="10" ry="5" fill="#8B6914" />
            <circle cx="24" cy="18" r="7" fill="none" stroke="#8B6914" strokeWidth="2" />
            {[0,1,2,3,4,5,6,7].map((i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <line key={i} x1={24 + Math.cos(a)*3} y1={18 + Math.sin(a)*3} x2={24 + Math.cos(a)*7} y2={18 + Math.sin(a)*7} stroke="#8B6914" strokeWidth="1" />
              );
            })}
            <ellipse cx="24" cy="13" rx="8" ry="5" fill="#8B6914" />
          </svg>

          {/* Center: Title block */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#5a3e10", margin: 0 }}>
              Government of India — Ministry of Finance
            </p>
            <p style={{ fontSize: 22, fontWeight: 900, letterSpacing: "0.06em", color: "#3d2200", margin: "4px 0 2px", textTransform: "uppercase", lineHeight: 1.1 }}>
              Non-Judicial E-Stamp Paper
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 4 }}>
              <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg,transparent,#8B6914,transparent)" }} />
              <p style={{ fontSize: 11, fontWeight: 700, color: "#8B6914", margin: 0, whiteSpace: "nowrap" }}>
                STOCK HOLDING CORPORATION OF INDIA LTD.
              </p>
              <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg,transparent,#8B6914,transparent)" }} />
            </div>
            <p style={{ fontSize: 9, color: "#7a5a20", margin: "4px 0 0", letterSpacing: "0.1em" }}>
              CIN: U74140MH1986PLC040679 · Authorised e-Stamping Vendor
            </p>
          </div>

          {/* Right: E-Stamp box */}
          <EStampBox agreementId={agreement.id} />
        </div>

        {/* Thick divider */}
        <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#8B6914 20%,#c8a84b 50%,#8B6914 80%,transparent)", margin: "10px 0 14px" }} />

        {/* ════════════════════════════════════
            ROW 2 — DOCUMENT TITLE
            ════════════════════════════════════ */}
        <div style={{ textAlign: "center", marginBottom: 4 }}>
          <p style={{ fontSize: 16, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2c1a06", margin: 0 }}>
            Residential Rental / Lease Agreement
          </p>
          <p style={{ fontSize: 10.5, color: "#6b5b3e", margin: "4px 0 0" }}>
            Agreement No.&nbsp;
            <strong style={{ color: "#3d2200", letterSpacing: "0.06em" }}>{agreement.id}</strong>
            &ensp;·&ensp;Generated on {formatDateTime(agreement.createdAt)}
            &ensp;·&ensp;Stamp Duty Paid ₹ 500
          </p>
        </div>

        <Divider label="Parties to this Agreement" />

        {/* ════════════════════════════════════
            ROW 3 — PARTIES DESCRIPTION
            ════════════════════════════════════ */}
        <p style={{ fontSize: 12.5, lineHeight: 1.8, margin: "0 0 4px", textAlign: "justify" }}>
          This Rental / Leave and Licence Agreement ("<strong>Agreement</strong>") is executed on this
          &nbsp;<strong>{formatDate(new Date().toISOString())}</strong> between:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "10px 0" }}>
          {/* Landlord */}
          <div style={{ border: "1.5px solid #d4a84b", borderRadius: 6, padding: "12px 14px", backgroundColor: "#fffbf0" }}>
            <p style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c4561a", margin: "0 0 4px" }}>FIRST PARTY — LANDLORD / LICENSOR</p>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#1a0f00", margin: "0 0 3px" }}>{agreement.landlordName}</p>
            <p style={{ fontSize: 10.5, color: "#6b5b3e", margin: 0 }}>Owner of the scheduled premises, hereinafter referred to as the "Landlord".</p>
          </div>
          {/* Tenant */}
          <div style={{ border: "1.5px solid #5a9e7c", borderRadius: 6, padding: "12px 14px", backgroundColor: "#f4fbf7" }}>
            <p style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#2C5E4B", margin: "0 0 4px" }}>SECOND PARTY — TENANT / LICENSEE</p>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#1a0f00", margin: "0 0 3px" }}>{agreement.tenantName}</p>
            <p style={{ fontSize: 10.5, color: "#6b5b3e", margin: 0 }}>Occupant of the scheduled premises, hereinafter referred to as the "Tenant".</p>
          </div>
        </div>

        <p style={{ fontSize: 11.5, lineHeight: 1.75, textAlign: "justify", margin: "4px 0" }}>
          Both parties agree to the following terms and conditions in respect of the property located at&nbsp;
          <strong>{agreement.propertyAddress}</strong>.
        </p>

        <Divider label="Schedule of Property & Financial Terms" />

        {/* ════════════════════════════════════
            ROW 4 — PROPERTY TABLE
            ════════════════════════════════════ */}
        <div style={{ border: "1.5px solid #d4c5a9", borderRadius: 6, overflow: "hidden", marginBottom: 4 }}>
          {[
            ["Property Name / Description", agreement.propertyTitle],
            ["Complete Postal Address", agreement.propertyAddress],
            ["Type of Premises", "Residential — Leave & Licence"],
            ["Monthly Licence Fee (Rent)", formatINR(agreement.rent)],
            ["Refundable Security Deposit", formatINR(agreement.deposit)],
            ["Commencement Date", formatDate(agreement.startDate)],
            ["Expiry Date", formatDate(agreement.endDate)],
            ["Duration of Agreement", "Eleven (11) calendar months"],
            ["Lock-in Period", "Six (6) months from commencement"],
          ].map(([k, v], i) => (
            <div key={i} style={{ ...ROW_STYLE, borderBottom: i === 8 ? "none" : "1px solid #d4c5a9" }}>
              <div style={CELL_KEY}>{k}</div>
              <div style={{ ...CELL_VAL, backgroundColor: i % 2 === 0 ? "#fffcf8" : "#fdf8ef" }}>{v}</div>
            </div>
          ))}
        </div>

        <Divider label="Terms, Conditions & Covenants" />

        {/* ════════════════════════════════════
            ROW 5 — DYNAMIC CLAUSES
            ════════════════════════════════════ */}
        <ol
          style={{
            margin: "0 0 6px",
            paddingLeft: 22,
            fontSize: 11.5,
            lineHeight: 1.85,
            color: "#2c1a06",
            textAlign: "justify",
          }}
        >
          {agreement.clauses.map((clause, i) => (
            <li key={i} style={{ marginBottom: 7, paddingLeft: 4 }}>
              {clause}
            </li>
          ))}
          {/* Fixed legal boilerplate always appended */}
          <li style={{ marginBottom: 7, paddingLeft: 4 }}>
            The Landlord shall be responsible for all major structural repairs. The Tenant shall maintain the premises in good and tenantable condition and shall not cause any structural alterations without prior written consent.
          </li>
          <li style={{ marginBottom: 7, paddingLeft: 4 }}>
            This Agreement shall be governed by and construed in accordance with the laws of India. Any dispute arising hereunder shall be subject to the exclusive jurisdiction of the Courts at the location of the scheduled premises.
          </li>
          <li style={{ marginBottom: 0, paddingLeft: 4 }}>
            This Agreement has been electronically executed on the RentCraft platform. Both parties' identities have been digitally verified via mock Aadhaar &amp; PAN Smart-KYC. Each electronic signature bears a legally-admissible timestamp and is binding under the Information Technology Act, 2000.
          </li>
        </ol>

        <Divider label="Digital Execution & E-Signatures" />

        {/* ════════════════════════════════════
            ROW 6 — SIGNATURE ZONE
            ════════════════════════════════════ */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <SigBox
            label="Landlord / First Party"
            name={agreement.landlordName}
            role="Owner — signing as Licensor"
            signature={agreement.landlordSignature}
            accentColor="#DD6B20"
          />
          <SigBox
            label="Tenant / Second Party"
            name={agreement.tenantName}
            role="Occupant — signing as Licensee"
            signature={agreement.tenantSignature}
            accentColor="#2C5E4B"
          />
        </div>

        {/* ════════════════════════════════════
            ROW 7 — QR + FOOTER BAND
            ════════════════════════════════════ */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 18,
            borderTop: "1.5px solid #d4c5a9",
            paddingTop: 12,
            marginTop: 4,
          }}
        >
          {/* Simulated QR block */}
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                width: 64,
                height: 64,
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 1.5,
                border: "2px solid #8B6914",
                padding: 4,
                backgroundColor: "#fffbf0",
                borderRadius: 4,
              }}
              title={qrValue}
              aria-label="Verification QR code placeholder"
            >
              {qrBlocks.map((filled, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: filled ? "#3d2200" : "#fffbf0",
                    borderRadius: 1,
                  }}
                />
              ))}
            </div>
            <p style={{ fontSize: 7.5, textAlign: "center", color: "#8a7060", marginTop: 3, maxWidth: 64 }}>
              Scan to verify
            </p>
          </div>

          {/* Verification text */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 9.5, lineHeight: 1.65, color: "#5a3e10", margin: "0 0 5px" }}>
              <strong>Verification Reference:</strong> {qrValue}
            </p>
            <p style={{ fontSize: 9, lineHeight: 1.6, color: "#8a7060", margin: 0 }}>
              This document is digitally executed on <strong>RentCraft</strong> — an Automated Digital Lease Agreement &amp; Smart Verification Platform.
              The stamp duty of ₹500 is paid via e-Stamp and this document is legally valid under the Registration Act, 1908,
              Maharashtra Stamp Act, and the Information Technology Act, 2000.
              For verification, visit <strong>rentcraft.io/verify</strong> and enter the Agreement Number above.
            </p>
          </div>

          {/* Official stamp circle */}
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "3px solid #8B6914",
                boxShadow: "inset 0 0 0 3px #fcf8f2, inset 0 0 0 5px #c8a84b40",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fffbf0",
                gap: 2,
              }}
            >
              <p style={{ fontSize: 7, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a3e10", margin: 0, lineHeight: 1.2 }}>
                OFFICIAL
              </p>
              <p style={{ fontSize: 6.5, color: "#8B6914", margin: 0, lineHeight: 1.2 }}>E-STAMP</p>
              <p style={{ fontSize: 11, fontWeight: 900, color: "#3d2200", margin: 0, lineHeight: 1.1 }}>₹500</p>
              <p style={{ fontSize: 6, color: "#8a7060", margin: 0 }}>PAID</p>
            </div>
            <p style={{ fontSize: 7.5, color: "#8a7060", marginTop: 3 }}>Duty Paid</p>
          </div>
        </div>

        {/* Bottom disclaimer band */}
        <div
          style={{
            background: "linear-gradient(135deg,#3d2200,#6b3d00)",
            color: "#f5e8c8",
            borderRadius: 5,
            padding: "7px 14px",
            marginTop: 10,
            fontSize: 8.5,
            textAlign: "center",
            letterSpacing: "0.04em",
            lineHeight: 1.55,
          }}
        >
          ⚠ This is a <strong>digitally-generated e-stamp document</strong> produced for demonstration purposes on the RentCraft platform.
          The stamp certificate number is system-generated. For actual legal use, obtain an e-stamp from a licensed vendor.
          &nbsp;·&nbsp; <strong>rentcraft.io</strong>
        </div>
      </div>
    );
  }
);

StampPaper.displayName = "StampPaper";
export default StampPaper;
