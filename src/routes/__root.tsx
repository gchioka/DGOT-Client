import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { Toaster } from "sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a0a00", padding: "1rem" }}>
      <div style={{ maxWidth: "640px", width: "100%", textAlign: "center", fontFamily: "monospace" }}>
        <h1 style={{ color: "#e00", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
          ⚠ Erro ao carregar página
        </h1>
        <div style={{ background: "#2a1a00", border: "2px solid #e00", borderRadius: "6px", padding: "1rem", margin: "1rem 0", textAlign: "left" }}>
          <p style={{ color: "#ffaa00", fontWeight: "bold", marginBottom: "0.5rem" }}>
            {error?.message ?? "Unknown error"}
          </p>
          <pre style={{ color: "#aaa", fontSize: "0.7rem", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: "200px", overflow: "auto" }}>
            {error?.stack ?? "No stack trace"}
          </pre>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => { router.invalidate(); reset(); }}
            style={{ background: "#8b6914", color: "#fff", border: "none", borderRadius: "4px", padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Tentar novamente
          </button>
          <a
            href="/"
            style={{ background: "#333", color: "#fff", borderRadius: "4px", padding: "0.5rem 1rem", textDecoration: "none" }}
          >
            Página inicial
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Outlet />
          <Toaster richColors closeButton />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
