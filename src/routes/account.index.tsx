import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, AccountSubNav } from "@/components/ProtectedPage";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/account/")({
  head: () => ({
    meta: [
      { title: "DGOT — Account Overview" },
      { name: "description", content: "Your DGOT account dashboard: characters, premium status and quick actions." },
    ],
  }),
  component: AccountPage,
});

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "https://dgot.com.br";

function AccountPage() {
  const { user, logout } = useAuth();
  const characters = user?.characters ?? [];
  const mainChar = characters.find((c) => c.ismaincharacter) ?? characters[0];

  return (
    <ProtectedPage>
      <PageBox title="Account Overview" icon="📜">
        <AccountSubNav active="/account" />

        {/* Status premium */}
        <div className="mb-5 grid gap-3 sm:grid-cols-[160px_1fr_auto] items-center rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4">
          <div className={`pixel-text rounded-sm border-2 px-3 py-2 text-center text-[10px] ${
            user?.isPremium
              ? "border-[color:var(--gold-deep)] bg-[color:var(--gold)]/20 text-[color:var(--wood-dark)]"
              : "border-[color:var(--wood-dark)] bg-red-700/20 text-red-800"
          }`}>
            {user?.isPremium ? "PREMIUM" : "FREE ACCOUNT"}
          </div>
          <div className="font-[VT323] text-lg leading-snug">
            <strong>Welcome, {user?.name ?? "adventurer"}!</strong>
            <br />
            {user?.isPremium
              ? "Your account has Premium status."
              : "Your Premium Time has expired. (Balance: 0 days)"}
          </div>
          <div className="flex flex-col gap-2">
            <Link to="/account/manage" className="btn-royal pixel-text text-[9px] block text-center">Manage Account</Link>
            <Link to="/payment" className="btn-gold pixel-text text-[9px] block text-center">Get Coins</Link>
            <button onClick={logout} className="pixel-text rounded-sm border-2 border-[color:var(--wood-dark)] bg-red-800 px-3 py-2 text-[9px] text-[color:var(--parchment)]">
              Logout
            </button>
          </div>
        </div>

        {/* Benefícios premium */}
        <div className="banner-header mb-3 pixel-text text-[10px] text-center">Premium Benefits</div>
        <div className="mb-5 grid gap-3 sm:grid-cols-3 font-[VT323] text-lg">
          {[
            { icon: "✦", text: "Cast all powerful spells" },
            { icon: "⚡", text: "50% XP boost for 3 hours every day" },
            { icon: "🛡", text: "Access secondary battlelists" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2 rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-3">
              <span className="text-2xl">{b.icon}</span>
              <span>{b.text}</span>
            </div>
          ))}
        </div>

        {/* Lista de personagens reais */}
        <div className="banner-header mb-3 pixel-text text-[10px] text-center">Your Characters</div>
        <div className="overflow-x-auto">
          <table className="w-full font-[VT323] text-lg">
            <thead className="bg-[color:var(--royal-deep)] text-[color:var(--gold-bright)]">
              <tr>
                <th className="px-2 py-2 text-left pixel-text text-[9px]">Outfit</th>
                <th className="px-3 py-2 text-left pixel-text text-[9px]">Name</th>
                <th className="px-3 py-2 text-left pixel-text text-[9px]">Level</th>
                <th className="px-3 py-2 text-left pixel-text text-[9px]">Vocation</th>
                <th className="px-3 py-2 text-left pixel-text text-[9px]">Main</th>
                <th className="px-3 py-2 text-right pixel-text text-[9px]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-[color:var(--parchment-dark)]">
              {characters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-[color:var(--wood-dark)]">
                    No characters yet.
                  </td>
                </tr>
              ) : (
                characters.map((c, i) => (
                  <tr key={c.name} className={`border-t-2 border-[color:var(--gold-deep)] ${i % 2 ? "bg-[color:var(--parchment-dark)]" : "bg-[color:var(--parchment)]"}`}>
                    <td className="px-2 py-1">
                      <img
                        src={`${API_BASE}/animoutfit.php?id=${c.outfitid}&addons=${c.addonsflags}&head=${c.headcolor}&body=${c.torsocolor}&legs=${c.legscolor}&feet=${c.detailcolor}&mount=0`}
                        alt={c.name}
                        width={40}
                        height={40}
                        className="pixelated"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    </td>
                    <td className="px-3 py-2">{c.name}</td>
                    <td className="px-3 py-2">{c.level}</td>
                    <td className="px-3 py-2">{c.vocation}</td>
                    <td className="px-3 py-2">{c.ismaincharacter ? "⭐" : ""}</td>
                    <td className="px-3 py-2 text-right">
                      <Link
                        to="/account/character/edit"
                        className="underline text-[color:var(--royal-deep)]"
                      >
                        Edit
                      </Link>
                      <span className="mx-2 text-[color:var(--gold-deep)]">|</span>
                      <Link
                        to="/account/character/delete"
                        className="underline text-red-800"
                      >
                        Delete
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link to="/account/createcharacter" className="btn-gold pixel-text text-[10px]">✦ Create Character</Link>
          {mainChar && (
            <Link to="/account/changemain" className="btn-royal pixel-text text-[9px]">Change Main</Link>
          )}
        </div>
      </PageBox>
    </ProtectedPage>
  );
}
