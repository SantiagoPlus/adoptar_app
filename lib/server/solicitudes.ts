import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CrearSolicitudInput = {
  idAnimal: string;
  idSolicitante: string;
  nombreSolicitante: string;
  mensaje: string;
};

export async function crearSolicitudAdopcion(input: CrearSolicitudInput) {
  const supabase = await createClient();

  if (!input.idAnimal) {
    redirect("/?error=animal_invalido");
  }

  if (!input.mensaje) {
    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(input.idAnimal)}&error=mensaje_vacio`,
    );
  }

  const { data: animal, error: animalError } = await supabase
    .from("animales_adopcion")
    .select("id_animal, estado, id_publicador")
    .eq("id_animal", input.idAnimal)
    .single();

  if (animalError || !animal) {
    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(input.idAnimal)}&error=animal_no_encontrado`,
    );
  }

  if (animal.id_publicador === input.idSolicitante) {
    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(input.idAnimal)}&error=auto_solicitud_no_permitida`,
    );
  }

  if (animal.estado !== "disponible") {
    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(input.idAnimal)}&error=animal_no_disponible`,
    );
  }

  const { error: insertError } = await supabase
    .from("solicitudes_adopcion")
    .insert({
      id_animal: input.idAnimal,
      id_solicitante: input.idSolicitante,
      nombre_solicitante: input.nombreSolicitante || "Usuario",
      mensaje: input.mensaje,
      estado: "pendiente",
      fecha_solicitud: new Date().toISOString(),
    });

  if (insertError) {
    if (insertError.code === "23505") {
      redirect(
        `/solicitudes/nueva?animal_id=${encodeURIComponent(input.idAnimal)}&error=solicitud_duplicada`,
      );
    }

    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(input.idAnimal)}&error=error_insercion`,
    );
  }

  redirect(
    `/solicitudes/nueva?animal_id=${encodeURIComponent(input.idAnimal)}&ok=1`,
  );
}

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
