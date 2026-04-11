"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function encodeError(message: string) {
  return encodeURIComponent(message.slice(0, 180));
}

export async function registrarAplicacion(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const idMascota = normalizeText(formData.get("id_mascota"));
  const tipo = normalizeText(formData.get("tipo"));
  const titulo = normalizeText(formData.get("titulo"));
  const descripcion = normalizeText(formData.get("descripcion"));
  const fechaAplicacion = normalizeText(formData.get("fecha_aplicacion"));
  const fechaProximoEvento = normalizeText(formData.get("fecha_proximo_evento"));
  const lote = normalizeText(formData.get("lote"));
  const fabricante = normalizeText(formData.get("fabricante"));
  const profesionalNombre = normalizeText(formData.get("profesional_nombre"));
  const profesionalMatricula = normalizeText(formData.get("profesional_matricula"));
  const observaciones = normalizeText(formData.get("observaciones"));

  if (!user) {
    redirect(`/auth/login?next=/mascotas/${idMascota}`);
  }

  if (!idMascota || !tipo || !titulo || !fechaAplicacion) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=campos_obligatorios`);
  }

  const tiposValidos = [
    "vacunacion",
    "desparasitacion_interna",
    "desparasitacion_externa",
    "control_preventivo",
  ];

  if (!tiposValidos.includes(tipo)) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=tipo_invalido`);
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (usuarioError || !usuario) {
    console.error("registrarAplicacion.usuarioError", usuarioError);
    redirect(`/mascotas/${idMascota}?tab=libreta&error=usuario_no_encontrado`);
  }

  const { data: mascota, error: mascotaError } = await supabase
    .from("mascotas")
    .select("id_mascota, id_usuario")
    .eq("id_mascota", idMascota)
    .single();

  if (mascotaError || !mascota) {
    console.error("registrarAplicacion.mascotaError", mascotaError);
    redirect(`/mascotas/${idMascota}?tab=libreta&error=mascota_no_encontrada`);
  }

  if (mascota.id_usuario !== usuario.id_usuario) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=sin_permisos`);
  }

  const estadoValidacion =
    profesionalNombre && profesionalMatricula
      ? "avalado_manual"
      : "cargado_por_tutor";

  const categoria =
    tipo === "vacunacion"
      ? "vacuna"
      : tipo === "desparasitacion_interna"
        ? "parasitos_internos"
        : tipo === "desparasitacion_externa"
          ? "parasitos_externos"
          : "control";

  const payload = {
    id_mascota: idMascota,
    tipo,
    categoria,
    titulo,
    descripcion: descripcion || titulo,
    fecha_aplicacion: fechaAplicacion,
    fecha_proximo_evento: fechaProximoEvento || null,
    producto_nombre: titulo,
    fabricante: fabricante || null,
    lote: lote || null,
    profesional_nombre: profesionalNombre || null,
    profesional_matricula: profesionalMatricula || null,
    estado_validacion: estadoValidacion,
    created_by_role: "tutor",
    created_by_user_id: usuario.id_usuario,
    observaciones: observaciones || null,
  };

  console.log("registrarAplicacion.payload", payload);

  const { error: insertError } = await supabase
    .from("mascotas_libreta_sanitaria")
    .insert(payload);

  if (insertError) {
    console.error("registrarAplicacion.insertError", insertError);
    redirect(
      `/mascotas/${idMascota}?tab=libreta&error=error_creacion_registro&db_error=${encodeError(
        insertError.message || "error_desconocido",
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
