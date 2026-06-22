import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Globe2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { site } from "@/data/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact BEKGED — partnerships & questions" },
      {
        name: "description",
        content:
          "Get in touch with BEKGED for partnerships, project ideas or questions about Erasmus+ opportunities.",
      },
      { property: "og:title", content: "Contact BEKGED" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sending, setSending] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const subject = String(fd.get("subject") || "").trim();
    const msg = String(fd.get("message") || "").trim();
    if (!name || name.length > 100) return toast.error("Add a valid name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Add a valid email.");
    if (subject.length < 3 || subject.length > 120) return toast.error("Subject 3–120 chars.");
    if (msg.length < 10 || msg.length > 2000) return toast.error("Message 10–2000 chars.");

    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent. Thanks — we'll reply soon.");
      (e.target as HTMLFormElement).reset();
    }, 700);
  }

  return (
    <>
      <Toaster />
      <section className="container-pad py-16 md:py-20">
        <span className="chip">Contact</span>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold md:text-6xl">
          Let's talk projects, partnerships or just say hi.
        </h1>
      </section>

      <section className="container-pad pb-24">
        <div className="grid gap-10 lg:grid-cols-5">
          <aside className="lg:col-span-2">
            <div className="card-pop" style={{ background: "var(--gradient-sunset)" }}>
              <h2 className="font-display text-2xl font-bold">BEKGED</h2>
              <p className="mt-1 text-sm">{site.fullName}</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5" />
                  <a href={`mailto:${site.email}`} className="font-semibold underline-offset-4 hover:underline">
                    {site.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5" />
                  <span>{site.city}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Globe2 className="mt-0.5 h-5 w-5" />
                  <span>OID {site.oid}</span>
                </li>
              </ul>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider">Follow us</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {site.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border-2 border-foreground bg-background px-3 py-1 text-xs font-semibold hover:bg-foreground hover:text-background"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <form
            onSubmit={onSubmit}
            className="card-pop space-y-4 lg:col-span-3"
          >
            <h2 className="font-display text-2xl font-bold">Send us a message</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input name="name" required maxLength={100} className="cinput" />
              </Field>
              <Field label="Email">
                <input type="email" name="email" required maxLength={255} className="cinput" />
              </Field>
            </div>
            <Field label="Subject">
              <input name="subject" required maxLength={120} className="cinput" />
            </Field>
            <Field label="Message">
              <textarea name="message" required rows={6} minLength={10} maxLength={2000} className="cinput resize-none" />
            </Field>
            <button type="submit" disabled={sending} className="btn-pop w-full sm:w-auto">
              {sending ? "Sending…" : "Send message"}
            </button>

            <style>{`.cinput{width:100%;border:2px solid var(--ink);border-radius:0.75rem;padding:0.65rem 0.9rem;background:var(--background);font-family:var(--font-sans);font-size:0.95rem}.cinput:focus{outline:none;box-shadow:3px 3px 0 0 var(--ink);transform:translate(-1px,-1px)}`}</style>
          </form>
        </div>
      </section>
    </>
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
