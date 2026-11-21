import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Brand } from "@/components/Brand";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = { title: "Crear cuenta" };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="public">
      <div className="public-bg" aria-hidden="true" />
      <header><Brand /></header>
      <main className="auth-wrap">
        <h1>Crear cuenta</h1>
        <p className="sub">Crea tu cuenta y tu primera organización en minutos.</p>
        {!isSupabaseConfigured() ? (
          <div className="alert advertencia" role="alert">
            <strong>Servicio no configurado</strong>
            Defina SUPABASE_URL y SUPABASE_ANON_KEY (ver .env.example) para habilitar el acceso.
          </div>
        ) : null}
        <Suspense>
          <AuthForm kind="register" />
        </Suspense>
        <p className="small">¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p>
      </main>
    </div>
  );
}
