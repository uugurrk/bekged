import { createFileRoute } from "@tanstack/react-router";
import { useAnnouncements } from "@/data/content";

export const Route = createFileRoute("/announcements")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Announcements & news — BEKGED" },
      {
        name: "description",
        content:
          "News, calls for participants and updates from BEKGED — an Erasmus+ youth NGO based in Istanbul.",
      },
      { property: "og:title", content: "Announcements & news — BEKGED" },
    ],
  }),
  component: Announcements,
});

function Announcements() {
  const { data: announcements = [], isLoading } = useAnnouncements();

  return (
    <>
      <section className="container-pad py-16 md:py-20">
        <span className="chip">Announcements</span>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold md:text-6xl">
          News from the BEKGED community.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Calls for participants, project recaps, resources we made and things we're proud of.
        </p>
      </section>

      <section className="container-pad pb-24">
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : announcements.length === 0 ? (
          <p className="text-muted-foreground">No announcements yet.</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {announcements.map((a, i) => (
              <li key={a.id}>
                <article
                  className="flex h-full flex-col rounded-3xl border-2 border-foreground p-7 transition-all hover:-translate-y-1"
                  style={{
                    background: i % 3 === 0 ? "var(--accent)" : "var(--card)",
                    boxShadow: "var(--shadow-pop)",
                  }}
                >
                  <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
                    <span className="rounded-full bg-foreground px-2.5 py-1 text-background">{a.tag}</span>
                    <time>{new Date(a.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time>
                  </div>
                  <h2 className="mt-4 font-display text-2xl font-bold leading-snug">{a.title}</h2>
                  <p className="mt-3 flex-1 text-foreground/80">{a.excerpt}</p>
                  <a
                    href={`mailto:bekgeddernegi@gmail.com?subject=${encodeURIComponent(a.title)}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
                  >
                    Get in touch →
                  </a>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
