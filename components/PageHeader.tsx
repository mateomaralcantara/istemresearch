import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function PageHeader({ eyebrow, title, description, actions, icon }: { eyebrow?: string; title: string; description?: ReactNode; actions?: ReactNode; icon?: string }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow ? <div className="eyebrow">{icon ? <Icon name={icon} size={14} /> : null}{eyebrow}</div> : null}
        <h1>{title}</h1>
        {description ? <div className="muted" style={{ maxWidth: "72ch" }}>{description}</div> : null}
      </div>
      {actions ? <div className="form-actions">{actions}</div> : null}
    </div>
  );
}
