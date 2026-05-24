import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import {
  loginApi,
  logoutApi,
  validateSession,
  setSessionExpiredHandler,
  type LoginCharacter,
  type LoginSession,
} from "@/lib/api";

export interface AuthUser {
  name: string;
  isPremium: boolean;
  /** Unix timestamp (segundos) em que o token expira no servidor */
  tokenExpires: number;
  characters: LoginCharacter[];
  /** Token hex 64 chars — NÃO contém a senha */
  sessionKey: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const STORAGE_KEY = "dgot-auth";
/** Verifica expiração a cada 30 segundos */
const CHECK_INTERVAL_MS = 30_000;
/** Renova se o token expira em menos de 15 minutos */
const RENEW_THRESHOLD_S = 15 * 60;
/** Considera "ativo" se houve interação nos últimos 15 minutos */
const ACTIVITY_WINDOW_MS = 15 * 60 * 1000;
/** Não renova mais de uma vez a cada 5 minutos */
const MIN_RENEWAL_INTERVAL_MS = 5 * 60 * 1000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Refs não causam re-render — ideais para tracking de atividade
  const lastActivityRef = useRef<number>(Date.now());
  const lastRenewalRef = useRef<number>(0);
  // Ref para acessar user atual dentro de setInterval sem stale closure
  const userRef = useRef<AuthUser | null>(null);
  userRef.current = user;

  // ── Restaura sessão do localStorage ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as AuthUser;
      if (!parsed?.name || !parsed?.sessionKey) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      // Já expirou? Limpa sem mostrar aviso (sessão antiga)
      if (Date.now() / 1000 > parsed.tokenExpires) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      setIsAuthenticated(true);
      setUser(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // ── Registra handler global de sessão expirada (interceptor de API) ──────
  useEffect(() => {
    setSessionExpiredHandler(() => {
      performLogout(/* serverSide */ false, /* showToast */ true);
    });
  }, []);

  // ── Rastreia atividade do usuário ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"] as const;
    const onActivity = () => { lastActivityRef.current = Date.now(); };
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, onActivity));
  }, []);

  // ── Timer: verifica expiração e renova se necessário ─────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      const currentUser = userRef.current;
      if (!currentUser) return;

      const nowS = Date.now() / 1000;
      const timeToExpiry = currentUser.tokenExpires - nowS;

      // Token já expirou → logout automático
      if (timeToExpiry <= 0) {
        performLogout(false, true);
        return;
      }

      // Token vai expirar em breve + usuário esteve ativo recentemente → renova
      const userWasActive = Date.now() - lastActivityRef.current < ACTIVITY_WINDOW_MS;
      const renewalCooldownPassed = Date.now() - lastRenewalRef.current > MIN_RENEWAL_INTERVAL_MS;

      if (timeToExpiry < RENEW_THRESHOLD_S && userWasActive && renewalCooldownPassed) {
        try {
          const result = await validateSession(currentUser.sessionKey);
          if (result.valid) {
            lastRenewalRef.current = Date.now();
            const newExpires = Math.floor(Date.now() / 1000) + result.expires_in;
            const updated: AuthUser = { ...currentUser, tokenExpires: newExpires };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            setUser(updated);
          }
        } catch {
          // SessionExpiredError já dispara o handler global — não precisa tratar aqui
        }
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const performLogout = (callServer: boolean, showToast: boolean) => {
    const currentUser = userRef.current;
    if (callServer && currentUser?.sessionKey) {
      void logoutApi(currentUser.sessionKey).catch(() => {});
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setIsAuthenticated(false);
    setUser(null);
    if (showToast) {
      toast.error("Sessão expirada. Faça login novamente.", {
        duration: 6000,
        position: "top-center",
      });
    }
  };

  // ── API pública ───────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const response = await loginApi(email, password);

    if (response.errorCode !== undefined || !response.session || !response.playdata) {
      throw new Error(response.errorMessage ?? "Login failed.");
    }

    const session: LoginSession = response.session;
    const characters: LoginCharacter[] = response.playdata.characters ?? [];
    const mainChar = characters.find((c) => c.ismaincharacter) ?? characters[0];

    const userData: AuthUser = {
      name: mainChar?.name ?? email.split("@")[0],
      isPremium: session.ispremium,
      tokenExpires: Math.floor(Date.now() / 1000) + ((session as any).expires_in ?? 3600),
      characters,
      sessionKey: session.sessionkey,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    lastRenewalRef.current = Date.now();
  };

  const logout = () => performLogout(true, false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
