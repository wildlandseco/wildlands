import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
// optional Supabase
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY || "");
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || "";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  message: z.string().min(5),
  turnstileToken: z.string().min(10),
});

// verify Cloudflare Turnstile
async function verifyTurnstile(token: string, remoteip?: string) {
 try {
    const body = new URLSearchParams();
    body.append("secret", process.env.TURNSTILE_SECRET_KEY || "");
    body.append("response", token);
    if (remoteip) body.append("remoteip", remoteip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = await r.json();
    return !!data.success;
  } catch { return false; }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.parse(json);

    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim();
    const ok = await verifyTurnstile(parsed.turnstileToken, ip);
    if (!ok) return NextResponse.json({ ok: false, error: "Turnstile validation failed" }, { status: 400 });

    const subject = `New inquiry – Wild Lands: ${parsed.name}`;
    const html = `
      <h2>New inquiry from Wild Lands website</h2>
      <p><strong>Name:</strong> ${parsed.name}</p>
      <p><strong>Email:</strong> ${parsed.email}</p>
      <p><strong>Phone:</strong> ${parsed.phone || "-"}</p>
      <p><strong>Location:</strong> ${parsed.location || "-"}</p>
      <p><strong>Message/Goals:</strong></p>
      <pre style="white-space:pre-wrap;font-family:ui-sans-serif,system-ui">${parsed.message}</pre>
      <hr/>
      <small>Source IP: ${ip || "-"}</small>
    `;

    await resend.emails.send({
      from: process.env.RESEND_FROM || "Wild Lands <no-reply@wildlandseco.com>",
      to: (process.env.LEADS_TO || "you@wildlandseco.com").split(","),
      subject,
      html,
    });

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("inquiries").insert([{
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone || null,
        location: parsed.location || null,
        message: parsed.message,
        ip: ip || null,
        created_at: new Date().toISOString(),
      }]);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err?.issues?.[0]?.message || err?.message || "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
