"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULES } from "@/lib/modules";
import { Icon } from "./Icon";

const GROUPS = [...new Set(MODULES.map((m) => m.group))];

function NavList() {
  const pathname = usePathname();
  return (
    <>
      {GROUPS.map((group) => (
        <div className="nav-group" key={group}>
          <div className="nav-group-title">{group}</div>
          <ul className="nav">
            {MODULES.filter((m) => m.group === group).map((m) => {
              const active = pathname === m.href || pathname.startsWith(`${m.href}/`);
              return (
                <li key={m.slug}>
                  <Link href={m.href} aria-current={active ? "page" : undefined}>
                    <Icon name={m.icon} />
                    <span className="label">{m.label}</span>
                    {m.status !== "disponible" ? (
                      <span className={`phase${m.status === "parcial" ? " partial" : ""}`} title={m.status === "parcial" ? "Disponible en parte" : "Planificado"}>
                        {m.status === "parcial" ? "parcial" : `F${m.phase}`}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

export function SideNav() {
  const ready = MODULES.filter((m) => m.status !== "planificado").length;
  return (
    <>
      <nav aria-label="Menú principal">
        <NavList />
      </nav>
      <div className="side-foot">
        <strong>Fase 1 · Fundamentos</strong>
        {ready} de {MODULES.length} módulos activos
        <div className="bar"><span style={{ width: `${Math.round((ready / MODULES.length) * 100)}%` }} /></div>
      </div>
    </>
  );
}

export function MobileNav() {
  return (
    <details className="nav-mobile">
      <summary aria-label="Abrir menú"><Icon name="menu" /></summary>
      <div className="mobile-panel">
        <nav aria-label="Menú principal" style={{ color: "var(--side-text)" }}>
          <NavList />
        </nav>
      </div>
    </details>
  );
}
