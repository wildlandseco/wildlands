// components/Toast.tsx
"use client";
import { useEffect, useState } from "react";

type Props = { message: string; variant?: "success" | "error" | "info" };

export default function Toast({ message, variant = "info" }: Props) {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOpen(false), 4000);
    return () => clearTimeout(t);
  }, []);
  if (!open) return null;

  const base =
    "fixed top-4 inset-x-0 mx-auto z-50 w-fit max-w-[90vw] rounded-xl px-4 py-3 shadow-lg border text-sm";
  const color =
    variant === "success"
      ? "bg-emerald-600 text-white border-emerald-700"
      : variant === "error"
      ? "bg-rose-600 text-white border-rose-700"
      : "bg-neutral-900 text-white border-neutral-800";

  return (
    <div className={`${base} ${color}`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          onClick={() => setOpen(false)}
          className="ml-2 rounded-md bg-white/10 px-2 py-1 hover:bg-white/20"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
