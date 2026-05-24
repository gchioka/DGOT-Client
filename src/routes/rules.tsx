import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";

export const Route = createFileRoute("/rules")({
  head: () => ({
    meta: [
      { title: "DGOT — Rules" },
      { name: "description", content: "The DGOT code of conduct — keep the realms fair, fun and respectful." },
    ],
  }),
  component: RulesPage,
});

const sections = [
  {
    title: "1. Names",
    items: [
      ["Offensive Name", "Insulting, racist, sexually related, drug-related, harassing or otherwise objectionable."],
      ["Forbidden Advertising", "Names that advertise brands, products or services unrelated to the game."],
      ["Unsuitable Name", "Names expressing religious or political views."],
      ["Supporting Rule Violation", "Names that incite or imply a violation of the DGOT rules."],
    ],
  },
  {
    title: "2. Statements",
    items: [
      ["Offensive Statement", "Insulting, racist or harassing public statements."],
      ["Spamming", "Repeating identical text or sending nonsensical content excessively."],
      ["Forbidden Advertising", "Advertising third-party brands or real-money trades."],
      ["Disclosing Personal Data", "Sharing other players' personal information without consent."],
    ],
  },
  {
    title: "3. Cheating",
    items: [
      ["Bug Abuse", "Exploiting obvious errors of the game or its services."],
      ["Unofficial Software", "Manipulating the client or using additional software to play."],
    ],
  },
  {
    title: "4. Legal Issues",
    items: [
      ["Hacking", "Stealing other players' account or personal data."],
      ["Attacking Service", "Disrupting any DGOT server or service."],
      ["Violating Law", "Breaking applicable law, the Service Agreement or rights of third parties."],
    ],
  },
];

function RulesPage() {
  return (
    <SiteLayout>
      <PageBox title="DGOT Rules" icon="📜">
        <p className="font-[VT323] text-xl leading-snug">
          DGOT is an online role-playing game where thousands of players meet every day. To keep the realms enjoyable
          for everyone, all citizens are expected to behave in a reasonable and respectful manner.
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
          Violating these rules may lead to temporary or permanent suspension of characters and accounts.
          Sanctions are imposed at the sole discretion of the DGOT team.
        </p>
      </PageBox>
    </SiteLayout>
  );
}
