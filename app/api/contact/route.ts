// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_FROM = process.env.CONTACT_FROM!;
const CONTACT_TO = process.env.CONTACT_TO!;
const CONTACT_BCC = process.env.CONTACT_BCC || undefined;

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;

// Server-only Supabase client using Service Role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

type Payload = {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  message?: string;
  turnstileToken?: string;
  hp?: string; // honeypot
};

function sanitize(s: unknown) {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, 5000);
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function verifyTurnstile(token: string, ip: string | null) {
  const form = new URLSearchParams();
  form.append("secret", TURNSTILE_SECRET_KEY);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.success;
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      (req as any).ip ??
      null;
    const ua = req.headers.get("user-agent") || "";

    const body = (await req.json()) as Payload;

    // Honeypot: if filled, fake success
    if (body.hp && body.hp.length > 0) {
      return NextResponse.json({ ok: true });
    }

    // Validate
    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const phone = sanitize(body.phone);
    const location = sanitize(body.location);
    const message = sanitize(body.message);
    const token = body.turnstileToken || "";

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Name and email are required." },
        { status: 400 }
      );
    }
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing bot verification." },
        { status: 400 }
      );
    }

    // Verify Turnstile
    const valid = await verifyTurnstile(token, ip);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Bot verification failed." },
        { status: 403 }
      );
    }

    // 1) Insert into Supabase
    const { error: dbError } = await supabase.from("inquiries").insert([
      {
        name,
        email,
        phone: phone || null,
        location: location || null,
        message: message || null,
        ip: ip || null,
        user_agent: ua,
      },
    ]);
    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // continue to email, but report error to client
    }

    // 2) Send email via Resend
    const subject = `New Inquiry — ${name}`;
    const text = [
      `New inquiry from Wild Lands website`,
      `-----------------------------------`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "-"}`,
      `Location: ${location || "-"}`,
      ``,
      `Message:`,
      message || "-",
      ``,
      `IP: ${ip || "-"}`,
      `UA: ${ua || "-"}`,
      `Time: ${new Date().toISOString()}`,
    ].join("\n");

    const html = `
      <table style="max-width:640px;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111;padding:16px">
        <tr><td>
          <h2 style="margin:0 0 8px 0;">New Inquiry — Wild Lands</h2>
          <p style="margin:0;color:#555">Submitted ${new Date().toLocaleString()}</p>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb" />
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || "-")}</p>
          <p><strong>Location:</strong> ${escapeHtml(location || "-")}</p>
          <p style="margin-top:12px;"><strong>Message:</strong></p>
          <pre style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e5e7eb;border-radius:6px;padding:12px;margin:8px 0">${escapeHtml(message || "-")}</pre>
          <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb" />
          <p style="color:#666;font-size:12px">IP: ${escapeHtml(ip || "-")}</p>
          <p style="color:#666;font-size:12px">UA: ${escapeHtml(ua || "-")}</p>
        </td></tr>
      </table>
    `;

    await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      ...(CONTACT_BCC ? { bcc: CONTACT_BCC } : {}),
      replyTo: email,
      subject,
      text,
      html,
    });

    // Done
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
