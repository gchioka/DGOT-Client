import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, memo, type ReactNode, type FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getServerStatus } from "@/lib/api";
import type { TranslationKey } from "@/lib/i18n";

import bgScene from "@/assets/pixel-scene.jpg";
import dgotLogo from "@/assets/dgot-logo.svg";
import knight from "@/assets/pixel-knight.png";
import dragon from "@/assets/pixel-dragon.png";
import boss from "@/assets/pixel-boss.png";

type NavGroup = {
  labelKey: TranslationKey;
  auth?: boolean;
  items: { labelKey: TranslationKey; to: string; auth?: boolean }[];
};

const navGroups: NavGroup[] = [
  {
    labelKey: "navAccount",
    items: [
      { labelKey: "accountManagement", to: "/account", auth: true },
      { labelKey: "manageAccount", to: "/account/manage", auth: true },
      { labelKey: "createCharacter", to: "/account/createcharacter", auth: true },
      { labelKey: "changePassword", to: "/account/changepassword", auth: true },
      { labelKey: "webshop", to: "/payment", auth: true },
      { labelKey: "premiumFeatures", to: "/premiumfeatures", auth: true },
      { labelKey: "foundGuild", to: "/foundguild", auth: true },
      { labelKey: "createAccount", to: "/createaccount" },
      { labelKey: "downloadClient", to: "/downloads" },
      { labelKey: "lostAccount", to: "/login" },
    ],
  },
  {
    labelKey: "navNews",
    items: [
      { labelKey: "lastNews", to: "/" },
      { labelKey: "eventSchedule", to: "/" },
    ],
  },
  {
    labelKey: "navLibrary",
    items: [
      { labelKey: "creatures", to: "/creatures" },
      { labelKey: "boostableBosses", to: "/creatures" },
      { labelKey: "items", to: "/items" },
    ],
  },
  {
    labelKey: "navCommunity",
    items: [
      { labelKey: "characters", to: "/characters" },
      { labelKey: "worlds", to: "/highscores" },
      { labelKey: "highscores", to: "/highscores" },
      { labelKey: "houses", to: "/houses" },
      { labelKey: "guilds", to: "/guilds" },
    ],
  },
  {
    labelKey: "navWars",
    auth: true,
    items: [
      { labelKey: "activeWars", to: "/guilds" },
      { labelKey: "pendingWars", to: "/guilds" },
      { labelKey: "surrenderWars", to: "/guilds" },
      { labelKey: "endedWars", to: "/guilds" },
    ],
  },
  {
    labelKey: "navSupport",
    items: [
      { labelKey: "rules", to: "/rules" },
      { labelKey: "privacyPolicy", to: "/privacy" },
      { labelKey: "cookiesPolicy", to: "/cookies" },
      { labelKey: "termsOfUse", to: "/terms" },
      { labelKey: "team", to: "/team" },
    ],
  },
];

const LANG_LABELS: Record<string, string> = { en: "US", pt: "BR", es: "ES" };

/**
 * Sidebar login panel — memoised so typing in the email/password fields
 * only re-renders this component, never the full SiteLayout.
 */
/**
 * Uncontrolled sidebar login — email/password have no value/onChange props.
 * Only error/loading cause React state updates. Typing is handled natively by the browser.
 */
