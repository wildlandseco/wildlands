// app/privacy/page.tsx
export const metadata = {
  title: "Privacy Policy • Wild Lands Ecological Services",
  description:
    "Privacy policy for Wild Lands Ecological Services — how we handle inquiries, data, and communications.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-neutral-800">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-600">
        Last updated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
      </p>

      <p className="mb-6">
        Wild Lands Ecological Services (“Wild Lands,” “we,” or “our”) values your privacy. This policy explains how we
        collect, use, and protect your information when you visit{" "}
        <a href="https://wildlandseco.com" className="text-emerald-700 underline">
          wildlandseco.com
        </a>{" "}
        or communicate with us through our contact form or email.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Information We Collect</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>Information you provide directly through forms (name, email, phone, location, and message content).</li>
        <li>Technical details such as IP address, browser type, and referrer, used for security and analytics.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-3">How We Use Information</h2>
      <ul className="list-disc list-inside space-y-2">
        <li>To respond to inquiries and provide ecological consulting services.</li>
        <li>To maintain site security and prevent spam or fraudulent use.</li>
        <li>To improve communication, planning, and outreach efforts.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Data Storage</h2>
      <p className="mb-6">
        Form submissions are securely stored through Supabase and delivered via encrypted email using Resend. We retain
        only necessary contact data for follow-up and do not share, sell, or lease it to third parties.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Your Rights</h2>
      <p className="mb-6">
        You may request correction or deletion of your information at any time by emailing{" "}
        <a href="mailto:info@wildlandseco.com" className="text-emerald-700 underline">
          info@wildlandseco.com
        </a>
        . We’ll verify identity before fulfilling requests.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Cookies & Analytics</h2>
      <p className="mb-6">
        Our site uses minimal, anonymous analytics via Vercel and Cloudflare to monitor site performance. No tracking or
        advertising cookies are used.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Policy Updates</h2>
      <p>
        This policy may be updated periodically to reflect operational, legal, or regulatory changes. Updated versions
        will be posted on this page with the revision date.
      </p>
    </main>
  );
}
