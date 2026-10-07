import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  ScanFace,
  Fingerprint,
  Check,
  Loader2,
  Landmark,
  BadgeCheck,
} from "lucide-react";
import Modal from "../app/Modal";
import { Field, inputCls } from "../app/ui";
import { useApp } from "../../store/AppContext";
import { cn } from "../../utils/cn";

type Stage = "form" | "verifying" | "done";

const VERIFY_STEPS = [
  "Contacting UIDAI mock gateway…",
  "Validating Aadhaar checksum & biometrics hash…",
  "Cross-verifying PAN with Income Tax database…",
  "Binding identity profile & computing trust score…",
];

export default function KycModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { session, completeKyc, pushToast } = useApp();
  const [stage, setStage] = useState<Stage>("form");
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
  const [errors, setErrors] = useState<{ name?: string; aadhaar?: string; pan?: string }>({});
  const [stepIdx, setStepIdx] = useState(0);
  const timers = useRef<number[]>([]);

  /* reset whenever reopened */
  useEffect(() => {
    if (open) {
      setStage("form");
      setName(session?.name ?? "");
      setAadhaar("");
      setPan("");
      setErrors({});
      setStepIdx(0);
    }
  }, [open, session]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const fmtAadhaar = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 12)
      .replace(/(\d{4})(?=\d)/g, "$1 ");

  const verify = () => {
    const next: typeof errors = {};
    const digits = aadhaar.replace(/\s/g, "");
    if (name.trim().length < 3) next.name = "Enter the name exactly as on your Aadhaar";
    if (!/^\d{12}$/.test(digits)) next.aadhaar = "Aadhaar must be a 12-digit number";
    else if (/^(\d)\1{11}$/.test(digits)) next.aadhaar = "That Aadhaar fails the mock liveness check";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) next.pan = "PAN format: 5 letters, 4 digits, 1 letter (ABCDE1234F)";
    setErrors(next);
    if (Object.keys(next).length) return;

    /* simulated API pipeline */
    setStage("verifying");
    setStepIdx(0);
    VERIFY_STEPS.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStepIdx(i + 1), (i + 1) * 950));
    });
    timers.current.push(
      window.setTimeout(() => {
        const trustScore = 92 + ((digits.charCodeAt(0) + digits.charCodeAt(5)) % 7);
        completeKyc({
          name: name.trim(),
          aadhaar: fmtAadhaar(digits),
          pan,
          trustScore,
          verifiedAt: new Date().toISOString(),
        });
        setStage("done");
      }, VERIFY_STEPS.length * 950 + 600)
    );
  };

  const finish = () => {
    onClose();
    pushToast("KYC verified successfully — trust badge unlocked", "forest");
    onSuccess?.();
  };

  const masked = aadhaar.replace(/\s/g, "").replace(/^(\d{4})\d{4}(\d{4})$/, "$1 •••• $2");

  return (
    <Modal open={open} onClose={onClose} size="md" locked={stage === "verifying"} label="Smart KYC verification">
      <div className="p-7 sm:p-9">
        {/* ── FORM ── */}
        {stage === "form" && (
          <>
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-forest-500 text-white shadow-lg shadow-forest-500/30">
                <ScanFace className="h-5.5 w-5.5" />
              </span>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-ink">Smart KYC Verification</h3>
                <p className="text-xs font-semibold text-ink-mute">Mock Aadhaar + PAN check · demo gateway</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Field label="Full name (as per Aadhaar)" error={errors.name}>
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Deshmukh" />
              </Field>
              <Field label="Aadhaar number" error={errors.aadhaar} hint="12 digits — auto-formatted in groups of 4">
                <input
                  className={cn(inputCls, "tracking-[0.2em]")}
                  inputMode="numeric"
                  placeholder="1234 5678 9012"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(fmtAadhaar(e.target.value))}
                />
              </Field>
              <Field label="PAN number" error={errors.pan} hint="Format: ABCDE1234F">
                <input
                  className={cn(inputCls, "uppercase tracking-[0.2em]")}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                />
              </Field>
            </div>

            <button
              onClick={verify}
              className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-forest-500 py-4 text-sm font-bold text-white shadow-lg shadow-forest-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-600 active:scale-[0.98]"
            >
              <Fingerprint className="h-4.5 w-4.5" />
              Verify my identity
            </button>
            <p className="mt-3.5 flex items-center justify-center gap-1.5 text-center text-[11px] font-semibold text-ink-mute">
              <ShieldCheck className="h-3.5 w-3.5 text-forest-500" />
              Demo only — nothing leaves your browser. Try 1234 5678 9012 / ABCDE1234F
            </p>
          </>
        )}

        {/* ── VERIFYING ── */}
        {stage === "verifying" && (
          <div className="py-4">
            <div className="flex items-center gap-3.5">
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-forest-500 text-white">
                <ScanFace className="h-5.5 w-5.5" />
                <span className="absolute inset-0 animate-ping rounded-2xl bg-forest-400/50" />
              </span>
              <div>
                <h3 className="text-xl font-extrabold tracking-tight text-ink">Verifying with government databases…</h3>
                <p className="text-xs font-semibold text-ink-mute">Hang tight — this is a simulated lookup</p>
              </div>
            </div>

            <ul className="mt-7 space-y-3.5">
              {VERIFY_STEPS.map((s, i) => {
                const done = stepIdx > i;
                const active = stepIdx === i;
                return (
                  <li
                    key={s}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-500",
                      done
                        ? "border-forest-200 bg-forest-50"
                        : active
                          ? "border-terracotta-200 bg-white shadow-soft"
                          : "border-terracotta-100/60 bg-linen/50 opacity-50"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full",
                        done ? "bg-forest-500 text-white" : active ? "bg-white" : "bg-terracotta-100/60 text-transparent"
                      )}
                    >
                      {done ? (
                        <Check className="h-4 w-4" strokeWidth={3} />
                      ) : active ? (
                        <Loader2 className="h-4 w-4 animate-spin text-terracotta-500" />
                      ) : (
                        <Check className="h-4 w-4" strokeWidth={3} />
                      )}
                    </span>
                    <span className={cn("text-sm font-bold", done ? "text-forest-600" : "text-ink-soft")}>{s}</span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-forest-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-forest-400 to-forest-500 transition-all duration-700 ease-out"
                style={{ width: `${Math.min((stepIdx / VERIFY_STEPS.length) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {stage === "done" && (
          <div className="py-2 text-center">
            <span className="check-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-forest-500 text-white shadow-lift-green">
              <Check className="h-9 w-9" strokeWidth={3} />
            </span>
            <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">Verified Successfully</h3>
            <p className="mt-1.5 text-sm font-medium text-ink-soft">
              Your identity cleared the mock UIDAI &amp; Income Tax checks.
            </p>

            <div className="mx-auto mt-6 max-w-sm space-y-2.5 rounded-2xl border border-forest-100 bg-forest-50/60 p-5 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-mute">Name</span>
                <span className="font-extrabold text-ink">{name.trim()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-mute">Aadhaar</span>
                <span className="font-extrabold text-ink">{masked}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-mute">PAN</span>
                <span className="font-extrabold text-ink">{pan}</span>
              </div>
              <div className="flex items-center justify-between border-t border-forest-100 pt-2.5 text-sm">
                <span className="font-semibold text-ink-mute">Trust score</span>
                <span className="inline-flex items-center gap-1.5 font-extrabold text-forest-600">
                  <Landmark className="h-4 w-4" /> Excellent
                </span>
              </div>
            </div>

            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest-500 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-forest-500/30">
              <BadgeCheck className="h-4 w-4" /> KYC Verified · Forest Badge
            </span>

            <button
              onClick={finish}
              className="mt-6 w-full rounded-full bg-ink py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-600 active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