const SidebarLogin = memo(function SidebarLogin() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [sideError, setSideError] = useState("");
  const [sideLoading, setSideLoading] = useState(false);

  return (
    <section className="frame-ornate">
      <div className="banner-header mb-4 text-center text-[10px] pixel-text">
        {isAuthenticated ? `${t("welcomeBack")} ${user?.name}` : t("loginTitle")}
      </div>
      <div className="space-y-3">
        {isAuthenticated ? (
          <>
            <div className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">
              {user?.name}
            </div>
            <button
              onClick={logout}
              className="btn-royal pixel-text w-full text-[9px] block text-center"
            >
              {t("logout")}
            </button>
          </>
        ) : (
          <form
            ref={formRef}
            onSubmit={async (e: FormEvent) => {
              e.preventDefault();
              setSideError("");
              const fd = new FormData(formRef.current!);
              const email = (fd.get("email") as string).trim();
              const password = fd.get("password") as string;
              if (!email || !password) return;
              setSideLoading(true);
              try {
                await login(email, password);
                navigate({ to: "/account" });
              } catch (err) {
                setSideError(err instanceof Error ? err.message : "Login failed.");
              } finally {
                setSideLoading(false);
              }
            }}
            className="space-y-2"
          >
            {sideError && (
              <p className="pixel-text text-[8px] text-red-700">{sideError}</p>
            )}
            <input
              type="email"
              name="email"
              required
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              className="w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 font-[VT323] text-lg placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]"
            />
            <input
              type="password"
              name="password"
              required
              placeholder={t("passwordPlaceholder")}
              autoComplete="current-password"
              className="w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 font-[VT323] text-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]"
            />
            <button
              type="submit"
              disabled={sideLoading}
              className="btn-gold pixel-text w-full text-[10px] block text-center disabled:opacity-60"
            >
              {sideLoading ? "..." : t("enterBtn")}
            </button>
            <Link to="/createaccount" className="btn-royal pixel-text w-full text-[9px] block text-center">
              {t("createAccount")}
            </Link>
          </form>
        )}
      </div>
    </section>
  );
});

