// components/Navbar.tsx
"use client";

import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 relative">
            <Image
              src="/logo-wildlands.png"
              alt="Wild Lands Logo"
              fill
              sizes="80px"
              className="object-contain"
              priority
            />
          </div>
          <div>
            <p className="font-semibold text-[20px] uppercase tracking-widest text-emerald-700">
              Wild Lands
            </p>
            <h1 className="font-regular leading-none text-neutral-700">
              Ecological Services
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#services" className="hover:text-emerald-700">Services</a>
          <a href="#approach" className="hover:text-emerald-700">Approach</a>
          <a href="#work" className="hover:text-emerald-700">Projects</a>
          <a href="#about" className="hover:text-emerald-700">About</a>
          <a href="/blog" className="hover:text-emerald-700">Knowledge</a>
          <a href="#contact" className="hover:text-emerald-700">Contact</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
          >
            Request a Consult
          </a>
          <a
            href="/portal/login"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-colors"
          >
            Client Portal
          </a>
        </div>
      </div>
    </header>
  );
}
