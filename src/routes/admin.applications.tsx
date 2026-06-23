import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, X, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Application } from "@/data/content";

export const Route = createFileRoute("/admin/applications")({
  ssr: false,
  component: AdminApplications,
});

const TABS = ["pending", "accepted", "rejected", "all"] as const;

function useApplications() {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Application[];
    },
  });
}

function AdminApplications() {
  const qc = useQueryClient();
  const { data: apps = [], isLoading } = useApplications();
  const [tab, setTab] = useState<(typeof TABS)[number]>("pending");
  const [expanded, setExpanded] = useState<string | null>(null);

  const list = useMemo(
    () => (tab === "all" ? apps : apps.filter((a) => a.status === tab)),
    [apps, tab],
  );
  const counts = useMemo(() => ({
    pending: apps.filter((a) => a.status === "pending").length,
    accepted: apps.filter((a) => a.status === "accepted").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
    all: apps.length,
  }), [apps]);

  async function setStatus(id: string, status: Application["status"]) {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    qc.invalidateQueries({ queryKey: ["applications"] });
  }
  async function remove(id: string) {
    if (!confirm("Eliminate this application permanently?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Eliminated");
    qc.invalidateQueries({ queryKey: ["applications"] });
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold">Project applications</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Review submitted applications. Accept the ones you want to send; reject or eliminate the rest.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border-2 border-foreground px-3 py-1.5 text-xs font-semibold capitalize ${
              tab === t ? "bg-foreground text-background" : "bg-background hover:bg-accent"
            }`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-6">Loading…</p>
      ) : list.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No applications in this category.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.map((a) => {
            const isOpen = expanded === a.id;
            return (
              <li key={a.id} className="rounded-2xl border-2 border-foreground bg-background">
                <button onClick={() => setExpanded(isOpen ? null : a.id)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      {new Date(a.created_at).toLocaleString()} · {a.project_title}
                    </p>
                    <p className="font-display text-lg font-bold">{a.full_name} — {a.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge s={a.status} />
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t-2 border-foreground/15 p-4 text-sm">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Info k="Phone" v={a.phone} />
                      <Info k="City" v={a.city} />
                      <Info k="Birthdate" v={a.birthdate} />
                      <Info k="Passport" v={a.passport_type} />
                      <Info k="Passport expiry" v={a.passport_expiry} />
                      <Info k="English level" v={a.english_level} />
                      <Info k="Previous projects" v={String(a.previous_projects ?? "")} />
                      <Info k="Age consent" v={a.consent_age} />
                      <Info k="Followed IG" v={a.follow_ig ? "Yes" : "No"} />
                      <Info k="Followed WA" v={a.follow_wa ? "Yes" : "No"} />
                    </div>
                    {a.barriers && a.barriers.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-bold uppercase text-muted-foreground">Barriers</p>
                        <ul className="mt-1 list-disc pl-5">
                          {a.barriers.map((b, i) => <li key={i}>{b}</li>)}
                        </ul>
                      </div>
                    )}
                    <div className="mt-3">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Motivation</p>
                      <p className="whitespace-pre-line">{a.motivation}</p>
                    </div>
                    {a.ngo_experience && (
                      <div className="mt-3">
                        <p className="text-xs font-bold uppercase text-muted-foreground">NGO experience</p>
                        <p className="whitespace-pre-line">{a.ngo_experience}</p>
                      </div>
                    )}

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button onClick={() => setStatus(a.id, "accepted")} className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">
                        <Check className="h-3.5 w-3.5" /> Accept
                      </button>
                      <button onClick={() => setStatus(a.id, "rejected")} className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white">
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                      <button onClick={() => setStatus(a.id, "pending")} className="inline-flex items-center gap-1 rounded-full border-2 border-foreground px-3 py-1.5 text-xs font-semibold">
                        Move to pending
                      </button>
                      <button onClick={() => remove(a.id)} className="ml-auto inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white">
                        <Trash2 className="h-3.5 w-3.5" /> Eliminate
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Info({ k, v }: { k: string; v: string | null | undefined }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-muted-foreground">{k}</p>
      <p>{v || "—"}</p>
    </div>
  );
}

function StatusBadge({ s }: { s: Application["status"] }) {
  const map: Record<string, string> = {
    pending: "bg-accent text-foreground",
    accepted: "bg-green-600 text-white",
    rejected: "bg-orange-500 text-white",
  };
  return <span className={`rounded-full border-2 border-foreground px-2.5 py-0.5 text-xs font-bold uppercase ${map[s]}`}>{s}</span>;
}
