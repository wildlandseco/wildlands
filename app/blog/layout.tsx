export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      {/* Optional hero */}
      <section className="border-b bg-emerald-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <p className="uppercase tracking-widest text-xs text-emerald-700 mb-2">Wild Lands</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Insights from the Field & the Policy Desk
          </h1>
          <p className="text-gray-700 mt-3 max-w-3xl">
            Practical guidance for landowners and deep dives on conservation policy—
            one voice, same stewardship mission.
          </p>
        </div>
      </section>
      {children}
    </div>
  );
}
