import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, Field, inputClass } from "@/components/ProtectedPage";

export const Route = createFileRoute("/foundguild")({
  head: () => ({
    meta: [
      { title: "DGOT — Found a Guild" },
      { name: "description", content: "Found a new guild in DGOT — pick a name, world and leader." },
    ],
  }),
  component: FoundGuildPage,
});

function FoundGuildPage() {
  return (
    <ProtectedPage>
      <PageBox title="Found Guild" icon="🏰">
        <p className="mb-5 font-[VT323] text-xl leading-snug">
          Found a guild and gather thy allies under one banner. A leader of at least <strong>level 8</strong> is required.
          A fee of <strong>20.000 gold</strong> will be drawn from thy hero's purse.
        </p>
        <form className="mx-auto max-w-xl space-y-4">
          <Field label="Guild Name" hint="3–30 characters, no profanity.">
            <input name="guild_name" className={inputClass} required maxLength={30} />
          </Field>
          <Field label="World">
            <select name="guild_world" className={inputClass}>
              <option>DGOT</option>
              <option>DGOT-Hardcore</option>
            </select>
          </Field>
          <Field label="Guild Leader (Main Character)">
            <select name="guild_leader" className={inputClass}>
              <option>Sir Knightly</option>
              <option>Mage Mystica</option>
              <option>Paladin Pax</option>
            </select>
          </Field>
          <Field label="Current Password">
            <input type="password" name="password" className={inputClass} required />
          </Field>
          <label className="flex items-center gap-2 font-[VT323] text-lg">
            <input type="checkbox" required /> I agree to the guild charter and code of conduct.
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Link to="/guilds" className="pixel-text rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--parchment-dark)] px-4 py-2 text-[10px] text-[color:var(--wood-dark)]">Cancel</Link>
            <button type="submit" className="btn-gold pixel-text text-[10px]">✦ Found Guild</button>
          </div>
        </form>
      </PageBox>
    </ProtectedPage>
  );
}
