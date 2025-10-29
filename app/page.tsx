"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion"; // ✅ animations
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

  const reduce = useReducedMotion(); // ✅ respect reduced-motion

  // Project images (put files in /public/projects/)
const projects = [
  {
    img: "/projects/farmland.webp",
    title: "Farmland Renewal",
    tag: "A cow standing in a field",
  },
  {
    img: "/projects/wetland.webp",
    title: "Wetland Restoration",
    tag: "A landscape with a river and trees in the background",
  },
  {
    img: "/projects/urban-forest.webp",
    title: "Urban Forest Reclamation",
    tag: "A factory with trees and houses in the foreground",
  },
  {
    img: "/projects/riparian-edge.webp",
    title: "Riparian Edge Recovery",
    tag: "A stream with trees framing the edges and field in the background",
  },
  {
    img: "/projects/prescribed-burn.webp",
    title: "Prescribed Burn Operations",
    tag: "A wildland firefighter in front of a fire with trees on the edge of the frame",
  },
  {
    img: "/projects/bobwhite.webp",
    title: "Bobwhite Habitat Restoration",
    tag: "A bobwhite quail standing on a log in a grass field",
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 relative">
              <Image
                src="/logo-wildlands.png" // ← make sure this exists in /public
                alt="Wild Lands Logo"
                fill
                sizes="80px"
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="font-semibold text-[20px] uppercase tracking-widest text-emerald-700">Wild Lands</p>
              <h1 className="font-regular leading-none text-neutral-700">Ecological Services</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#services" className="hover:text-emerald-700">Services</a>
            <a href="#approach" className="hover:text-emerald-700">Approach</a>
            <a href="#work" className="hover:text-emerald-700">Projects</a>
            <a href="#about" className="hover:text-emerald-700">About</a>
            <a href="#contact" className="hover:text-emerald-700">Contact</a>
          </nav>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
          >
            Request a Consult
          </a>
        </div>
      </header>

      {/* HERO SECTION (Video Background) */}
      <section className="relative h-[90vh] overflow-hidden flex items-center justify-center text-white">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero-video.mp4" // ← add your file to /public
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
            Stewardship rooted in native ecology — helping landowners, tribes, and partners restore balance to their landscapes.
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
                d: "Buffer restoration, floodplain reconnection, wetland enhancement for waterfowl and aquatic species.",
              },
              {
                t: "Upland Pine–Oak & Early Successional",
                d: "Stand improvement, prescribed fire plans, native grass/forb establishment for game and nongame.",
              },
              {
                t: "Agricultural & Post-Industrial Conversions",
                d: "Row-crop/turf to native habitat; reforest disturbed sites; conservation easement alignment.",
              },
              {
                t: "Wildlife Enterprise Planning",
                d: "Habitat + access + guest experience for hunting, fishing, and ecotourism operations.",
              },
              {
                t: "Monitoring & Compliance",
                d: "Field surveys, mapping, reporting; permit-aware specs aligned to ESA/MBTA/CWA and NRCS practices.",
              },
              {
                t: "Owner’s Rep & Implementation",
                d: "Contractor oversight, native sourcing, schedule/budget management, QA/QC in the field.",
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
              Wild lands are inherited lands. We combine ancestral knowledge and modern ecology to
              restore structure, reconnect water, and put disturbance back on schedule. Success is
              defined by native composition, functioning hydrology, and wildlife response—not vague greening.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {[
              {
                t: "Native-First",
                d: "Local genotypes, community-level targets, and honest structure over cosmetic plantings.",
              },
              {
                t: "Active Stewardship",
                d: "Fire, thinning, disking, and hydrologic reconnection applied on purpose to guide succession.",
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
              We’re a stewardship partner, not a one-and-done consultant. Clarity before action,
              hands-on delivery, and adaptive care across seasons.
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
              We’re a field-first team delivering practical restoration and wildlife management. Our
              work follows a modern land ethic—respecting ancestral lands and working realities—
              while using disturbance-based management, native seed and stock, and adaptive monitoring
              to make acres function as habitat again.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-gray-800">
              <li>Permit-aware plans (ESA/MBTA/CWA) with NRCS alignment</li>
              <li>Clear success metrics and seasonal reporting</li>
              <li>Native sourcing and specification leadership</li>
              <li>Coastal, riverine, and upland expertise</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
            viewport={{ once: true }}
            className="aspect-[4/3] rounded-2xl bg-[url('https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center shadow-xl"
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
                  <p className="text-emerald-200">Southeastern U.S. • Coastal to upland systems</p>
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
