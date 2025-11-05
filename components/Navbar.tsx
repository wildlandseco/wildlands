// components/Navbar.tsx
export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-base font-semibold text-emerald-800">Wild Lands</a>
        <nav className="flex items-center gap-6">
          {/* Keep it minimal to avoid changing existing page copy */}
          <a
            href="/portal/login"
            className="inline-flex items-center rounded-md border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-700 hover:text-white transition-colors"
          >
            Client Portal
          </a>
        </nav>
      </div>
    </header>
  );
}
