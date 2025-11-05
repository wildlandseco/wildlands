// app/portal/page.tsx
import { supabaseServer } from "@/lib/supabaseServer";

export default async function PortalHome() {
  const supabase = supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Ensure profile exists (safe if id PK/unique)
  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: user.email ?? "User",
  });

  // List projects (tweak query to scope to the user if you add membership later)
  const { data: projects } = await supabase
    .from("projects")
    .select("id,title,location,status,created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <a
          href="/portal/projects/new"
          className="rounded bg-emerald-700 text-white px-3 py-2 text-sm"
        >
          New Project
        </a>
      </div>

      <div className="mt-4 grid gap-3">
        {projects && projects.length > 0 ? (
          projects.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded p-4 hover:border-emerald-300"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <a
                    href={`/portal/projects/${p.id}`}
                    className="font-medium hover:underline"
                  >
                    {p.title}
                  </a>
                  <div className="text-sm text-gray-600">
                    {p.location || "—"} • {p.status || "draft"}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/portal/projects/${p.id}`}
                    className="inline-flex items-center rounded px-3 py-2 text-sm border"
                  >
                    Open
                  </a>
                  <a
                    href={`/portal/projects/${p.id}/playbooks`}
                    className="inline-flex items-center rounded px-3 py-2 text-sm bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    Apply Playbook
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600">No projects yet.</p>
        )}
      </div>
    </div>
  );
}
