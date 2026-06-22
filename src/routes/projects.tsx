import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { projects, type Project } from "@/data/site";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & open calls — BEKGED" },
      {
        name: "description",
        content:
          "Browse open Erasmus+ youth exchanges, training courses and ESC volunteering with BEKGED, and apply directly through our online form.",
      },
      { property: "og:title", content: "Projects & open calls — BEKGED" },
    ],
  }),
  component: Projects,
});

const filters = ["All", "Open", "Upcoming", "Closed"] as const;

function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const list = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.status === filter)),
    [filter],
  );

  return (
    <>
      <Toaster />
      <section className="container-pad py-16 md:py-20">
        <span className="chip">Projects</span>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold md:text-6xl">
          Find your next Erasmus+ adventure.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Travel, food and accommodation are covered by the Erasmus+ programme. Pick a project, hit
          apply, and tell us a little about you.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border-2 border-foreground px-4 py-1.5 text-sm font-semibold transition-all ${
                filter === f ? "bg-foreground text-background" : "bg-background hover:bg-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="container-pad pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <article key={p.slug} className="card-pop flex flex-col">
              <div className="flex items-center justify-between">
                <span className="chip">{p.type}</span>
                <StatusPill status={p.status} />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {p.country} · {p.dates}
              </p>
              <p className="mt-3 flex-1 text-sm">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.topics.map((t) => (
                  <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-semibold text-primary">Deadline {p.deadline}</span>
                <button
                  onClick={() => setSelected(p)}
                  disabled={p.status === "Closed"}
                  className="btn-pop !px-4 !py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {p.status === "Closed" ? "Closed" : "Apply"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {selected && <ApplyModal project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function StatusPill({ status }: { status: Project["status"] }) {
  const map = {
    Open: { bg: "var(--secondary)", text: "white" },
    Upcoming: { bg: "var(--accent)", text: "var(--ink)" },
    Closed: { bg: "var(--muted)", text: "var(--muted-foreground)" },
  } as const;
  const s = map[status];
  return (
    <span
      className="rounded-full border-2 border-foreground px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
      style={{ background: s.bg, color: s.text }}
    >
      {status}
    </span>
  );
}

function ApplyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const motivation = String(data.get("motivation") || "").trim();

    if (!name || name.length > 100) return toast.error("Please add a valid name (max 100 chars).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Please add a valid email.");
    if (motivation.length < 20 || motivation.length > 1500)
      return toast.error("Motivation must be 20–1500 characters.");

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Application sent! We'll be in touch within 5 working days.");
      onClose();
    }, 700);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border-2 border-foreground bg-background p-6 sm:rounded-3xl sm:p-8"
        style={{ boxShadow: "var(--shadow-pop)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="chip">{project.type}</span>
            <h2 className="mt-2 font-display text-2xl font-bold">{project.title}</h2>
            <p className="text-sm text-muted-foreground">
              {project.country} · {project.dates}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-full border-2 border-foreground px-3 py-1 text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="Full name">
            <input name="name" required maxLength={100} className="input-base" autoComplete="name" />
          </Field>
          <Field label="Email">
            <input type="email" name="email" required maxLength={255} className="input-base" autoComplete="email" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Age">
              <input type="number" name="age" min={13} max={99} required className="input-base" />
            </Field>
            <Field label="Country">
              <input name="country" required maxLength={60} className="input-base" />
            </Field>
          </div>
          <Field label="Why this project? (20–1500 characters)">
            <textarea name="motivation" required minLength={20} maxLength={1500} rows={5} className="input-base resize-none" />
          </Field>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1 h-4 w-4 accent-[var(--primary)]" />
            <span>I consent to BEKGED processing my data for this application.</span>
          </label>

          <button type="submit" disabled={submitting} className="btn-pop w-full disabled:opacity-60">
            {submitting ? "Sending…" : "Send application"}
          </button>
        </form>

        <style>{`.input-base{width:100%;border:2px solid var(--ink);border-radius:0.75rem;padding:0.6rem 0.85rem;background:var(--background);font-family:var(--font-sans);font-size:0.95rem}.input-base:focus{outline:none;box-shadow:3px 3px 0 0 var(--ink);transform:translate(-1px,-1px)}`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}
