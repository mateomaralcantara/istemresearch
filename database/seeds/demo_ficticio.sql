-- ISTEM RESEARCH · datos de demostración FICTICIOS
-- Crea la organización «Instituto Demo (datos ficticios)» con proyectos en todas las etapas,
-- usando las mismas funciones de la app (permisos y auditoría incluidos).
--
-- Uso (Supabase → SQL Editor):
--   1. Regístrate primero en la app (o crea el usuario en Authentication → Users).
--   2. Cambia el correo de la línea v_email si no es el tuyo y pulsa Run.
-- Si la organización demo ya existe, no hace nada.
-- Para borrarla: delete from public.organizations where slug = 'instituto-demo';
--   (requiere borrar antes su auditoría, que es inmutable: ver final del archivo).

do $$
declare
  v_email text := 'istemsd@gmail.com';
  v_uid uuid;
  v_org uuid;
  p uuid;
begin
  select auth.users.id into v_uid from auth.users where lower(auth.users.email) = lower(v_email);
  if v_uid is null then
    raise exception 'No existe un usuario con el correo %. Regístrate primero en la app.', v_email;
  end if;
  if exists (select 1 from public.organizations where organizations.slug = 'instituto-demo') then
    raise notice 'La organización demo ya existe; no se crea de nuevo.';
    return;
  end if;

  -- Actúa como ese usuario para que las funciones apliquen sus permisos y auditoría.
  perform set_config('request.jwt.claim.sub', v_uid::text, true);
  perform public.ensure_my_profile();
  v_org := (public.create_organization('Instituto Demo (datos ficticios)', 'instituto-demo', 'DO')).id;

  p := (public.create_project(v_org, '{
    "title": "Satisfacción con servicios públicos municipales (ficticio)",
    "research_question": "¿Cómo valoran los residentes de 18 años o más la calidad de los servicios públicos municipales en 2026?",
    "objective_type": "descriptivo",
    "description": "Proyecto de demostración con datos ficticios.",
    "target_population": "Residentes de 18 años o más en hogares particulares",
    "geo_area_codes": ["DO-01", "DO-32", "DO-25"],
    "methods": ["capi", "cati"],
    "sampling_design": "probabilistico", "planned_sample_size": 1601, "target_moe": 0.03, "confidence_level": 0.95,
    "starts_on": "2026-11-10", "ends_on": "2026-12-15"}'::jsonb)).id;
  perform public.change_project_status(p, 'diseno', 'Cuestionario aprobado');
  perform public.change_project_status(p, 'campo', 'Piloto superado');

  p := (public.create_project(v_org, '{
    "title": "Percepción de seguridad ciudadana (ficticio)",
    "research_question": "¿Qué nivel de seguridad perciben los adultos en sus barrios y cómo cambió respecto al año anterior?",
    "objective_type": "comparativo",
    "target_population": "Adultos residentes en zonas urbanas",
    "geo_area_codes": ["DO"],
    "methods": ["capi"],
    "sampling_design": "probabilistico", "planned_sample_size": 1200, "target_moe": 0.03, "confidence_level": 0.95,
    "starts_on": "2026-09-01", "ends_on": "2026-10-30"}'::jsonb)).id;
  perform public.change_project_status(p, 'diseno');
  perform public.change_project_status(p, 'campo');
  perform public.change_project_status(p, 'analisis', 'Campo cerrado: 1.214 entrevistas');

  p := (public.create_project(v_org, '{
    "title": "Conversación pública sobre transporte urbano (ficticio)",
    "research_question": "¿Qué temas y preocupaciones aparecen en las conversaciones públicas sobre el transporte urbano?",
    "objective_type": "exploratorio",
    "target_population": "Publicaciones públicas accesibles por APIs oficiales",
    "geo_area_codes": ["DO-01", "DO-32"],
    "methods": ["escucha_social", "investigacion_web"],
    "sampling_design": "no_aplica"}'::jsonb)).id;
  perform public.change_project_status(p, 'diseno', 'Esperando autorización de fuentes');

  p := (public.create_project(v_org, '{
    "title": "Panel web de percepción de marca (ficticio)",
    "research_question": "¿Qué atributos asocian los miembros del panel a las marcas evaluadas?",
    "objective_type": "comparativo",
    "target_population": "Miembros del panel en línea",
    "geo_area_codes": ["DO"],
    "methods": ["cawi"],
    "sampling_design": "no_probabilistico", "planned_sample_size": 800}'::jsonb)).id;

  p := (public.create_project(v_org, '{
    "title": "Confianza en las instituciones 2025 (ficticio)",
    "research_question": "¿Qué nivel de confianza expresan los adultos en las principales instituciones públicas?",
    "objective_type": "seguimiento",
    "target_population": "Residentes de 18 años o más",
    "geo_area_codes": ["DO"],
    "methods": ["capi", "cati"],
    "sampling_design": "probabilistico", "planned_sample_size": 2400, "target_moe": 0.02, "confidence_level": 0.95,
    "starts_on": "2025-06-01", "ends_on": "2025-08-15"}'::jsonb)).id;
  perform public.change_project_status(p, 'diseno');
  perform public.change_project_status(p, 'campo');
  perform public.change_project_status(p, 'analisis');
  perform public.change_project_status(p, 'revision');
  perform public.change_project_status(p, 'terminado', 'Informe aprobado');

  p := (public.create_project(v_org, '{
    "title": "Calidad del servicio de agua potable (ficticio)",
    "research_question": "¿Cómo evalúan los hogares la continuidad y calidad del servicio de agua potable por provincia?",
    "objective_type": "evaluativo",
    "target_population": "Hogares particulares",
    "geo_area_codes": ["DO-25", "DO-13", "DO-18", "DO-06"],
    "methods": ["cati", "datos_secundarios"],
    "sampling_design": "probabilistico", "planned_sample_size": 1000, "target_moe": 0.031, "confidence_level": 0.95}'::jsonb)).id;
  perform public.change_project_status(p, 'diseno');
  perform public.change_project_status(p, 'campo');
  perform public.change_project_status(p, 'analisis');
  perform public.change_project_status(p, 'revision', 'En revisión metodológica');

  p := (public.create_project(v_org, '{
    "title": "Clima laboral interno (ficticio)",
    "research_question": "¿Cómo perciben los colaboradores el clima laboral de la organización?",
    "objective_type": "descriptivo",
    "methods": ["cawi"],
    "sampling_design": "por_definir"}'::jsonb)).id;
  perform public.change_project_status(p, 'archivado', 'Duplicado de otro estudio');

  -- La organización demo queda como activa la próxima vez que entres (si es la única).
  raise notice 'Listo: organización demo creada con 7 proyectos ficticios.';
end $$;

-- Para borrar la demo por completo (solo en tu proyecto de pruebas):
--   alter table public.audit_logs disable trigger audit_logs_no_update;
--   delete from public.audit_logs where organization_id = (select id from public.organizations where slug = 'instituto-demo');
--   alter table public.audit_logs enable trigger audit_logs_no_update;
--   delete from public.organizations where slug = 'instituto-demo';
