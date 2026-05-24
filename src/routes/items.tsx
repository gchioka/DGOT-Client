import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import { useState, useEffect, useCallback, memo, type FormEvent } from "react";

export const Route = createFileRoute("/items")({
  head: () => ({
    meta: [
      { title: "DGOT — Itens" },
      { name: "description", content: "Biblioteca de itens de DGOT — armas, armaduras, anéis e mais." },
    ],
  }),
  component: ItemsPage,
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface Item {
  id: number;
  name: string;
  article: string;
  category: string;
  slotType: string;
  weaponType: string;
  attack: number;
  defense: number;
  extradef: number;
  armor: number;
  range: number;
  weight: number;
  level: number;
  maglevel: number;
  vocation: string;
  hands: string;
  hitchance: number;
  description: string;
  slug: string;
}

interface Pagination { current: number; total: number; per_page: number; count: number; }

interface ItemsResponse {
  items?: Item[];
  categories?: Record<string, number>;
  pagination?: Pagination;
  errorMessage?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugImg(name: string) {
  return name.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("_");
}

const CAT_PT: Record<string, string> = {
  "Helmets":             "Capacetes",
  "Armors":              "Armaduras",
  "Shields":             "Escudos",
  "Legs":                "Calças",
  "Spellbooks":          "Livros de Magia",
  "Boots":               "Botas",
  "Quivers":             "Aljavas",
  "Extra Slots":         "Slots Extras",
  "Axe Weapons":         "Machados",
  "Club Weapons":        "Maças",
  "Sword Weapons":       "Espadas",
  "Rods":                "Cajados",
  "Wands":               "Varinhas",
  "Ammunition":          "Munição",
  "Distance Weapons":    "Armas de Distância",
  "Fist Weapons":        "Combate Corpo a Corpo",
  "Backpacks":           "Mochilas",
  "Rings":               "Anéis",
  "Amulets & Necklaces": "Amuletos e Colares",
};

// ── Item Image ─────────────────────────────────────────────────────────────────

const ItemImage = memo(function ItemImage({ name, size = 32 }: { name: string; size?: number }) {
  const [src, setSrc] = useState(
    `https://tibia.fandom.com/wiki/Special:Redirect/file/${slugImg(name)}.gif`
  );
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ imageRendering: "pixelated", objectFit: "contain", width: size, height: size }}
      onError={() => setSrc("/town-thais.png")}
    />
  );
});

// ── Item Card ──────────────────────────────────────────────────────────────────

