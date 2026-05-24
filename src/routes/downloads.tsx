import { createFileRoute } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage } from "@/components/ProtectedPage";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "DGOT — Download Cliente" },
      { name: "description", content: "Baixe o cliente DGOT para Windows, macOS ou Linux." },
    ],
  }),
  component: DownloadsPage,
});

const builds = [
  { os: "Windows", size: "92 MB", file: "DGOT-RTC-Setup.exe", icon: "⊞" },
  { os: "macOS",   size: "104 MB", file: "DGOT-RTC.dmg",       icon: "" },
  { os: "Linux",   size: "88 MB",  file: "DGOT-RTC.AppImage",  icon: "🐧" },
];

function DownloadsPage() {
  return (
    <ProtectedPage>
      <PageBox title="Download Cliente" icon="⬇">
        <p className="font-[VT323] text-xl leading-snug">
          O cliente <strong>RTC</strong> é necessário para jogar DGOT. Ele inclui todas as atualizações de mapa,
          outfits customizados e pacote de tiles HD. Escolha sua plataforma abaixo.
        </p>
        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>
        <div className="grid gap-3 sm:grid-cols-3">
          {builds.map((b) => (
            <div key={b.os} className="frame-ornate p-4 text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--royal-deep)] text-2xl text-[color:var(--gold-bright)]">
                {b.icon}
              </div>
              <div className="pixel-text text-[10px] text-[color:var(--royal-deep)]">{b.os}</div>
              <div className="font-[VT323] text-base mb-2">{b.file} · {b.size}</div>
              <a href="#" className="btn-gold pixel-text text-[9px] block">Download</a>
            </div>
          ))}
        </div>
      </PageBox>

      <PageBox title="Requisitos do Sistema" icon="⚙">
        <ul className="space-y-2 font-[VT323] text-xl">
          {[
            "SO: Windows 10+, macOS 11+, Ubuntu 20.04+",
            "CPU: Dual-core 2.0 GHz ou superior",
            "RAM: 2 GB mínimo, 4 GB recomendado",
            "GPU: Placa compatível com OpenGL 3.3",
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
