import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Plus, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProjects, type Project } from "@/data/content";

export const Route = createFileRoute("/admin/projects")({
  ssr: false,
  component: AdminProjects,
});

const STATUSES = ["Open", "Upcoming", "Closed"] as const;
const TYPES = ["Youth Exchange", "Training Course", "KA2", "ESC", "Local"];

function blank(): Partial<Project> {
  return {
    slug: "",
    title: "",
    type: "Youth Exchange",
    country: "",
    dates: "",
    deadline: "Rolling",
    participants: 5,
    summary: "",
    topics: [],
    status: "Open",
    sort_order: 0,
  };
}

function AdminProjects() {
  const qc = useQueryClient();
  const { data: projects = [], isLoading } = useProjects();
  const [editing, setEditing] = useState<Partial<Project> | null>(null);

  async function save() {
    if (!editing) return;
    const payload = {
      ...editing,
      topics: typeof editing.topics === "string" ? (editing.topics as any).split(",").map((t: string) => t.trim()).filter(Boolean) : editing.topics ?? [],
      participants: Number(editing.participants ?? 0),
      sort_order: Number(editing.sort_order ?? 0),
    };
    const { id, ...rest } = payload as any;
    const res = id
      ? await supabase.from("projects").update(rest).eq("id", id)
      : await supabase.from("projects").insert(rest);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["projects"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["projects"] });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Projects</h2>
        <button onClick={() => setEditing(blank())} className="btn-pop !px-4 !py-2 text-sm">
          <Plus className="h-4 w-4" /> Add project
        </button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border-2 border-foreground">
          <table className="w-full text-sm">
            <thead className="bg-accent text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Country</th>
                <th className="p-3">Status</th>
                <th className="p-3">Sort</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-t border-foreground/15">
                  <td className="p-3 font-semibold">{p.title}</td>
                  <td className="p-3">{p.type}</td>
                  <td className="p-3">{p.country}</td>
                  <td className="p-3">{p.status}</td>
                  <td className="p-3">{p.sort_order}</td>
                  <td className="flex justify-end gap-2 p-3">
                    <button onClick={() => setEditing(p)} className="rounded-full border-2 border-foreground px-3 py-1 text-xs">Edit</button>
                    <button onClick={() => remove(p.id)} className="rounded-full border-2 border-foreground bg-red-500 px-3 py-1 text-xs text-white">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border-2 border-foreground bg-background p-6" style={{ boxShadow: "var(--shadow-pop)" }}>
            <h3 className="font-display text-xl font-bold">{(editing as any).id ? "Edit project" : "New project"}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <L label="Title"><input className="adm-input" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></L>
              <L label="Slug (URL)"><input className="adm-input" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></L>
              <L label="Type"><select className="adm-input" value={editing.type ?? ""} onChange={(e) => setEditing({ ...editing, type: e.target.value })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></L>
              <L label="Status"><select className="adm-input" value={editing.status ?? "Open"} onChange={(e) => setEditing({ ...editing, status: e.target.value as any })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></L>
              <L label="Country / City"><input className="adm-input" value={editing.country ?? ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} /></L>
              <L label="Dates"><input className="adm-input" value={editing.dates ?? ""} onChange={(e) => setEditing({ ...editing, dates: e.target.value })} /></L>
              <L label="Deadline"><input className="adm-input" value={editing.deadline ?? ""} onChange={(e) => setEditing({ ...editing, deadline: e.target.value })} /></L>
              <L label="Participants"><input type="number" className="adm-input" value={editing.participants ?? 0} onChange={(e) => setEditing({ ...editing, participants: Number(e.target.value) })} /></L>
              <L label="Sort order (lower = first)"><input type="number" className="adm-input" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></L>
              <L label="Topics (comma separated)" wide><input className="adm-input" value={Array.isArray(editing.topics) ? editing.topics.join(", ") : (editing.topics as any) ?? ""} onChange={(e) => setEditing({ ...editing, topics: e.target.value as any })} /></L>
              <L label="Summary" wide><textarea rows={5} className="adm-input" value={editing.summary ?? ""} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></L>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-full border-2 border-foreground px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} className="btn-pop !px-4 !py-2 text-sm"><Save className="h-4 w-4" /> Save</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.adm-input{width:100%;border:2px solid var(--ink);border-radius:0.5rem;padding:0.45rem 0.65rem;font-size:0.9rem;background:var(--background)}`}</style>
    </div>
  );
}

function L({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-semibold">{label}</span>
      {children}
    </label>
  );
}
