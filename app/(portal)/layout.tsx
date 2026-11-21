import type { ReactNode } from "react";
import { Brand } from "@/components/Brand";
import { LogoutButton } from "@/components/LogoutButton";
import { MobileNav, SideNav } from "@/components/Nav";
import { OrgSwitcher } from "@/components/OrgSwitcher";
import { requirePortalSession } from "@/lib/session";

export const dynamic = "force-dynamic";

function displayName(meta: Record<string, unknown> | undefined, email: string | undefined) {
  const full = typeof meta?.full_name === "string" ? meta.full_name.trim() : "";
  return full || email?.split("@")[0] || "Usuario";
}

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const session = await requirePortalSession();
  const name = displayName(session.user.user_metadata, session.user.email);
  const initials = name.replace(/\(.*?\)/g, "").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return (
    <div className="app">
      <aside className="sidebar">
        <Brand href="/inicio" />
        <SideNav />
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <MobileNav />
            <OrgSwitcher
              options={session.memberships.map((m) => ({ id: m.organization.id, name: m.organization.name }))}
              activeId={session.active?.organization.id ?? null}
            />
          </div>
          <div className="topbar-right">
            <div className="user-chip">
              <span className="avatar" aria-hidden="true">{initials || "U"}</span>
              <span className="who">
                <strong>{name}</strong>
                <small>{session.user.email}</small>
              </span>
            </div>
            <LogoutButton />
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
