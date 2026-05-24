import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "DGOT — Legal Documents" },
      { name: "description", content: "Legal documents and disclosures for DGOT Realms." },
    ],
  }),
  component: LegalPage,
});

const sections = [
  {
    title: "1. Corporate Information",
    items: [
      ["Company Name", "DGOT Realms — Digital Game of Thrones"],
      ["Jurisdiction", "Subject to applicable laws of the country where the service is hosted."],
      ["Contact", "For legal inquiries, contact legal@dgot.realms."],
    ],
  },
  {
    title: "2. Intellectual Property",
    items: [
      ["Trademarks", "DGOT, DGOT Realms, and associated logos are trademarks of their respective owners."],
      ["Copyright", "All game content, artwork, code, and text are protected by copyright law."],
      ["Fan Content", "Fan-created content must not imply official endorsement or monetize IP without permission."],
    ],
  },
  {
    title: "3. Disclosures",
    items: [
      ["Service Status", "DGOT is an independent fan project not affiliated with any commercial publisher."],
      ["Age Rating", "Content is suitable for players aged 13 and older."],
      ["Accessibility", "We are committed to improving accessibility for all players."],
    ],
  },
  {
    title: "4. Governing Law",
    items: [
      ["Applicable Law", "These documents are governed by the laws of the jurisdiction where servers operate."],
      ["Dispute Resolution", "Disputes should first be resolved through our support channels."],
      ["Updates", "Legal documents may be updated; continued use constitutes acceptance of changes."],
    ],
  },
];

function LegalPage() {
  return (
    <SiteLayout>
      <PageBox title="Legal Documents" icon="📜">
        <p className="font-[VT323] text-xl leading-snug">
          This page contains important legal information about DGOT Realms, including
          corporate details, intellectual property notices, and governing law.
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
          If you have any questions about these legal documents, please contact us at legal@dgot.realms.
        </p>
      </PageBox>
    </SiteLayout>
  );
}
