import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Globe2, Leaf, Users } from "lucide-react";
import heroImg from "@/assets/hero-youth.jpg";
import { site } from "@/data/site";
import { useAnnouncements, useProjects } from "@/data/content";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "BEKGED — Erasmus+ youth, inclusion & climate from Istanbul" },
      {
        name: "description",
        content:
          "Bosphorus Education Culture and Development Association (BEKGED) sends and hosts young people across Europe through Erasmus+ youth exchanges and training courses. Based in Istanbul.",
      },
      { property: "og:title", content: "BEKGED — Youth, inclusion & climate" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: projects = [] } = useProjects();
  const { data: announcements = [] } = useAnnouncements();
  const openCalls = projects.filter((p) => p.status === "Open").slice(0, 3);
  const latest = announcements.slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-pad grid items-center gap-12 py-14 md:grid-cols-2 md:py-24">
          <div>
            <span className="chip">
              <Sparkles className="h-3.5 w-3.5" /> Erasmus+ • OID {site.oid}
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] md:text-7xl">
              Young people, <span className="text-primary">bold ideas</span>, a fairer{" "}
              <span className="text-secondary">planet</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              {site.fullName} (BEKGED) is a youth NGO based in {site.city}. We send and host young
              Europeans through Erasmus+ youth exchanges and training courses — with inclusion and
              climate action at our core.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/projects" className="btn-pop">
                See open calls <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/about" className="btn-ghost">
                Who we are
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 text-sm">
              {[
                ["120+", "young people sent"],
                ["18", "partner countries"],
                ["32", "projects delivered"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl font-bold">{n}</dt>
                  <dd className="text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl" style={{ background: "var(--gradient-lagoon)" }} />
            <img
              src={heroImg}
              alt="Young Europeans together at an Erasmus exchange in Istanbul"
              width={1600}
              height={1100}
              className="relative aspect-[4/5] w-full rounded-3xl border-2 border-foreground object-cover md:aspect-[5/6]"
              style={{ boxShadow: "var(--shadow-pop)" }}
            />
            <div
              className="absolute -bottom-6 -left-6 hidden rotate-[-6deg] rounded-2xl border-2 border-foreground bg-background px-4 py-3 md:block"
              style={{ boxShadow: "var(--shadow-pop-teal)" }}
            >
              <p className="font-display text-sm font-bold">#ErasmusIstanbul</p>
              <p className="text-xs text-muted-foreground">Spring 2026 cohort</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-pad py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Users, title: "Non-formal education", text: "We design experiences where young people actually learn by doing — and have fun doing it." },
            { icon: Globe2, title: "Inclusion first", text: "We prioritise young people with fewer opportunities and remove practical barriers to mobility." },
            { icon: Leaf, title: "Climate awareness", text: "From Green Voices to local clean-ups, we make climate a youth conversation." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-pop">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground" style={{ boxShadow: "3px 3px 0 0 var(--ink)" }}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-pad py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="chip">Open calls</span>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">Projects you can join right now</h2>
          </div>
          <Link to="/projects" className="hidden text-sm font-semibold underline-offset-4 hover:underline md:inline">
            All projects →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {openCalls.map((p) => (
            <article key={p.slug} className="card-pop flex flex-col">
              <span className="chip self-start">{p.type}</span>
              <h3 className="mt-3 font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.country} · {p.dates}</p>
              <p className="mt-3 flex-1 text-sm">{p.summary}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-primary">Deadline {p.deadline}</span>
                <Link to="/projects" className="font-semibold underline-offset-4 hover:underline">
                  Apply →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-pad py-16">
        <div className="rounded-3xl border-2 border-foreground p-8 md:p-12" style={{ background: "var(--accent)" }}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="chip bg-background">Latest</span>
              <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">From the BEKGED desk</h2>
            </div>
            <Link to="/announcements" className="hidden text-sm font-semibold underline-offset-4 hover:underline md:inline">
              All announcements →
            </Link>
          </div>

          <ul className="mt-8 divide-y-2 divide-foreground/20">
            {latest.map((a) => (
              <li key={a.id} className="flex flex-col gap-2 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                    {a.tag} · {new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <h3 className="font-display text-xl font-semibold">{a.title}</h3>
                </div>
                <p className="max-w-md text-sm text-foreground/80">{a.excerpt}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-pad py-20">
        <div className="rounded-3xl border-2 border-foreground p-10 text-center md:p-16" style={{ background: "var(--gradient-lagoon)", boxShadow: "var(--shadow-pop)" }}>
          <h2 className="font-display text-4xl font-bold text-primary-foreground md:text-6xl">Got a project idea?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/90">
            We're always looking for partner organisations across Europe and curious young people in
            Istanbul. Let's build something together.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-background px-6 py-3 font-display font-semibold text-foreground" style={{ boxShadow: "6px 6px 0 0 var(--ink)" }}>
              Partner with us <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-background px-6 py-3 font-display font-semibold text-primary-foreground hover:bg-background hover:text-foreground">
              Meet the team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
