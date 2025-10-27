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
    const res = await fetch("/api/contact", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ ...payload, turnstileToken }) });
    const json = await res.json();
    if (json.ok) setStatus("ok"); else { setStatus("error"); setErr(json.error || "Submission failed"); }
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-700 text-white grid place-items-center font-bold">WL</div>
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-700">Wild Lands</p>
              <h1 className="font-semibold">Ecological Services</h1>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a href="#services" className="hover:text-emerald-700">Services</a>
            <a href="#approach" className="hover:text-emerald-700">Approach</a>
            <a href="#work" className="hover:text-emerald-700">Projects</a>
            <a href="#about" className="hover:text-emerald-700">About</a>
            <a href="#contact" className="hover:text-emerald-700">Contact</a>
          </nav>
          <a href="#contact" className="btn btn-primary hidden md:inline-flex">Start a Project</a>
        </div>
      </header>

      {/* Hero */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-white -z-10"/>
        <div className="container pt-16 md:pt-24 pb-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="h2-kicker">Science-forward habitat solutions</p>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Smart, effective land and wildlife management—built on measurable results</h2>
            <p className="mt-4 text-lg text-gray-600">We plan, implement, and monitor restoration across coastal estuaries, river corridors, wetlands, and upland pine–oak systems. Our team turns data into decisions—so your acres return more habitat, resilience, and recreational value.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#contact" className="btn btn-primary">Request a consult</a>
              <a href="#services" className="btn btn-outline">Explore services</a>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
              <div className="flex items-center gap-2">📈 Data-driven plans</div>
              <div className="flex items-center gap-2">✅ Compliance-ready</div>
              <div className="flex items-center gap-2">🌱 Native-first design</div>
              <div className="flex items-center gap-2">🌊 Coastal to upland</div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center shadow-xl"/>
          </div>
        </div>
      </div>

      {/* Services */}
      <section id="services" className="container py-12 md:py-20">
        <div className="h2-wrap"><p className="h2-kicker">What we do</p><h2 className="h2">Wildlife & habitat services</h2></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {["Riparian & wetland restoration","Upland pine–oak savannah","Agricultural conversions","Post-industrial reforestation","Wildlife enterprise planning","Monitoring & compliance"].map((title,i)=> (
            <div key={i} className="card"><div className="card-body">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {[
                  "Channel and floodplain reconnection, buffer design, wetland enhancement for waterfowl and aquatic species.",
                  "Stand improvement, prescribed fire planning, native grass/forb establishment for game and nongame.",
                  "From row-crop or turf to native habitat and conservation easements with funding alignment.",
                  "Soil prep, species selection, and successional planning to return function to disturbed sites.",
                  "Habitat + access + experience design for hunting, fishing, and ecotourism operations.",
                  "ESA/MBTA/CWA-aware plans, field monitoring, mapping, and reporting for agency standards.",
                ][i]}</p>
            </div></div>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section id="approach" className="container py-12 md:py-20">
        <div className="h2-wrap"><p className="h2-kicker">How we work</p><h2 className="h2">An adaptive, investment‑minded approach</h2></div>
        <div className="grid md:grid-cols-3 gap-6">
          {[{t:"Assess",d:"On‑site surveys, soils/hydrology review, and baseline wildlife/habitat inventories."},{t:"Plan",d:"Scenario planning with clear targets, budgets, and success metrics."},{t:"Implement & monitor",d:"Contractor oversight, native installs, and seasonal monitoring with annual reports."}].map((s,i)=> (
            <div className="card" key={i}><div className="card-body"><h3 className="font-semibold">{s.t}</h3><p className="text-sm text-gray-600 mt-1">{s.d}</p></div></div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="work" className="container py-12 md:py-20">
        <div className="h2-wrap"><p className="h2-kicker">Selected projects</p><h2 className="h2">Recent work across the Southeast</h2></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {img:"https://images.unsplash.com/photo-1524790672308-46bbd6e19f5e?q=80&w=1200&auto=format&fit=crop", title:"Farmland to easement", tag:"MS Gulf Coastal Plain"},
            {img:"https://images.unsplash.com/photo-1465397792955-1492b20f0f53?q=80&w=1200&auto=format&fit=crop", title:"Waterfowl wetland enhancement", tag:"Black Belt, AL"},
            {img:"https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=1200&auto=format&fit=crop", title:"Post‑industrial reforestation", tag:"Metro Atlanta, GA"},
            {img:"https://images.unsplash.com/photo-1545243424-0ce743321e11?q=80&w=1200&auto=format&fit=crop", title:"Riparian buffer rebuild", tag:"Tennessee Valley"},
            {img:"https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1200&auto=format&fit=crop", title:"Native pine–oak savannah", tag:"Huntsville uplands, AL"},
            {img:"https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1200&auto=format&fit=crop", title:"Upland quail habitat", tag:"Appalachian foothills"},
          ].map((p,i)=> (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-[4/3] bg-gray-100"><img src={p.img} alt="Project" className="h-full w-full object-cover"/></div>
              <div className="card-body"><h3 className="font-semibold text-base">{p.title}</h3><p className="text-xs text-gray-600">{p.tag}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="container py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="h2-wrap"><p className="h2-kicker">Who we are</p><h2 className="h2">Biologists, builders, and good neighbors</h2></div>
            <p className="text-gray-600">Wild Lands Ecological Services is a field‑first team delivering restoration and wildlife management across the Southeast. We pair practical experience with rigorous monitoring—so landowners, tribes, and partners see exactly what their investment returns in habitat function and recreational value.</p>
            <ul className="mt-6 grid gap-3 text-sm">
              <li>✅ Permitting‑aware plans (ESA/MBTA/CWA)</li>
              <li>📈 Clear success metrics & reporting</li>
              <li>🌱 Native species sourcing & specs</li>
              <li>🌊 Coastal, riverine, and upland expertise</li>
            </ul>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-[url('https://images.unsplash.com/photo-1439853949127-fa647821eba0?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center shadow-xl"/>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="container py-12 md:py-20">
        <div className="h2-wrap"><p className="h2-kicker">Start a project</p><h2 className="h2">Tell us about your land</h2></div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card"><div className="card-body">
            <form onSubmit={onSubmit} className="grid gap-4">
              <input name="name" placeholder="Full name" required className="border p-3 rounded" />
              <input name="email" type="email" placeholder="Email" required className="border p-3 rounded" />
              <input name="phone" placeholder="Phone" className="border p-3 rounded" />
              <input name="location" placeholder="Property location (city, state)" className="border p-3 rounded" />
              <textarea name="message" placeholder="Goals & challenges (e.g., quail habitat, wetland enhancement, easement)" rows={5} className="border p-3 rounded" />
              <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string} onVerify={setTurnstileToken} />
              <button disabled={!turnstileToken || status==="sending"} className="btn btn-primary">
                {status==="sending" ? "Sending…" : "Submit"}
              </button>
              {status==="ok" && <p className="text-emerald-700">Thanks—We’ll be in touch shortly.</p>}
              {status==="error" && <p className="text-red-600">There was a problem: {err}</p>}
            </form>
            <p className="text-xs text-gray-500 mt-3">By submitting, you agree to be contacted about services. We respect your privacy.</p>
          </div></div>
          <div className="card"><div className="card-body">
            <div className="grid gap-4 text-sm">
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:info@wildlandseco.com" className="text-emerald-700 hover:underline">info@wildlandseco.com</a>
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <a href="tel:+18656217555" className="text-emerald-700 hover:underline">(865) 621-7555</a>
              </div>
              <div>
                <p className="font-medium">Service area</p>
                <p className="text-gray-600">Southeastern U.S. • Coastal to upland systems</p>
              </div>
            </div>
          </div></div>
        </div>
      </section>

      <footer className="border-t mt-16">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
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