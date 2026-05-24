import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const STORAGE_KEY = "dgot-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] flex justify-center px-4 pb-4 pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-3xl border-4 p-5 sm:p-6"
        style={{
          background: "var(--wood-dark)",
          borderColor: "var(--gold-bright)",
          boxShadow: "0 0 0 2px var(--wood-darkest), 0 8px 0 0 var(--wood-darkest), 0 12px 24px rgba(0,0,0,0.6)",
          imageRendering: "pixelated",
        }}
      >
        <h2
          className="pixel-text text-sm sm:text-base mb-2"
          style={{
            color: "var(--gold-bright)",
            textShadow: "0 2px 0 var(--wood-darkest)",
            letterSpacing: "0.1em",
          }}
        >
          AVISO DO REINO — COOKIES & PRIVACIDADE
        </h2>
        <p
          className="font-[VT323] text-base sm:text-lg leading-snug mb-4"
          style={{ color: "var(--gold-bright)" }}
        >
          Utilizamos cookies para melhorar sua experiência em nosso reino. Ao continuar navegando,
          você concorda com nossa coleta de dados conforme descrito em nossos documentos legais.
          Consulte abaixo para mais informações:
        </p>
        <div
          className="flex flex-wrap gap-x-3 gap-y-1 mb-4 font-[VT323] text-sm sm:text-base"
          style={{ color: "var(--gold-bright)" }}
        >
          <Link to="/privacy" className="underline hover:text-[color:var(--gold)]">
            Política de Privacidade
          </Link>
          <span style={{ color: "var(--gold-deep)" }}>|</span>
          <Link to="/terms" className="underline hover:text-[color:var(--gold)]">
            Termos de Uso
          </Link>
          <span style={{ color: "var(--gold-deep)" }}>|</span>
          <Link to="/cookies" className="underline hover:text-[color:var(--gold)]">
            Política de Cookies
          </Link>
          <span style={{ color: "var(--gold-deep)" }}>|</span>
          <Link to="/legal" className="underline hover:text-[color:var(--gold)]">
            Documentos Legais
          </Link>
        </div>
        <div className="flex justify-end">
          <button
            onClick={accept}
            className="pixel-text text-xs sm:text-sm px-5 py-2 border-4 transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--gold-bright)",
              borderColor: "var(--wood-darkest)",
              color: "var(--wood-darkest)",
              boxShadow: "0 4px 0 0 var(--wood-darkest)",
              letterSpacing: "0.15em",
            }}
          >
            ACEITAR
          </button>
        </div>
      </div>
    </div>
  );
}
