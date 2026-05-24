import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "DGOT — Cookies Policy" },
      { name: "description", content: "How DGOT uses cookies and similar technologies on its website." },
    ],
  }),
  component: CookiesPage,
});

const sections = [
  {
    title: "1. What Are Cookies",
    items: [
      ["Definition", "Small text files stored by your browser when you visit a website."],
      ["Purpose", "They help websites remember preferences, sessions and usage patterns."],
    ],
  },
  {
    title: "2. Cookies We Use",
    items: [
      ["Essential", "Required to keep you signed in and maintain your session — cannot be disabled."],
      ["Preference", "Remember your language, theme and display settings."],
      ["Analytics", "Aggregated traffic data to help us improve the website (anonymized)."],
      ["Security", "Detect suspicious activity and protect against fraud."],
    ],
  },
  {
    title: "3. Third-Party Cookies",
    items: [
      ["Payment Providers", "May set cookies during checkout to prevent fraud."],
      ["No Ads", "We do not use third-party advertising cookies or trackers."],
    ],
  },
  {
    title: "4. Managing Cookies",
    items: [
      ["Browser Settings", "You can block or delete cookies through your browser preferences."],
      ["Impact", "Disabling essential cookies will prevent login and core features from working."],
      ["Contact", "Questions? Reach our team at privacy@dgot.realms."],
    ],
  },
];

function CookiesPage() {
  return (
    <SiteLayout>
      <PageBox title="Cookies Policy" icon="🍪">
        <p className="font-[VT323] text-xl leading-snug">
          This page explains how DGOT uses cookies and similar technologies when you visit our website
          or use our services.
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
          By continuing to browse DGOT, you consent to the use of cookies as described above.
        </p>
      </PageBox>
    </SiteLayout>
  );
}
