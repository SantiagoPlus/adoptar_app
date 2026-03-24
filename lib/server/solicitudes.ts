import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function marcarSolicitudEnRevision(params: {
  idSolicitud: string;
  idAnimal: string;
  idPublicador: string;
}) {
  const supabase = await createClient();

  const { data: solicitud } = await supabase
    .from("solicitudes_adopcion")
    .select("id_solicitud, id_animal, estado")
    .eq("id_solicitud", params.idSolicitud)
    .single();

  if (!solicitud) {
    redirect(`/publicaciones/${params.idAnimal}?error=solicitud_no_encontrada`);
  }

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", solicitud.id_animal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${params.idAnimal}?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== params.idPublicador) {
    redirect(`/publicaciones/${params.idAnimal}?error=sin_permisos`);
  }

  if (animal.estado !== "disponible") {
    redirect(
      `/publicaciones/${params.idAnimal}?error=animal_no_disponible_para_revision`,
    );
  }

  if (solicitud.estado !== "pendiente") {
    redirect(`/publicaciones/${params.idAnimal}?error=estado_invalido`);
  }

  const { error } = await supabase
    .from("solicitudes_adopcion")
    .update({ estado: "en_revision" })
    .eq("id_solicitud", params.idSolicitud);

  if (error) {
    redirect(
      `/publicaciones/${params.idAnimal}?error=error_actualizacion_solicitud`,
    );
  }

  redirect(`/publicaciones/${params.idAnimal}?ok=en_revision`);
}

export async function actualizarEstadoSolicitudPublicacion(params: {
  idSolicitud: string;
  idAnimal: string;
  idPublicador: string;
  nuevoEstado: "rechazada";
}) {
  const supabase = await createClient();

  const { data: solicitud } = await supabase
    .from("solicitudes_adopcion")
    .select("id_solicitud, id_animal, estado")
    .eq("id_solicitud", params.idSolicitud)
    .single();

  if (!solicitud) {
    redirect(`/publicaciones/${params.idAnimal}?error=solicitud_no_encontrada`);
  }

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador")
    .eq("id_animal", solicitud.id_animal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${params.idAnimal}?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== params.idPublicador) {
    redirect(`/publicaciones/${params.idAnimal}?error=sin_permisos`);
  }

  if (!["pendiente", "en_revision"].includes(solicitud.estado)) {
    redirect(`/publicaciones/${params.idAnimal}?error=estado_invalido`);
  }

  const { error } = await supabase
    .from("solicitudes_adopcion")
    .update({ estado: params.nuevoEstado })
    .eq("id_solicitud", params.idSolicitud);

  if (error) {
    redirect(
      `/publicaciones/${params.idAnimal}?error=error_actualizacion_solicitud`,
    );
  }

  redirect(`/publicaciones/${params.idAnimal}?ok=${params.nuevoEstado}`);
}
