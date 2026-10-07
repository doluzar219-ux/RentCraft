import { FileSignature, ShieldCheck, Cloud, KeyRound, Stamp, ScanFace } from "lucide-react";

const ITEMS = [
  { icon: FileSignature, label: "Paperless E-Signing" },
  { icon: ShieldCheck, label: "Mock Aadhaar Verified" },
  { icon: Stamp, label: "Legally Vetted Templates" },
  { icon: Cloud, label: "Encrypted Cloud Vault" },
  { icon: KeyRound, label: "Zero Brokerage" },
  { icon: ScanFace, label: "Smart PAN Checks" },
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <section aria-hidden className="relative -rotate-1 overflow-hidden bg-forest-500 py-4 shadow-[0_18px_40px_-18px_rgba(44,94,75,0.5)]">
      <div className="flex w-max animate-marquee items-center gap-10 pr-10">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-10">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-3 whitespace-nowrap text-sm font-bold uppercase tracking-[0.16em] text-cream"
              >
                <item.icon className="h-4.5 w-4.5 text-terracotta-200" strokeWidth={2.4} />
                {item.label}
                <span className="ml-7 h-1.5 w-1.5 rounded-full bg-terracotta-300" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
