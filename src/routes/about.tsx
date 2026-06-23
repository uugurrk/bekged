import { createFileRoute } from "@tanstack/react-router";
import { Heart, Sprout, Users, Globe2 } from "lucide-react";
import { board, site } from "@/data/site";

export const Route = createFileRoute("/about")({
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
  return (
    <>
      <section className="container-pad py-16 md:py-24">
        <span className="chip">Our story</span>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-tight md:text-7xl">
          {site.fullName}.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Welcome to BEKGED. Based in Istanbul, we are dedicated to empowering youth through
          non-formal education and fostering civil society. Our mission is to provide valuable
          resources and promote social inclusion for disadvantaged young people, while enhancing
          diversity and encouraging intercultural learning. Join us in creating a brighter future
          and raising awareness about the impact of climate change on youth.
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
        <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Our activities</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <p className="text-lg text-muted-foreground">
            At BEKGED we implement a variety of activities that promote youth participation,
            international mobility and intercultural learning. We organise Erasmus+ information
            workshops at youth centers and educational institutions, where young people learn
            about international opportunities and how to access them.
          </p>
          <p className="text-lg text-muted-foreground">
            To ensure equal access, we also run online information and Q&amp;A sessions for young
            people facing geographical barriers. In addition, we organise networking events, youth
            gatherings and picnics that bring together young people from different regions of
            Türkiye.
          </p>
        </div>
      </section>

      <section className="container-pad py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <span className="chip">The founder</span>
            <h2 className="mt-3 font-display text-4xl font-bold">Elif Demir</h2>
            <p className="mt-2 font-semibold text-muted-foreground">Founder & President</p>
            <p className="mt-5 text-lg">
              Elif started BEKGED after a decade of youth work in Istanbul and across the EU, frustrated
              that the best Erasmus+ opportunities often missed the young people who needed them most.
            </p>
            <p className="mt-4 text-muted-foreground">
              "I want BEKGED to be the kind of organisation I needed when I was nineteen — one that
              opens the door, walks you through it, and trusts you to lead what comes next."
            </p>
          </div>
          <div
            className="rounded-3xl border-2 border-foreground p-8"
            style={{ background: "var(--gradient-sunset)", boxShadow: "var(--shadow-pop)" }}
          >
            <h3 className="font-display text-2xl font-bold">Mission, in one paragraph</h3>
            <p className="mt-4">
              Empower young people — especially those with fewer opportunities — through non-formal
              education, international mobility and civic participation. Build a stronger civil
              society and a more inclusive Europe. Put climate at the centre of the youth agenda.
            </p>
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
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
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
