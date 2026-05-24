import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "DGOT — Terms of Use" },
      { name: "description", content: "The terms governing your use of the DGOT website and game services." },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "1. Acceptance",
    items: [
      ["Agreement", "By creating an account or accessing DGOT you agree to these terms."],
      ["Eligibility", "You must be of legal age in your jurisdiction or have parental consent."],
    ],
  },
  {
    title: "2. Accounts",
    items: [
      ["Responsibility", "You are responsible for all activity on your account and for keeping credentials safe."],
      ["One Person", "Accounts are personal and may not be shared, sold or transferred."],
      ["Suspension", "We may suspend or terminate accounts that violate these terms or our Rules."],
    ],
  },
  {
    title: "3. Conduct",
    items: [
      ["Fair Play", "No cheating, exploiting bugs or using unofficial software."],
      ["Respect", "Treat other players and staff with respect — harassment is not tolerated."],
      ["Content", "You are responsible for any content you submit through the game or website."],
    ],
  },
  {
    title: "4. Virtual Items & Payments",
    items: [
      ["No Ownership", "All in-game items, currency and characters remain the property of DGOT."],
      ["No Refunds", "Payments for virtual goods are generally non-refundable except where required by law."],
      ["Real Money Trading", "Selling or trading accounts or items for real money is strictly forbidden."],
    ],
  },
  {
    title: "5. Liability & Changes",
    items: [
      ["As-Is", "DGOT is provided as-is, without warranties of uninterrupted availability."],
      ["Updates", "We may modify these terms at any time; continued use means acceptance of the changes."],
      ["Contact", "For questions, contact support@dgot.realms."],
    ],
  },
];

function TermsPage() {
  return (
    <SiteLayout>
      <PageBox title="Terms of Use" icon="⚖️">
        <p className="font-[VT323] text-xl leading-snug">
          These terms govern your use of the DGOT website, game servers and related services.
          Please read them carefully before playing.
        </p>
        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>
        {sections.map((s) => (
          <div key={s.title} className="mb-5">
            <h3 className="pixel-text mb-2 text-[10px] text-[color:var(--royal-deep)]">{s.title}</h3>
            <ul className="space-y-2 font-[VT323] text-xl">
              {s.items.map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span aria-hidden className="mt-2 inline-block h-3 w-3 flex-shrink-0 bg-[color:var(--gold-deep)] shadow-[inset_0_0_0_1px_var(--gold-bright)]" />
                  <span><strong>{title}</strong> — {desc}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="font-[VT323] text-xl leading-snug text-[color:var(--muted-foreground)]">
          Violating these terms may result in suspension or permanent loss of your DGOT account.
        </p>
      </PageBox>
    </SiteLayout>
  );
}
