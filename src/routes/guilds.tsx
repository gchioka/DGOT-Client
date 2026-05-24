import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import { getGuilds, type GuildEntry } from "@/lib/api";

export const Route = createFileRoute("/guilds")({
  head: () => ({
    meta: [
      { title: "DGOT — Guilds" },
      { name: "description", content: "Browse the guilds of every DGOT world, view their banners and ranks." },
    ],
  }),
  component: GuildsPage,
});

function GuildsPage() {
  const [guilds, setGuilds] = useState<GuildEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getGuilds()
      .then((data) => {
        setGuilds(data.guilds ?? []);
        if (data.error && !data.guilds) setError(data.error);
      })
      .catch(() => setError("Failed to load guilds."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteLayout>
      <PageBox title="Guilds" icon="🏰">
        <p className="font-[VT323] text-xl leading-snug">
          Select the game world of your choice to see all existing guilds. Click any view button to read its history,
          ranks and warring record.
        </p>
        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>
      </PageBox>

      <PageBox title="All Guilds" icon="⚔">
        {loading && (
          <p className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">Loading...</p>
        )}
        {!loading && guilds.length === 0 && (
          <p className="py-6 text-center font-[VT323] text-lg text-[color:var(--wood-dark)]">
            No guilds have been founded yet. Be the first to create one!
          </p>
        )}
        {!loading && guilds.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {guilds.map((g) => (
              <div key={g.name} className="frame-ornate p-3">
                <div className="flex items-center gap-3">
                  {g.logo_url ? (
                    <img src={g.logo_url} alt={g.name} width={40} height={40} className="pixelated border-2 border-[color:var(--gold-deep)]" />
                  ) : (
                    <span className="inline-block h-10 w-10 bg-[color:var(--royal-deep)] border-2 border-[color:var(--gold-deep)]" />
                  )}
                  <div>
                    <div className="pixel-text text-[10px] text-[color:var(--royal-deep)]">{g.name}</div>
                    <div className="font-[VT323] text-base">
                      {g.members ?? 0} members
                      {g.members_online !== undefined && (
                        <> · <span className="text-green-700">{g.members_online} online</span></>
                      )}
                    </div>
                    {g.description && (
                      <p className="mt-1 font-[VT323] text-base text-[color:var(--wood-dark)] line-clamp-2">
                        {g.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {error && !loading && (
          <p className="py-4 text-center font-[VT323] text-base text-[color:var(--wood-dark)]">{error}</p>
        )}
      </PageBox>
    </SiteLayout>
  );
}
