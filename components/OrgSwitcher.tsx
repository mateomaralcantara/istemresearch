"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { send } from "@/lib/client-api";

type Option = { id: string; name: string };

function initials(name: string) {
  return name.replace(/\(.*?\)/g, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "O";
}

export function OrgSwitcher({ options, activeId }: { options: Option[]; activeId: string | null }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  if (options.length === 0) return null;
  const active = options.find((o) => o.id === activeId) ?? options[0];
  return (
    <label className="org-switch">
      <span className="org-dot" aria-hidden="true">{initials(active.name)}</span>
      <span className="sr-only">Organización activa</span>
      <select
        value={activeId ?? ""}
        disabled={busy}
        onChange={async (e) => {
          if (e.target.value === "__new") return router.push("/organizacion/nueva");
          setBusy(true);
          await send("POST", "/api/session/organization", { organizationId: e.target.value });
          setBusy(false);
          router.refresh();
        }}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
        <option value="__new">+ Nueva organización…</option>
      </select>
    </label>
  );
}
