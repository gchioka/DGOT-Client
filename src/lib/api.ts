/**
 * DGOT API client — conecta ao backend CanaryAAC em dgot.com.br
 */

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "https://dgot.com.br";

/** Callback global chamado quando o backend indica sessão expirada */
let onSessionExpired: (() => void) | null = null;
export function setSessionExpiredHandler(fn: () => void) {
  onSessionExpired = fn;
}

/** Erro específico para sessão expirada — distingue de outros erros de rede */
export class SessionExpiredError extends Error {
  constructor() { super("Session expired"); this.name = "SessionExpiredError"; }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000); // 15s max

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`API ${res.status}: ${path}`);

    const data = await res.json() as T & { errorCode?: number };
    // errorCode 1 = sessão inválida/expirada (framework PHP sempre retorna 200)
    if (data && typeof data === "object" && (data as any).errorCode === 1) {
      onSessionExpired?.();
      throw new SessionExpiredError();
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  }
}

function apiGet<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return apiFetch<T>(url.pathname + url.search);
}

function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─────────────────────────────────────────────
// Tipos de resposta
// ─────────────────────────────────────────────

export interface ApiError {
  errorCode: number;
  errorMessage: string;
}

export interface LoginCharacter {
  name: string;
  level: number;
  vocation: string;
  worldid: number;
  ismaincharacter: boolean;
  outfitid: number;
  headcolor: number;
  torsocolor: number;
  legscolor: number;
  detailcolor: number;
  addonsflags: number;
}

export interface LoginWorld {
  id: number;
  name: string;
  externaladdress: string;
  externalport: number;
  pvptype: number;
}

export interface LoginSession {
  sessionkey: string;
  ispremium: boolean;
  premiumuntil: number;
  status: string;
}

export interface LoginAccountInfo {
  email: string;
  /** MySQL timestamp string, e.g. "2026-05-23 12:00:00" */
  creation: string;
}

export interface LoginResponse {
  account?: LoginAccountInfo;
  playdata?: {
    worlds: LoginWorld[];
    characters: LoginCharacter[];
  };
  session?: LoginSession;
  errorCode?: number;
  errorMessage?: string;
}

// ─────────────────────────────────────────────
// Account management types
// ─────────────────────────────────────────────

export interface AccountActionResponse {
  success?: boolean;
  errorCode?: number;
  errorMessage?: string;
  /** Returned by changeEmail */
  email?: string;
  /** Returned by changeMain / createCharacter */
  character?: string;
}

export interface CacheInfo {
  playersonline: number;
  twitchstreams: number;
  twitchviewer: number;
  gamingyoutubestreams: number;
  gamingyoutubeviewer: number;
}

export interface BoostedInfo {
  creatureraceid: number;
  bossraceid: number;
}

/** Resposta consolidada do /api/v1/server/status (público, sem rate limit agressivo) */
export interface ServerStatus extends CacheInfo, BoostedInfo {}

export interface HighscoreEntry {
  name: string;
  vocation: string;
  level: number;
  experience: number;
  online: boolean;
}

export interface HighscoresResponse {
  highscores: HighscoreEntry[];
  pagination: { current: number; total: number };
}

export interface SearchCharacterResult {
  name: string;
  level: number;
  vocation: string;
  outfit: { image_url: string };
}

export interface CharacterDetail {
  info: {
    name: string;
    level: number;
    vocation: string;
    online: boolean;
    experience: number;
    town_name: string;
    world: string;
    sex: string;
    premdays: string;
    group_id: string;
    comment: string;
  };
  stats: {
    health: number;
    healthmax: number;
    mana: number;
    manamax: number;
    soul: number;
    lastlogout: string;
    achievements_points: number;
  };
  outfit: {
    image_url: string;
    looktype: number;
    lookaddons: number;
  };
}

export interface RegisterPayload {
  accname: string;
  email: string;
  password1: string;
  password2: string;
  name: string;
  sex: number;
  vocation: string;
  world: string;
  full_name: string;
  birthdate: string;
  town?: number;
  cf_turnstile_response: string;
}

export interface RegisterResponse {
  success?: boolean;
  account?: string;
  character?: string;
  message?: string;
  errorCode?: number;
  errorMessage?: string;
}

export interface GuildEntry {
  name: string;
  description?: string;
  logo_url?: string;
  members_online?: number;
  members?: number;
}

export interface GuildsResponse {
  guilds?: GuildEntry[];
  error?: string;
}

export interface HouseEntry {
  id: number;
  name: string;
  town: string;
  town_id: number;
  size: number;
  beds: number;
  rent: number;
  bid: number;
  bid_end: number;
  status: string;
  owner?: string | null;
  bidder_name?: string | null;
}

export interface HousesResponse {
  houses?: HouseEntry[];
  towns?: { id: number; name: string }[];
  total?: number;
  error?: string;
}

// ─────────────────────────────────────────────
// Endpoints
// ─────────────────────────────────────────────

/** Faz login e retorna dados da conta + lista de personagens */
export function loginApi(email: string, password: string): Promise<LoginResponse> {
  return apiPost<LoginResponse>("/api/v1/login", { type: "login", email, password });
}

/** Invalida o token de sessão no servidor */
export function logoutApi(sessionKey: string): Promise<{ status: string }> {
  return apiPost("/api/v1/login", { type: "logout", token: sessionKey });
}

/**
 * Valida e renova o token por mais 1h (sliding window).
 * Retorna { valid: true, expires_in: 3600 } ou lança SessionExpiredError.
 */
export function validateSession(token: string): Promise<{ valid: boolean; expires_in: number }> {
  return apiPost("/api/v1/login", { type: "validate", token });
}

