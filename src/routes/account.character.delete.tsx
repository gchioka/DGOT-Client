import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, AccountSubNav, Field, inputClass } from "@/components/ProtectedPage";

export const Route = createFileRoute("/account/character/delete")({
  head: () => ({
    meta: [
      { title: "DGOT — Delete Character" },
      { name: "description", content: "Permanently remove a character from your DGOT account." },
    ],
  }),
  component: DeleteCharacterPage,
});

function DeleteCharacterPage() {
  return (
    <ProtectedPage>
      <PageBox title="Delete Character" icon="⚰">
        <AccountSubNav active="/account/character/delete" />
        <div className="mb-5 rounded-sm border-4 border-red-700 bg-red-50/30 p-4 font-[VT323] text-lg text-red-900">
          <strong className="pixel-text text-[10px]">WARNING</strong>
          <p className="mt-2">
            Once a character is sent to the void, all their items, levels and history are lost forever. This act cannot be undone by gods nor sages.
          </p>
        </div>
        <form className="mx-auto max-w-lg space-y-4">
          <Field label="Character Name">
            <input className={inputClass} placeholder="Type the exact character name" required />
          </Field>
          <Field label="Current Password">
            <input type="password" className={inputClass} required />
          </Field>
          <label className="flex items-center gap-2 font-[VT323] text-lg">
            <input type="checkbox" required /> I understand this action is permanent.
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Link to="/account" className="pixel-text rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--parchment-dark)] px-4 py-2 text-[10px] text-[color:var(--wood-dark)]">Cancel</Link>
            <button type="submit" className="pixel-text rounded-sm border-2 border-red-900 bg-red-700 px-4 py-2 text-[10px] text-[color:var(--parchment)]">Delete Forever</button>
          </div>
        </form>
      </PageBox>
    </ProtectedPage>
  );
}
