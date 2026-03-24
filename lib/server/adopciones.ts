import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function concretarAdopcionPublicacion(params: {
  idSolicitud: string;
  idAnimal: string;
  idPublicador: string;
}) {
  const supabase = await createClient();

  const { data: solicitud } = await supabase
    .from("solicitudes_adopcion")
    .select("id_solicitud, id_animal, id_solicitante, estado")
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
      `/publicaciones/${params.idAnimal}?error=animal_no_disponible_para_adopcion`,
    );
  }

  if (solicitud.estado !== "en_revision") {
    redirect(`/publicaciones/${params.idAnimal}?error=estado_invalido_adopcion`);
  }

  const { error: insertAdopcionError } = await supabase
    .from("adopciones")
    .insert({
      id_animal: solicitud.id_animal,
      id_adoptante: solicitud.id_solicitante,
      id_publicador: params.idPublicador,
      id_solicitud: solicitud.id_solicitud,
      fecha_adopcion: new Date().toISOString(),
    });

  if (insertAdopcionError) {
    if (insertAdopcionError.code === "23505") {
      redirect(`/publicaciones/${params.idAnimal}?error=adopcion_duplicada`);
    }
    redirect(`/publicaciones/${params.idAnimal}?error=error_adopcion`);
  }

  const { error: updateSolicitudGanadoraError } = await supabase
    .from("solicitudes_adopcion")
    .update({ estado: "adoptado" })
    .eq("id_solicitud", solicitud.id_solicitud);

  if (updateSolicitudGanadoraError) {
    redirect(
      `/publicaciones/${params.idAnimal}?error=error_estado_solicitud_ganadora`,
    );
  }

  const { error: updateAnimalError } = await supabase
    .from("animales_adopcion")
    .update({ estado: "adoptado" })
    .eq("id_animal", solicitud.id_animal);

  if (updateAnimalError) {
    redirect(`/publicaciones/${params.idAnimal}?error=error_estado_animal`);
  }

  const { error: cancelRestError } = await supabase
    .from("solicitudes_adopcion")
    .update({ estado: "cancelada" })
    .eq("id_animal", solicitud.id_animal)
    .neq("id_solicitud", solicitud.id_solicitud)
    .in("estado", ["pendiente", "en_revision"]);

  if (cancelRestError) {
    redirect(`/publicaciones/${params.idAnimal}?error=error_cierre_restantes`);
  }

  redirect(`/publicaciones/${params.idAnimal}?ok=adoptado`);
}