/**
 * Retorna status público do servidor: players online + boosted creature/boss.
 * Usa o endpoint dedicado /api/v1/server/status — separado do login para
 * não consumir o rate limit de autenticação em cada page load.
 */
export function getServerStatus(): Promise<ServerStatus> {
  return apiGet<ServerStatus>("/api/v1/server/status");
}

/** @deprecated Use getServerStatus() — mantido por compatibilidade retroativa */
export function getCacheInfo(): Promise<CacheInfo> {
  return apiPost<CacheInfo>("/api/v1/login", { type: "cacheinfo" });
}

/** @deprecated Use getServerStatus() — mantido por compatibilidade retroativa */
export function getBoosted(): Promise<BoostedInfo> {
  return apiPost<BoostedInfo>("/api/v1/login", { type: "boostedcreature" });
}

/** Lista highscores — parâmetros opcionais: vocation, category, page */
export function getHighscores(
  params: { vocation?: string; category?: string; page?: string } = {},
): Promise<HighscoresResponse> {
  const p: Record<string, string> = {};
  if (params.vocation) p.vocation = params.vocation;
  if (params.category) p.category = params.category;
  if (params.page) p.page = params.page;
  return apiGet<HighscoresResponse>("/api/v1/highscores", p);
}

/** Busca personagens por nome */
export function searchCharacters(name: string): Promise<SearchCharacterResult[]> {
  return apiPost<SearchCharacterResult[]>("/api/v1/searchcharacters", { name });
}

/** Busca detalhes de um personagem pelo nome */
export function getCharacterDetail(name: string): Promise<CharacterDetail | { error: string }> {
  return apiGet<CharacterDetail | { error: string }>("/api/v1/characters", { name });
}

/**
 * Cria uma nova conta + personagem inicial.
 * Requer token Cloudflare Turnstile válido em cf_turnstile_response.
 */
export function registerApi(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiPost<RegisterResponse>("/api/v1/register", payload as unknown as Record<string, unknown>);
}

/** Lista guilds */
export function getGuilds(): Promise<GuildsResponse> {
  return apiGet<GuildsResponse>("/api/v1/guilds");
}

// ─────────────────────────────────────────────
// Account management API
// ─────────────────────────────────────────────

function accountPost(token: string, action: string, extra: Record<string, unknown> = {}): Promise<AccountActionResponse> {
  return apiPost<AccountActionResponse>("/api/v1/account", { token, action, ...extra });
}

export function changePasswordApi(token: string, oldpassword: string, newpassword: string, newpassword2: string): Promise<AccountActionResponse> {
  return accountPost(token, "changepassword", { oldpassword, newpassword, newpassword2 });
}

export function changeEmailApi(token: string, newemail: string, newemail2: string, password: string): Promise<AccountActionResponse> {
  return accountPost(token, "changeemail", { newemail, newemail2, password });
}

export function changeMainApi(token: string, character: string, password: string): Promise<AccountActionResponse> {
  return accountPost(token, "changemain", { character, password });
}

export function createCharacterApi(token: string, name: string, sex: number, vocation: string, world: string, town: number = 9): Promise<AccountActionResponse> {
  return accountPost(token, "createcharacter", { name, sex, vocation, world, town });
}

export function deleteCharacterApi(token: string, character: string, password: string): Promise<AccountActionResponse> {
  return accountPost(token, "deletecharacter", { character, password });
}

/** Lista casas — parâmetros opcionais: town, type, status */
export function getHouses(
  params: { town?: string; type?: string; status?: string } = {},
): Promise<HousesResponse> {
  const p: Record<string, string> = {};
  if (params.town) p.town = params.town;
  if (params.type) p.type = params.type;
  if (params.status) p.status = params.status;
  return apiGet<HousesResponse>("/api/v1/houses", p);
}

/** Formata número de experiência */
export function formatExp(exp: number): string {
  return exp.toLocaleString("en-US");
}

// ─────────────────────────────────────────────
// Creatures / Bestiary types
// ─────────────────────────────────────────────

export interface CreatureLoot {
  name: string;
  chance: number;   // 0–100000 raw
  percent: number;  // 0–100
  maxCount: number;
}

export interface CreatureElement {
  type: string;    // "physical" | "fire" | "ice" | ...
  percent: number; // negative = weakness, positive = resistance, 100 = immune
}

export interface CreatureAttack {
  name: string;
  type: string;
  minDamage: number;
  maxDamage: number;
}

export interface CreatureDefenses {
  defense: number;
  armor: number;
  mitigation: number;
}

export interface Creature {
  name: string;
  tag: string;
  description: string;
  class: string;
  hp: number;
  exp: number;
  speed: number;
  race: string;
  raceId: number;
  bossRaceId: number;
  looktype: number;
  /** Sprite display size in px: 32 | 64 | 96 | 128 (from appearances.dat) */
  spriteSize: number;
  stars: number;
  toKill: number;
  charmsPoints: number;
  locations: string;
  isBoss: boolean;
  folder: string;
  loot: CreatureLoot[];
  elements: CreatureElement[];
  immunities: string[];
  attacks: CreatureAttack[];
  defenses: CreatureDefenses;
}

export interface CreaturesResponse {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  /** All categories with counts (before the current filter) */
  categories: Record<string, number>;
  items: Creature[];
  errorCode?: number;
  errorMessage?: string;
}

export function getCreaturesApi(params: {
  type?: "creatures" | "bosses";
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
} = {}): Promise<CreaturesResponse> {
  const p: Record<string, string> = {};
  if (params.type)     p.type     = params.type;
  if (params.category) p.category = params.category;
  if (params.search)   p.search   = params.search;
  if (params.page)     p.page     = String(params.page);
  if (params.per_page) p.per_page = String(params.per_page);
  return apiGet<CreaturesResponse>("/api/v1/creatures", p);
}
