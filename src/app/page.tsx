import {
  dashboardStats,
  pipelineSteps,
  queueLeads
} from "@/lib/demo-data";

export default function Home() {
  return (
    <main style={{ padding: "24px" }}>
      <section
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          display: "grid",
          gap: "24px"
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            padding: "28px"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: "8px 12px",
              borderRadius: "999px",
              background: "var(--surface-strong)",
              color: "var(--muted)",
              fontSize: "14px",
              marginBottom: "18px"
            }}
          >
            Messe-Lead-Erfassung fuer Agenturen
          </div>

          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(2.4rem, 6vw, 4.6rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em"
            }}
          >
            LeadCard sammelt Karten, Quali und Kundenkontext in einem Flow.
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "720px",
              color: "var(--muted)",
              fontSize: "18px",
              lineHeight: 1.5
            }}
          >
            Der MVP startet als mobile-first Arbeitsoberflaeche fuer Messen:
            schnell erfassen, direkt qualifizieren und spaeter sauber ins CRM
            exportieren.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px"
          }}
        >
          {dashboardStats.map((stat) => (
            <section
              key={stat.label}
              style={{
                background:
                  stat.tone === "success"
                    ? "linear-gradient(180deg, #eef7f0 0%, #f8fcf9 100%)"
                    : "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "20px"
              }}
            >
              <div style={{ color: "var(--muted)", fontSize: "14px" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "40px", marginTop: "10px" }}>
                {stat.value}
              </div>
            </section>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px"
          }}
        >
          <section
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "24px"
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "20px" }}>Lead-Pipeline</h2>
            <ol
              style={{
                margin: 0,
                paddingLeft: "20px",
                display: "grid",
                gap: "12px",
                color: "var(--muted)"
              }}
            >
              {pipelineSteps.map((step) => (
                <li key={step.title}>
                  <strong style={{ color: "var(--foreground)" }}>
                    {step.title}
                  </strong>
                  <div>{step.description}</div>
                </li>
              ))}
            </ol>
          </section>

          <section
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "24px"
            }}
          >
            <h2 style={{ marginTop: 0, fontSize: "20px" }}>
              Nachbereitungs-Queue
            </h2>
            <div
              style={{
                margin: 0,
                display: "grid",
                gap: "12px",
                color: "var(--muted)"
              }}
            >
              {queueLeads.map((lead) => (
                <article
                  key={`${lead.name}-${lead.company}`}
                  style={{
                    padding: "14px",
                    border: "1px solid var(--border)",
                    borderRadius: "18px",
                    background: "var(--surface-strong)"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      alignItems: "center"
                    }}
                  >
                    <strong style={{ color: "var(--foreground)" }}>
                      {lead.name}
                    </strong>
                    <span>{lead.status}</span>
                  </div>
                  <div style={{ marginTop: "6px" }}>{lead.company}</div>
                  <div style={{ marginTop: "4px", fontSize: "14px" }}>
                    {lead.client}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
