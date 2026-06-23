import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, FolderKanban, Megaphone, ImageIcon, Info, Inbox } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin — BEKGED" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const tabs = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/about", label: "About", icon: Info },
  { to: "/admin/applications", label: "Applications", icon: Inbox },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="container-pad py-24 text-center text-muted-foreground">Loading…</div>;
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="container-pad py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Not an admin</h1>
        <p className="mt-3 text-muted-foreground">
          This account does not have admin access. Ask an existing admin to grant you the role.
        </p>
      </div>
    );
  }

  const isDashboard = pathname === "/admin";

  return (
    <>
      <Toaster />
      <div className="container-pad py-10">
        <h1 className="font-display text-4xl font-bold">Admin panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit website content and review project applications.
        </p>

        <nav className="mt-6 flex flex-wrap gap-2 border-b-2 border-foreground/15 pb-4">
          {tabs.map((t) => {
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`inline-flex items-center gap-1.5 rounded-full border-2 border-foreground px-3 py-1.5 text-xs font-semibold ${
                  active ? "bg-foreground text-background" : "bg-background hover:bg-accent"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          {isDashboard ? <Dashboard /> : <Outlet />}
        </div>
      </div>
    </>
  );
}

function Dashboard() {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {tabs
        .filter((t) => !t.exact)
        .map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className="card-pop block">
              <Icon className="h-7 w-7 text-primary" />
              <h3 className="mt-3 font-display text-xl font-bold">{t.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.to === "/admin/applications"
                  ? "Review and eliminate applications."
                  : `Edit ${t.label.toLowerCase()} content shown on the public site.`}
              </p>
            </Link>
          );
        })}
    </div>
  );
}
