"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function normalizeText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
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

  if (
    ![
      "vacunacion",
      "desparasitacion_interna",
      "desparasitacion_externa",
      "control_preventivo",
    ].includes(tipo)
  ) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=tipo_invalido`);
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (usuarioError || !usuario) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=usuario_no_encontrado`);
  }

  const { data: mascota, error: mascotaError } = await supabase
    .from("mascotas")
    .select("id_mascota, id_usuario")
    .eq("id_mascota", idMascota)
    .single();

  if (mascotaError || !mascota) {
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

  const { error: insertError } = await supabase
    .from("mascotas_libreta_sanitaria")
    .insert(payload);

  if (insertError) {
    redirect(`/mascotas/${idMascota}?tab=libreta&error=error_creacion_registro`);
  }

  redirect(`/mascotas/${idMascota}?tab=libreta&ok=aplicacion_registrada`);
}
