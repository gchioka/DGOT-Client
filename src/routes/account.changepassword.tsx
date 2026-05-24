import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, AccountSubNav, Field, inputClass } from "@/components/ProtectedPage";

export const Route = createFileRoute("/account/changepassword")({
  head: () => ({
    meta: [
      { title: "DGOT — Change Password" },
      { name: "description", content: "Update the password that guards thy DGOT account." },
    ],
  }),
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  return (
    <ProtectedPage>
      <PageBox title="Change Password" icon="🔑">
        <AccountSubNav active="/account/changepassword" />
        <form className="mx-auto max-w-lg space-y-4">
          <p className="font-[VT323] text-xl leading-snug">
            Choose a strong word of power. The new password must contain at least 8 runes (characters).
          </p>
          <Field label="Old Password">
            <input type="password" className={inputClass} required />
          </Field>
          <Field label="New Password" hint="At least 8 characters, letters and numbers.">
            <input type="password" className={inputClass} minLength={8} required />
          </Field>
          <Field label="Confirm New Password">
            <input type="password" className={inputClass} minLength={8} required />
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
