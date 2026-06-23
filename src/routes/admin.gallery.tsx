import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGalleryItems } from "@/data/content";

export const Route = createFileRoute("/admin/gallery")({
  ssr: false,
  component: AdminGallery,
});

function AdminGallery() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useGalleryItems();
  const [src, setSrc] = useState("");
  const [alt, setAlt] = useState("");

  async function add() {
    if (!src) return toast.error("Image URL required");
    const sort_order = (data[data.length - 1]?.sort_order ?? 0) + 1;
    const { error } = await supabase.from("gallery_items").insert({ src, alt, sort_order });
    if (error) return toast.error(error.message);
    setSrc(""); setAlt("");
    qc.invalidateQueries({ queryKey: ["gallery"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this photo?")) return;
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["gallery"] });
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Gallery</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Add photos by URL. Tip: paste a direct image link (Instagram CDN, Google Drive direct link, etc.).
      </p>

      <div className="mt-4 grid gap-3 rounded-2xl border-2 border-foreground p-4 sm:grid-cols-[1fr_1fr_auto]">
        <input className="adm-input" placeholder="Image URL (https://…)" value={src} onChange={(e) => setSrc(e.target.value)} />
        <input className="adm-input" placeholder="Alt text" value={alt} onChange={(e) => setAlt(e.target.value)} />
        <button onClick={add} className="btn-pop !px-4 !py-2 text-sm"><Plus className="h-4 w-4" /> Add</button>
      </div>

      {isLoading ? (
        <p className="mt-6">Loading…</p>
      ) : data.length === 0 ? (
        <p className="mt-6 text-muted-foreground">No photos yet. The public gallery shows fallback images until you add some.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((g) => (
            <figure key={g.id} className="relative overflow-hidden rounded-2xl border-2 border-foreground">
              <img src={g.src} alt={g.alt} className="w-full" />
              <figcaption className="flex items-center justify-between gap-2 bg-background p-2 text-xs">
                <span className="truncate">{g.alt || g.src}</span>
                <button onClick={() => remove(g.id)} className="rounded-full bg-red-500 px-2 py-1 text-white"><Trash2 className="h-3 w-3" /></button>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <style>{`.adm-input{width:100%;border:2px solid var(--ink);border-radius:0.5rem;padding:0.45rem 0.65rem;font-size:0.9rem;background:var(--background)}`}</style>
    </div>
  );
}
