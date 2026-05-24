import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import {
  useState, useEffect, useCallback, useRef, memo, type FormEvent,
} from "react";
import {
  getCreaturesApi,
  type Creature,
  type CreaturesResponse,
} from "@/lib/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

const ELEMENT_ICONS: Record<string, string> = {
  physical:     "⚔️",
  energy:       "⚡",
  fire:         "🔥",
  ice:          "❄️",
  earth:        "🌿",
  death:        "💀",
  holy:         "✨",
  "life drain": "🩸",
  "mana drain": "💧",
  drown:        "🌊",
};

function fmtCat(cat: string) {
  return cat.replace(/_/g, " ");
}

function elementLabel(pct: number) {
  if (pct >= 100) return "Immune";
  if (pct > 0)    return `+${pct}% resist`;
  if (pct < 0)    return `${Math.abs(pct)}% weak`;
  return "Neutral";
}

function elementColor(pct: number) {
  if (pct >= 100) return "text-[color:var(--gold-deep)] font-bold";
  if (pct > 0)    return "text-green-700";
  if (pct < 0)    return "text-red-700";
  return "text-[color:var(--wood-mid)]";
}

function stars(n: number) {
  if (!n) return null;
  return (
    <span className="text-[color:var(--gold-deep)]">
      {"★".repeat(n)}
      <span className="opacity-30">{"★".repeat(Math.max(0, 5 - n))}</span>
    </span>
  );
}

function lootColor(pct: number) {
  if (pct >= 20) return "text-green-700";
  if (pct >= 5)  return "text-[color:var(--gold-mid)]";
  if (pct >= 1)  return "text-[color:var(--wood-dark)]";
  return "text-[color:var(--wood-mid)]";
}

// ── Creature Image ────────────────────────────────────────────────────────────
//
// Fallback chain (first source that loads wins):
//   1. /wiki-sprites/{slug}.webp  — animated WebP from tibia.fandom.com
//   2. /outfits/{lt}/anim.gif     — animated GIF from raw sprite frames
//   3. /outfits/{lt}/preview.png  — best static frame
//   4. 🐾 paw placeholder
//
// Card slot is always 64×64. Images render at their natural size (max 64px)
// centered inside the slot — smaller sprites stay small, not stretched.

const CARD_IMG_SIZE = 64;  // fixed card image slot (px)

