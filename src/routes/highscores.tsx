import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import { getHighscores, formatExp, type HighscoreEntry } from "@/lib/api";

export const Route = createFileRoute("/highscores")({
  head: () => ({
    meta: [
      { title: "DGOT — Ranking" },
      { name: "description", content: "Os melhores aventureiros de DGOT — experiência, magia e habilidades de combate." },
    ],
  }),
  component: HighscoresPage,
});

function HighscoresPage() {
  const [vocation, setVocation] = useState("");
  const [category, setCategory] = useState("Experience Points");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<HighscoreEntry[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async (voc: string, cat: string, pg: number) => {
    setLoading(true);
    setError("");
    try {
      const params: Record<string, string> = { page: String(pg) };
      if (voc) params.vocation = voc;
      if (cat) params.category = cat;
      const data = await getHighscores(params);
      setRows(data.highscores ?? []);
      setTotalPages(data.pagination?.total ?? 1);
    } catch {
      setError("Erro ao carregar ranking. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData(vocation, category, page);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    void fetchData(vocation, category, 1);
  };

  return (
    <SiteLayout>
      <PageBox title="Filtro de Ranking" icon="⚔">
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-3 font-[VT323] text-lg">
          <label className="flex flex-col gap-1">
            <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Vocação</span>
            <select
              className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-2"
              value={vocation}
              onChange={(e) => setVocation(e.target.value)}
            >
              <option value="">Todas</option>
              <option>Sorcerers</option>
              <option>Druids</option>
              <option>Paladins</option>
              <option>Knights</option>
              <option>Monks</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Categoria</span>
            <select
              className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Experience Points</option>
              <option>Axe Fighting</option>
              <option>Club Fighting</option>
              <option>Distance Fighting</option>
              <option>Sword Fighting</option>
              <option>Magic Level</option>
              <option>Shielding</option>
              <option>Fishing</option>
              <option>Fist Fighting</option>
            </select>
          </label>
          <button className="btn-gold pixel-text self-end text-[9px]">Buscar</button>
        </form>
        <p className="mt-3 font-[VT323] text-base text-[color:var(--muted-foreground)]">
          Habilidades exibidas não incluem bônus de lealdade ou equipamentos.
        </p>
      </PageBox>

      <PageBox title="Ranking" icon="👑">
        {loading && (
          <p className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">Carregando...</p>
        )}
        {error && (
          <p className="py-4 text-center font-[VT323] text-base text-red-700">{error}</p>
        )}
        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-[VT323] text-lg">
                <thead>
                  <tr className="bg-[color:var(--royal-deep)] text-[color:var(--gold-bright)]">
                    {["Rank", "Nome", "Vocação", "Nível", "Pontos"].map((h) => (
                      <th key={h} className="pixel-text border-2 border-[color:var(--gold-deep)] px-3 py-2 text-left text-[9px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.name} className={i % 2 ? "bg-[color:var(--parchment-dark)]" : "bg-[color:var(--parchment)]"}>
                      <td className="pixel-text border-2 border-[color:var(--gold-deep)] px-3 py-2 text-[9px]">
                        {(page - 1) * 50 + i + 1}
                      </td>
                      <td className="border-2 border-[color:var(--gold-deep)] px-3 py-2">
                        {r.name}{" "}
                        <span className="text-[color:var(--muted-foreground)]">
                          [{r.online ? "Online" : "Offline"}]
                        </span>
                      </td>
                      <td className="border-2 border-[color:var(--gold-deep)] px-3 py-2">{r.vocation}</td>
                      <td className="border-2 border-[color:var(--gold-deep)] px-3 py-2">{r.level}</td>
                      <td className="border-2 border-[color:var(--gold-deep)] px-3 py-2 text-right">
                        {formatExp(r.experience)}
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3 font-[VT323] text-lg">
                <button
                  disabled={page <= 1}
                  onClick={() => {
                    const np = page - 1;
                    setPage(np);
                    void fetchData(vocation, category, np);
                  }}
                  className="btn-royal pixel-text text-[9px] disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="pixel-text text-[9px]">
                  Página {page} de {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => {
                    const np = page + 1;
                    setPage(np);
                    void fetchData(vocation, category, np);
                  }}
                  className="btn-royal pixel-text text-[9px] disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </PageBox>
    </SiteLayout>
  );
}
