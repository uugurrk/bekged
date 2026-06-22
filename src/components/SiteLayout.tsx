import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { Menu, X, Mail, MapPin } from "lucide-react";
import { nav, site } from "@/data/site";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b-2 border-foreground bg-background/90 backdrop-blur">
      <div className="container-pad flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="inline-block h-7 w-7 rounded-lg bg-primary" style={{ boxShadow: "3px 3px 0 0 var(--ink)" }} />
          {site.name}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-foreground text-background" : "hover:bg-accent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link to="/projects" className="hidden md:inline-flex btn-pop !px-5 !py-2 text-sm">
          Apply now
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border-2 border-foreground p-2 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t-2 border-foreground bg-background md:hidden">
          <div className="container-pad flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium hover:bg-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-foreground" style={{ background: "var(--gradient-sunset)" }}>
      <div className="container-pad grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display text-2xl font-bold">
            <span className="inline-block h-8 w-8 rounded-lg bg-foreground" />
            {site.name}
          </div>
          <p className="mt-3 max-w-md font-sans text-foreground/80">
            {site.fullName}. {site.tagline}
          </p>
          <p className="mt-2 text-sm text-foreground/70">OID: {site.oid}</p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Get in touch</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${site.email}`} className="hover:underline">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {site.city}
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
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
      <div className="border-t-2 border-foreground/30">
        <div className="container-pad flex flex-col items-center justify-between gap-2 py-4 text-xs text-foreground/70 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. Co-funded by the European Union.</p>
          <p>Views and opinions expressed are those of the author(s) only.</p>
        </div>
      </div>
    </footer>
  );
}
