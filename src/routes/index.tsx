import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import dgotLogo from "@/assets/dgot-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DGOT — Notícias" },
      { name: "description", content: "Últimas notícias, atualizações e comunicados da comunidade DGOT." },
    ],
    links: [
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" },
    ],
  }),
  component: NewsPage,
});

const ticker = [
  {
    cat: "Evento",
    date: "24 Mai 2026",
    title: "[Servidor de Teste]",
    body: "O Servidor de Teste DGOT abre suas portas em 24/05/2026 — sua primeira chance de explorar o conteúdo antes do lançamento oficial. Cadastre-se agora e garanta sua vaga.",
  },
  {
    cat: "Aviso",
    date: "24 Mai 2026",
    title: "[Regras do Servidor de Teste]",
    body: "Personagens e progressos criados durante o período de teste não serão transferidos para o servidor oficial. Esta é uma prévia exclusiva para a comunidade.",
  },
  {
    cat: "Aviso",
    date: "24 Mai 2026",
    title: "[Feedback é Bem-vindo]",
    body: "Encontrou um bug ou tem uma sugestão? Use o sistema de reporte no jogo ou entre em nosso Discord. Cada reporte ajuda a moldar o lançamento final.",
  },
];

function NewsPage() {
  return (
    <SiteLayout>
      <PageBox title="Mural de Notícias" icon="📯">
        <div className="space-y-1">
          {ticker.map((t, i) => (
            <div className="news-row" key={i}>
              <span
                aria-hidden
                className="pixel-text inline-flex h-7 w-7 items-center justify-center rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--gold)] text-[9px] text-[color:var(--wood-dark)]"
                title={t.cat}
              >
                {t.cat[0]}
              </span>
              <span className="pixel-text text-[9px] text-[color:var(--wood-dark)]">{t.date}</span>
              <p className="font-[VT323] text-lg leading-tight text-[color:var(--foreground)]">
                <strong className="pixel-text text-[10px]">{t.title}</strong> — {t.body}
              </p>
              <span className="text-[color:var(--gold-deep)]">›</span>
            </div>
          ))}
        </div>
      </PageBox>

      <PageBox title="Notícias" icon="📜">
        {/* Cabeçalho */}
        <div className="mb-5 flex items-center gap-4">
          <img src={dgotLogo} alt="" width={56} height={42} loading="lazy" className="pixelated flex-shrink-0" />
          <div>
            <h2 className="pixel-text text-[11px] text-[color:var(--royal-deep)]">
              Servidor de Teste DGOT — 24/05/2026
            </h2>
            <p className="font-[VT323] text-base text-[color:var(--wood-dark)]">
              Evento · 24 Mai 2026
            </p>
          </div>
        </div>

        {/* Parágrafo de abertura */}
        <p className="font-[VT323] text-xl leading-snug">
          As portas de DGOT estão se abrindo pela primeira vez — e estamos convidando <strong>todos os aventureiros</strong> a atravessá-las antes do lançamento oficial. Em <strong>24 de Maio de 2026</strong>, o Servidor de Teste DGOT entra no ar, oferecendo à comunidade uma prévia completa do que aguarda nos reinos adiante.
        </p>

        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>

        {/* O que esperar */}
        <h3 className="pixel-text text-[10px] text-[color:var(--royal-deep)] mb-3">
          O Que Esperar
        </h3>
        <p className="font-[VT323] text-xl leading-snug">
          Esta é a sua oportunidade de explorar o mundo de DGOT, testar suas mecânicas e vivenciar o conteúdo antes de qualquer pessoa. O servidor de teste roda a <strong>build completa</strong> — cada vocação, cada região do mapa, cada sistema — exatamente como estará no dia do lançamento.
        </p>
        <p className="mt-3 font-[VT323] text-xl leading-snug">
          Seja você um veterano experiente ou um aventureiro de primeira viagem, o servidor de teste foi pensado para todos. Entre, explore, caçe, evolua — e nos ajude a forjar a melhor versão possível de DGOT.
        </p>

        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>

        {/* Destaques */}
        <h3 className="pixel-text text-[10px] text-[color:var(--royal-deep)] mb-3">
          Destaques do Servidor de Teste
        </h3>
        <ul className="space-y-2 pl-1">
          {[
            "Todas as vocações disponíveis — Knight, Paladin, Druid, Sorcerer e Monk.",
            "Acesso completo ao mapa desde o primeiro dia, sem bloqueio de conteúdo.",
            "Experiência e loot aumentados para agilizar os testes de progressão.",
            "Todos os sistemas ativos — stash, doomforging, upgrades de tier, mercado.",
            "Ferramenta de reporte de bugs disponível em todos os personagens.",
          ].map((line) => (
            <li key={line} className="flex gap-3 font-[VT323] text-xl leading-snug">
              <span aria-hidden className="mt-2 inline-block h-3 w-3 flex-shrink-0 bg-[color:var(--gold-deep)] shadow-[inset_0_0_0_1px_var(--gold-bright)]" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>

        {/* Aviso importante */}
        <h3 className="pixel-text text-[10px] text-[color:var(--royal-deep)] mb-3">
          Aviso Importante
        </h3>
        <p className="font-[VT323] text-xl leading-snug">
          Todos os personagens, itens e progressos criados durante o período de teste <strong>não serão transferidos</strong> para o servidor oficial. O servidor de teste existe exclusivamente para prévia e feedback — será reiniciado ao término da fase de testes.
        </p>
        <p className="mt-3 font-[VT323] text-xl leading-snug">
          Seu feedback é a maior contribuição que você pode dar. Cada reporte de bug, sugestão de balanceamento e discussão na comunidade molda o lançamento final. Entre em nosso <strong>Discord</strong> e faça parte da conversa.
        </p>

        <div className="gilded-divider"><span className="pixel-text text-[10px]">D</span></div>

        {/* CTA */}
        <p className="font-[VT323] text-xl leading-snug text-center text-[color:var(--royal-deep)]">
          ⚔ Crie sua conta, baixe o cliente e esteja pronto para <strong>24 de Maio de 2026</strong>. O reino aguarda.
        </p>
      </PageBox>
    </SiteLayout>
  );
}