function slugName(n: string) {
  return n.toLowerCase()
    .replace(/ /g, "_")
    .replace(/'/g, "")
    .replace(/"/g, "")
    .replace(/\//g, "_");
}

const CreatureImg = memo(function CreatureImg({
  looktype,
  name,
  containerSize = CARD_IMG_SIZE,
}: {
  looktype: number;
  name: string;
  containerSize?: number;
}) {
  const [srcIdx, setSrcIdx] = useState(0);

  // Source list: wiki always first; outfit sprites only when looktype > 0
  const srcs = [
    `/wiki-sprites/${slugName(name)}.webp`,
    ...(looktype
      ? [`/outfits/${looktype}/anim.gif`, `/outfits/${looktype}/preview.png`]
      : []),
  ];

  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{ width: containerSize, height: containerSize }}
    >
      {srcIdx >= srcs.length ? (
        // Generic paw placeholder when no image found
        <img
          src="/wiki-sprites/_placeholder.webp"
          alt=""
          style={{ width: 32, height: 32, imageRendering: "pixelated", opacity: 0.35 }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      ) : (
        <img
          key={srcs[srcIdx]}
          src={srcs[srcIdx]}
          alt={name}
          style={{
            maxWidth:  containerSize,
            maxHeight: containerSize,
            width:  "auto",
            height: "auto",
            imageRendering: "pixelated",
          }}
          onError={() => setSrcIdx((i) => i + 1)}
          loading="lazy"
        />
      )}
    </div>
  );
});

// ── Creature Card ─────────────────────────────────────────────────────────────

const CreatureCard = memo(function CreatureCard({
  creature,
  onClick,
}: {
  creature: Creature;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="frame-ornate flex flex-col items-center gap-1 p-3 text-center transition hover:brightness-105 active:scale-[0.98] cursor-pointer w-full"
    >
      <CreatureImg
        looktype={creature.looktype}
        name={creature.name}
      />
      <div className="pixel-text text-[9px] leading-tight text-[color:var(--royal-deep)] line-clamp-2 min-h-[2em]">
        {creature.name}
      </div>
      {creature.stars > 0 && (
        <div className="text-[11px] leading-none">{stars(creature.stars)}</div>
      )}
      <div className="font-[VT323] text-sm leading-tight">
        <span className="text-red-700">♥ {creature.hp.toLocaleString()}</span>
        {" · "}
        <span className="text-[color:var(--gold-mid)]">✦ {creature.exp.toLocaleString()}</span>
      </div>
    </button>
  );
});

// ── Detail Modal ──────────────────────────────────────────────────────────────

function CreatureModal({
  creature,
  onClose,
}: {
  creature: Creature;
  onClose: () => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const sigElements = creature.elements.filter((el) => el.percent !== 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-xl sm:rounded-xl bg-[color:var(--parchment)] border-4 border-[color:var(--wood-dark)] shadow-2xl">

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center gap-3 border-b-2 border-[color:var(--wood-mid)] bg-[color:var(--parchment-dark)] px-4 py-3">
          <CreatureImg
            looktype={creature.looktype}
            name={creature.name}
            containerSize={96}
          />
          <div className="flex-1 min-w-0">
            <div className="pixel-text text-[11px] text-[color:var(--royal-deep)] leading-tight">{creature.name}</div>
            <div className="font-[VT323] text-base text-[color:var(--wood-mid)]">
              {fmtCat(creature.class)}
              {creature.stars > 0 && <span className="ml-2">{stars(creature.stars)}</span>}
            </div>
            {creature.description && (
              <div className="font-[VT323] text-sm italic text-[color:var(--wood-mid)] line-clamp-1 mt-0.5">
                {creature.description}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 pixel-text rounded border-2 border-[color:var(--wood-dark)] bg-[color:var(--parchment)] px-2 py-1 text-[10px] text-[color:var(--wood-dark)] hover:bg-[color:var(--parchment-dark)]"
          >
            ✕ Close
          </button>
        </div>

        <div className="p-4 space-y-5">

          {/* ── Primary Stats ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "Health",     value: creature.hp.toLocaleString(),     icon: "♥",  c: "text-red-700" },
              { label: "Experience", value: creature.exp.toLocaleString(),    icon: "✦",  c: "text-[color:var(--gold-mid)]" },
              { label: "Speed",      value: creature.speed,                   icon: "⚡", c: "text-blue-700" },
              { label: "Armor",      value: creature.defenses.armor,          icon: "🛡", c: "text-[color:var(--wood-mid)]" },
            ].map(({ label, value, icon, c }) => (
              <div key={label} className="rounded border-2 border-[color:var(--wood-mid)] bg-[color:var(--parchment-dark)] p-2 text-center">
                <div className={`font-[VT323] text-2xl ${c}`}>{icon} {value}</div>
                <div className="pixel-text text-[8px] text-[color:var(--wood-mid)] mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* ── Bestiary Info ── */}
          {(creature.toKill > 0 || creature.charmsPoints > 0 || creature.locations) && (
            <div className="rounded border-2 border-[color:var(--gold-mid)] bg-[color:var(--parchment-dark)] px-3 py-2 font-[VT323] text-base space-y-0.5">
              {creature.toKill > 0 && (
                <div>
                  <span className="text-[color:var(--wood-dark)]">Kills required: </span>
                  <span className="text-[color:var(--gold-deep)]">{creature.toKill.toLocaleString()}</span>
                </div>
              )}
              {creature.charmsPoints > 0 && (
                <div>
                  <span className="text-[color:var(--wood-dark)]">Charm points: </span>
                  <span className="text-[color:var(--gold-deep)]">{creature.charmsPoints}</span>
                </div>
              )}
              {creature.locations && (
                <div>
                  <span className="text-[color:var(--wood-dark)]">Found in: </span>
                  <span className="text-[color:var(--wood-mid)]">{creature.locations}</span>
                </div>
              )}
            </div>
          )}

          {/* ── Resistances & Weaknesses ── */}
          {sigElements.length > 0 && (
            <section>
              <h3 className="pixel-text text-[10px] text-[color:var(--royal-deep)] mb-2">
                Resistances & Weaknesses
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {sigElements.map((el) => (
                  <div
                    key={el.type}
                    className="flex items-center justify-between gap-2 rounded border border-[color:var(--wood-mid)] bg-[color:var(--parchment-dark)] px-2 py-1"
                  >
                    <span className="font-[VT323] text-base capitalize">
                      {ELEMENT_ICONS[el.type] ?? "◈"} {el.type}
                    </span>
                    <span className={`pixel-text text-[9px] shrink-0 ${elementColor(el.percent)}`}>
                      {elementLabel(el.percent)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Condition Immunities ── */}
          {creature.immunities.length > 0 && (
            <section>
              <h3 className="pixel-text text-[10px] text-[color:var(--royal-deep)] mb-2">
                Immune to Conditions
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {creature.immunities.map((im) => (
                  <span
                    key={im}
                    className="rounded border border-[color:var(--gold-mid)] bg-amber-50 px-2 py-0.5 font-[VT323] text-sm capitalize text-[color:var(--wood-dark)]"
                  >
                    {im}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ── Attacks ── */}
          {creature.attacks.length > 0 && (
            <section>
              <h3 className="pixel-text text-[10px] text-[color:var(--royal-deep)] mb-2">Attacks</h3>
              <div className="space-y-1">
                {creature.attacks.map((atk, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded border border-[color:var(--wood-mid)] bg-[color:var(--parchment-dark)] px-2 py-1"
                  >
                    <span className="font-[VT323] text-base capitalize">
                      {ELEMENT_ICONS[atk.type] ?? "⚔️"} {atk.name}
                    </span>
                    <span className="font-[VT323] text-sm text-red-800 shrink-0">
                      {atk.minDamage}–{atk.maxDamage}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Loot Table ── */}
          {creature.loot.length > 0 && (
            <section>
              <h3 className="pixel-text text-[10px] text-[color:var(--royal-deep)] mb-2">
                Loot Table ({creature.loot.length} items)
              </h3>
              <div className="max-h-52 overflow-y-auto rounded border-2 border-[color:var(--wood-mid)] bg-[color:var(--parchment-dark)]">
                {creature.loot.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-3 py-1 border-b border-[color:var(--wood-mid)]/20 last:border-0"
                  >
                    <span className="font-[VT323] text-base capitalize flex-1 truncate pr-2">
                      {item.name}
                    </span>
                    <span className="font-[VT323] text-sm shrink-0 flex items-center gap-2">
                      {item.maxCount > 1 && (
                        <span className="text-[color:var(--wood-mid)]">×{item.maxCount}</span>
                      )}
                      <span className={lootColor(item.percent)}>
                        {item.percent.toFixed(2)}%
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {creature.loot.length === 0 && creature.attacks.length === 0 && (
            <p className="font-[VT323] text-base text-[color:var(--wood-mid)] text-center py-2">
              No loot or attack data available for this creature.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pagination ─────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const lo = Math.max(1, page - 2);
  const hi = Math.min(totalPages, page + 2);
  const pages: number[] = [];
  for (let i = lo; i <= hi; i++) pages.push(i);

  const btn = (label: string, p: number, disabled: boolean) => (
    <button
      key={label}
      onClick={() => !disabled && onPage(p)}
      disabled={disabled}
      className={`pixel-text text-[9px] rounded border-2 px-2 py-1 disabled:opacity-40 ${
        p === page && typeof label === "number"
          ? "border-[color:var(--gold-deep)] bg-[color:var(--gold-deep)] text-[color:var(--parchment)]"
          : "border-[color:var(--wood-mid)] bg-[color:var(--parchment-dark)] text-[color:var(--wood-dark)] hover:border-[color:var(--gold-mid)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 pt-4">
      {btn("«", 1, page === 1)}
      {btn("‹", page - 1, page === 1)}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`pixel-text text-[9px] rounded border-2 px-2 py-1 ${
            p === page
              ? "border-[color:var(--gold-deep)] bg-[color:var(--gold-deep)] text-[color:var(--parchment)]"
              : "border-[color:var(--wood-mid)] bg-[color:var(--parchment-dark)] text-[color:var(--wood-dark)] hover:border-[color:var(--gold-mid)]"
          }`}
        >
          {p}
        </button>
      ))}
      {btn("›", page + 1, page === totalPages)}
      {btn("»", totalPages, page === totalPages)}
      <span className="font-[VT323] text-sm text-[color:var(--wood-mid)] ml-2">
        {page} / {totalPages}
      </span>
    </div>
  );
}

// ── Category Filter ────────────────────────────────────────────────────────────

function CategoryFilter({
  categories,
  active,
  onSelect,
}: {
  categories: Record<string, number>;
  active: string;
  onSelect: (cat: string) => void;
}) {
  const total    = Object.values(categories).reduce((a, b) => a + b, 0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(false);

  const checkArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkArrows, { passive: true });
    const ro = new ResizeObserver(checkArrows);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", checkArrows); ro.disconnect(); };
  }, [categories, checkArrows]);

  const scroll = (dir: 1 | -1) =>
    scrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });

  const tabClass = (isActive: boolean) =>
    `shrink-0 pixel-text text-[9px] rounded border-2 px-2 py-1 whitespace-nowrap transition ${
      isActive
        ? "border-[color:var(--gold-deep)] bg-[color:var(--gold-deep)] text-[color:var(--parchment)]"
        : "border-[color:var(--wood-mid)] bg-[color:var(--parchment-dark)] text-[color:var(--wood-dark)] hover:border-[color:var(--gold-mid)]"
    }`;

  /* Gradient + animated arrow overlaid on each side */
  const Arrow = ({ dir }: { dir: "left" | "right" }) => {
    const visible = dir === "left" ? canLeft : canRight;
    return (
      <button
        onClick={() => scroll(dir === "left" ? -1 : 1)}
        aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
        className={`
          absolute top-0 bottom-[8px] z-10 flex items-center
          ${dir === "left" ? "left-0 pl-1 pr-3 bg-gradient-to-r" : "right-0 pr-1 pl-3 bg-gradient-to-l"}
          from-[color:var(--parchment)] via-[color:var(--parchment)]/90 to-transparent
          transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      >
        <span
          className="pixel-text text-[color:var(--gold-deep)] text-base leading-none"
          style={{ animation: "cat-arrow-pulse 1s ease-in-out infinite" }}
        >
          {dir === "left" ? "◀" : "▶"}
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Inject webkit scrollbar hide + arrow animation once */}
      <style>{`
        .cat-scroll::-webkit-scrollbar { display: none; }
        @keyframes cat-arrow-pulse {
          0%, 100% { opacity: 1; transform: translateX(0); }
          50%       { opacity: 0.5; transform: translateX(${canLeft ? "-" : ""}2px); }
        }
      `}</style>

      <div className="relative mb-3">
        <Arrow dir="left" />
        <div
          ref={scrollRef}
          className="cat-scroll flex gap-1.5 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          <button className={tabClass(active === "")} onClick={() => onSelect("")}>
            All ({total})
          </button>
          {Object.entries(categories).map(([cat, count]) => (
            <button
              key={cat}
              className={tabClass(active === cat)}
              onClick={() => onSelect(cat)}
            >
              {fmtCat(cat)} ({count})
            </button>
          ))}
        </div>
        <Arrow dir="right" />
      </div>
    </>
  );
}

// ── Creature Section ──────────────────────────────────────────────────────────

const PER_PAGE = 24;

function CreatureSection({ type }: { type: "creatures" | "bosses" }) {
  const [data, setData]           = useState<CreaturesResponse | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [page, setPage]           = useState(1);
  const [category, setCategory]   = useState("");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState<Creature | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(
    async (p: number, cat: string, s: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await getCreaturesApi({
          type,
          category: cat,
          search: s,
          page: p,
          per_page: PER_PAGE,
        });
        if (res.errorCode) throw new Error(res.errorMessage ?? "Failed to load.");
        setData(res);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    },
    [type],
  );

  useEffect(() => { load(1, "", ""); }, [load]);

  const handleCategory = (cat: string) => {
    setCategory(cat);
    setPage(1);
    load(1, cat, search);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setPage(1);
      load(1, category, val);
    }, 350);
  };

  const handlePage = (p: number) => {
    setPage(p);
    load(p, category, search);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const title = type === "bosses" ? "Bosses" : "Creatures";
  const icon  = type === "bosses" ? "💀" : "🐉";

  return (
    <PageBox title={title} icon={icon}>

      {/* Search bar */}
      <div className="mb-3 flex items-center gap-2">
        <input
          type="search"
          placeholder={`Search ${title.toLowerCase()}…`}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full max-w-xs rounded border-2 border-[color:var(--wood-mid)] bg-[color:var(--parchment-dark)] px-3 py-1.5 font-[VT323] text-base text-[color:var(--wood-dark)] placeholder:text-[color:var(--wood-mid)]/60 focus:border-[color:var(--gold-deep)] focus:outline-none"
        />
        {data && (
          <span className="font-[VT323] text-sm text-[color:var(--wood-mid)] shrink-0">
            {data.total.toLocaleString()} found
          </span>
        )}
      </div>

      {/* Category filter */}
      {data && (
        <CategoryFilter
          categories={data.categories}
          active={category}
          onSelect={handleCategory}
        />
      )}

      {/* States */}
      {loading && (
        <div className="py-16 text-center font-[VT323] text-2xl text-[color:var(--wood-mid)] animate-pulse">
          Loading {title.toLowerCase()}…
        </div>
      )}
      {!loading && error && (
        <div className="rounded border-2 border-red-700 bg-red-50/40 px-3 py-2 font-[VT323] text-base text-red-800">
          {error}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && data && (
        <>
          {data.items.length === 0 ? (
            <div className="py-10 text-center font-[VT323] text-xl text-[color:var(--wood-mid)]">
              No {title.toLowerCase()} found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {data.items.map((c) => (
                <CreatureCard
                  key={`${c.tag}-${c.name}`}
                  creature={c}
                  onClick={() => setSelected(c)}
                />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={data.total_pages}
            onPage={handlePage}
          />
        </>
      )}

      {/* Detail modal */}
      {selected && (
        <CreatureModal creature={selected} onClose={() => setSelected(null)} />
      )}
    </PageBox>
  );
}

// ── Route ─────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/creatures")({
  head: () => ({
    meta: [
      { title: "DGOT — Creatures & Bosses" },
      {
        name: "description",
        content:
          "Complete bestiary of DGOT — every creature and boss with loot tables, resistances and stats. Plan your next hunt.",
      },
    ],
  }),
  component: CreaturesPage,
});

function CreaturesPage() {
  return (
    <SiteLayout>
      <PageBox title="Bestiary" icon="🐉">
        <p className="font-[VT323] text-xl leading-snug">
          Every creature catalogued — loot tables, resistances, attack damage and kill counts.
          Study their weaknesses before setting foot in their lair.
        </p>
      </PageBox>

      <CreatureSection type="creatures" />
      <CreatureSection type="bosses" />
    </SiteLayout>
  );
}
