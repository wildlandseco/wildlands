import { supabaseServer } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

/** ----- Playbook templates (edit to taste) ----- **/

type Task = { title: string; notes?: string; dueOffsetDays?: number };
type PracticeRef = { program: "EQIP"|"CRP"|"ACEP-WRE"; code?: string|null; title?: string; quantity?: number; unit?: string; estRate?: number; notes?: string; deadlineOffsetDays?: number };

type Playbook = {
  label: string;
  key: string;
  tasks: Task[];
  practices: PracticeRef[];
};

const PLAYBOOKS: Playbook[] = [
  {
    key: "upland-habitat",
    label: "Upland Habitat (Disturbance-based)",
    tasks: [
      { title: "Baseline vegetation & structure assessment", notes: "Plots/transects, photo points.", dueOffsetDays: 14 },
      { title: "Fuel & ladder analysis + thinning prescription", notes: "Target basal area, leave trees, regen patches.", dueOffsetDays: 21 },
      { title: "Prescribed fire plan & burn unit map", notes: "Seasonality, return interval, control lines.", dueOffsetDays: 28 },
      { title: "Native forb/grass establishment plan", notes: "Species list, rates, vendor sourcing.", dueOffsetDays: 35 },
      { title: "Game camera + call point monitoring setup", notes: "Quail, songbirds, small mammals baseline.", dueOffsetDays: 45 },
    ],
    practices: [
      { program: "EQIP", code: "647", title: "Early Successional Habitat", quantity: 40, unit: "ac", estRate: 150 },
      { program: "EQIP", code: "314", title: "Brush Management", quantity: 25, unit: "ac", estRate: 120 },
    ],
  },
  {
    key: "riparian-buffer",
    label: "Riparian Buffer (Bank Stabilization + Shade)",
    tasks: [
      { title: "Stream reach assessment", notes: "Bank height ratio, BEHI/Rosgen notes, buffer width targets.", dueOffsetDays: 14 },
      { title: "Buffer layout & species plan", notes: "Native canopy/midstory/understory mix.", dueOffsetDays: 21 },
      { title: "Livestock exclusion / fence options", notes: "Crossings, off-channel water.", dueOffsetDays: 28 },
      { title: "Erosion control + live staking plan", notes: "Coir, fascines, willow/alders where appropriate.", dueOffsetDays: 28 },
      { title: "Shade & temperature monitoring plan", notes: "HOBO loggers, seasonal checks.", dueOffsetDays: 40 },
    ],
    practices: [
      { program: "CRP", code: "391", title: "Riparian Forest Buffer", quantity: 10, unit: "ac", estRate: 400 },
    ],
  },
  {
    key: "waterfowl-wetland",
    label: "Waterfowl Wetland (Hydro + Food Base)",
    tasks: [
      { title: "Hydrologic recon + topo review", notes: "Boards/structures, drawdown timing.", dueOffsetDays: 14 },
      { title: "Moist-soil plant community plan", notes: "Disking/mowing schedule, seed bank.", dueOffsetDays: 21 },
      { title: "Invasive control plan", notes: "Target species, intervals, monitoring.", dueOffsetDays: 28 },
      { title: "Water management calendar", notes: "Seasonal flooding, spring drawdown.", dueOffsetDays: 35 },
      { title: "Waterbird monitoring protocol", notes: "Monthly counts, photo points.", dueOffsetDays: 45 },
    ],
    practices: [
      { program: "ACEP-WRE", code: null, title: "Wetland Reserve Easement (restoration)", quantity: 30, unit: "ac", estRate: 0 },
      { program: "EQIP", code: "647", title: "Early Successional (moist-soil units)", quantity: 15, unit: "ac", estRate: 150 },
    ],
  },
];

/** ----- Helpers ----- **/

function addDays(base: Date, n?: number) {
  if (!n || n <= 0) return null;
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0,10);
}

/** ----- Page ----- **/

export default async function PlaybooksPage({ params }: { params: { id: string } }) {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/portal/login");

  // basic project check (also enforces RLS)
  const { data: project } = await supabase
    .from("projects")
    .select("id,title")
    .eq("id", params.id)
    .single();

  if (!project) return <div className="p-6">Project not found or access denied.</div>;

  async function applyPlaybook(formData: FormData) {
    "use server";
    const supa = await supabaseServer();
    const key = String(formData.get("key"));
    const projectId = String(formData.get("projectId"));
    const today = new Date();

    const pb = PLAYBOOKS.find(p => p.key === key);
    if (!pb) throw new Error("Unknown playbook");

    // Insert TASKS
    const tasksPayload = pb.tasks.map((t, idx) => ({
      project_id: projectId,
      title: t.title,
      notes: t.notes || null,
      order_index: idx,
      due_on: addDays(today, t.dueOffsetDays),
      status: "todo" as const
    }));
    const { error: taskErr } = await supa.from("tasks").insert(tasksPayload);
    if (taskErr) throw new Error(taskErr.message);

    // Resolve practice_id by program+code (fallback to title if needed)
    // fetch programs & practices once
    const { data: programs } = await supa.from("funding_programs").select("id,name");
    const { data: practices } = await supa.from("funding_practices").select("id,program_id,code,title,default_payment_rate,unit");

    const programByName = new Map(programs?.map(p => [p.name, p.id]));
    const projectPracticesPayload = pb.practices.map(pr => {
      const programId = programByName.get(pr.program) || null;
      const match = (pr.code)
        ? practices?.find(x => x.program_id === programId && x.code === pr.code)
        : practices?.find(x => x.program_id === programId && x.title === pr.title);

      const practice_id = match?.id ?? null;
      return {
        project_id: projectId,
        practice_id,
        custom_title: pr.title || null,
        quantity: pr.quantity ?? null,
        unit: pr.unit ?? (match?.unit ?? null),
        est_payment_rate: pr.estRate ?? (match?.default_payment_rate ?? null),
        status: "researching",
        deadline: addDays(today, pr.deadlineOffsetDays),
        notes: pr.notes ?? null
      };
    });

    const { error: ppErr } = await supa.from("project_practices").insert(projectPracticesPayload);
    if (ppErr) throw new Error(ppErr.message);

    redirect(`/portal/projects/${projectId}`);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Apply a Playbook</h1>
      <p className="text-sm text-gray-600 mb-6">
        Seed standardized tasks and funding practices for this project. You can edit everything later.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {PLAYBOOKS.map(pb => (
          <form action={applyPlaybook} key={pb.key} className="border rounded-xl p-4 bg-white grid gap-2">
            <input type="hidden" name="projectId" value={project.id} />
            <input type="hidden" name="key" value={pb.key} />
            <div>
              <h2 className="font-medium">{pb.label}</h2>
              <ul className="text-xs text-gray-600 list-disc pl-4 mt-1">
                <li>{pb.tasks.length} tasks</li>
                <li>{pb.practices.length} funding practice(s)</li>
              </ul>
            </div>
            <button className="justify-self-start mt-2 px-3 py-2 rounded bg-emerald-700 text-white text-sm hover:bg-emerald-800">
              Apply to Project
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
