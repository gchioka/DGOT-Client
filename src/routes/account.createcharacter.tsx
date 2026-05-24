import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, type FormEvent } from "react";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, AccountSubNav, Field, inputClass } from "@/components/ProtectedPage";
import { createCharacterApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const TOWN_OPTIONS = [
  { value: "9",  label: "Thais",      img: "/town-thais.png",     desc: "A grande capital humana" },
  { value: "11", label: "Ankrahmun",  img: "/town-ankrahmun.png", desc: "Cidade do deserto" },
];

export const Route = createFileRoute("/account/createcharacter")({
  head: () => ({
    meta: [
      { title: "DGOT — Create Character" },
      { name: "description", content: "Forge a new hero in the realm of DGOT." },
    ],
  }),
  component: CreateCharacterPage,
});

const VOCATIONS = [
  { value: "4", label: "Knight",   icon: "🛡" },
  { value: "3", label: "Paladin",  icon: "🏹" },
  { value: "1", label: "Sorcerer", icon: "✨" },
  { value: "2", label: "Druid",    icon: "🍃" },
  { value: "9", label: "Monk",     icon: "👊" },
];

function CreateCharacterPage() {
  return (
    <ProtectedPage>
      <PageBox title="Create Character" icon="⚔">
        <AccountSubNav active="/account/createcharacter" />
        <CreateCharacterForm />
      </PageBox>
    </ProtectedPage>
  );
}

function CreateCharacterForm() {
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);
  const [createdName, setCreatedName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const fd = new FormData(formRef.current!);
    const name     = (fd.get("name")     as string).trim();
    const sex      = parseInt(fd.get("sex")      as string) || 1;
    const vocation = fd.get("vocation")  as string || "4";
    const world    = fd.get("world")     as string || "DGOT";
    const town     = parseInt(fd.get("town") as string) || 9;

    setLoading(true);
    try {
      const result = await createCharacterApi(user?.sessionKey ?? "", name, sex, vocation, world, town);
      if (result.errorCode !== undefined) {
        setError(result.errorMessage ?? "Failed to create character.");
        return;
      }
      setCreatedName(result.character ?? name);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create character.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 text-center py-6">
        <p className="font-[VT323] text-2xl text-[color:var(--gold-deep)]">Character created!</p>
        <p className="font-[VT323] text-xl text-[color:var(--wood-dark)]">
          <strong className="text-[color:var(--royal-deep)]">{createdName}</strong> is ready for adventure.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/account" className="btn-gold pixel-text text-[10px]">▶ My Account</Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
      <Field label="Character Name" hint="5–29 characters.">
        <input name="name" className={inputClass} required minLength={5} maxLength={29} placeholder="5–29 characters" />
      </Field>

      <div>
        <span className="pixel-text mb-2 block text-[9px] text-[color:var(--wood-dark)]">Sex</span>
        <div className="flex gap-3">
          {[{ v: "1", l: "Male" }, { v: "0", l: "Female" }].map(({ v, l }) => (
            <label key={v} className="flex flex-1 cursor-pointer items-center gap-2 rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 font-[VT323] text-lg">
              <input type="radio" name="sex" value={v} defaultChecked={v === "1"} />
              {l}
            </label>
          ))}
        </div>
      </div>

      <div>
        <span className="pixel-text mb-2 block text-[9px] text-[color:var(--wood-dark)]">Vocation</span>
        <div className="grid gap-2 sm:grid-cols-5">
          {VOCATIONS.map((v) => (
            <label key={v.value} className="flex cursor-pointer flex-col items-center gap-1 rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-3 text-center font-[VT323] text-base">
              <span className="text-2xl">{v.icon}</span>
              <input type="radio" name="vocation" value={v.value} defaultChecked={v.value === "4"} />
              <span>{v.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* hidden world — only one world exists */}
      <input type="hidden" name="world" value="DGOT" />

      <div>
        <span className="pixel-text mb-2 block text-[9px] text-[color:var(--wood-dark)]">Starting City</span>
        <div className="grid grid-cols-2 gap-3">
          {TOWN_OPTIONS.map((t, i) => (
            <label key={t.value} className="cursor-pointer block">
              <input
                type="radio"
                name="town"
                value={t.value}
                defaultChecked={i === 0}
                className="peer sr-only"
              />
              <div
                className={[
                  "flex flex-col items-center gap-2 rounded-sm border-2 px-4 py-4 text-center transition-all",
                  "border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)]",
                  "hover:border-[color:var(--gold-bright)] hover:bg-[color:var(--parchment)]",
                  "peer-checked:border-[color:var(--gold-bright)] peer-checked:bg-[color:var(--parchment)]",
                  "peer-checked:shadow-[inset_0_0_0_2px_rgba(200,160,0,0.35)]",
                ].join(" ")}
              >
                <img
                  src={t.img}
                  alt={t.label}
                  className="h-12 w-12 object-contain"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="font-[VT323] text-xl leading-none text-[color:var(--wood-dark)]">
                  {t.label}
                </span>
                <span className="pixel-text text-[7px] text-[color:var(--wood-light)] leading-tight">
                  {t.desc}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p className="pixel-text text-[8px] text-red-700 bg-red-50 border border-red-300 rounded px-3 py-2">{error}</p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Link to="/account" className="pixel-text rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--parchment-dark)] px-4 py-2 text-[10px] text-[color:var(--wood-dark)]">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="btn-gold pixel-text text-[10px] disabled:opacity-50">
          {loading ? "Creating..." : "✦ Create"}
        </button>
      </div>
    </form>
  );
}
