import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, AccountSubNav, Field, inputClass } from "@/components/ProtectedPage";

export const Route = createFileRoute("/account/changeemail")({
  head: () => ({
    meta: [
      { title: "DGOT — Change Email" },
      { name: "description", content: "Change the email address linked to your DGOT account." },
    ],
  }),
  component: ChangeEmailPage,
});

function ChangeEmailPage() {
  return (
    <ProtectedPage>
      <PageBox title="Change Email Address" icon="✉">
        <AccountSubNav active="/account/changeemail" />
        <form className="mx-auto max-w-lg space-y-4">
          <p className="font-[VT323] text-xl leading-snug">
            Enter the new email scroll address and confirm with thy current password. A confirmation raven will be sent to the new address.
          </p>
          <Field label="New Email Address">
            <input type="email" className={inputClass} placeholder="hero@dgot.com.br" required />
          </Field>
          <Field label="Confirm New Email">
            <input type="email" className={inputClass} required />
          </Field>
          <Field label="Current Password">
            <input type="password" className={inputClass} required />
          </Field>
          <div className="flex justify-end gap-3 pt-2">
            <Link to="/account/manage" className="pixel-text rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--parchment-dark)] px-4 py-2 text-[10px] text-[color:var(--wood-dark)]">Cancel</Link>
            <button type="submit" className="btn-gold pixel-text text-[10px]">Submit</button>
          </div>
        </form>
      </PageBox>
    </ProtectedPage>
  );
}
