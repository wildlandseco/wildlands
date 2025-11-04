import { supabaseServer } from "@/lib/supabaseServer";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = supabaseServer();
  const { data: project } = await supabase
    .from('projects')
    .select('id,title,location,acreage,objective,status,created_at')
    .eq('id', params.id)
    .single();

  const { data: tasks } = await supabase
    .from('tasks')
    .select('id,title,details,status,due_date,created_at')
    .eq('project_id', params.id)
    .order('created_at', { ascending: false });

  const { data: files } = await supabase
    .from('files')
    .select('id,label,path,created_at')
    .eq('project_id', params.id)
    .order('created_at', { ascending: false });

  if (!project) return <p>Project not found.</p>;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white border rounded p-4">
          <h1 className="text-lg font-semibold">{project.title}</h1>
          <p className="text-sm text-gray-600">{project.location} • {project.status}</p>
          {project.objective && <p className="mt-2">{project.objective}</p>}
        </div>

        <div className="bg-white border rounded p-4 mt-4">
          <h2 className="font-semibold">Tasks</h2>
          <ul className="mt-2 grid gap-2">
            {tasks?.map(t => (
              <li key={t.id} className="border rounded p-3">
                <div className="font-medium">{t.title}</div>
                {t.details && <p className="text-sm text-gray-700">{t.details}</p>}
                <div className="text-xs text-gray-500 mt-1">{t.status}{t.due_date ? ` • due ${t.due_date}` : ""}</div>
              </li>
            )) || <p className="text-sm text-gray-600">No tasks yet.</p>}
          </ul>
          <form action={`/api/tasks?project=${project.id}`} method="post" className="mt-3 grid gap-2">
            <input className="border rounded p-2" name="title" placeholder="New task title" required />
            <textarea className="border rounded p-2" name="details" placeholder="Details (optional)" />
            <button className="rounded bg-emerald-700 text-white px-3 py-2 text-sm w-fit">Add Task</button>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border rounded p-4">
          <h2 className="font-semibold">Files</h2>
          <ul className="mt-2 grid gap-2">
            {files?.map(f => (
              <li key={f.id} className="flex items-center justify-between border rounded p-2">
                <span className="text-sm">{f.label || f.path}</span>
                <a className="text-emerald-700 text-sm" href={`/api/files/get?path=${encodeURIComponent(f.path)}`}>Download</a>
              </li>
            )) || <p className="text-sm text-gray-600">No files yet.</p>}
          </ul>

          {/* Upload */}
          <form action={`/api/files/upload?project=${project.id}`} method="post" encType="multipart/form-data" className="mt-3 grid gap-2">
            <input type="file" name="file" required />
            <input className="border rounded p-2" name="label" placeholder="Label (e.g., Map, Plan, Invoice)" />
            <button className="rounded bg-emerald-700 text-white px-3 py-2 text-sm w-fit">Upload</button>
          </form>
        </div>
      </div>
    </div>
  );
}
