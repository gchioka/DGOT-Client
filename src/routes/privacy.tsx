import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "DGOT — Privacy Policy" },
      { name: "description", content: "How DGOT collects, uses and protects your personal data." },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "1. Information We Collect",
    items: [
      ["Account Data", "Email, username, password hash and character information you provide on sign-up."],
      ["Gameplay Data", "Login times, IP address and in-game actions required to operate the server."],
      ["Payment Data", "Billing details processed by our payment providers — we never store full card numbers."],
      ["Support Data", "Messages and attachments you send to our support team."],
    ],
  },
  {
    title: "2. How We Use Your Data",
    items: [
      ["Service Operation", "Authenticate accounts, deliver gameplay, and maintain server stability."],
      ["Security & Anti-Cheat", "Detect cheating, fraud and unauthorized access."],
      ["Communication", "Send important account, server and policy updates."],
      ["Improvement", "Analyze aggregated usage to improve game balance and features."],
    ],
  },
  {
    title: "3. Data Sharing",
    items: [
      ["No Sale of Data", "We do not sell or rent your personal data to anyone."],
      ["Service Providers", "Shared only with hosting and payment processors strictly required to run DGOT."],
      ["Legal Requests", "Disclosed only when required by applicable law or court order."],
    ],
  },
  {
    title: "4. Your Rights",
    items: [
      ["Access", "Request a copy of the personal data we hold about you."],
      ["Correction", "Ask us to update inaccurate or outdated information."],
      ["Deletion", "Request deletion of your account and associated personal data."],
      ["Contact", "Reach our privacy team at privacy@dgot.realms."],
    ],
  },
];

function PrivacyPage() {
  return (
    <SiteLayout>
      <PageBox title="Privacy Policy" icon="🛡️">
        <p className="font-[VT323] text-xl leading-snug">
          Your privacy matters to us. This policy explains what data DGOT collects, why we collect it,
          and the choices you have over your information.
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
          We may update this policy from time to time. Continued use of DGOT after changes constitutes
          acceptance of the revised policy.
        </p>
      </PageBox>
    </SiteLayout>
  );
}
