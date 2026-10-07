import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, PenLine, Save } from "lucide-react";
import { cn } from "../../utils/cn";

type Pt = { x: number; y: number };

export default function SignaturePad({
  onSave,
  accent = "forest",
  disabled = false,
}: {
  onSave: (dataUrl: string) => void;
  accent?: "forest" | "terra";
  disabled?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const prev = useRef<Pt | null>(null);
  const prevMid = useRef<Pt | null>(null);
  const [hasInk, setHasInk] = useState(false);

  /* hi-dpi canvas setup */
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = wrap.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1A202C";
    ctx.lineWidth = 2.6;
  }, []);

  useEffect(() => {
    setupCanvas();
    const onResize = () => {
      /* re-setup wipes ink — acceptable on resize during signing */
      setupCanvas();
      setHasInk(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setupCanvas]);

  const getPos = (e: React.PointerEvent): Pt => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = getPos(e);
    prev.current = p;
    prevMid.current = p;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      /* dot for taps */
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
      ctx.fillStyle = "#1A202C";
      ctx.fill();
    }
    setHasInk(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawing.current || disabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !prev.current || !prevMid.current) return;
    const p = getPos(e);
    const mid: Pt = { x: (prev.current.x + p.x) / 2, y: (prev.current.y + p.y) / 2 };
    ctx.beginPath();
    ctx.moveTo(prevMid.current.x, prevMid.current.y);
    ctx.quadraticCurveTo(prev.current.x, prev.current.y, mid.x, mid.y);
    ctx.stroke();
    prev.current = p;
    prevMid.current = mid;
  };

  const endStroke = () => {
    drawing.current = false;
    prev.current = null;
    prevMid.current = null;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasInk) return;
    onSave(canvas.toDataURL("image/png"));
  };

  const terra = accent === "terra";

  return (
    <div>
      <div
        ref={wrapRef}
        className={cn(
          "relative h-44 overflow-hidden rounded-2xl border-2 border-dashed bg-linen/70 sm:h-48",
          terra ? "border-terracotta-200" : "border-forest-200"
        )}
      >
        <canvas
          ref={canvasRef}
          className="sig-canvas h-full w-full"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerLeave={endStroke}
        />
        {!hasInk && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-mute/70">
            <PenLine className="h-6 w-6" />
            <p className="text-xs font-bold">Draw your signature here — mouse or touch</p>
          </div>
        )}
        <span className="pointer-events-none absolute bottom-4 left-6 right-6 border-b border-terracotta-100/70" />
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={clear}
          disabled={!hasInk || disabled}
          className="inline-flex items-center gap-1.5 rounded-full border border-terracotta-100 bg-white px-4 py-2.5 text-xs font-bold text-ink-soft transition-all hover:border-terracotta-300 hover:text-terracotta-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Eraser className="h-3.5 w-3.5" /> Clear
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!hasInk || disabled}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40",
            terra
              ? "bg-terracotta-500 shadow-terracotta-500/30 hover:bg-terracotta-600"
              : "bg-forest-500 shadow-forest-500/30 hover:bg-forest-600",
            hasInk && !disabled && "hover:-translate-y-0.5"
          )}
        >
          <Save className="h-3.5 w-3.5" /> Save Signature
        </button>
      </div>
    </div>
  );
}
