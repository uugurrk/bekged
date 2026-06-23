import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/data/site";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin login — BEKGED" }, { name: "robots", content: "noindex" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can now sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Try to auto-claim admin (no-op if an admin already exists)
        await supabase.rpc("claim_admin").catch(() => {});
        toast.success("Signed in.");
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Toaster />
      <section className="container-pad py-20">
        <div
          className="mx-auto max-w-md rounded-3xl border-2 border-foreground bg-background p-8"
          style={{ boxShadow: "var(--shadow-pop)" }}
        >
          <img src={site.logo} alt="BEKGED" className="mx-auto h-16 w-16 object-contain" />
          <h1 className="mt-4 text-center font-display text-3xl font-bold">Admin access</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to manage the website."
              : "Create the first admin account."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border-2 border-foreground bg-background px-3 py-2"
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-semibold">Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border-2 border-foreground bg-background px-3 py-2"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </label>
            <button type="submit" disabled={busy} className="btn-pop w-full disabled:opacity-60">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {mode === "signin"
              ? "Need to create the first admin? Sign up"
              : "Already have an account? Sign in"}
          </button>
          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            The very first user becomes admin automatically. Additional admins must be added by an
            existing admin.
          </p>
        </div>
      </section>
    </>
  );
}
