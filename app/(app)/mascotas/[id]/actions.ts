"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function encodeError(message: string) {
  return encodeURIComponent(message.slice(0, 180));
}

function isValidLibretaCategoria(value: string) {
  return [
    "vacunacion",
    "desparasitacion_interna",
    "desparasitacion_externa",
    "control_preventivo",
  ].includes(value);
}

function toNullable(value: string) {
  return value.trim() ? value.trim() : null;
}

function parseDateValue(value: string) {
  const normalized = value.trim();
  if (!normalized) return null;

  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

function getDiffDays(start: string, end: string) {
  const startDate = parseDateValue(start);
  const endDate = parseDateValue(end);

  if (!startDate || !endDate) return null;

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return null;
  return diffDays;
}

function parsePositiveInteger(value: string) {
  const normalized = value.trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  return Math.round(parsed);
}

export async function registrarAplicacion(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const idMascota = normalizeText(formData.get("id_mascota"));
  const categoriaUI = normalizeText(formData.get("tipo"));

  const titulo = normalizeText(formData.get("titulo"));
  const fechaAplicacion = normalizeText(formData.get("fecha_aplicacion"));
  const fechaProximoEvento = normalizeText(formData.get("fecha_proximo_evento"));
  const observaciones = normalizeText(formData.get("observaciones"));

  const productoNombre = normalizeText(formData.get("producto_nombre"));
  const fabricante = normalizeText(formData.get("fabricante"));
  const lote = normalizeText(formData.get("lote"));
  const viaAplicacion = normalizeText(formData.get("via_aplicacion"));
  const dosis = normalizeText(formData.get("dosis"));

  const enfermedadObjetivo = normalizeText(formData.get("enfermedad_objetivo"));
  const esquemaRefuerzo = normalizeText(formData.get("esquema_refuerzo"));

  const principioActivo = normalizeText(formData.get("principio_activo"));
  const frecuenciaDiasInput = normalizeText(formData.get("frecuencia_dias"));

  const tipoControl = normalizeText(formData.get("tipo_control"));
  const motivo = normalizeText(formData.get("motivo"));
  const hallazgosResumen = normalizeText(formData.get("hallazgos_resumen"));
  const indicaciones = normalizeText(formData.get("indicaciones"));
  const institucion = normalizeText(formData.get("institucion"));

  const profesionalNombre = normalizeText(formData.get("profesional_nombre"));
  const profesionalMatricula = normalizeText(formData.get("profesional_matricula"));

  if (!user) {
    redirect(`/auth/login?next=/mascotas/${idMascota}`);
  }

  if (!idMascota || !categoriaUI || !titulo || !fechaAplicacion) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=campos_obligatorios`);
  }

  if (!isValidLibretaCategoria(categoriaUI)) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=tipo_invalido`);
  }

  let rpcErrorMessage: string | null = null;

  if (categoriaUI === "vacunacion") {
    const { error } = await supabase.rpc("registrar_evento_vacuna", {
      p_id_mascota: idMascota,
      p_titulo: titulo,
      p_fecha_evento: fechaAplicacion,
      p_fecha_proxima_accion: toNullable(fechaProximoEvento),
      p_producto_nombre: toNullable(productoNombre) ?? titulo,
      p_fabricante: toNullable(fabricante),
      p_lote: toNullable(lote),
      p_via_aplicacion: toNullable(viaAplicacion),
      p_dosis: toNullable(dosis),
      p_enfermedad_objetivo: toNullable(enfermedadObjetivo),
      p_esquema_refuerzo: toNullable(esquemaRefuerzo),
      p_profesional_nombre: toNullable(profesionalNombre),
      p_profesional_matricula: toNullable(profesionalMatricula),
    });

    if (error) {
      rpcErrorMessage = error.message || "error_rpc_vacuna";
    }
  }

  if (
    categoriaUI === "desparasitacion_interna" ||
    categoriaUI === "desparasitacion_externa"
  ) {
    const frecuenciaDias =
      parsePositiveInteger(frecuenciaDiasInput) ??
      getDiffDays(fechaAplicacion, fechaProximoEvento);

    const { error } = await supabase.rpc("registrar_evento_desparasitacion", {
      p_id_mascota: idMascota,
      p_alcance: categoriaUI === "desparasitacion_externa" ? "externa" : "interna",
      p_titulo: titulo,
      p_fecha_evento: fechaAplicacion,
      p_fecha_proxima_accion: toNullable(fechaProximoEvento),
      p_producto_nombre: toNullable(productoNombre) ?? titulo,
      p_principio_activo: toNullable(principioActivo),
      p_fabricante: toNullable(fabricante),
      p_lote: toNullable(lote),
      p_via_aplicacion: toNullable(viaAplicacion),
      p_dosis: toNullable(dosis),
      p_profesional_nombre: toNullable(profesionalNombre),
      p_profesional_matricula: toNullable(profesionalMatricula),
      p_frecuencia_dias: frecuenciaDias,
      p_observaciones: toNullable(observaciones),
    });

    if (error) {
      rpcErrorMessage = error.message || "error_rpc_desparasitacion";
    }
  }

  if (categoriaUI === "control_preventivo") {
    const { error } = await supabase.rpc("registrar_evento_control_preventivo", {
      p_id_mascota: idMascota,
      p_titulo: titulo,
      p_fecha_evento: fechaAplicacion,
      p_fecha_proxima_accion: toNullable(fechaProximoEvento),
      p_tipo_control: toNullable(tipoControl),
      p_motivo: toNullable(motivo),
      p_hallazgos_resumen: toNullable(hallazgosResumen),
      p_indicaciones: toNullable(indicaciones),
      p_profesional_nombre: toNullable(profesionalNombre),
      p_profesional_matricula: toNullable(profesionalMatricula),
      p_institucion: toNullable(institucion),
      p_observaciones: toNullable(observaciones),
    });

    if (error) {
      rpcErrorMessage = error.message || "error_rpc_control";
    }
  }

  if (rpcErrorMessage) {
    console.error("registrarAplicacion.rpcError", rpcErrorMessage);
    redirect(
      `/mascotas/${idMascota}?tab=libreta&error=error_creacion_registro&db_error=${encodeError(
        rpcErrorMessage,
      )}`,
    );
  }

  redirect(`/mascotas/${idMascota}?tab=libreta&ok=aplicacion_registrada`);
}

