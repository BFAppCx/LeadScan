import Link from "next/link";
import { ReactNode } from "react";
import { navItems } from "@/lib/app-data";

type AppShellProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children: ReactNode;
};

export function AppShell({
  title,
  description,
  eyebrow = "LeadCard",
  children
}: AppShellProps) {
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
