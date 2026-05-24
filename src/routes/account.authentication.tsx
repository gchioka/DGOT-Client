import { createFileRoute, Link } from "@tanstack/react-router";
import { PageBox } from "@/components/SiteLayout";
import { ProtectedPage, AccountSubNav, Field, inputClass } from "@/components/ProtectedPage";

export const Route = createFileRoute("/account/authentication")({
  head: () => ({
    meta: [
      { title: "DGOT — Authenticator" },
      { name: "description", content: "Bind a magical second seal (authenticator) to thy DGOT account." },
    ],
  }),
  component: AuthenticatorPage,
});

function AuthenticatorPage() {
  return (
    <ProtectedPage>
      <PageBox title="Authenticator" icon="🛡">
        <AccountSubNav active="/account/authentication" />
        <div className="banner-header mb-3 pixel-text text-[10px] text-center">Warning</div>
        <div className="mb-5 rounded-sm border-4 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 font-[VT323] text-lg">
          <p>
            Once an authenticator is bound, thou must provide a 6-rune token at every sign-in. Losing the device may
            lock thee out of the realm. Keep the recovery key in a safe scroll.
          </p>
        </div>

        <form className="mx-auto max-w-lg space-y-4">
          <div className="rounded-sm border-2 border-[color:var(--gold-deep)] bg-[color:var(--parchment-dark)] p-4 text-center">
            <div className="mx-auto mb-3 grid h-40 w-40 grid-cols-8 grid-rows-8 gap-px bg-[color:var(--wood-dark)]">
              {Array.from({ length: 64 }).map((_, i) => (
                <span key={i} className={i % 3 === 0 || i % 5 === 0 ? "bg-[color:var(--ink)]" : "bg-[color:var(--parchment)]"} />
              ))}
            </div>
            <p className="font-[VT323] text-base">Scan this rune with thy authenticator app.</p>
            <p className="font-[VT323] text-lg"><strong>Recovery Key:</strong> A3F2-8K9P-Q7XV-LM2D</p>
          </div>

          <Field label="Authenticator Token">
            <input className={inputClass} pattern="\\d{6}" maxLength={6} placeholder="6-digit code" required />
          </Field>
          <label className="flex items-center gap-2 font-[VT323] text-lg">
            <input type="checkbox" required /> I have saved my recovery key in a safe place.
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Link to="/account/manage" className="pixel-text rounded-sm border-2 border-[color:var(--wood-dark)] bg-[color:var(--parchment-dark)] px-4 py-2 text-[10px] text-[color:var(--wood-dark)]">Cancel</Link>
            <button type="submit" className="btn-gold pixel-text text-[10px]">Activate</button>
          </div>
        </form>
      </PageBox>
    </ProtectedPage>
  );
}
