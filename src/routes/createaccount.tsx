import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, memo, type FormEvent } from "react";
import { SiteLayout, PageBox } from "@/components/SiteLayout";
import { registerApi } from "@/lib/api";


// ── Town picker — visual card selector ───────────────────────────────────────
const TOWN_OPTIONS = [
  {
    value: "8",
    label: "Thais",
    img: "/town-thais.webp",
    desc: "A grande capital humana",
  },
  {
    value: "13",
    label: "Darashia",
    img: "/town-darashia.webp",
    desc: "Cidade do deserto",
  },
];

/**
 * Uncontrolled radio picker — reads from FormData at submit time.
 * Uses Tailwind peer trick: hidden radio + sibling div with peer-checked styles.
 */
function TownPicker() {
  return (
    <div>
      <span className="pixel-text mb-2 block text-[8px] text-[color:var(--wood-dark)]">
        Cidade Inicial
      </span>
      <div className="grid grid-cols-2 gap-3">
        {TOWN_OPTIONS.map((t, i) => (
          <label key={t.value} className="cursor-pointer block">
            <input
              type="radio"
              name="town"
              value={t.value}
              defaultChecked={i === 0}
              className="peer sr-only"
            />
            <div
              className={[
                "flex flex-col items-center gap-2 rounded-sm border-2 px-4 py-4 text-center transition-all",
                "border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)]",
                "hover:border-[color:var(--gold-bright)] hover:bg-[color:var(--parchment)]",
                "peer-checked:border-[color:var(--gold-bright)] peer-checked:bg-[color:var(--parchment)]",
                "peer-checked:shadow-[inset_0_0_0_2px_rgba(200,160,0,0.35)]",
              ].join(" ")}
            >
              <img
                src={t.img}
                alt={t.label}
                className="h-12 w-12 object-contain"
                style={{ imageRendering: "pixelated" }}
              />
              <span className="font-[VT323] text-xl leading-none text-[color:var(--wood-dark)]">
                {t.label}
              </span>
              <span className="pixel-text text-[7px] text-[color:var(--wood-light)] leading-tight">
                {t.desc}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/createaccount")({
  head: () => ({
    meta: [
      { title: "DGOT — Criar Conta" },
      { name: "description", content: "Junte-se ao DGOT Realms — crie sua conta e comece sua aventura." },
    ],
  }),
  component: CreateAccountPage,
});

const VOCATIONS = [
  { value: "1", label: "Sorcerer" },
  { value: "2", label: "Druid" },
  { value: "3", label: "Paladin" },
  { value: "4", label: "Knight" },
  { value: "9", label: "Monk" },
];

const WORLDS = [{ value: "DGOT", label: "DGOT" }];

/** Stateless shell — SiteLayout renders once, never re-renders from form typing */
function CreateAccountPage() {
  return (
    <SiteLayout>
      <CreateAccountContent />
    </SiteLayout>
  );
}

/**
 * Uncontrolled form — no value/onChange on inputs, zero re-renders while typing.
 * Values read from DOM via FormData only at submit time.
 */
const CreateAccountContent = memo(function CreateAccountContent() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);

  const [agreed, setAgreed] = useState(false);
  const [ageOk, setAgeOk]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdChar, setCreatedChar] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!ageOk) {
      setError("Você deve confirmar que tem 16 anos ou mais.");
      return;
    }
    if (!agreed) {
      setError("Você deve aceitar os Termos de Serviço para criar uma conta.");
      return;
    }

    const fd = new FormData(formRef.current!);
    const email    = (fd.get("email")     as string).trim();
    const password1 = fd.get("password1") as string;
    const password2 = fd.get("password2") as string;
    const charName  = (fd.get("name")     as string).trim();
    const sex       = fd.get("sex")       as string;
    const vocation  = fd.get("vocation")  as string;
    const world     = "DGOT";
    const full_name = (fd.get("full_name") as string).trim();
    const birthdate = fd.get("birthdate") as string;

    setLoading(true);
    try {
      const town = parseInt(fd.get("town") as string) || 8;
      const result = await registerApi({
        accname: email,
        email,
        full_name,
        birthdate,
        password1,
        password2,
        name: charName,
        sex: parseInt(sex),
        vocation,
        world,
        town,
        cf_turnstile_response: "",
      });

      if (result.errorCode !== undefined) {
        setError(result.errorMessage ?? "Falha no cadastro.");
        return;
      }

      setSuccess(true);
      setCreatedChar(result.character ?? charName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no cadastro.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageBox title="Conta Criada!" icon="⚔">
        <div className="space-y-4 text-center py-6">
          <p className="font-[VT323] text-2xl text-[color:var(--gold-deep)]">
            Bem-vindo ao DGOT Realms!
          </p>
          <p className="font-[VT323] text-xl text-[color:var(--wood-dark)]">
            Seu personagem{" "}
            <strong className="text-[color:var(--royal-deep)]">{createdChar}</strong>{" "}
            está pronto para a aventura.
          </p>
          <div className="gilded-divider">
            <span className="pixel-text text-[10px]">D</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/login" className="btn-gold pixel-text text-[10px]">▶ Entrar</Link>
            <Link to="/downloads" className="btn-royal pixel-text text-[9px]">⬇ Download Client</Link>
          </div>
        </div>
      </PageBox>
    );
  }

  return (
    <PageBox title="Criar Conta" icon="⚔">
      <p className="font-[VT323] text-xl leading-snug mb-4">
        Uma conta gratuita abre as portas para todo o mundo DGOT Realms.
        Seu e-mail é seu login — escolha o nome do personagem com sabedoria.
      </p>
      <div className="gilded-divider">
        <span className="pixel-text text-[10px]">D</span>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 font-[VT323] text-lg mt-4">

        <fieldset className="space-y-3">
          <legend className="pixel-text text-[9px] text-[color:var(--wood-dark)] mb-2 uppercase tracking-widest">
            ◈ Informações da Conta
          </legend>
          <label className="flex flex-col gap-1">
            <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">E-mail</span>
            <input
              type="email"
              name="email"
              required
              placeholder="voce@exemplo.com"
              autoComplete="email"
              className="w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">Senha</span>
              <input
                type="password"
                name="password1"
                required
                minLength={8}
                placeholder="Mín. 8 caracteres"
                autoComplete="new-password"
                className="w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">Confirmar Senha</span>
              <input
                type="password"
                name="password2"
                required
                minLength={8}
                placeholder="Repita a senha"
                autoComplete="new-password"
                className="w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]"
              />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">Nome completo</span>
              <input
                type="text"
                name="full_name"
                required
                minLength={2}
                maxLength={100}
                placeholder="Seu nome completo"
                autoComplete="name"
                className="w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">Data de nascimento</span>
              <input
                type="date"
                name="birthdate"
                required
                max={new Date(Date.now() - 16 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0]}
                className="w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="pixel-text text-[9px] text-[color:var(--wood-dark)] mb-2 uppercase tracking-widest">
            ◈ Primeiro Personagem
          </legend>
          <label className="flex flex-col gap-1">
            <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">Nome do Personagem</span>
            <input
              type="text"
              name="name"
              required
              minLength={5}
              maxLength={29}
              placeholder="5–29 caracteres"
              className="w-full rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]"
            />
          </label>
          {/* hidden world — only one world exists */}
          <input type="hidden" name="world" value="DGOT" />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">Gênero</span>
              <select name="sex" defaultValue="1" className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]">
                <option value="1">Masculino</option>
                <option value="0">Feminino</option>
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="pixel-text text-[8px] text-[color:var(--wood-dark)]">Vocação</span>
              <select name="vocation" defaultValue="1" className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--gold-bright)]">
                {VOCATIONS.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}</option>
                ))}
              </select>
            </label>
          </div>
          <TownPicker />
        </fieldset>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ageOk}
            onChange={(e) => setAgeOk(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[color:var(--gold-deep)] cursor-pointer"
          />
          <span className="font-[VT323] text-base leading-snug text-[color:var(--wood-dark)]">
            Confirmo que tenho 16 anos ou mais. Entendo que não poderei acessar conteúdos do jogo que possuam restrição para 18 anos.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 accent-[color:var(--gold-deep)] cursor-pointer"
          />
          <span className="font-[VT323] text-base leading-snug text-[color:var(--wood-dark)]">
            Li e concordo com as{" "}
            <Link to="/rules" className="underline text-[color:var(--royal-deep)] hover:text-[color:var(--gold-deep)]">Regras</Link>
            ,{" "}
            <Link to="/terms" className="underline text-[color:var(--royal-deep)] hover:text-[color:var(--gold-deep)]">Termos de Uso</Link>
            {" "}e a{" "}
            <Link to="/privacy" className="underline text-[color:var(--royal-deep)] hover:text-[color:var(--gold-deep)]">Política de Privacidade</Link>
            .
          </span>
        </label>

        {error && (
          <p className="pixel-text text-[8px] text-red-700 bg-red-50 border border-red-300 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={!agreed || !ageOk || loading}
            className="btn-gold pixel-text text-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Criando..." : "⚔ Criar Conta"}
          </button>
          <span className="font-[VT323] text-base text-[color:var(--wood-dark)]">
            Já tem uma conta?{" "}
            <Link to="/login" className="underline text-[color:var(--royal-deep)] hover:text-[color:var(--gold-deep)]">
              Faça login aqui
            </Link>
          </span>
        </div>
      </form>
    </PageBox>
  );
});
