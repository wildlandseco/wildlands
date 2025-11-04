import { supabaseServer } from "@/lib/supabaseServer";

export default async function PortalHome() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // ensure profile
  await supabase.from('profiles').upsert({ id: user.id, full_name: user.email ?? 'User' });

  // projects where user is member or owner
  const { data: projects } = await supabase
    .from('projects')
    .select('id,title,location,status,created_at')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <a href="/portal/projects/new" className="rounded bg-emerald-700 text-white px-3 py-2 text-sm">New Project</a>
      </div>
      <div className="mt-4 grid gap-3">
        {projects?.map(p => (
          <a key={p.id} href={`/portal/projects/${p.id}`} className="bg-white border rounded p-4 hover:border-emerald-300">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">{p.location} • {p.status}</div>
          </a>
        )) || <p className="text-sm text-gray-600">No projects yet.</p>}
      </div>
    </div>
  );
}
<a
  href={`/portal/projects/${project.id}/playbooks`}
  className="inline-flex items-center rounded px-3 py-2 text-sm bg-emerald-700 text-white hover:bg-emerald-800"
>
  Apply Playbook
</a>
