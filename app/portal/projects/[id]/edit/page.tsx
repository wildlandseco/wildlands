import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function EditProject({ params }: { params: { id: string } }) {
  const supabase = await supabaseServer();
  const { data: p } = await supabase.from("projects")
    .select("id,title,location,acreage,objective,status")
    .eq("id", params.id).single();
  if (!p) return <p>Project not found.</p>;

  return (
    <form action={update} className="max-w-xl bg-white border rounded p-5 grid gap-3">
      <h1 className="text-lg font-semibold">Edit Project</h1>
      <input name="id" defaultValue={p.id} hidden readOnly />
      <input name="title" defaultValue={p.title || ""} required className="border rounded p-2" />
      <input name="location" defaultValue={p.location || ""} className="border rounded p-2" />
      <input name="acreage" defaultValue={p.acreage ?? ""} type="number" step="0.01" className="border rounded p-2" />
      <textarea name="objective" defaultValue={p.objective || ""} className="border rounded p-2" />
      <select name="status" defaultValue={p.status || "planning"} className="border rounded p-2">
        <option value="planning">Planning</option>
        <option value="active">Active</option>
        <option value="monitor">Monitor</option>
        <option value="complete">Complete</option>
      </select>
      <button className="rounded bg-emerald-700 text-white px-4 py-2 w-fit">Save</button>
    </form>
  );
}

async function update(formData: FormData) {
  "use server";
  const supabase = await supabaseServer();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "").slice(0,200);
  const location = String(formData.get("location") || "").slice(0,200);
  const acreage = Number(formData.get("acreage") || 0);
  const objective = String(formData.get("objective") || "").slice(0,5000);
  const status = String(formData.get("status") || "planning");

  const { error } = await supabase
    .from("projects")
    .update({ title, location, acreage, objective, status })
    .eq("id", id);
  if (error) throw new Error(error.message);

  redirect(`/portal/projects/${id}`);
}
