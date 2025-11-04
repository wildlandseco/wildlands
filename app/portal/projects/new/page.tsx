import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default function NewProjectPage() {
  return (
    <form action={createProject} className="max-w-xl bg-white border rounded p-5 grid gap-3">
      <h1 className="text-lg font-semibold">New Project</h1>
      <input name="title" required placeholder="Title" className="border rounded p-2" />
      <input name="location" placeholder="Location (City, State)" className="border rounded p-2" />
      <input name="acreage" type="number" step="0.01" placeholder="Acreage" className="border rounded p-2" />
      <textarea name="objective" placeholder="Primary objectives..." className="border rounded p-2" />
      <button className="rounded bg-emerald-700 text-white px-4 py-2 w-fit">Create</button>
    </form>
  );
}

async function createProject(formData: FormData) {
  "use server";
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  const title = String(formData.get("title") || "").slice(0,200);
  const location = String(formData.get("location") || "").slice(0,200);
  const acreage = Number(formData.get("acreage") || 0);
  const objective = String(formData.get("objective") || "").slice(0,5000);

  // create project
  const { data: proj, error } = await supabase
    .from("projects")
    .insert({ owner_id: user.id, title, location, acreage, objective })
    .select("id")
    .single();
  if (error || !proj) throw new Error(error?.message || "Create failed");

  // add owner as member
  await supabase.from("project_members").insert({ project_id: proj.id, user_id: user.id, role: "owner" });

  redirect(`/portal/projects/${proj.id}`);
}
