"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Turnstile from "@/components/Turnstile";

/** Sticky CTA used at the bottom of the page */
function StickyCTA() {
  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-4 md:px-0">
      <div className="mx-auto max-w-7xl">
        <a
          href="#contact"
          className="block md:hidden rounded-xl px-5 py-3 text-center font-semibold bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-800"
        >
          Request a Consult
        </a>
      </div>
    </div>
  );
}

export default function Page() {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [err, setErr] = useState("");

  const reduce = useReducedMotion();

  // Project images (put files in /public/projects/)
  const projects = [
    {
      img: "/projects/farmland.webp",
      title: "Conservation Easements",
      tag: "Getting landowners the most out of their farm bill benefits",
    },
    {
      img: "/projects/wetland.webp",
      title: "Wetlands Restoration",
      tag: "Creating and improving waterfowl habitat",
    },
    {
      img: "/projects/urban-forest.webp",
      title: "Urban Reforestation",
      tag: "Keep urban water clean and power bills down with new forests",
    },
    {
      img: "/projects/riparian-edge.webp",
      title: "Riparian Edge Recovery",
      tag: "Creating bigger, healthier, more connected bottomland hardwoods in timber stands",
    },
    {
      img: "/projects/prescribed-burn.webp",
      title: "Early Succession Management",
      tag: "Using every tool at our disposal to put more wildlife on the land",
    },
    {
      img: "/projects/bobwhite.webp",
      title: "Habitat Improvement",
      tag: "Bringing important game and non-game species back to your land",
    },
  ];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErr("");
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, turnstileToken }),
    });
    const json = await res.json();
    if (json.ok) setStatus("ok");
    else {
      setStatus("error");
      setErr(json.error || "Submission failed");
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
           </header>

      {/* HERO SECTION (Video Background) */}
      <section className="relative h-[90vh] overflow-hidden flex items-center justify-center text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero-video.mp4"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center max-w-3xl px-4">
          <h2 className="text-4xl uppercase md:text-6xl font-bold tracking-tight leading-tight mb-4">
            Wild Lands
          </h2>
          <h2 className="text-3xl md:text-6xl font-semibold tracking-tight leading-tight mb-4">
            Ecological Services
          </h2>
          <p className="text-lg md:text-xl text-emerald-100 mb-8">
            Guided by a living land ethic, we help landowners, tribes, and partners restore balance to the land—
            rebuilding native systems while keeping working lands productive and wild places alive for both people and wildlife.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-emerald-700 text-white font-semibold text-sm hover:bg-emerald-800"
          >
            Start Your Project
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-18 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <p className="uppercase tracking-widest text-xs text-emerald-700 mb-2">What We Do</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Wildlife & Habitat Services</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                t: "Riparian & Wetland Systems",
                d: "Buffer restoration, floodplain reconnection, and wetland enhancement to restore function and improve habitat for aquatic species and waterfowl.",
              },
              {
                t: "Upland Habitat Restoration",
                d: "Selective thinning, prescribed fire planning, and native groundcover establishment to benefit quail, turkey, deer, songbirds, and pollinators.",
              },
              {
                t: "Agricultural & Post-Industrial Conversions",
                d: "Transition row-crop or turf to native habitat; reforest disturbed sites; align projects with easements, incentives, and long-term stewardship goals.",
              },
              {
                t: "Wildlife Enterprise Planning",
                d: "Integrate habitat design, access, and user experience for hunting, fishing, and ecotourism—grounded in ecological performance and safety.",
              },
              {
                t: "Monitoring & Compliance",
                d: "Permit-aware specs (ESA/MBTA/CWA), field surveys, mapping, and clear reporting aligned with NRCS practices and agency standards.",
              },
              {
                t: "Owner’s Rep & Implementation",
                d: "Contractor oversight, native sourcing, schedule and budget management, and QA/QC—delivering the plan on the ground.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.06 }}
                viewport={{ once: true }}
                whileHover={{ y: reduce ? 0 : -2, scale: reduce ? 1 : 1.01 }}
                className="rounded-2xl border bg-white shadow-sm"
              >
                <div className="p-6">
                  <h3 className="font-semibold text-lg">{card.t}</h3>
                  <p className="text-sm text-gray-600 mt-2">{card.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR ETHIC */}
      <section id="ethic" className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-widest text-xs text-emerald-300 mb-2">Our Values</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Traditional Ethic.</h2>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Modern Results.</h2>
            <p className="mt-4 text-white/85">
              Wild lands are inherited lands—places of use, renewal, and responsibility.
              Our work blends traditional stewardship and ecological science to restore structure,
              reconnect water, and return natural disturbance to its rhythm. We measure success by
              function: native composition, clean water, abundant wildlife, and a landscape that still
              provides for those who depend on it.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {[
              {
                t: "Native-First",
                d: "Local genotypes, community-level targets, and honest structure—not cosmetic plantings.",
              },
              {
                t: "Active Stewardship",
                d: "Fire, thinning, disking, and hydrologic reconnection—applied on purpose to guide succession.",
              },
              {
                t: "Measure What Matters",
                d: "Vegetation strata, focal species detections, water metrics, and user-day experience reported clearly.",
              },
              {
                t: "Ancestral & Tribal Partnership",
                d: "Good-faith consultation; sovereignty, cultural indicators, and data care where appropriate.",
              },
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6"
              >
                <h3 className="font-semibold">{v.t}</h3>
                <p className="text-sm text-white/80 mt-2">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section id="approach" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-18 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <p className="uppercase tracking-widest text-xs text-emerald-700 mb-2">How We Work</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Plan • Implement • Maintain</h2>
            <p className="mt-4 text-gray-700">
              Every plan we write is guided by a simple principle: healthy land serves all.
              We balance ecological restoration with continued use—bringing together science, tradition,
              and the landowner’s goals to create resilient habitat and lasting value.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                t: "Plan",
                d: "Site walk, baseline inventory, soils and hydrology review, clear objectives, budget and schedule, permit-aware specs.",
              },
              {
                t: "Implement",
                d: "Owner’s-rep or turnkey. Contractor oversight, native sourcing, QA/QC in the field, funding and compliance alignment.",
              },
              {
                t: "Maintain",
                d: "Seasonal monitoring, burn/maintenance calendars, annual reports, mid-course corrections, and continuity.",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.06 }}
                viewport={{ once: true }}
                className="rounded-2xl border bg-white shadow-sm"
              >
                <div className="p-6">
                  <h3 className="font-semibold text-lg">{s.t}</h3>
                  <p className="text-sm text-gray-600 mt-2">{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="work" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-18 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <p className="uppercase tracking-widest text-xs text-emerald-700 mb-2">Selected Projects</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Recent Work Across the Southeast</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: reduce ? 0 : -4, scale: reduce ? 1 : 1.02 }}
                className="rounded-2xl overflow-hidden border bg-white shadow-sm"
              >
                <div className="aspect-[4/3] bg-gray-100 relative">
                  <Image
                    src={p.img}
                    alt={p.tag}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base">{p.title}</h3>
                  <p className="text-xs text-gray-600">{p.tag}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-18 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            viewport={{ once: true }}
          >
            <p className="uppercase tracking-widest text-xs text-emerald-700 mb-2">Who We Are</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Biologists, Builders, and Good Neighbors</h2>
            <p className="mt-4 text-gray-700">
              Our work follows a practical land ethic—rooted in respect for ancestral lands and today’s working realities.
              Using disturbance-based management, native species, and adaptive monitoring, we help acres function again
              as living habitat—places that sustain wildlife, water, and people.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-gray-800">
              <li>Permit-aware plans (ESA/MBTA/CWA) with NRCS alignment</li>
              <li>Clear success metrics and seasonal reporting</li>
              <li>Native sourcing and specification leadership</li>
              <li>Coastal, riparian, and upland expertise</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
            viewport={{ once: true }}
            className="aspect-[4/3] rounded-2xl bg-[url('/who-we-are.jpg')] bg-cover bg-center shadow-xl"
          />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-18 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <p className="uppercase tracking-widest text-xs text-emerald-300 mb-2">Start a Project</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Tell Us About Your Land</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white text-neutral-900 shadow-sm"
            >
              <div className="p-6">
                <form onSubmit={onSubmit} className="grid gap-4">
                  <input name="name" placeholder="Full name" required className="border p-3 rounded" />
                  <input name="email" type="email" placeholder="Email" required className="border p-3 rounded" />
                  <input name="phone" placeholder="Phone" className="border p-3 rounded" />
                  <input name="location" placeholder="Property location (city, state)" className="border p-3 rounded" />
                  {/* Honeypot */}
                  <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" />
                  <textarea
                    name="message"
                    placeholder="Goals & challenges (e.g., quail habitat, wetland enhancement, easement)"
                    rows={5}
                    className="border p-3 rounded"
                  />
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string}
                    onVerify={setTurnstileToken}
                  />
                  <button
                    disabled={!turnstileToken || status === "sending"}
                    className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    {status === "sending" ? "Sending…" : "Submit"}
                  </button>
                  {status === "ok" && <p className="text-emerald-700">Thanks — we’ll be in touch shortly.</p>}
                  {status === "error" && <p className="text-red-600">There was a problem: {err}</p>}
                </form>
                <p className="text-xs text-gray-500 mt-3">
                  By submitting, you agree to be contacted about services. We respect your privacy.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.08 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-neutral-800"
            >
              <div className="p-6 grid gap-4 text-sm">
                <div>
                  <p className="font-medium text-white">Email</p>
                  <a href="mailto:info@wildlandseco.com" className="text-emerald-300 hover:underline">
                    info@wildlandseco.com
                  </a>
                </div>
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <a href="tel:+18656217555" className="text-emerald-300 hover:underline">
                    (865) 621-7555
                  </a>
                </div>
                <div>
                  <p className="font-medium text-white">Service area</p>
                  <p className="text-emerald-200">Southeastern U.S. • Coastal, riparian, and upland habitat</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sticky CTA */}
      <StickyCTA />

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Wild Lands Ecological Services. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#services" className="hover:text-emerald-700">Services</a>
            <a href="#ethic" className="hover:text-emerald-700">Our Ethic</a>
            <a href="#approach" className="hover:text-emerald-700">Approach</a>
            <a href="#contact" className="hover:text-emerald-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
