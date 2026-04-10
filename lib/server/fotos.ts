import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function marcarFotoPrincipalPublicacion(params: {
  idAnimal: string;
  idFoto: string;
  idPublicador: string;
}) {
  const supabase = await createClient();

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", params.idAnimal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${params.idAnimal}/editar?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== params.idPublicador) {
    redirect(`/publicaciones/${params.idAnimal}/editar?error=sin_permisos`);
  }

  if (animal.estado === "adoptado") {
    redirect(
      `/publicaciones/${params.idAnimal}/editar?error=publicacion_adoptada_bloqueada`,
    );
  }

  const { error: clearError } = await supabase
    .from("fotos_animales")
    .update({ es_principal: false })
    .eq("id_animal", params.idAnimal);

  if (clearError) {
    redirect(`/publicaciones/${params.idAnimal}/editar?error=error_foto_principal`);
  }

  const { error: setError } = await supabase
    .from("fotos_animales")
    .update({ es_principal: true })
    .eq("id_foto", params.idFoto)
    .eq("id_animal", params.idAnimal);

  if (setError) {
    redirect(`/publicaciones/${params.idAnimal}/editar?error=error_foto_principal`);
  }

  redirect(`/publicaciones/${params.idAnimal}/editar?ok=foto_principal_actualizada`);
}

export async function eliminarFotoPublicacion(params: {
  idAnimal: string;
  idFoto: string;
  idPublicador: string;
}) {
  const supabase = await createClient();

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", params.idAnimal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${params.idAnimal}/editar?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== params.idPublicador) {
    redirect(`/publicaciones/${params.idAnimal}/editar?error=sin_permisos`);
  }

  if (animal.estado === "adoptado") {
    redirect(
      `/publicaciones/${params.idAnimal}/editar?error=publicacion_adoptada_bloqueada`,
    );
  }

  const { data: foto } = await supabase
    .from("fotos_animales")
    .select("id_foto, storage_path, es_principal")
    .eq("id_foto", params.idFoto)
    .eq("id_animal", params.idAnimal)
    .single();

  if (!foto) {
    redirect(`/publicaciones/${params.idAnimal}/editar?error=foto_no_encontrada`);
  }

  if (foto.storage_path) {
    const { error: removeStorageError } = await supabase.storage
      .from("animales")
      .remove([foto.storage_path]);

    if (removeStorageError) {
      redirect(
        `/publicaciones/${params.idAnimal}/editar?error=error_eliminacion_storage`,
      );
    }
  }

  const { error: deleteFotoError } = await supabase
    .from("fotos_animales")
    .delete()
    .eq("id_foto", params.idFoto)
    .eq("id_animal", params.idAnimal);

  if (deleteFotoError) {
    redirect(`/publicaciones/${params.idAnimal}/editar?error=error_eliminacion_foto`);
  }

  if (foto.es_principal) {
    const { data: restantes } = await supabase
      .from("fotos_animales")
      .select("id_foto")
      .eq("id_animal", params.idAnimal)
      .order("orden", { ascending: true })
      .limit(1);

    const siguiente = restantes?.[0];

    if (siguiente) {
      await supabase
        .from("fotos_animales")
        .update({ es_principal: true })
        .eq("id_foto", siguiente.id_foto)
        .eq("id_animal", params.idAnimal);
    }
  }

  redirect(`/publicaciones/${params.idAnimal}/editar?ok=foto_eliminada`);
}
