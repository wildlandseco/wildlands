export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-7xl p-4 flex items-center justify-between">
          <h1 className="font-semibold">Wild Lands — Client Portal</h1>
          <nav className="text-sm flex gap-6">
            <a href="/portal">Dashboard</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-4">{children}</main>
    </div>
  );
}
