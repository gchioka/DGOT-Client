import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import { searchCharacters, getCharacterDetail, type SearchCharacterResult, type CharacterDetail } from "@/lib/api";

export const Route = createFileRoute("/characters")({
  head: () => ({
    meta: [
      { title: "DGOT — Characters" },
      { name: "description", content: "Search any character across the DGOT realms — outfits, level and vocation." },
    ],
  }),
  component: CharactersPage,
});

function CharactersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchCharacterResult[]>([]);
  const [detail, setDetail] = useState<CharacterDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setDetail(null);
    setSearched(true);
    try {
      const data = await searchCharacters(query.trim());
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setError("Search failed. Try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (name: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await getCharacterDetail(name);
      if ("error" in data) {
        setError(data.error);
        setDetail(null);
      } else {
        setDetail(data);
      }
    } catch {
      setError("Could not load character details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <PageBox title="Search Character" icon="🔍">
        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3 font-[VT323] text-lg">
          <label className="flex flex-1 min-w-[180px] flex-col gap-1">
            <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Character Name</span>
            <input
              type="text"
              placeholder="name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2"
            />
          </label>
          <button className="btn-gold pixel-text text-[9px]">Search</button>
        </form>
      </PageBox>

      {/* Detalhes de um personagem */}
      {detail && (
        <PageBox title={detail.info.name} icon="🛡">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-shrink-0 text-center">
              <img
                src={detail.outfit.image_url}
                alt={detail.info.name}
                width={128}
                height={128}
                className="pixelated mx-auto"
              />
            </div>
            <div className="flex-1 font-[VT323] text-lg">
              <div className="grid gap-1 sm:grid-cols-2">
                {[
                  ["Name", detail.info.name],
                  ["Vocation", detail.info.vocation],
                  ["Level", String(detail.info.level)],
                  ["World", detail.info.world],
                  ["Status", detail.info.online ? "🟢 Online" : "Offline"],
                  ["Town", detail.info.town_name],
                  ["Sex", detail.info.sex],
                  ["Premium", detail.info.premdays],
                  ["Last Logout", detail.stats.lastlogout],
                  ["Achievement Pts", String(detail.stats.achievements_points)],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-2 border-b border-[color:var(--gold-deep)]/30 pb-1">
                    <span className="pixel-text text-[9px] text-[color:var(--wood-dark)] w-28 shrink-0">{label}:</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              {detail.info.comment && (
                <p className="mt-3 italic text-[color:var(--wood-dark)]">"{detail.info.comment}"</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setDetail(null)}
            className="mt-4 pixel-text text-[9px] underline text-[color:var(--royal-deep)]"
          >
            ← Back to results
          </button>
        </PageBox>
      )}

      {/* Resultados da busca */}
      {!detail && (
        <PageBox title={searched ? "Search Results" : "Recent Characters"} icon="🛡">
          {loading && (
            <p className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">Searching...</p>
          )}
          {error && <p className="py-4 text-center font-[VT323] text-base text-red-700">{error}</p>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-[VT323] text-lg">
                <thead>
                  <tr className="bg-[color:var(--royal-deep)] text-[color:var(--gold-bright)]">
                    {["Outfit", "Name", "Level", "Vocation", ""].map((h) => (
                      <th key={h} className="pixel-text border-2 border-[color:var(--gold-deep)] px-3 py-2 text-left text-[9px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((c, i) => (
                    <tr key={c.name} className={i % 2 ? "bg-[color:var(--parchment-dark)]" : "bg-[color:var(--parchment)]"}>
                      <td className="border-2 border-[color:var(--gold-deep)] px-2 py-1">
                        <img
                          src={c.outfit.image_url}
                          alt={c.name}
                          width={48}
                          height={48}
                          className="pixelated"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      </td>
                      <td className="border-2 border-[color:var(--gold-deep)] px-3 py-2">{c.name}</td>
                      <td className="border-2 border-[color:var(--gold-deep)] px-3 py-2">{c.level}</td>
                      <td className="border-2 border-[color:var(--gold-deep)] px-3 py-2">{c.vocation}</td>
                      <td className="border-2 border-[color:var(--gold-deep)] px-3 py-2">
                        <button
                          onClick={() => void handleViewDetail(c.name)}
                          className="pixel-text text-[8px] underline text-[color:var(--royal-deep)]"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {results.length === 0 && searched && !loading && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">
                        No characters found.
                      </td>
                    </tr>
                  )}
                  {!searched && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">
                        Use the search above to find characters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </PageBox>
      )}
    </SiteLayout>
  );
}
