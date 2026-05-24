import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedPage({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return (
      <SiteLayout>
        <PageBox title="Members Only" icon="🔒">
          <p className="font-[VT323] text-xl leading-snug">
            Thy scroll requires a sealed identity. Please sign in to thy account to continue.
          </p>
          <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/login" className="btn-gold pixel-text text-[10px] px-6 py-3">Enter the Realm</Link>
            <Link to="/createaccount" className="btn-royal pixel-text text-[9px] px-6 py-3">Create Account</Link>
          </div>
        </PageBox>
      </SiteLayout>
    );
  }
  return <SiteLayout>{children}</SiteLayout>;
}

export function AccountSubNav({ active }: { active?: string }) {
  const items: { label: string; to: string }[] = [
    { label: "Overview", to: "/account" },
    { label: "Manage", to: "/account/manage" },
    { label: "Change Email", to: "/account/changeemail" },
    { label: "Change Password", to: "/account/changepassword" },
    { label: "Main Character", to: "/account/changemain" },
    { label: "Create Character", to: "/account/createcharacter" },
    { label: "Edit Character", to: "/account/character/edit" },
    { label: "Delete Character", to: "/account/character/delete" },
    { label: "Authenticator", to: "/account/authentication" },
  ];
  return (
    <nav className="mb-5 flex flex-wrap justify-center gap-2">
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          className={
            "pixel-text rounded-sm border-2 px-3 py-2 text-[8px] " +
            (active === it.to
              ? "border-[color:var(--gold-bright)] bg-[color:var(--royal-deep)] text-[color:var(--gold-bright)]"
              : "border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] text-[color:var(--wood-dark)] hover:bg-[color:var(--gold)]")
          }
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">{label}</span>
      {children}
      {hint && (
        <span className="font-[VT323] text-base text-[color:var(--wood-dark)] opacity-80">{hint}</span>
      )}
    </label>
  );
}

export const inputClass =
  "w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 font-[VT323] text-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]";
