import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "DGOT — Team" },
      { name: "description", content: "The team behind DGOT — administrators, game masters and community helpers." },
    ],
  }),
  component: TeamPage,
});

const team = [
  { name: "DGOT", role: "Founder & Administrator", world: "all", color: "var(--gold-bright)" },
  { name: "Archmage Solrik", role: "Senior Developer", world: "all", color: "var(--royal-deep)" },
  { name: "Sister Vanya", role: "Senior Game Master", world: "all", color: "var(--ember)" },
  { name: "Brother Hadrian", role: "Game Master", world: "all", color: "var(--ember)" },
  { name: "Lady Mireille", role: "Community Manager", world: "all", color: "var(--royal-deep)" },
  { name: "Tutor Klein", role: "Senior Tutor", world: "all", color: "var(--gold)" },
];

function TeamPage() {
  return (
    <SiteLayout>
      <PageBox title="The DGOT Team" icon="🛡">
        <p className="font-[VT323] text-xl leading-snug">
          Every realm needs its keepers. Below are the people who craft, moderate and guard the worlds of DGOT.
          Contact them in-game or on Discord whenever you need assistance.
        </p>
        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>
        <div className="grid gap-3 sm:grid-cols-2">
          {team.map((m) => (
            <div key={m.name} className="frame-ornate p-3 flex items-center gap-3">
              <span
                aria-hidden
                className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm border-2 border-[color:var(--gold-deep)] pixel-text text-base"
                style={{ background: `color-mix(in oklab, ${m.color} 60%, transparent)`, color: "var(--parchment-dark)" }}
              >
                {m.name[0]}
              </span>
              <div>
                <div className="pixel-text text-[10px] text-[color:var(--royal-deep)]">{m.name}</div>
                <div className="font-[VT323] text-base">{m.role}</div>
                <div className="font-[VT323] text-sm text-[color:var(--muted-foreground)]">World: {m.world}</div>
              </div>
            </div>
          ))}
        </div>
      </PageBox>
    </SiteLayout>
  );
}
