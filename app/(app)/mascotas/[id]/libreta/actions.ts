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

function parsePositiveInteger(value: string) {
  const normalized = value.trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;

  return Math.round(parsed);
}

function parseBoolean(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim().toLowerCase();

  if (!normalized) return null;
  if (["true", "1", "yes", "si", "sí", "on"].includes(normalized)) return true;
  if (["false", "0", "no", "off"].includes(normalized)) return false;

  return null;
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
  const institucion = normalizeText(formData.get("institucion"));

  const profesionalNombre = normalizeText(formData.get("profesional_nombre"));
  const profesionalMatricula = normalizeText(formData.get("profesional_matricula"));

  if (!user) {
    redirect(`/auth/login?next=/mascotas/${idMascota}`);
  }

  if (!idMascota || !categoriaUI || !fechaAplicacion) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=campos_obligatorios`);
  }

  if (!isValidLibretaCategoria(categoriaUI)) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=tipo_invalido`);
  }

  let rpcErrorMessage: string | null = null;

  if (categoriaUI === "vacunacion") {
    const productoNombre = normalizeText(formData.get("producto_nombre"));
    const fabricante = normalizeText(formData.get("fabricante"));
    const lote = normalizeText(formData.get("lote"));
    const viaAplicacion = normalizeText(formData.get("via_aplicacion"));
    const aplicacionUnica = parseBoolean(
      formData.get("vacuna_aplicacion_unica"),
    );
    const esquemaRefuerzoDias = parsePositiveInteger(
      normalizeText(formData.get("esquema_refuerzo_dias")),
    );

    if (!productoNombre || !viaAplicacion || aplicacionUnica === null) {
      redirect(`/mascotas/${idMascota}?tab=libreta&error=campos_obligatorios`);
    }

    if (aplicacionUnica === false && !esquemaRefuerzoDias) {
      redirect(
        `/mascotas/${idMascota}?tab=libreta&error=esquema_refuerzo_requerido`,
      );
    }

    const { error } = await supabase.rpc("registrar_evento_vacuna", {
      p_id_mascota: idMascota,
      p_titulo: toNullable(titulo),
      p_fecha_evento: fechaAplicacion,
      p_fecha_proxima_accion: toNullable(fechaProximoEvento),
      p_producto_nombre: productoNombre,
      p_fabricante: toNullable(fabricante),
      p_lote: toNullable(lote),
      p_via_aplicacion: viaAplicacion,
      p_dosis: null,
      p_enfermedad_objetivo: null,
      p_esquema_refuerzo:
        aplicacionUnica === true
          ? "aplicación única"
          : esquemaRefuerzoDias?.toString() ?? null,
      p_profesional_nombre: toNullable(profesionalNombre),
      p_profesional_matricula: toNullable(profesionalMatricula),
      p_aplicacion_unica: aplicacionUnica,
      p_esquema_refuerzo_dias: esquemaRefuerzoDias,
      p_institucion: toNullable(institucion),
      p_observaciones: toNullable(observaciones),
      p_id_servicio: null,
    });

    if (error) {
      rpcErrorMessage = error.message || "error_rpc_vacuna";
    }
  }

  if (
    categoriaUI === "desparasitacion_interna" ||
    categoriaUI === "desparasitacion_externa"
  ) {
    const alcance =
      categoriaUI === "desparasitacion_externa" ? "externa" : "interna";
    const productoNombre = normalizeText(formData.get("producto_nombre"));
    const principioActivo = normalizeText(formData.get("principio_activo"));
    const fabricante = normalizeText(formData.get("fabricante"));
    const lote = normalizeText(formData.get("lote"));
    const formaAdministracion = normalizeText(
      formData.get("forma_administracion"),
    );
    const aplicacionUnica = parseBoolean(
      formData.get("desparasitacion_aplicacion_unica"),
    );
    const cantidadDias = parsePositiveInteger(
      normalizeText(formData.get("cantidad_dias")),
    );
    const frecuenciaHoras = parsePositiveInteger(
      normalizeText(formData.get("frecuencia_horas")),
    );

    if (!productoNombre || !formaAdministracion || aplicacionUnica === null) {
      redirect(`/mascotas/${idMascota}?tab=libreta&error=campos_obligatorios`);
    }

    if (aplicacionUnica === false && (!cantidadDias || !frecuenciaHoras)) {
      redirect(
        `/mascotas/${idMascota}?tab=libreta&error=tratamiento_incompleto`,
      );
    }

    const { error } = await supabase.rpc("registrar_evento_desparasitacion", {
      p_id_mascota: idMascota,
      p_alcance: alcance,
      p_titulo: toNullable(titulo),
      p_fecha_evento: fechaAplicacion,
      p_fecha_proxima_accion: toNullable(fechaProximoEvento),
      p_producto_nombre: productoNombre,
      p_principio_activo: toNullable(principioActivo),
      p_fabricante: toNullable(fabricante),
      p_lote: toNullable(lote),
      p_via_aplicacion: formaAdministracion,
      p_dosis: null,
      p_profesional_nombre: toNullable(profesionalNombre),
      p_profesional_matricula: toNullable(profesionalMatricula),
      p_frecuencia_dias: null,
      p_observaciones: toNullable(observaciones),
      p_forma_administracion: formaAdministracion,
      p_aplicacion_unica: aplicacionUnica,
      p_cantidad_dias: cantidadDias,
      p_frecuencia_horas: frecuenciaHoras,
      p_institucion: toNullable(institucion),
      p_id_servicio: null,
    });

    if (error) {
      rpcErrorMessage = error.message || "error_rpc_desparasitacion";
    }
  }

  if (categoriaUI === "control_preventivo") {
    const hallazgosResumen = normalizeText(formData.get("hallazgos_resumen"));

    const { error } = await supabase.rpc("registrar_evento_control_preventivo", {
      p_id_mascota: idMascota,
      p_titulo: toNullable(titulo),
      p_fecha_evento: fechaAplicacion,
      p_fecha_proxima_accion: toNullable(fechaProximoEvento),
      p_tipo_control: null,
      p_motivo: null,
      p_hallazgos_resumen: toNullable(hallazgosResumen),
      p_indicaciones: null,
      p_profesional_nombre: toNullable(profesionalNombre),
      p_profesional_matricula: toNullable(profesionalMatricula),
      p_institucion: toNullable(institucion),
      p_observaciones: toNullable(observaciones),
      p_id_servicio: null,
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
