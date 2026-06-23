import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAnnouncements, type Announcement } from "@/data/content";

export const Route = createFileRoute("/admin/announcements")({
  ssr: false,
  component: AdminAnnouncements,
});

function blank(): Partial<Announcement> {
  return { slug: "", title: "", date: new Date().toISOString().slice(0, 10), tag: "News", excerpt: "" };
}

function AdminAnnouncements() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useAnnouncements();
  const [editing, setEditing] = useState<Partial<Announcement> | null>(null);

  async function save() {
    if (!editing) return;
    const { id, ...rest } = editing as any;
    const res = id ? await supabase.from("announcements").update(rest).eq("id", id) : await supabase.from("announcements").insert(rest);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["announcements"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["announcements"] });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">Announcements</h2>
        <button onClick={() => setEditing(blank())} className="btn-pop !px-4 !py-2 text-sm"><Plus className="h-4 w-4" /> Add</button>
      </div>
      {isLoading ? <p>Loading…</p> : (
        <ul className="space-y-3">
          {data.map((a) => (
            <li key={a.id} className="flex items-start justify-between gap-3 rounded-2xl border-2 border-foreground p-4">
              <div>
                <p className="text-xs font-bold uppercase">{a.tag} · {a.date}</p>
                <h3 className="font-display text-lg font-bold">{a.title}</h3>
                <p className="text-sm text-muted-foreground">{a.excerpt}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditing(a)} className="rounded-full border-2 border-foreground px-3 py-1 text-xs">Edit</button>
                <button onClick={() => remove(a.id)} className="rounded-full bg-red-500 px-3 py-1 text-xs text-white"><Trash2 className="h-3 w-3" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl rounded-3xl border-2 border-foreground bg-background p-6" style={{ boxShadow: "var(--shadow-pop)" }}>
            <h3 className="font-display text-xl font-bold">{(editing as any).id ? "Edit" : "New"} announcement</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <F label="Title" wide><input className="adm-input" value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></F>
              <F label="Slug"><input className="adm-input" value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></F>
              <F label="Tag"><input className="adm-input" value={editing.tag ?? ""} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} /></F>
              <F label="Date"><input type="date" className="adm-input" value={editing.date ?? ""} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></F>
              <F label="Excerpt" wide><textarea rows={4} className="adm-input" value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></F>
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

function F({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <label className={`block ${wide ? "sm:col-span-2" : ""}`}><span className="mb-1 block text-xs font-semibold">{label}</span>{children}</label>;
}
