import { createFileRoute } from "@tanstack/react-router";
import { Heart, Sprout, Users, Globe2 } from "lucide-react";
import { board, site } from "@/data/site";
import { useAboutSections } from "@/data/content";

export const Route = createFileRoute("/about")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "About BEKGED — mission, board & founder" },
      {
        name: "description",
        content:
          "Learn about BEKGED's mission, the board members behind the association and how it all started in Istanbul.",
      },
      { property: "og:title", content: "About BEKGED" },
    ],
  }),
  component: About,
});

const values = [
  { icon: Heart, title: "Inclusion", text: "Mobility opportunities for young people with fewer opportunities, full stop." },
  { icon: Sprout, title: "Climate", text: "We treat the climate crisis as a youth issue and a leadership opportunity." },
  { icon: Globe2, title: "Intercultural learning", text: "We learn from difference. Curiosity is our default setting." },
  { icon: Users, title: "Non-formal education", text: "We build experiences, not lectures. Reflection is part of the design." },
];

function About() {
  const { data = [] } = useAboutSections();
  const get = (key: string, fallback = "") => data.find((s) => s.key === key)?.content ?? fallback;

  return (
    <>
      <section className="container-pad py-16 md:py-24">
        <span className="chip">Our story</span>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-tight md:text-7xl">
          {site.fullName}.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground whitespace-pre-line">
          {get("mission", "")}
        </p>
      </section>

      <section className="container-pad py-12">
        <div className="grid gap-6 md:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-pop">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-pad py-16">
        <span className="chip">What we do</span>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          {data.find((s) => s.key === "activities")?.title || "Our activities"}
        </h2>
        <p className="mt-6 max-w-3xl text-lg text-muted-foreground whitespace-pre-line">
          {get("activities", "")}
        </p>
      </section>

      <section className="container-pad py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <span className="chip">The founder</span>
            <h2 className="mt-3 font-display text-4xl font-bold">Elif Demir</h2>
            <p className="mt-2 font-semibold text-muted-foreground">Founder & President</p>
            <p className="mt-5 whitespace-pre-line text-lg">{get("founder", "")}</p>
          </div>
          <div
            className="rounded-3xl border-2 border-foreground p-8"
            style={{ background: "var(--gradient-sunset)", boxShadow: "var(--shadow-pop)" }}
          >
            <h3 className="font-display text-2xl font-bold">Mission, in one paragraph</h3>
            <p className="mt-4 whitespace-pre-line">{get("mission", "")}</p>
          </div>
        </div>
      </section>

      <section className="container-pad py-16">
        <span className="chip">Board members</span>
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">The people behind BEKGED</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {board.map((m, i) => (
            <article key={m.name} className="card-pop">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl font-display text-xl font-bold"
                style={{
                  background: i % 2 ? "var(--secondary)" : "var(--primary)",
                  color: "white",
                  boxShadow: "3px 3px 0 0 var(--ink)",
                }}
              >
                {m.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{m.name}</h3>
              <p className="text-sm font-semibold text-primary">{m.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
