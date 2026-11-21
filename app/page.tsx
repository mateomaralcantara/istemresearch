import Link from "next/link";
import { Brand } from "@/components/Brand";
import { Icon } from "@/components/Icon";

const FEATURES = [
  { icon: "fingerprint", tone: "blue", title: "Cada dato tiene una fuente", text: "Toda cifra conserva su origen, fecha, licencia y método de obtención." },
  { icon: "sigma", tone: "teal", title: "Cada conclusión tiene un método", text: "Sin margen de error probabilístico para muestras voluntarias, y sin presentar la conversación digital como opinión de toda una población." },
  { icon: "cpu", tone: "violet", title: "Cada agente tiene supervisión", text: "La IA amplía la investigación, pero no fabrica entrevistas ni sustituye la evidencia. Lo sensible requiere aprobación humana." },
  { icon: "shield", tone: "amber", title: "Cada resultado se audita", text: "Las acciones quedan en un registro encadenado con SHA-256 que delata cualquier alteración." },
];

/** Ilustración decorativa del panel (no representa datos reales). */
function PreviewArt() {
  return (
    <svg viewBox="0 0 420 260" role="img" aria-label="Ilustración del panel de ISTEM RESEARCH">
      <defs>
        <linearGradient id="g1" x1="0" x2="1"><stop offset="0" stopColor="#2563eb" /><stop offset="1" stopColor="#0ea5a4" /></linearGradient>
        <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#2563eb" stopOpacity=".28" /><stop offset="1" stopColor="#2563eb" stopOpacity="0" /></linearGradient>
      </defs>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${i * 140} 0)`}>
          <rect x="0" y="0" width="128" height="62" rx="12" fill="currentColor" opacity=".05" />
          <rect x="12" y="14" width="46" height="7" rx="3.5" fill="currentColor" opacity=".25" />
          <rect x="12" y="32" width={[64, 40, 54][i]} height="14" rx="5" fill="url(#g1)" opacity={[1, 0.75, 0.55][i]} />
        </g>
      ))}
      <rect x="0" y="78" width="268" height="172" rx="14" fill="currentColor" opacity=".05" />
      <path d="M16 214 L56 196 L96 204 L136 170 L176 178 L216 140 L252 150 L252 236 L16 236Z" fill="url(#g2)" />
      <path d="M16 214 L56 196 L96 204 L136 170 L176 178 L216 140 L252 150" fill="none" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 196 L56 186 L96 190 L136 160 L176 166 L216 128 L252 136" fill="none" stroke="#2563eb" strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="4 4" />
      {[[136, 170], [216, 140]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" fill="#fff" stroke="#2563eb" strokeWidth="2.5" />)}
      <rect x="282" y="78" width="138" height="172" rx="14" fill="currentColor" opacity=".05" />
      <circle cx="351" cy="142" r="42" fill="none" stroke="currentColor" strokeOpacity=".08" strokeWidth="14" />
      <circle cx="351" cy="142" r="42" fill="none" stroke="url(#g1)" strokeWidth="14" strokeDasharray="180 264" strokeLinecap="round" transform="rotate(-90 351 142)" />
      {[0, 1, 2].map((i) => <rect key={i} x="300" y={200 + i * 14} width={[96, 70, 84][i]} height="7" rx="3.5" fill="currentColor" opacity=".18" />)}
    </svg>
  );
}

export default function Home() {
  return (
    <div className="public">
      <div className="public-bg" aria-hidden="true" />
      <header>
        <Brand />
        <div className="form-actions">
          <Link className="btn ghost" href="/login">Iniciar sesión</Link>
          <Link className="btn primary" href="/register">Crear cuenta</Link>
        </div>
      </header>
      <main>
        <section className="landing">
          <div>
            <span className="pill"><i /> Inteligencia · Investigación · Opinión · Tecnología</span>
            <h1>Investigamos la realidad. <em>Transformamos los datos en conocimiento.</em></h1>
            <p className="lead">
              Diseña, ejecuta y audita investigaciones científicas: encuestas, muestreo, inteligencia digital autorizada,
              encuesta de encuestas y análisis estadístico, con trazabilidad completa.
            </p>
            <div className="form-actions" style={{ marginTop: "1.6rem" }}>
              <Link className="btn primary" href="/register">Comenzar ahora <Icon name="arrow" size={16} /></Link>
              <Link className="btn" href="/login">Ya tengo cuenta</Link>
            </div>
            <div className="hero-chips" style={{ marginTop: "1.6rem" }}>
              <span className="badge teal"><Icon name="shield" size={13} /> Aislamiento por organización</span>
              <span className="badge brand"><Icon name="fingerprint" size={13} /> Auditoría verificable</span>
              <span className="badge violet"><Icon name="pin" size={13} /> Hecho para República Dominicana</span>
            </div>
          </div>
          <div className="preview" style={{ color: "var(--text)" }}>
            <div className="preview-top"><i /><i /><i /></div>
            <PreviewArt />
          </div>
        </section>
        <section className="features grid cols-4" aria-label="Principios">
          {FEATURES.map((f) => (
            <article className={`card feature tone-${f.tone}`} key={f.title}>
              <span className="kpi-icon"><Icon name={f.icon} size={20} /></span>
              <h2>{f.title}</h2>
              <p>{f.text}</p>
            </article>
          ))}
        </section>
      </main>
      <footer>
        <span>ISTEM RESEARCH · versión 0.1 · fase 1: fundamentos</span>
        <span>Los datos de demostración, si los hay, se identifican como ficticios.</span>
      </footer>
    </div>
  );
}
