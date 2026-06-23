import { createFileRoute } from "@tanstack/react-router";
import { useGalleryItems } from "@/data/content";
import { fallbackGallery } from "@/data/site";

export const Route = createFileRoute("/gallery")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Gallery — BEKGED projects & moments" },
      {
        name: "description",
        content:
          "Photos from BEKGED's Erasmus+ youth exchanges, training courses and local projects across Istanbul and Europe.",
      },
      { property: "og:title", content: "Gallery — BEKGED" },
    ],
  }),
  component: Gallery,
});

function Gallery() {
  const { data = [], isLoading } = useGalleryItems();
  const items =
    data.length > 0
      ? data.map((g) => ({ src: g.src, alt: g.alt }))
      : fallbackGallery;

  return (
    <>
      <section className="container-pad py-16 md:py-20">
        <span className="chip">Gallery</span>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold md:text-6xl">
          Faces, places and projects.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          A few moments from the road. Tree planting in the park, mural painting in Kadıköy, late
          nights with new friends from across Europe.
        </p>
      </section>

      <section className="container-pad pb-24">
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
            {items.map((g, i) => (
              <figure
                key={i}
                className="overflow-hidden rounded-2xl border-2 border-foreground"
                style={{ boxShadow: "var(--shadow-pop)" }}
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  loading="lazy"
                  className="w-full transition-transform duration-500 hover:scale-105"
                />
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
