import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, AccountSubNav, Field, inputClass } from "@/components/ProtectedPage";

export const Route = createFileRoute("/account/changemain")({
  head: () => ({
    meta: [
      { title: "DGOT — Main Character" },
      { name: "description", content: "Choose which character represents thy account in the realm of DGOT." },
    ],
  }),
  component: ChangeMainPage,
});

function ChangeMainPage() {
  return (
    <ProtectedPage>
      <PageBox title="Main Character Change" icon="👑">
        <AccountSubNav active="/account/changemain" />
        <form className="mx-auto max-w-lg space-y-4">
          <p className="font-[VT323] text-xl leading-snug">
            <strong>Characters available:</strong> Select which hero shall stand as the banner of thy account.
          </p>
          <Field label="Main Character">
            <select className={inputClass}>
              <option>Sir Knightly</option>
              <option>Mage Mystica</option>
              <option>Paladin Pax</option>
            </select>
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
