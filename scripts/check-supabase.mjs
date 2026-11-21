// Verificador de configuración: `npm run check:supabase`
// Lee .env.local, comprueba la conexión con Supabase y que las migraciones estén aplicadas.
// Nunca imprime las claves.
import fs from "node:fs";

const ok = (m) => console.log(`  ✅ ${m}`);
const bad = (m) => { console.log(`  ❌ ${m}`); process.exitCode = 1; };
const info = (m) => console.log(`  ℹ️  ${m}`);

function readEnv(file) {
  if (!fs.existsSync(file)) return null;
  const env = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

function jwtRole(key) {
  try {
    return JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString()).role ?? null;
  } catch {
    return null;
  }
}

console.log("\nISTEM RESEARCH · verificación de Supabase\n");
const env = readEnv(".env.local");
if (!env) {
  bad("No existe .env.local en esta carpeta. Cópialo desde .env.example (NO pongas claves en .env.example).");
  process.exit(1);
}
ok(".env.local encontrado");

const rawUrl = env.SUPABASE_URL ?? "";
const url = rawUrl.trim().replace(/\/+$/, "").replace(/\/(rest|auth)\/v1$/, "");
const key = (env.SUPABASE_ANON_KEY ?? "").trim();
if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url) && !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(url)) {
  bad(`SUPABASE_URL no tiene el formato esperado (https://<proyecto>.supabase.co). Valor leído: ${url || "(vacío)"}`);
} else {
  ok(`SUPABASE_URL: ${url}`);
  if (url !== rawUrl.trim().replace(/\/+$/, "")) info("Se quitó /rest/v1 del final: la app lo hace sola, pero mejor déjalo sin eso.");
}
if (!key) bad("SUPABASE_ANON_KEY está vacío.");
else {
  const role = jwtRole(key);
  if (role === "service_role") bad("SUPABASE_ANON_KEY contiene la clave service_role. Usa la clave «anon public».");
  else if (role === "anon") ok("SUPABASE_ANON_KEY es una clave anon (pública)");
  else if (key.startsWith("sb_publishable_")) info("Es una clave publishable nueva; si el login falla, usa la «anon public» de Legacy API keys.");
  else info("No se pudo identificar el tipo de clave.");
}
if (env.SUPABASE_SERVICE_ROLE_KEY) info("SUPABASE_SERVICE_ROLE_KEY está definida: la app no la necesita. Puedes dejarla vacía.");
if (process.exitCode) process.exit(1);

const headers = { apikey: key, authorization: `Bearer ${key}` };
try {
  const auth = await fetch(`${url}/auth/v1/settings`, { headers, signal: AbortSignal.timeout(10000) });
  if (auth.ok) {
    const s = await auth.json();
    ok("Auth responde");
    info(s.mailer_autoconfirm ? "Confirmación de correo desactivada: puedes entrar justo después de registrarte." : "Confirmación de correo activada: tras registrarte, confirma el correo o crea el usuario con «Auto Confirm User».");
  } else bad(`Auth respondió HTTP ${auth.status}. Revisa la URL y la clave.`);

  const rest = await fetch(`${url}/rest/v1/geo_areas?select=code&limit=1`, { headers, signal: AbortSignal.timeout(10000) });
  const body = await rest.json().catch(() => ({}));
  if (rest.status === 401 || rest.status === 403 || body.code === "42501") ok("Migraciones aplicadas (las tablas existen y están protegidas para usuarios anónimos)");
  else if (body.code === "PGRST205" || rest.status === 404) bad("Faltan las migraciones: ejecuta 001_fundamentos.sql y 002_geografia_do.sql en el SQL Editor.");
  else if (rest.ok) bad("La tabla geo_areas es legible sin sesión: la migración 001 no se aplicó completa.");
  else bad(`REST respondió HTTP ${rest.status}${body.message ? `: ${body.message}` : ""}`);
} catch (error) {
  bad(`No se pudo conectar: ${error instanceof Error ? error.message : error}`);
}

console.log(process.exitCode ? "\nHay problemas por resolver.\n" : "\nTodo listo. Reinicia el servidor y entra en /register o /login.\n");
