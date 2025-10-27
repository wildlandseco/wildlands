"use client";
import { useEffect, useRef } from "react";

declare global { interface Window { turnstile: any; onloadTurnstileCallback?: () => void; } }

export default function Turnstile({ siteKey, onVerify }: { siteKey: string; onVerify: (token: string) => void; }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const render = () => {
      if (!window.turnstile || !ref.current) return;
      window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: onVerify,
        theme: "light",
      });
    };

    if (window.turnstile) { render(); return; }

    window.onloadTurnstileCallback = render;
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback";
    document.head.appendChild(s);
  }, [siteKey, onVerify]);

  return <div ref={ref} />;
}