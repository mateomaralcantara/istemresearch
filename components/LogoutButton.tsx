"use client";

import { useRouter } from "next/navigation";
import { Icon } from "./Icon";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="btn small ghost"
      title="Cerrar sesión"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.replace("/login");
        router.refresh();
      }}
    >
      <Icon name="logout" size={16} />
      <span>Salir</span>
    </button>
  );
}
