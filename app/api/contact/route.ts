// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ---------- helpers ----------
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

async function verifyTurnstile(token: string, ip: string | null, secret: string) {
  if (!secret) return false;
  const form = new URLSearchParams();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: form,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return !!data.success;
}

// Lazy builders so bad env doesn’t crash build:
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY || "";
  if (!key) return null;
  return new Resend(key);
}

function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE || "";
  if (!url || !/^https?:\/\//i.test(url) || !serviceRole) return null;
  return createClient(url, serviceRole, { auth: { persistSession: false } });
}

// ---------- handler ----------
export async function POST(req: Request) {
  try {
    // Basic request info
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      (req as any).ip ??
      null;
    const ua = req.headers.get("user-agent") || "";

    // Read envs at request time (safe for build)
    const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "";
    const CONTACT_FROM = process.env.CONTACT_FROM || "";
    const CONTACT_TO = process.env.CONTACT_TO || "";
    const CONTACT_BCC = process.env.CONTACT_BCC || "";

    // Parse body
    const body = (await req.json()) as Payload;

    // Honeypot: if filled, pretend success
    if (body.hp && body.hp.length > 0) {
      return NextResponse.json({ ok: true }, { headers: nocacheHeaders() });
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
        { status: 400, headers: nocacheHeaders() }
      );
    }
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing bot verification." },
        { status: 400, headers: nocacheHeaders() }
      );
    }

    // Verify Turnstile
    const human = await verifyTurnstile(token, ip, TURNSTILE_SECRET_KEY);
    if (!human) {
      return NextResponse.json(
        { ok: false, error: "Bot verification failed." },
        { status: 403, headers: nocacheHeaders() }
      );
    }

    // 1) Insert into Supabase (optional if configured)
    const supabase = getSupabase();
    if (supabase) {
      const { error: dbError } = await supabase.from("inquiries").insert([
        {
          name,
          email,
          phone: phone || null,
          location: location || null,
          message: message || null,
          ip: ip || null,
          user_agent: ua || null,
        },
      ]);
      if (dbError) {
        console.error("Supabase insert error:", dbError);
        // continue; don’t block email on DB failure
      }
    } else {
      console.warn("Supabase is not configured (missing or invalid SUPABASE_URL/SUPABASE_SERVICE_ROLE). Skipping DB insert.");
    }

    // 2) Send email via Resend
    const resend = getResend();
    if (!resend) {
      console.error("RESEND_API_KEY not configured.");
      return NextResponse.json(
        { ok: false, error: "Email service not configured." },
        { status: 500, headers: nocacheHeaders() }
      );
    }

    if (!CONTACT_FROM || !CONTACT_TO) {
      console.error("CONTACT_FROM/CONTACT_TO not configured.");
      return NextResponse.json(
        { ok: false, error: "Email addresses not configured." },
        { status: 500, headers: nocacheHeaders() }
      );
    }

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
      from: process.env.CONTACT_FROM as string,
      to: process.env.CONTACT_TO as string,
      ...(CONTACT_BCC ? { bcc: CONTACT_BCC } : {}),
      replyTo: email,
      subject,
      text,
      html,
    });

    // All good
    return NextResponse.json({ ok: true }, { headers: nocacheHeaders() });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error. Please try again." },
      { status: 500, headers: nocacheHeaders() }
    );
  }
}

// Small helper to prevent caches holding form responses
function nocacheHeaders() {
  return {
    "Cache-Control": "no-store, max-age=0",
  };
}
