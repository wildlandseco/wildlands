"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/portal` },
    });
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <div className="min-h-[60vh] grid place-items-center p-6">
      <form onSubmit={sendLink} className="w-full max-w-sm border rounded-xl p-6">
        <h1 className="text-xl font-semibold">Client Portal Login</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter your email and we’ll send a one-time sign-in link.
        </p>
        <input
          className="mt-4 w-full border rounded p-3"
          type="email" placeholder="you@example.com"
          value={email} onChange={e=>setEmail(e.target.value)} required
        />
        <button className="mt-3 w-full rounded bg-emerald-700 text-white py-3 font-semibold">
          Send Magic Link
        </button>
        {sent && <p className="text-emerald-700 mt-3">Link sent—check your inbox.</p>}
        {err && <p className="text-red-600 mt-3">{err}</p>}
      </form>
    </div>
  );
}
