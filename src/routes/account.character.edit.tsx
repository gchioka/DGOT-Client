import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, AccountSubNav, Field, inputClass } from "@/components/ProtectedPage";

export const Route = createFileRoute("/account/character/edit")({
  head: () => ({
    meta: [
      { title: "DGOT — Edit Character" },
      { name: "description", content: "Edit the public information shown for thy character on DGOT." },
    ],
  }),
  component: EditCharacterPage,
});

const privacy = [
  { name: "hide_account", label: "Hide my account" },
  { name: "hide_outfit", label: "Hide outfit" },
  { name: "hide_inventory", label: "Hide inventory" },
  { name: "hide_healthmana", label: "Hide health and mana" },
  { name: "hide_skills", label: "Hide skills" },
  { name: "hide_bonus", label: "Hide bonus stats" },
];

function EditCharacterPage() {
  return (
    <ProtectedPage>
      <PageBox title="Edit Character" icon="📝">
        <AccountSubNav active="/account/character/edit" />

        <div className="banner-header mb-3 pixel-text text-[10px] text-center">Character Data</div>
        <div className="mb-5 grid gap-2 rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 font-[VT323] text-lg sm:grid-cols-2">
          <div><strong>Name:</strong> Sir Knightly</div>
          <div><strong>Vocation:</strong> Knight</div>
          <div><strong>Level:</strong> 124</div>
          <div><strong>World:</strong> DGOT</div>
        </div>

        <form className="space-y-5">
          <div className="banner-header pixel-text text-[10px] text-center">Edit Character Information</div>

          <Field label="Comment (visible on character page)">
            <textarea className={inputClass} rows={4} maxLength={400} placeholder="Tell the realm about thy hero…" />
          </Field>

          <div>
            <span className="pixel-text mb-2 block text-[9px] text-[color:var(--wood-dark)]">Privacy</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {privacy.map((p) => (
                <label key={p.name} className="flex items-center gap-2 rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 font-[VT323] text-lg">
                  <input type="checkbox" name={p.name} /> {p.label}
                </label>
              ))}
            </div>
          </div>

          <div className="banner-header pixel-text text-[10px] text-center">Display Character Achievements</div>
          <div className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 font-[VT323] text-lg">
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Show earned achievements on character page
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link to="/account" className="pixel-text rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--parchment-dark)] px-4 py-2 text-[10px] text-[color:var(--wood-dark)]">Cancel</Link>
            <button type="submit" className="btn-gold pixel-text text-[10px]">Save Changes</button>
          </div>
        </form>
      </PageBox>
    </ProtectedPage>
  );
}