export async function registrarVisita(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const idMascota = normalizeText(formData.get("id_mascota"));
  const categoria = normalizeText(formData.get("categoria"));
  const titulo = normalizeText(formData.get("titulo"));
  const motivoConsulta = normalizeText(formData.get("motivo_consulta"));
  const fechaVisita = normalizeText(formData.get("fecha_visita"));
  const diagnostico = normalizeText(formData.get("diagnostico"));
  const tratamientoIndicado = normalizeText(formData.get("tratamiento_indicado"));
  const tipoEstudio = normalizeText(formData.get("tipo_estudio"));
  const resultadoResumen = normalizeText(formData.get("resultado_resumen"));
  const medicacionOTratamiento = normalizeText(formData.get("medicacion_o_tratamiento"));
  const dosis = normalizeText(formData.get("dosis"));
  const duracionTratamiento = normalizeText(formData.get("duracion_tratamiento"));
  const fechaProximoControl = normalizeText(formData.get("fecha_proximo_control"));
  const profesionalNombre = normalizeText(formData.get("profesional_nombre"));
  const profesionalMatricula = normalizeText(formData.get("profesional_matricula"));
  const institucion = normalizeText(formData.get("institucion"));
  const observaciones = normalizeText(formData.get("observaciones"));

  if (!user) {
    redirect(`/auth/login?next=/mascotas/${idMascota}`);
  }

  if (!idMascota || !categoria || !titulo || !motivoConsulta || !fechaVisita) {
    redirect(`/mascotas/${idMascota}?tab=historial&error=campos_obligatorios_historial`);
  }

  if (!["consulta", "estudio", "cirugia", "medicacion_tratamiento"].includes(categoria)) {
    redirect(`/mascotas/${idMascota}?tab=historial&error=categoria_invalida_historial`);
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (usuarioError || !usuario) {
    console.error("registrarVisita.usuarioError", usuarioError);
    redirect(`/mascotas/${idMascota}?tab=historial&error=usuario_no_encontrado`);
  }

  const { data: mascota, error: mascotaError } = await supabase
    .from("mascotas")
    .select("id_mascota, id_usuario")
    .eq("id_mascota", idMascota)
    .single();

  if (mascotaError || !mascota) {
    console.error("registrarVisita.mascotaError", mascotaError);
    redirect(`/mascotas/${idMascota}?tab=historial&error=mascota_no_encontrada`);
  }

  if (mascota.id_usuario !== usuario.id_usuario) {
    redirect(`/mascotas/${idMascota}?tab=historial&error=sin_permisos`);
  }

  const estadoValidacion =
    profesionalNombre && profesionalMatricula
      ? "avalado_manual"
      : "cargado_por_tutor";

  const payload = {
    id_mascota: idMascota,
    categoria,
    titulo,
    motivo_consulta: motivoConsulta,
    fecha_visita: fechaVisita,
    diagnostico: diagnostico || null,
    tratamiento_indicado: tratamientoIndicado || null,
    tipo_estudio: tipoEstudio || null,
    resultado_resumen: resultadoResumen || null,
    medicacion_o_tratamiento: medicacionOTratamiento || null,
    dosis: dosis || null,
    duracion_tratamiento: duracionTratamiento || null,
    fecha_proximo_control: fechaProximoControl || null,
    profesional_nombre: profesionalNombre || null,
    profesional_matricula: profesionalMatricula || null,
    institucion: institucion || null,
    estado_validacion: estadoValidacion,
    created_by_role: "tutor",
    created_by_user_id: usuario.id_usuario,
    observaciones: observaciones || null,
  };

  console.log("registrarVisita.payload", payload);

  const { error: insertError } = await supabase
    .from("mascotas_historial_clinico")
    .insert(payload);

  if (insertError) {
    console.error("registrarVisita.insertError", insertError);
    redirect(
      `/mascotas/${idMascota}?tab=historial&error=error_creacion_historial&db_error=${encodeError(
        insertError.message || "error_desconocido",
      )}`,
    );
  }

  redirect(`/mascotas/${idMascota}?tab=historial&ok=visita_registrada`);
}
