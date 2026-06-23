import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAboutSections, type AboutSection } from "@/data/content";

export const Route = createFileRoute("/admin/about")({
  ssr: false,
  component: AdminAbout,
});

const KEYS = [
  { key: "mission", title: "Our mission" },
  { key: "activities", title: "Our activities" },
  { key: "founder", title: "About the founder" },
];

function AdminAbout() {
  const qc = useQueryClient();
  const { data = [] } = useAboutSections();
  const [local, setLocal] = useState<Record<string, AboutSection>>({});

  useEffect(() => {
    const map: Record<string, AboutSection> = {};
    KEYS.forEach((k) => {
      const found = data.find((s) => s.key === k.key);
      map[k.key] = found ?? { key: k.key, title: k.title, content: "" };
    });
    setLocal(map);
  }, [data]);

  async function saveOne(key: string) {
    const row = local[key];
    if (!row) return;
    const { error } = await supabase
      .from("about_sections")
      .upsert({ key: row.key, title: row.title, content: row.content });
    if (error) return toast.error(error.message);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["about_sections"] });
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">About page content</h2>
      <p className="mt-1 text-sm text-muted-foreground">Edit the public "About" page sections.</p>

      <div className="mt-6 space-y-6">
        {KEYS.map(({ key }) => {
          const row = local[key];
          if (!row) return null;
          return (
            <div key={key} className="rounded-2xl border-2 border-foreground p-5">
              <label className="block">
                <span className="text-xs font-bold uppercase">Section title</span>
                <input className="adm-input mt-1" value={row.title}
                  onChange={(e) => setLocal({ ...local, [key]: { ...row, title: e.target.value } })} />
              </label>
              <label className="mt-3 block">
                <span className="text-xs font-bold uppercase">Content</span>
                <textarea rows={7} className="adm-input mt-1"
                  value={row.content}
                  onChange={(e) => setLocal({ ...local, [key]: { ...row, content: e.target.value } })} />
              </label>
              <div className="mt-3 flex justify-end">
                <button onClick={() => saveOne(key)} className="btn-pop !px-4 !py-2 text-sm"><Save className="h-4 w-4" /> Save</button>
              </div>
            </div>
          );
        })}
      </div>
      <style>{`.adm-input{width:100%;border:2px solid var(--ink);border-radius:0.5rem;padding:0.45rem 0.65rem;font-size:0.9rem;background:var(--background)}`}</style>
    </div>
  );
}
