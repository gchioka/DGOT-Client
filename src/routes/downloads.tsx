import { createFileRoute } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage } from "@/components/ProtectedPage";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "DGOT — Download Cliente" },
      { name: "description", content: "Baixe o cliente DGOT para Windows." },
    ],
  }),
  component: DownloadsPage,
});

const builds = [
  { os: "Windows", size: "164 MB", file: "DGOT-Client.zip", icon: "⊞", available: true,  href: "/dl/DGOT-Client.zip" },
  { os: "macOS",   size: "—",      file: "—",               icon: "",  available: false, href: "#" },
  { os: "Linux",   size: "—",      file: "—",               icon: "🐧", available: false, href: "#" },
];

function DownloadsPage() {
  return (
    <ProtectedPage>
      <PageBox title="Download Cliente" icon="⬇">
        <p className="font-[VT323] text-xl leading-snug">
          O cliente <strong>DGOT</strong> é necessário para jogar. Ele inclui todos os assets de mapa,
          outfits customizados e módulos do jogo. Escolha sua plataforma abaixo.
        </p>
        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>
        <div className="grid gap-3 sm:grid-cols-3">
          {builds.map((b) => (
            <div key={b.os} className="frame-ornate p-4 text-center flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--royal-deep)] text-2xl text-[color:var(--gold-bright)]">
                {b.icon}
              </div>
              <div className="pixel-text text-[10px] text-[color:var(--royal-deep)]">{b.os}</div>
              {b.available && (
                <div className="font-[VT323] text-base">{b.file} · {b.size}</div>
              )}
              {b.available ? (
                <a
                  href={b.href}
                  download
                  className="btn-gold pixel-text text-[9px] block w-full"
                >
                  ⬇ Download
                </a>
              ) : (
                <span className="font-[VT323] text-base text-[color:var(--wood-dark)] italic">Em breve...</span>
              )}
            </div>
          ))}
        </div>
      </PageBox>

      <PageBox title="Requisitos do Sistema" icon="⚙">
        <ul className="space-y-2 font-[VT323] text-xl">
          {[
            "SO: Windows 10 ou superior (64-bit)",
            "CPU: Dual-core 2.0 GHz ou superior",
            "RAM: 2 GB mínimo, 4 GB recomendado",
            "GPU: Placa compatível com DirectX 11",
            "Armazenamento: 500 MB disponíveis",
            "Rede: conexão estável de banda larga",
          ].map((line) => (
            <li key={line} className="flex gap-3">
              <span aria-hidden className="mt-2 inline-block h-3 w-3 flex-shrink-0 bg-[color:var(--gold-deep)] shadow-[inset_0_0_0_1px_var(--gold-bright)]" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </PageBox>
    </ProtectedPage>
  );
}
