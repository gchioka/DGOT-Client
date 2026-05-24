import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef, memo, type FormEvent } from "react";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "DGOT — Account Login" },
      { name: "description", content: "Sign in to your DGOT account to manage your characters, premium and shop." },
    ],
  }),
  component: LoginPage,
});

/** Stateless shell — SiteLayout renders once, never re-renders from form typing */
function LoginPage() {
  return (
    <SiteLayout>
      <LoginContent />
    </SiteLayout>
  );
}

/**
 * Uncontrolled form — no value/onChange on inputs, zero re-renders while typing.
 * Redirect via useEffect, never inside the render body.
 */
const LoginContent = memo(function LoginContent() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/account" });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const fd = new FormData(formRef.current!);
    const email    = (fd.get("email")   as string).trim();
    const password = fd.get("password") as string;

    if (!email || !password) {
      setError("Fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate({ to: "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageBox title="Account Login" icon="🔑">
      <form ref={formRef} onSubmit={handleSubmit} className="mx-auto max-w-md space-y-3 font-[VT323] text-lg">
        {error && (
          <div className="rounded-sm border-2 border-red-700 bg-red-100 px-3 py-2 text-red-800 text-base">
            {error}
          </div>
        )}
        <label className="block">
          <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Email</span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@realm.com"
            autoComplete="email"
            className="mt-1 w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2"
          />
        </label>
        <label className="block">
          <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Password</span>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            autoComplete="current-password"
            className="mt-1 w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="btn-gold pixel-text w-full text-[10px] disabled:opacity-60"
        >
          {loading ? "Entering..." : "Enter the Realm"}
        </button>
        <div className="flex items-center justify-between text-base">
          <a href="#" className="underline">Lost account?</a>
          <Link to="/createaccount" className="underline">Create account</Link>
        </div>
      </form>
    </PageBox>
  );
});
