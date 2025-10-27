"use client";
import { useState } from "react";
import Turnstile from "@/components/Turnstile";

export default function Page() {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"ok"|"error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending"); setErr("");
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ ...payload, turnstileToken })
    });
    const json = await res.json();
    if (json.ok) setStatus("ok");
    else { setStatus("error"); setErr(json.error || "Submission failed"); }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-700 text-white grid place-items-center font-bold">WL</div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-emerald-700">Wild Lands</p>
              <h1 className="font-semibold leading-none">Ecological Services</h1>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#services" className="hover:text-emerald-700">Services</a>
            <a href="#approach" className="hover:text-emerald-700">Approach</a>
            <a href="#work" className="hover:text-emerald-700">Projects</a>
            <a href="#about" className="hover:text-emerald-700">About</a>
            <a href="#contact" className="hover:text-emerald-700">Contact</a>
          </nav>
          <a href="#contact" className="hidden md:inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800">Start a Project</a>
        </div>
      </header>

      {/* HERO – high-contrast brand block */}
      <section className="bg-emerald-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-14 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-widest text-xs text-emerald-200 mb-3">Science-forward habitat solutions</p>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Smart, effective land and wildlife management—built on measurable results
            </h2>
            <p className="mt-5 text-lg text-emerald-100">
              We plan, implement, and monitor restoration across coastal estuaries, river corridors, wetlands, and upland pine–oak systems.
              Our team turns data into decisions—so your acres return more habitat, resilience, and recreational value.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-white text-emerald-900 hover:bg-emerald-50">Request a consult</a>
              <a href="#services" className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold ring-1 ring-inset ring-emerald-300 text-white/90 hover:text-white">Explore services</a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              {["Data-driven planning","Compliance-ready deliverables","Native-first design","Coastal-to-upland expertise"].map((t,i)=>(
                <div key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center shadow-2xl border border-white/10" />
          </div>
        </div>
      </section>

      {/* SERVICES – clean white block */}
      <section id="services" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="uppercase tracking-widest text-xs text-emerald-700 mb-2">What we do</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Wildlife & Habitat Services</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {t:"Riparian & wetland restoration", d:"Channel/floodplain reconnection, buffer design, wetland enhancement for waterfowl and aquatic species."},
              {t:"Upland pine–oak savannah", d:"Stand improvement, prescribed fire planning, native grass/forb establishment for game and nongame."},
              {t:"Agricultural conversions", d:"From row-crop or turf to native habitat and conservation easements with funding alignment."},
              {t:"Post-industrial reforestation", d:"Soil prep, species selection, and successional planning to return function to disturbed sites."},
              {t:"Wildlife enterprise planning", d:"Habitat + access + experience design for hunting, fishing, and ecotourism operations."},
              {t:"Monitoring & compliance", d:"ESA/MBTA/CWA-aware plans, field monitoring, mapping, and reporting for agency standards."},
            ].map((card,i)=>(
              <div key={i} className="rounded-2xl border bg-white shadow-sm"><div className="p-6">
                <h3 className="font-semibold text-lg">{card.t}</h3>
                <p className="text-sm text-gray-600 mt-2">{card.d}</p>
              </div></div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH – subtle gray block */}
      <section id="approach" className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="uppercase tracking-widest text-xs text-emerald-700 mb-2">How we work</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">An Adaptive, Investment-Minded Method</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[{t:"Assess",d:"On-site surveys, soils/hydrology review, and baseline wildlife/habitat inventories."},
              {t:"Plan",d:"Scenario planning with clear targets, budgets, and success metrics."},
              {t:"Implement & monitor",d:"Contractor oversight, native installs, and seasonal monitoring with annual reports."}]
              .map((s,i)=>(
                <div key={i} className="rounded-2xl border bg-white shadow-sm"><div className="p-6">
                  <h3 className="font-semibold text-lg">{s.t}</h3>
                  <p className="text-sm text-gray-600 mt-2">{s.d}</p>
                </div></div>
              ))}
          </div>
        </div>
      </section>

      {/* PROJECTS – white block */}
      <section id="work" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="uppercase tracking-widest text-xs text-emerald-700 mb-2">Selected projects</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Recent Work Across the Southeast</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {img:"https://images.unsplash.com/photo-1524790672308-46bbd6e19f5e?q=80&w=1200&auto=format&fit=crop", title:"Farmland to Easement", tag:"MS Gulf Coastal Plain"},
              {img:"https://images.unsplash.com/photo-1465397792955-1492b20f0f53?q=80&w=1200&auto=format&fit=crop", title:"Waterfowl Wetland Enhancement", tag:"Black Belt, AL"},
              {img:"https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=1200&auto=format&fit=crop", title:"Post-Industrial Reforestation", tag:"Metro Atlanta, GA"},
              {img:"https://images.unsplash.com/photo-1545243424-0ce743321e11?q=80&w=1200&auto=format&fit=crop", title:"Riparian Buffer Rebuild", tag:"Tennessee Valley"},
              {img:"https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop", title:"Native Pine–Oak Savannah", tag:"Huntsville Uplands, AL"},
              {img:"https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1200&auto=format&fit=crop", title:"Upland Quail Habitat", tag:"Appalachian Foothills"},
            ].map((p,i)=>(
              <div key={i} className="rounded-2xl overflow-hidden border bg-white shadow-sm">
                <div className="aspect-[4/3] bg-gray-100">
                  <img src={p.img} alt="Project" className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base">{p.title}</h3>
                  <p className="text-xs text-gray-600">{p.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT – brand-tinted block */}
      <section id="about" className="bg-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-widest text-xs text-emerald-700 mb-2">Who we are</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Biologists, Builders, and Good Neighbors</h2>
            <p className="mt-4 text-gray-700">
              Wild Lands Ecological Services is a field-first team delivering restoration and wildlife management across the Southeast.
              We pair practical experience with rigorous monitoring—so landowners, tribes, and partners see exactly what their
              investment returns in habitat function and recreational value.
            </p>
            <ul className="mt-6 grid gap-2 text-sm text-gray-800">
              <li>Permitting-aware plans (ESA/MBTA/CWA)</li>
              <li>Clear success metrics & reporting</li>
              <li>Native species sourcing & specifications</li>
              <li>Coastal, riverine, and upland expertise</li>
            </ul>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-[url('https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center shadow-xl" />
        </div>
      </section>

      {/* CONTACT – dark block for conversion */}
      <section id="contact" className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="uppercase tracking-widest text-xs text-emerald-300 mb-2">Start a project</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Tell Us About Your Land</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-white text-neutral-900 shadow-sm">
              <div className="p-6">
                <form onSubmit={onSubmit} className="grid gap-4">
                  <input name="name" placeholder="Full name" required className="border p-3 rounded" />
                  <input name="email" type="email" placeholder="Email" required className="border p-3 rounded" />
                  <input name="phone" placeholder="Phone" className="border p-3 rounded" />
                  <input name="location" placeholder="Property location (city, state)" className="border p-3 rounded" />
                  <textarea name="message" placeholder="Goals & challenges (e.g., quail habitat, wetland enhancement, easement)" rows={5} className="border p-3 rounded" />
                  <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string} onVerify={setTurnstileToken} />
                  <button disabled={!turnstileToken || status==="sending"} className="inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800">
                    {status==="sending" ? "Sending…" : "Submit"}
                  </button>
                  {status==="ok" && <p className="text-emerald-600">Thanks — we’ll be in touch shortly.</p>}
                  {status==="error" && <p className="text-red-600">There was a problem: {err}</p>}
                </form>
                <p className="text-xs text-gray-500 mt-3">By submitting, you agree to be contacted about services. We respect your privacy.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-800">
              <div className="p-6 grid gap-4 text-sm">
                <div>
                  <p className="font-medium text-white">Email</p>
                  <a href="mailto:info@wildlandseco.com" className="text-emerald-300 hover:underline">info@wildlandseco.com</a>
                </div>
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <a href="tel:+18656217555" className="text-emerald-300 hover:underline">(865) 621-7555</a>
                </div>
                <div>
                  <p className="font-medium text-white">Service area</p>
                  <p className="text-emerald-200">Southeastern U.S. • Coastal to upland systems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {new Date().getFullYear()} Wild Lands Ecological Services. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#services" className="hover:text-emerald-700">Services</a>
            <a href="#approach" className="hover:text-emerald-700">Approach</a>
            <a href="#contact" className="hover:text-emerald-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
