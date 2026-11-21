import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Kpi, KpiUnavailable } from "@/components/Kpi";
import { StageBar, StatusBadge } from "@/components/StatusBadge";
import { listProjects, projectCounts } from "@/lib/data";
import { MODULES, PHASES } from "@/lib/modules";
import { OBJECTIVE_TYPES } from "@/lib/project-rules";
import { requireOrganization } from "@/lib/session";

export const metadata: Metadata = { title: "Inicio" };

const TONES = ["blue", "teal", "violet", "amber", "rose"];

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("es-DO", { hour: "numeric", hour12: false, timeZone: "America/Santo_Domingo" }).format(new Date()));
  return hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
}

export default async function HomePage() {
  const { token, user, active } = await requireOrganization();
  const orgId = active.organization.id;
  const [counts, recent] = await Promise.all([projectCounts(token, orgId), listProjects(token, orgId, { limit: 5 })]);
  const perms = active.permissions;
  const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "";
  const firstName = fullName.trim().split(/\s+/)[0] || user.email?.split("@")[0] || "";
  const today = new Intl.DateTimeFormat("es-DO", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Santo_Domingo" }).format(new Date());

  return (
    <>
      <section className="hero-band">
        <div className="hero-row">
          <div>
            <div className="eyebrow"><Icon name="spark" size={14} /> {active.organization.name}</div>
            <h1>{greeting()}{firstName ? `, ${firstName}` : ""}</h1>
            <p>
              {counts.active > 0
                ? `Tienes ${counts.active} ${counts.active === 1 ? "investigación activa" : "investigaciones activas"}. Cada dato con su fuente, cada conclusión con su método.`
                : "Empieza formulando una pregunta de investigación. Cada dato con su fuente, cada conclusión con su método."}
            </p>
            <div className="hero-chips">
              <span><Icon name="clock" size={13} /> {today.charAt(0).toUpperCase() + today.slice(1)}</span>
              <span><Icon name="shield" size={13} /> Auditoría encadenada activa</span>
              <span><Icon name="pin" size={13} /> República Dominicana</span>
            </div>
          </div>
          <div className="form-actions">
            <Link className="btn" href="/muestras"><Icon name="users" size={16} /> Simulador</Link>
            {perms.includes("project.create") ? (
              <Link className="btn primary" href="/proyectos/nuevo"><Icon name="plus" size={16} /> Nuevo proyecto</Link>
            ) : null}
          </div>
        </div>
      </section>

      <div className="grid cols-3">
        <Kpi label="Investigaciones activas" value={counts.active} note="En diseño, campo, análisis o revisión" icon="activity" tone="blue" />
        <Kpi label="Terminadas" value={counts.finished} note="Con informe y auditoría completos" icon="check" tone="teal" />
        <Kpi label="Proyectos totales" value={counts.total} note={`${counts.archived} archivados`} icon="flask" tone="violet" />
      </div>

      <div className="section-label">Próximos indicadores</div>
      <div className="grid cols-4">
        <KpiUnavailable label="Entrevistas recibidas" phase={2} phaseName={PHASES[2]} icon="clipboard" />
        <KpiUnavailable label="Fuentes conectadas" phase={3} phaseName={PHASES[3]} icon="plug" />
        <KpiUnavailable label="Agentes en ejecución" phase={5} phaseName={PHASES[5]} icon="cpu" />
        <KpiUnavailable label="Costo operacional" phase={7} phaseName={PHASES[7]} icon="bars" />
      </div>

      <div className="grid wide-left" style={{ marginTop: "1.5rem" }}>
        <section className="card">
          <div className="card-head">
            <h2><span className="card-title-icon"><Icon name="flask" size={16} /></span>Proyectos recientes</h2>
            <Link href="/proyectos" className="small">Ver todos <Icon name="arrow" size={13} /></Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Icon name="target" size={26} /></div>
              <strong>Aún no hay proyectos</strong>
              <p className="small">{perms.includes("project.create") ? "Crea el primero a partir de una pregunta de investigación." : "Pide que te asignen a uno."}</p>
              {perms.includes("project.create") ? <Link className="btn primary small" href="/proyectos/nuevo"><Icon name="plus" size={14} /> Crear proyecto</Link> : null}
            </div>
          ) : (
            <div className="plist">
              {recent.map((p, i) => (
                <Link key={p.id} href={`/proyectos/${p.id}`} className={`pitem tone-${TONES[i % TONES.length]}`}>
                  <span className="p-icon"><Icon name={p.methods.includes("escucha_social") ? "chat" : p.methods.some((m) => ["capi", "cati", "cawi"].includes(m)) ? "clipboard" : "flask"} size={18} /></span>
                  <span>
                    <div className="p-title">{p.title}</div>
                    <div className="p-meta">
                      <span className="mono">{p.code}</span>
                      <span>{OBJECTIVE_TYPES[p.objective_type as keyof typeof OBJECTIVE_TYPES]?.split(":")[0]}</span>
                      <StageBar status={p.status} />
                    </div>
                  </span>
                  <StatusBadge status={p.status} />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2><span className="card-title-icon"><Icon name="layers" size={16} /></span>Hoja de ruta</h2>
          </div>
          <ol className="timeline">
            {Object.entries(PHASES).map(([phase, name]) => {
              const done = Number(phase) === 1;
              const mods = MODULES.filter((m) => m.phase === Number(phase)).map((m) => m.label);
              return (
                <li key={phase} className={done ? "done" : undefined}>
                  <span className="dot">{done ? <Icon name="check" size={13} /> : phase}</span>
                  <div className="t-title">{name} {done ? <span className="badge ok">Disponible</span> : null}</div>
                  <div className="t-sub">{mods.length ? mods.join(" · ") : "Infraestructura"}</div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </>
  );
}
