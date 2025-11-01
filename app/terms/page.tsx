// app/terms/page.tsx
export const metadata = {
  title: "Terms of Use • Wild Lands Ecological Services",
  description:
    "Terms and conditions governing use of Wild Lands Ecological Services’ website and communications.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-neutral-800">
      <h1 className="text-4xl font-bold mb-6">Terms of Use</h1>
      <p className="mb-4 text-sm text-gray-600">
        Last updated {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.
      </p>

      <p className="mb-6">
        Welcome to the website of Wild Lands Ecological Services (“Wild Lands,” “we,” “our,” or “us”). By accessing or
        using this site, you agree to the following terms and conditions.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Use of Content</h2>
      <p className="mb-6">
        All text, images, and media on this website are the property of Wild Lands unless otherwise credited. You may
        not reproduce, distribute, or modify any content without prior written permission.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Informational Purposes Only</h2>
      <p className="mb-6">
        Content provided is for general informational purposes. It does not constitute professional advice or a binding
        proposal. For official project proposals, contracts, or consultations, please contact{" "}
        <a href="mailto:info@wildlandseco.com" className="text-emerald-700 underline">
          info@wildlandseco.com
        </a>
        .
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Third-Party Links</h2>
      <p className="mb-6">
        This website may contain links to third-party sites for additional information. Wild Lands is not responsible
        for the content or practices of external websites.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Limitation of Liability</h2>
      <p className="mb-6">
        Wild Lands shall not be liable for any damages arising from the use or inability to use this website. All use is
        at your own discretion and risk.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3">Contact</h2>
      <p>
        For questions regarding these terms, please email{" "}
        <a href="mailto:info@wildlandseco.com" className="text-emerald-700 underline">
          info@wildlandseco.com
        </a>
        .
      </p>
    </main>
  );
}
