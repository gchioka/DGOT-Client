import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";

export const Route = createFileRoute("/premiumfeatures")({
  head: () => ({
    meta: [
      { title: "DGOT — Premium Features" },
      { name: "description", content: "Unlock all the spells, mounts and benefits of DGOT Premium." },
    ],
  }),
  component: PremiumPage,
});

const features = [
  { icon: "✨", title: "All Spells", text: "Cast every spell of thy vocation, including the mightiest." },
  { icon: "⚡", title: "Stamina Boost", text: "+50% XP for 3 hours every day, on the house." },
  { icon: "⚔", title: "Secondary Battlelists", text: "Track foes and allies on a second magical list." },
  { icon: "🏰", title: "Houses", text: "Own a hearth, guildhall or tower in every great city." },
  { icon: "🐎", title: "Mounts", text: "Ride premium beasts at faster speeds." },
  { icon: "🎒", title: "More Storage", text: "Expanded depot and quick-access slots." },
];

const packages = [
  { days: 30, coins: 250 },
  { days: 90, coins: 690, bonus: "Save 8%" },
  { days: 180, coins: 1290, bonus: "Save 14%" },
  { days: 365, coins: 2390, bonus: "Save 20%", featured: true },
];

function PremiumPage() {
  return (
    <SiteLayout>
      <PageBox title="Premium Features" icon="👑">
        <div className="banner-header mb-3 pixel-text text-[10px] text-center">DGOT Features</div>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 text-center">
              <div className="mb-1 text-3xl">{f.icon}</div>
              <div className="pixel-text mb-1 text-[9px] text-[color:var(--royal-deep)]">{f.title}</div>
              <p className="font-[VT323] text-base">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="banner-header mb-3 pixel-text text-[10px] text-center">DGOT Premium Time</div>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => (
            <div
              key={p.days}
              className={
                "rounded-sm border-2 p-4 text-center " +
                (p.featured
                  ? "border-[color:var(--gold-bright)] bg-[color:var(--royal-deep)] text-[color:var(--gold-bright)]"
                  : "border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)]")
              }
            >
              {p.featured && <div className="pixel-text mb-2 text-[8px]">★ BEST DEAL</div>}
              <div className="pixel-text text-[14px]">{p.days}</div>
              <div className="font-[VT323] text-lg">days of Premium</div>
              {p.bonus && <div className="font-[VT323] text-base opacity-80">{p.bonus}</div>}
              <div className="mt-2 pixel-text text-[10px]">{p.coins} coins</div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link to="/payment" className="btn-gold pixel-text text-[10px] px-6 py-3">✦ Get Coins</Link>
        </div>
      </PageBox>
    </SiteLayout>
  );
}
