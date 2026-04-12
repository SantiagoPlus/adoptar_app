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