export function SiteLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const [knightOpen, setKnightOpen] = useState(false);
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(navGroups.map((g) => [g.labelKey, false])),
  );
  const [playersOnline, setPlayersOnline] = useState<number | null>(null);
  const [boostedCreatureId, setBoostedCreatureId] = useState<number | null>(null);
  const [boostedBossId, setBoostedBossId] = useState<number | null>(null);

  const toggleGroup = (key: string) =>
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("dgot-cookie-consent") as "accepted" | "declined" | null;
    setConsent(saved);
    // Only open the banner if the user hasn't answered yet
    if (!saved) setKnightOpen(true);

    getServerStatus()
      .then((data) => {
        setPlayersOnline(data.playersonline);
        setBoostedCreatureId(data.creatureraceid);
        setBoostedBossId(data.bossraceid);
      })
      .catch(() => {});
  }, []);

  const saveConsent = (value: "accepted" | "declined") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dgot-cookie-consent", value);
    }
    setConsent(value);
    setKnightOpen(false);
  };

  return (
    <>
      <div className="sky-overlay" />
      <div
        className="scene-overlay"
        style={{ backgroundImage: `url(${bgScene})` }}
      />
      <div
        aria-hidden
        className="fixed inset-0 -z-[1] bg-gradient-to-b from-transparent via-transparent to-black/40"
      />

      <main className="relative min-h-screen px-4 py-6 lg:px-10">

        <header className="relative mx-auto mb-6 flex max-w-[1500px] flex-col items-center pt-2">
          <Link to="/" aria-label="DGOT home">
            <img
              src={dgotLogo}
              alt="DGOT crest"
              width={520}
              height={400}
              className="drop-shadow-[0_10px_18px_rgba(0,0,0,0.6)]"
            />
          </Link>
        </header>

        <div className="mx-auto mb-6 max-w-[1500px]">
          <div className="frame-ornate flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 font-[VT323] text-lg">
            <SocialLink label="Discord" icon="◈" />
            <SocialLink label="Instagram" icon="◉" />
            <SocialLink label={t("download")} icon="⬇" />
            <span className="flex items-center gap-2 text-[color:var(--wood-dark)]">
              <span className="online-dot" />
              <strong className="pixel-text text-[10px]">
                {playersOnline !== null ? playersOnline.toLocaleString("en-US") : "..."}
              </strong>{" "}
              {t("online")}
            </span>

            {/* Language switcher */}
            <span className="flex items-center gap-1 pixel-text text-[9px]">
              {(["en", "pt", "es"] as const).map((l, i) => (
                <span key={l} className="flex items-center gap-1">
                  {i > 0 && (
                    <span aria-hidden className="text-[color:var(--gold-deep)]">|</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setLang(l)}
                    title={l === "en" ? "English" : l === "pt" ? "Português" : "Español"}
                    className={`transition-colors ${
                      lang === l
                        ? "text-[color:var(--gold-bright)] font-bold"
                        : "text-[color:var(--wood-dark)] hover:text-[color:var(--royal-deep)]"
                    }`}
                  >
                    {LANG_LABELS[l]}
                  </button>
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
          {/* LEFT */}
          <aside className="space-y-6">
            <SidebarLogin />

            <Link
              to="/downloads"
              className="btn-gold pixel-text flex w-full items-center justify-center gap-2 py-4 text-[10px]"
            >
              ⬇ {t("download")}
            </Link>

            <nav className="space-y-5">
              {navGroups.map((group) => {
                if (group.auth && !isAuthenticated) return null;
                const items = group.items.filter((it) => !it.auth || isAuthenticated);
                if (items.length === 0) return null;
                const isSupport = group.labelKey === "navSupport";
                const isOpen = isSupport || (openGroups[group.labelKey] ?? false);
                return (
                  <div key={group.labelKey}>
                    {isSupport ? (
                      <div className="banner-header mb-2 px-3 text-center text-[9px] pixel-text">
                        {t(group.labelKey)}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.labelKey)}
                        aria-expanded={isOpen}
                        className="banner-header mb-2 flex w-full items-center justify-between gap-2 px-3 text-[9px] pixel-text"
                      >
                        <span className="flex-1 text-center">{t(group.labelKey)}</span>
                        <span aria-hidden className="text-[color:var(--gold-bright)]">
                          {isOpen ? "▾" : "▸"}
                        </span>
                      </button>
                    )}
                    {isOpen && (
                      <div className="space-y-2">
                        {items.map((item) => (
                          <Link
                            key={item.labelKey}
                            to={item.to}
                            className="nav-pill pixel-text text-[8px]"
                          >
                            <span>{t(item.labelKey)}</span>
                            <span aria-hidden className="text-[color:var(--gold-bright)]">
                              ›
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* CENTER */}
          <section className="space-y-6">
            {children}
          </section>

          {/* RIGHT */}
          <aside className="space-y-6">
            {isAuthenticated && (
              <section className="frame-ornate text-center">
                <div className="banner-header mb-3 pixel-text text-[9px]">
                  ✦ {t("webshopTitle")} ✦
                </div>
                <p className="pixel-text mb-2 text-[10px] text-[color:var(--royal-deep)]">
                  {t("exclusiveContent")}
                </p>
                <div className="my-3 grid grid-cols-3 gap-2">
                  <div className="thumb" />
                  <div className="thumb" />
                  <div className="thumb" />
                </div>
                <Link to="/payment" className="btn-gold pixel-text w-full block text-center text-[9px]">
                  {t("getCoins")}
                </Link>
              </section>
            )}

            <section className="frame-ornate">
              <div className="banner-header mb-3 text-center pixel-text text-[9px]">
                {t("boostedTitle")}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="thumb mb-2 overflow-hidden p-1">
                    {boostedBossId ? (
                      <img
                        src={`https://dgot.com.br/animoutfit.php?id=${boostedBossId}&addons=0&head=0&body=0&legs=0&feet=0&mount=0`}
                        alt="Boosted boss"
                        width={120}
                        height={120}
                        loading="lazy"
                        className="pixelated h-full w-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = boss; }}
                      />
                    ) : (
                      <img src={boss} alt="Boosted boss" width={120} height={120} loading="lazy" className="pixelated h-full w-full object-contain" />
                    )}
                  </div>
                  <div className="pixel-text text-[8px] text-[color:var(--wood-dark)]">{t("bossLabel")}</div>
                  <div className="font-[VT323] text-base">#{boostedBossId ?? "..."}</div>
                </div>
                <div className="text-center">
                  <div className="thumb mb-2 overflow-hidden p-1">
                    {boostedCreatureId ? (
                      <img
                        src={`https://dgot.com.br/animoutfit.php?id=${boostedCreatureId}&addons=0&head=0&body=0&legs=0&feet=0&mount=0`}
                        alt="Boosted creature"
                        width={120}
                        height={120}
                        loading="lazy"
                        className="pixelated h-full w-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = dragon; }}
                      />
                    ) : (
                      <img src={dragon} alt="Boosted creature" width={120} height={120} loading="lazy" className="pixelated h-full w-full object-contain" />
                    )}
                  </div>
                  <div className="pixel-text text-[8px] text-[color:var(--wood-dark)]">{t("creatureLabel")}</div>
                  <div className="font-[VT323] text-base">#{boostedCreatureId ?? "..."}</div>
                </div>
              </div>
            </section>

            <section className="frame-ornate text-center">
              <div className="banner-header mb-3 pixel-text text-[9px]">{t("discordTitle")}</div>
              <div className="pixel-text mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-md border-2 border-[color:var(--gold-deep)] bg-[color:var(--royal-deep)] text-2xl text-[color:var(--gold-bright)] shadow-[inset_0_0_0_1px_var(--gold-bright)]">
                ◈
              </div>
              <p className="mb-3 font-[VT323] text-lg">{t("discordDesc")}</p>
              <button className="btn-royal pixel-text w-full text-[9px]">{t("joinDiscord")}</button>
            </section>

            <section className="frame-ornate text-center">
              <div className="banner-header mb-3 pixel-text text-[9px]">{t("wikiTitle")}</div>
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-md border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] text-3xl">
                📖
              </div>
              <p className="mb-3 font-[VT323] text-lg">
                {t("wikiDesc")}
              </p>
              <button className="btn-gold pixel-text w-full text-[9px]">{t("exploreWiki")}</button>
            </section>
          </aside>
        </div>

        {/* Cookie / Knight banner — wrapper always pointer-events-none so it never blocks form inputs */}
        <div className="pointer-events-none fixed bottom-2 right-2 left-2 z-30 flex flex-col-reverse items-center gap-2 xl:left-auto xl:flex-row xl:items-end xl:gap-3">
          {knightOpen && (
            <div className="pointer-events-auto relative mb-2 w-full max-w-full animate-in fade-in zoom-in-95 duration-200 xl:mb-6 xl:w-[420px] xl:max-w-[40vw]">
              {/* Speech balloon */}
              <div className="relative max-h-[50vh] overflow-y-auto rounded-lg border-4 border-[color:var(--gold-deep)] bg-[color:var(--parchment)] p-4 text-[color:var(--ink)] shadow-[0_12px_28px_rgba(0,0,0,0.55),inset_0_0_0_2px_var(--gold-bright)] xl:max-h-[70vh] xl:p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="pixel-text text-[11px] text-[color:var(--gold-deep)] [text-shadow:_0_1px_0_var(--wood-dark)]">
                      {t("cookieBannerTitle")}
                    </h2>
                    <p className="font-[VT323] text-base text-[color:var(--wood-dark)]">
                      {t("cookieBannerSubtitle")}
                    </p>
                  </div>
                </div>

                <p className="font-[VT323] text-base leading-snug text-[color:var(--ink)]">
                  {t("cookieBannerBody")}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 font-[VT323] text-base">
                  <Link to="/privacy" className="underline text-[color:var(--royal-deep)] hover:text-[color:var(--gold-deep)]">
                    {t("privacyPolicy")}
                  </Link>
                  <span className="text-[color:var(--gold-deep)]">|</span>
                  <Link to="/terms" className="underline text-[color:var(--royal-deep)] hover:text-[color:var(--gold-deep)]">
                    {t("termsOfUse")}
                  </Link>
                  <span className="text-[color:var(--gold-deep)]">|</span>
                  <Link to="/cookies" className="underline text-[color:var(--royal-deep)] hover:text-[color:var(--gold-deep)]">
                    {t("cookiesPolicy")}
                  </Link>
                  <span className="text-[color:var(--gold-deep)]">|</span>
                  <Link to="/legal" className="underline text-[color:var(--royal-deep)] hover:text-[color:var(--gold-deep)]">
                    {t("legalDocuments")}
                  </Link>
                </div>

                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => saveConsent("declined")}
                    className="pixel-text rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--parchment-dark)] px-4 py-2 text-[10px] text-[color:var(--wood-dark)] hover:bg-[color:var(--wood-light)]"
                  >
                    {t("cookieDecline")}
                  </button>
                  <button
                    onClick={() => saveConsent("accepted")}
                    className="btn-gold pixel-text text-[10px]"
                  >
                    {t("cookieAccept")}
                  </button>
                </div>

              </div>

              {/* Balloon tail pointing to the knight (right side) — hidden on mobile */}
              <span
                aria-hidden
                className="absolute bottom-6 -right-3 hidden h-0 w-0 border-y-[14px] border-l-[18px] border-y-transparent border-l-[color:var(--gold-deep)] xl:block"
              />
              <span
                aria-hidden
                className="absolute bottom-[26px] -right-[7px] hidden h-0 w-0 border-y-[10px] border-l-[14px] border-y-transparent border-l-[color:var(--parchment)] xl:block"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (consent) setKnightOpen((o) => !o);
            }}
            aria-label={consent ? "Open Privacy Policy" : "Privacy Policy Knight"}
            aria-expanded={knightOpen}
            className="group pointer-events-auto hidden h-[28vh] w-auto cursor-pointer xl:block xl:h-[24vh]"
          >
            <img
              src={knight}
              alt="Pixel knight"
              width={240}
              height={320}
              loading="lazy"
              className="pixelated h-full w-auto object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.55)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:drop-shadow-[0_14px_22px_rgba(255,200,80,0.45)]"
            />
          </button>
        </div>

        <footer className="mx-auto mt-10 max-w-[1500px] text-center">
          <div className="flex flex-col items-center gap-3 xl:hidden">
            <button
              type="button"
              onClick={() => {
                if (consent) setKnightOpen((o) => !o);
              }}
              aria-label={consent ? "Open Privacy Policy" : "Privacy Policy Knight"}
              aria-expanded={knightOpen}
              className="group pointer-events-auto h-[22vh] w-auto cursor-pointer"
            >
              <img
                src={knight}
                alt="Pixel knight"
                width={240}
                height={320}
                loading="lazy"
                className="pixelated h-full w-auto object-contain drop-shadow-[0_12px_16px_rgba(0,0,0,0.55)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:drop-shadow-[0_14px_22px_rgba(255,200,80,0.45)]"
              />
            </button>
          </div>
          <div className="pixel-text text-[9px] tracking-[0.2em] text-[color:var(--gold-bright)] [text-shadow:_0_1px_0_var(--wood-dark)]">
            {t("footerCopyright")}
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3 pixel-text text-[9px] tracking-[0.15em] text-[color:var(--gold-bright)] [text-shadow:_0_1px_0_var(--wood-dark)]">
            <Link to="/privacy" className="transition-colors hover:text-[color:var(--gold)] hover:underline">
              {t("privacyPolicy")}
            </Link>
            <span className="text-[color:var(--gold-deep)]">|</span>
            <Link to="/cookies" className="transition-colors hover:text-[color:var(--gold)] hover:underline">
              {t("cookiesPolicy")}
            </Link>
            <span className="text-[color:var(--gold-deep)]">|</span>
            <Link to="/terms" className="transition-colors hover:text-[color:var(--gold)] hover:underline">
              {t("termsOfUse")}
            </Link>
            <span className="text-[color:var(--gold-deep)]">|</span>
            <Link to="/legal" className="transition-colors hover:text-[color:var(--gold)] hover:underline">
              {t("legalDocuments")}
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}

function SocialLink({ label, icon }: { label: string; icon: string }) {
  return (
    <a
      href="#"
      className="inline-flex items-center gap-1.5 font-[VT323] text-lg text-[color:var(--wood-dark)] transition-colors hover:text-[color:var(--royal-deep)]"
    >
      <span
        aria-hidden
        className="inline-flex h-6 w-6 items-center justify-center rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--gold)] text-xs"
      >
        {icon}
      </span>
      {label}
    </a>
  );
}

export function PageBox({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <article className="frame-ornate">
      <div className="banner-header mb-5 flex items-center justify-center gap-3 pixel-text text-[10px]">
        {icon && <span aria-hidden>{icon}</span>} {title}
      </div>
      {children}
    </article>
  );
}
