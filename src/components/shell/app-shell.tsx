import Link from "next/link";
import { ReactNode } from "react";
import { navItems } from "@/lib/app-data";
import { getAuthViewState } from "@/server/leadcard-auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

type AppShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children: ReactNode;
};

export async function AppShell({
  title,
  description,
  eyebrow = "LeadCard",
  children
}: AppShellProps) {
  const auth = await getAuthViewState();

  return (
    <main className="page-shell">
      <div className="backdrop-orb backdrop-orb-left" />
      <div className="backdrop-orb backdrop-orb-right" />
      <div className="app-frame">
        <aside className="sidebar">
          <Link href="/" className="brand-mark">
            <span className="brand-mark__dot" />
            <span>
              <strong>LeadCard</strong>
              <small>Agency lead capture</small>
            </span>
          </Link>

          <nav className="nav-list" aria-label="Primary">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                <span className="nav-link__short">{item.shortLabel}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <section className="sidebar-card">
            <p className="sidebar-card__label">Messe-Regel</p>
            <strong>Erfassen vor Verschieben.</strong>
            <p>
              Erst Lead sichern, dann Quali. Nachbereitung ist spaeter leichter
              als verlorene Informationen.
            </p>
          </section>

          <section className="sidebar-card sidebar-card-auth">
            <p className="sidebar-card__label">Account</p>
            <div className="sidebar-status-row">
              <span
                className={
                  auth.hasSupabaseEnv
                    ? "status-pill status-pill-success"
                    : "status-pill status-pill-warning"
                }
              >
                {auth.hasSupabaseEnv ? "Live verbunden" : "Setup offen"}
              </span>
              <span className="meta-pill">
                {auth.runtime === "production" ? "Produktiv" : "Entwicklung"}
              </span>
            </div>
            {!auth.hasSupabaseEnv ? (
              <>
                <strong>Backend ist noch nicht voll konfiguriert</strong>
                <p>
                  {auth.runtime === "production"
                    ? "Bitte Server-Konfiguration fuer Supabase pruefen, bevor echte Leads erfasst werden."
                    : "Trage zuerst die lokalen Supabase-Keys ein, damit echte Daten gespeichert werden."}
                </p>
              </>
            ) : auth.isSignedIn ? (
              <>
                <strong>{auth.email}</strong>
                <p>Angemeldet und bereit fuer echte Datenspeicherung.</p>
                <SignOutButton />
              </>
            ) : (
              <>
                <strong>Noch nicht angemeldet</strong>
                <p>Lead-Speicherung wird aktiv, sobald du dich per Magic Link einloggst.</p>
                <Link href="/auth" className="ghost-button-link">
                  Login oeffnen
                </Link>
              </>
            )}
          </section>
        </aside>

        <section className="content-area">
          <header className="page-header">
            <div>
              <div className="eyebrow">{eyebrow}</div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            <Link href="/leads/new" className="primary-action">
              Neuer Lead
            </Link>
          </header>

          {children}
        </section>
      </div>
    </main>
  );
}
