import type { ReactNode } from "react";
import { Building2, MapPin, IndianRupee, ShieldCheck } from "lucide-react";
import { StatusChip } from "./ui";
import { formatINR } from "../../utils/agreement";
import { cn } from "../../utils/cn";
import type { Property } from "../../types";

const TINTS = {
  terracotta: {
    head: "from-terracotta-100 to-terracotta-50",
    icon: "bg-terracotta-500/15 text-terracotta-600",
    iconEl: "text-terracotta-600",
  },
  forest: {
    head: "from-forest-100 to-forest-50",
    icon: "bg-forest-500/15 text-forest-600",
    iconEl: "text-forest-600",
  },
  sand: {
    head: "from-sand to-linen",
    icon: "bg-terracotta-500/10 text-terracotta-700",
    iconEl: "text-terracotta-700",
  },
} as const;

const AMENITIES = [
  ["Gated society", "Covered parking"],
  ["Near metro", "Power backup"],
  ["Pet friendly", "Balcony"],
  ["Semi-furnished", "Park view"],
];

export default function PropertyCard({
  property,
  footer,
  index = 0,
}: {
  property: Property;
  footer?: ReactNode;
  index?: number;
}) {
  const tint = TINTS[property.tint];
  const amenities = AMENITIES[index % AMENITIES.length];
  return (
    <article className="card group overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
      {/* flat 2D header */}
      <div className={cn("relative flex h-28 items-center justify-center bg-gradient-to-br", tint.head)}>
        <span className={cn("grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110", tint.icon)}>
          <Building2 className="h-7 w-7" />
        </span>
        <span className="absolute left-3.5 top-3.5">
          <StatusChip tone={property.status === "available" ? "green" : property.status === "requested" ? "amber" : "terra"}>
            {property.status === "available" ? "Available" : property.status === "requested" ? "Interest shown" : "Rented"}
          </StatusChip>
        </span>
        <span className="absolute right-3.5 top-3.5 rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-extrabold text-ink backdrop-blur">
          {property.type}
        </span>
        <span className="texture-dots absolute bottom-0 right-0 h-14 w-28 opacity-40 [mask-image:linear-gradient(to_top_left,black,transparent)]" />
      </div>

      {/* body */}
      <div className="p-5">
        <h4 className="truncate text-[15px] font-extrabold text-ink">{property.title}</h4>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-ink-mute">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-terracotta-400" />
          <span className="truncate">{property.location}</span>
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {amenities.map((a) => (
            <span key={a} className="rounded-full bg-linen px-2.5 py-1 text-[10px] font-bold text-ink-mute border border-terracotta-100/50">
              {a}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-terracotta-100/60 pt-3.5">
          <p className="flex items-center gap-0.5 text-lg font-extrabold text-ink">
            <IndianRupee className="h-4 w-4 text-terracotta-500" />
            {property.rent.toLocaleString("en-IN")}
            <span className="text-[11px] font-semibold text-ink-mute">/mo</span>
          </p>
          <p className="text-[11px] font-bold text-ink-mute">Dep {formatINR(property.deposit)}</p>
        </div>

        <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-forest-600">
          <ShieldCheck className="h-3 w-3" /> Owner · {property.ownerName} (verified)
        </p>

        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </article>
  );
}
