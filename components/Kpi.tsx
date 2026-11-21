import { Icon } from "./Icon";

export function Kpi({ label, value, note, icon, tone = "blue" }: { label: string; value: number; note?: string; icon: string; tone?: string }) {
  return (
    <div className={`kpi tone-${tone}`}>
      <div className="kpi-top">
        <span className="label">{label}</span>
        <span className="kpi-icon"><Icon name={icon} size={20} /></span>
      </div>
      <div className="value">{value.toLocaleString("es-DO")}</div>
      {note ? <div className="note">{note}</div> : null}
    </div>
  );
}

export function KpiUnavailable({ label, phase, phaseName, icon }: { label: string; phase: number; phaseName: string; icon: string }) {
  return (
    <div className="kpi unavailable">
      <div className="kpi-top">
        <span className="label">{label}</span>
        <span className="kpi-icon"><Icon name={icon} size={20} /></span>
      </div>
      <div className="value">Sin datos aún</div>
      <div className="note"><Icon name="lock" size={12} /> Llega con la fase {phase} · {phaseName}</div>
    </div>
  );
}
