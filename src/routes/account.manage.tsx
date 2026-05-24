import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, AccountSubNav } from "@/components/ProtectedPage";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/account/manage")({
  head: () => ({
    meta: [
      { title: "DGOT — Manage Account" },
      { name: "description", content: "Manage your DGOT account: email, password, characters and authenticator." },
    ],
  }),
  component: ManagePage,
});

function ManagePage() {
  const { user } = useAuth();
  return (
    <ProtectedPage>
      <PageBox title="Manage Account" icon="⚙">
        <AccountSubNav active="/account/manage" />

        <SectionTitle>General Information</SectionTitle>
        <div className="mb-5 grid gap-2 rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 font-[VT323] text-lg sm:grid-cols-2">
          <Row label="Account Name" value={user?.name ?? "—"} />
          <Row label="Email Address" value="hero@dgot.com.br" />
          <Row label="Created" value="May 22, 2026" />
          <Row label="Status" value="Free Account" />
        </div>

        <SectionTitle>Products Ready To Use</SectionTitle>
        <div className="mb-5 rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 font-[VT323] text-lg">
          <p>No products waiting to be activated.</p>
          <Link to="/payment" className="btn-gold pixel-text mt-3 inline-block text-[9px]">Visit Webshop</Link>
        </div>

        <SectionTitle>Registration</SectionTitle>
        <div className="mb-5 grid gap-3 rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 sm:grid-cols-3">
          <Link to="/account/changeemail" className="btn-royal pixel-text text-[9px] text-center">Change Email</Link>
          <Link to="/account/changepassword" className="btn-royal pixel-text text-[9px] text-center">Change Password</Link>
          <Link to="/account/changemain" className="btn-royal pixel-text text-[9px] text-center">Change Main Character</Link>
        </div>

        <SectionTitle>Authenticator</SectionTitle>
        <div className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 font-[VT323] text-lg">
          <p className="mb-3"><strong>Connect your account to an authenticator!</strong> Protect thy realm with a magical second seal.</p>
          <Link to="/account/authentication" className="btn-gold pixel-text text-[10px]">✦ Set Up Authenticator</Link>
        </div>
      </PageBox>
    </ProtectedPage>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="banner-header mb-3 pixel-text text-[10px] text-center">{children}</div>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[color:var(--gold-deep)]/40 py-1">
      <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
