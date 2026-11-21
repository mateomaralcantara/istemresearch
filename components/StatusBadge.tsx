import { STATUS_LABELS, type ProjectStatus } from "@/lib/project-rules";

const TONE: Record<ProjectStatus, string> = {
  borrador: "neutral",
  diseno: "violet",
  campo: "brand",
  analisis: "teal",
  revision: "warn",
  en_pausa: "warn",
  terminado: "ok",
  archivado: "neutral",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`badge dot ${TONE[status] ?? "neutral"}`}>{STATUS_LABELS[status] ?? status}</span>;
}

const ORDER: ProjectStatus[] = ["borrador", "diseno", "campo", "analisis", "revision", "terminado"];
const STAGE_LABELS = ["Borrador", "Diseño", "Campo", "Análisis", "Revisión", "Terminado"];

/** Barra compacta del avance del proyecto en su ciclo de vida. */
export function StageBar({ status }: { status: ProjectStatus }) {
  const index = ORDER.indexOf(status);
  const level = index >= 0 ? index : status === "archivado" ? ORDER.length - 1 : 2;
  const cls = status === "en_pausa" ? " paused" : status === "archivado" ? " archived" : "";
  return (
    <span className={`stages${cls}`} aria-label={`Etapa: ${STATUS_LABELS[status]}`}>
      {ORDER.map((s, i) => <span key={s} className={i <= level ? "on" : undefined} />)}
    </span>
  );
}

/** Vista detallada de las etapas, para la ficha del proyecto. */
export function StageTrack({ status }: { status: ProjectStatus }) {
  const index = ORDER.indexOf(status);
  return (
    <div className="stage-track" aria-label={`Etapa actual: ${STATUS_LABELS[status]}`}>
      {STAGE_LABELS.map((label, i) => (
        <div key={label} className={`${index >= 0 && i <= index ? "on" : ""}${i === index ? " current" : ""}`}>{label}</div>
      ))}
    </div>
  );
}
