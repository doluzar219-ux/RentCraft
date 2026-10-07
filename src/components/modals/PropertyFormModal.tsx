import { useState, type FormEvent } from "react";
import { Home, MapPin, IndianRupee, PlusCircle } from "lucide-react";
import Modal from "../app/Modal";
import { Field, inputCls } from "../app/ui";
import { useApp } from "../../store/AppContext";
import { cn } from "../../utils/cn";
import type { Property } from "../../types";

const TYPES = ["1BHK", "2BHK", "3BHK", "Studio", "Villa"];

export default function PropertyFormModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: (p: Property) => void;
}) {
  const { addProperty, session, pushToast } = useApp();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [type, setType] = useState("2BHK");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (title.trim().length < 4) next.title = "Give the listing a proper title (min 4 chars)";
    if (location.trim().length < 3) next.location = "Enter area & city, e.g. Koramangala, Bengaluru";
    const rentNum = Number(rent);
    const depNum = deposit === "" ? rentNum * 3 : Number(deposit);
    if (!rent || isNaN(rentNum) || rentNum <= 0) next.rent = "Enter a valid monthly rent";
    if (deposit !== "" && (isNaN(depNum) || depNum < 0)) next.deposit = "Deposit must be a positive number";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSaving(true);
    /* tiny simulated latency so the button feedback feels real */
    window.setTimeout(() => {
      const prop = addProperty({
        title: title.trim(),
        location: location.trim(),
        rent: rentNum,
        deposit: depNum,
        type,
        ownerName: session?.name ?? "You",
      });
      setSaving(false);
      setTitle("");
      setLocation("");
      setRent("");
      setDeposit("");
      setType("2BHK");
      onClose();
      pushToast(`“${prop.title}” is now live on RentCraft`, "terra");
      onCreated?.(prop);
    }, 550);
  };

  return (
    <Modal open={open} onClose={onClose} size="md" label="List a new property">
      <form onSubmit={submit} className="p-7 sm:p-9">
        <div className="flex items-center gap-3.5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-terracotta-500 text-white shadow-lg shadow-terracotta-500/30">
            <Home className="h-5.5 w-5.5" />
          </span>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-ink">List a new property</h3>
            <p className="text-xs font-semibold text-ink-mute">Goes live instantly — tenants can apply right away</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Field label="Property title" error={errors.title}>
            <div className="relative">
              <Home className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute/60" />
              <input
                className={cn(inputCls, "pl-11")}
                placeholder="e.g. Sunbeam Villa · 2BHK"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </Field>

          <Field label="Location" error={errors.location}>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute/60" />
              <input
                className={cn(inputCls, "pl-11")}
                placeholder="Area, City"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Monthly rent (₹)" error={errors.rent}>
              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute/60" />
                <input
                  className={cn(inputCls, "pl-11")}
                  inputMode="numeric"
                  placeholder="24000"
                  value={rent}
                  onChange={(e) => setRent(e.target.value.replace(/[^\d]/g, ""))}
                />
              </div>
            </Field>
            <Field label="Security deposit (₹)" error={errors.deposit} hint="Leave blank for 3× rent">
              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute/60" />
                <input
                  className={cn(inputCls, "pl-11")}
                  inputMode="numeric"
                  placeholder="72000"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value.replace(/[^\d]/g, ""))}
                />
              </div>
            </Field>
          </div>

          <Field label="Property type">
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "rounded-full border-2 px-4 py-2 text-xs font-bold transition-all duration-300 active:scale-95",
                    type === t
                      ? "border-terracotta-500 bg-terracotta-500 text-white shadow-md shadow-terracotta-500/30"
                      : "border-terracotta-100 bg-white text-ink-soft hover:border-terracotta-300"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta-500 py-4 text-sm font-bold text-white shadow-lg shadow-terracotta-500/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-600 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <PlusCircle className={cn("h-4.5 w-4.5", saving && "animate-spin")} />
          {saving ? "Publishing listing…" : "Publish listing"}
        </button>
      </form>
    </Modal>
  );
}
