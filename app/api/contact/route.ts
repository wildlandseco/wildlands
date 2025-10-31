// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";       // ensure Node runtime
export const dynamic = "force-dynamic";

// --- ENV ---
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const CONTACT_FROM = process.env.CONTACT_FROM || ""; // must be a verified Resend domain sender
const CONTACT_TO = process.env.CONTACT_TO || "";
const CONTACT_BCC = process.env.CONTACT_BCC || undefined;

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || "";

// Init clients (do not create if env missing to avoid masking issues)
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;
const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, { auth: { persistSession: false } })
    : null;

// --- Types & utils ---
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
  try {
    if (!TURNSTILE_SECRET_KEY) return true; // if not configured yet, bypass for testing
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
  } catch (e) {
    console.error("Turnstile verify error:", e);
    return false;
  }
}

export async function POST(req: Request) {
  const diag: Record<string, any> = { step: "start" };
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      (req as any).ip ??
      null;
    const ua = req.headers.get("user-agent") || "";

    const body = (await req.json()) as Payload;
    diag.bodyReceived = true;

    // Honeypot
    if (body.hp && body.hp.length > 0) {
      diag.honeypot = true;
      return NextResponse.json({ ok: true, skipped: "honeypot", diag });
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
        { ok: false, error: "Name and email are required.", diag },
        { status: 400 }
      );
    }

    const human = await verifyTurnstile(token, ip);
    diag.turnstile = human;
    if (!human) {
      return NextResponse.json(
        { ok: false, error: "Bot verification failed.", diag },
        { status: 403 }
      );
    }

    // DB insert
    let dbInserted = false;
    let dbError: string | null = null;
    if (!supabase) {
      dbError = "Supabase not configured (check SUPABASE_URL / SUPABASE_SERVICE_ROLE).";
      console.error(dbError);
    } else {
      const { error } = await supabase.from("inquiries").insert([
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
      if (error) {
        dbError = error.message || String(error);
        console.error("Supabase insert error:", error);
      } else {
        dbInserted = true;
      }
    }

    // Email
    let emailSent = false;
    let emailError: string | null = null;
    if (!resend) {
      emailError = "Resend not configured (check RESEND_API_KEY).";
      console.error(emailError);
    } else if (!CONTACT_FROM || !CONTACT_TO) {
      emailError = "CONTACT_FROM or CONTACT_TO missing.";
      console.error(emailError);
    } else {
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

      const resp = await resend.emails.send({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        ...(CONTACT_BCC ? { bcc: CONTACT_BCC } : {}),
        replyTo: email,
        subject,
        text,
        html,
      });

      if ((resp as any)?.error) {
        emailError = (resp as any).error?.message || JSON.stringify(resp);
        console.error("Resend error:", emailError);
      } else {
        emailSent = true;
      }
    }

    // Return with diagnostics so you can see where it failed
    return NextResponse.json({
      ok: dbInserted && emailSent,
      dbInserted,
      emailSent,
      dbError,
      emailError,
    });
  } catch (err: any) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error. Please try again." },
      { status: 500 }
    );
  }
}