const ItemCard = memo(function ItemCard({ item, selected, onClick }: { item: Item; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`frame-ornate flex flex-col items-center gap-2 p-3 text-center transition-colors cursor-pointer w-full ${selected ? "bg-[color:var(--parchment)]" : "hover:bg-[color:var(--parchment)]"}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--royal-deep)]">
        <ItemImage name={item.name} size={40} />
      </div>
      <span className="pixel-text text-[8px] text-[color:var(--royal-deep)] leading-tight line-clamp-2">
        {item.name}
      </span>
      {item.level > 0 && (
        <span className="pixel-text text-[7px] text-[color:var(--wood-dark)]">Nv. {item.level}</span>
      )}
    </button>
  );
});

// ── Item Detail Panel ─────────────────────────────────────────────────────────

function ItemDetail({ item, onClose }: { item: Item; onClose: () => void }) {
  const stats: { label: string; value: string | number }[] = [];
  if (item.attack > 0)    stats.push({ label: "Ataque",   value: item.attack });
  if (item.defense > 0)   stats.push({ label: "Defesa",   value: item.extradef ? `${item.defense} +${item.extradef}` : item.defense });
  if (item.armor > 0)     stats.push({ label: "Armadura", value: item.armor });
  if (item.range > 0)     stats.push({ label: "Alcance",  value: item.range });
  if (item.hitchance > 0) stats.push({ label: "Precisão", value: `${item.hitchance}%` });
  if (item.weight > 0)    stats.push({ label: "Peso",     value: `${item.weight} oz` });
  if (item.level > 0)     stats.push({ label: "Nível",    value: item.level });
  if (item.maglevel > 0)  stats.push({ label: "Magia",    value: item.maglevel });
  if (item.hands)         stats.push({ label: "Mãos",     value: item.hands === "two" ? "Duas mãos" : "Uma mão" });
  if (item.vocation)      stats.push({ label: "Vocação",  value: item.vocation });
  if (item.weaponType)    stats.push({ label: "Tipo",     value: item.weaponType });

  return (
    <div className="frame-ornate p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--royal-deep)]">
            <ItemImage name={item.name} size={48} />
          </div>
          <div>
            <h3 className="pixel-text text-[10px] text-[color:var(--royal-deep)]">{item.name}</h3>
            <p className="font-[VT323] text-base text-[color:var(--wood-dark)]">
              {CAT_PT[item.category] ?? item.category}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="pixel-text text-[9px] text-[color:var(--wood-dark)] hover:text-[color:var(--royal-deep)]"
        >
          ✕ Fechar
        </button>
      </div>

      {stats.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-x-4 gap-y-1">
          {stats.map((s) => (
            <div key={s.label} className="flex justify-between border-b border-[color:var(--gold-deep)]/30 py-0.5 font-[VT323] text-lg">
              <span className="text-[color:var(--wood-dark)]">{s.label}</span>
              <span className="font-bold text-[color:var(--royal-deep)]">{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {item.description && (
        <p className="font-[VT323] text-lg italic leading-snug text-[color:var(--wood-dark)]">
          "{item.description}"
        </p>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

async function fetchItems(params: Record<string, string>): Promise<ItemsResponse> {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/v1/items${qs ? `?${qs}` : ""}`);
  return res.json() as Promise<ItemsResponse>;
}

function ItemsPage() {
  const [category, setCategory] = useState("");
  const [search, setSearch]     = useState("");
  const [page, setPage]         = useState(1);
  const [data, setData]         = useState<ItemsResponse>({});
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<Item | null>(null);

  const load = useCallback(async (cat: string, s: string, pg: number) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(pg), per_page: "24" };
    if (cat) params.category = cat;
    if (s)   params.search   = s;
    const res = await fetchItems(params).catch(() => ({}));
    setData(res);
    setLoading(false);
  }, []);

  useEffect(() => { void load("", "", 1); }, [load]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSelected(null);
    void load(category, search, 1);
  };

  const changePage = (pg: number) => {
    setPage(pg);
    setSelected(null);
    void load(category, search, pg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cats  = data.categories ?? {};
  const items = data.items ?? [];
  const pag   = data.pagination;
  const total = Object.values(cats).reduce((a, b) => a + b, 0);

  return (
    <SiteLayout>
      <PageBox title="Itens" icon="⚔">
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-3 font-[VT323] text-lg">
          <label className="flex flex-col gap-1">
            <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Categoria</span>
            <select
              className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Todas ({total})</option>
              {Object.entries(cats).map(([cat, cnt]) => (
                <option key={cat} value={cat}>{CAT_PT[cat] ?? cat} ({cnt})</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Buscar por nome</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ex: fire sword"
              className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-2 font-[VT323] text-lg placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]"
            />
          </label>
          <button className="btn-gold pixel-text text-[9px] self-end">Buscar</button>
        </form>
      </PageBox>

      {selected && (
        <ItemDetail item={selected} onClose={() => setSelected(null)} />
      )}

      <PageBox title={`Itens${pag ? ` — ${pag.count} encontrados` : ""}`} icon="📜">
        {loading && (
          <p className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">Carregando...</p>
        )}
        {!loading && items.length === 0 && (
          <p className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">
            Nenhum item encontrado.
          </p>
        )}
        {!loading && items.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  selected={selected?.id === item.id}
                  onClick={() => setSelected(selected?.id === item.id ? null : item)}
                />
              ))}
            </div>

            {pag && pag.total > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3 font-[VT323] text-lg">
                <button
                  disabled={page <= 1}
                  onClick={() => changePage(page - 1)}
                  className="btn-royal pixel-text text-[9px] disabled:opacity-40"
                >
                  ← Anterior
                </button>
                <span className="pixel-text text-[9px]">Página {page} de {pag.total}</span>
                <button
                  disabled={page >= pag.total}
                  onClick={() => changePage(page + 1)}
                  className="btn-royal pixel-text text-[9px] disabled:opacity-40"
                >
                  Próximo →
                </button>
              </div>
            )}
          </>
        )}
      </PageBox>
    </SiteLayout>
  );
}
