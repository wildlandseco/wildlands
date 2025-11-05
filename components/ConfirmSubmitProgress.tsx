// components/ConfirmSubmitProgress.tsx
"use client";

import { useFormStatus } from "react-dom";
import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  confirmText?: string;
  className?: string;
  pendingText?: string;
};

export default function ConfirmSubmitProgress({
  children,
  confirmText = "Apply the default Habitat Stewardship playbook to this project? This will add predefined tasks and practices.",
  className = "",
  pendingText = "Seeding playbook…",
}: Props) {
  const { pending } = useFormStatus();
  const confirmedRef = useRef(false);

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (pending) return; // already submitting
        if (!confirmedRef.current) {
          const ok = window.confirm(confirmText);
          if (!ok) {
            e.preventDefault();
            e.stopPropagation();
          } else {
            confirmedRef.current = true; // allow the submit
          }
        }
      }}
      className={`${className} ${pending ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4"/>
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
          </svg>
          {pendingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
