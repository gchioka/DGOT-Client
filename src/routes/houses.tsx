import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import { getHouses, type HouseEntry } from "@/lib/api";

export const Route = createFileRoute("/houses")({
  head: () => ({
    meta: [
      { title: "DGOT — Houses & Guildhalls" },
      { name: "description", content: "Encontre uma casa ou sede de guild nas cidades de DGOT." },
    ],
  }),
  component: HousesPage,
});

interface TownOption { id: number; name: string; }

function HousesPage() {
  const [town, setTown]     = useState("");
  const [type, setType]     = useState("houses");
  const [status, setStatus] = useState("all");
  const [houses, setHouses] = useState<HouseEntry[]>([]);
  const [towns, setTowns]   = useState<TownOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  const fetchHouses = (t: string, tp: string, s: string) => {
    setLoading(true);
    setError("");
    const params: Record<string, string> = { type: tp };
    if (t) params.town = t;
    if (s && s !== "all") params.status = s;
    getHouses(params)
      .then((data) => {
        setHouses(data.houses ?? []);
        if (data.towns && data.towns.length > 0) setTowns(data.towns as unknown as TownOption[]);
        if (data.error && !data.houses) setError(data.error);
      })
      .catch(() => setError("Erro ao carregar casas."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHouses("", "houses", "all");
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchHouses(town, type, status);
  };

  const statusLabel = (s: string) => {
    if (s === "Available") return "Disponível";
    if (s === "Rented")    return "Alugada";
    if (s === "Auctioned") return "Em Leilão";
    return s;
  };

  const statusColor = (s: string) => {
    if (s === "Available") return "bg-green-700/20 text-green-800";
    if (s === "Rented")    return "bg-red-700/20 text-red-800";
    return "bg-[color:var(--gold)]/30 text-[color:var(--wood-dark)]";
  };

  return (
    <SiteLayout>
      <PageBox title="Houses & Guildhalls" icon="🏠">
        <p className="font-[VT323] text-xl leading-snug">
          Todo aventureiro merece um lar. Filtre por cidade, tipo e situação para encontrar sua casa ideal.
        </p>
        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>
        <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-4 font-[VT323] text-lg">
          <label className="flex flex-col gap-1">
            <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Cidade</span>
            <select
              className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-2"
              value={town}
              onChange={(e) => setTown(e.target.value)}
            >
              <option value="">Todas</option>
              {towns.map((t) => (
                <option key={t.id} value={String(t.id)}>{t.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Tipo</span>
            <select
              className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="houses">Houses</option>
              <option value="guildhalls">Guildhalls</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">Situação</span>
            <select
              className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="available">Disponível</option>
              <option value="rented">Alugada</option>
              <option value="auctioned">Em Leilão</option>
            </select>
          </label>
          <button className="btn-gold pixel-text text-[9px] self-end">Buscar</button>
        </form>
      </PageBox>

      <PageBox title={type === "guildhalls" ? "Guildhalls" : "Houses"} icon="📜">
        {loading && (
          <p className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">Carregando...</p>
        )}
        {!loading && houses.length === 0 && (
          <p className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">
            Nenhuma casa encontrada para os filtros selecionados.
          </p>
        )}
        {!loading && houses.length > 0 && (
          <ul className="space-y-2 font-[VT323] text-xl">
            {houses.map((h) => (
              <li key={h.id} className="news-row">
                <span className="pixel-text inline-flex h-7 w-7 items-center justify-center rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--gold)] text-[9px] flex-shrink-0">
                  ⌂
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="leading-tight">{h.name}</span>
                  <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">{h.town} · {h.size} sqm</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="pixel-text text-[9px] text-[color:var(--royal-deep)]">
                    {(h.rent ?? h.bid ?? 0).toLocaleString("pt-BR")} gp/mês
                  </span>
                  {h.owner && (
                    <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">👤 {h.owner}</span>
                  )}
                  <span className={`pixel-text text-[8px] rounded-sm px-2 py-1 ${statusColor(h.status)}`}>
                    {statusLabel(h.status)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        {error && !loading && (
          <p className="py-4 text-center font-[VT323] text-base text-[color:var(--wood-dark)]">{error}</p>
        )}
      </PageBox>
    </SiteLayout>
  );
}
