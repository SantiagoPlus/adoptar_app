import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FotoAnimal = {
  id_foto: string;
  url_foto: string;
  es_principal: boolean;
  orden: number;
  storage_path?: string | null;
};

export type AnimalPublicacion = {
  id_animal: string;
  nombre: string;
  especie: string;
  raza: string | null;
  sexo: string | null;
  edad_aproximada: string | null;
  tamano: string | null;
  descripcion: string | null;
  estado_salud: string | null;
  ciudad: string | null;
  estado: string;
  fecha_publicacion: string | null;
  id_publicador: string;
  nivel_energia: string | null;
  castrado: boolean | null;
  vacunado: boolean | null;
  desparasitado: boolean | null;
  apto_ninos: boolean | null;
  apto_gatos: boolean | null;
  apto_perros: boolean | null;
  fotos_animales: FotoAnimal[];
};

export type SolicitudItem = {
  id_solicitud: string;
  id_solicitante: string;
  nombre_solicitante: string | null;
  mensaje: string;
  estado: string;
  fecha_solicitud: string;
};

export async function getPublicacionDelPublicador(
  idAnimal: string,
  idPublicador: string,
) {
  const supabase = await createClient();

  const { data: animal, error } = await supabase
    .from("animales_adopcion")
    .select(
      `
        id_animal,
        nombre,
        especie,
        raza,
        sexo,
        edad_aproximada,
        tamano,
        descripcion,
        estado_salud,
        ciudad,
        estado,
        fecha_publicacion,
        id_publicador,
        nivel_energia,
        castrado,
        vacunado,
        desparasitado,
        apto_ninos,
        apto_gatos,
        apto_perros,
        fotos_animales (
          id_foto,
          url_foto,
          es_principal,
          orden,
          storage_path
        )
      `,
    )
    .eq("id_animal", idAnimal)
    .single();

  if (error || !animal) {
    return null;
  }

  const animalTipado: AnimalPublicacion = {
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  };

  if (animalTipado.id_publicador !== idPublicador) {
    return null;
  }

  return animalTipado;
}

export async function getSolicitudesDePublicacion(idAnimal: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .select(
      `
        id_solicitud,
        id_solicitante,
        nombre_solicitante,
        mensaje,
        estado,
        fecha_solicitud
      `,
    )
    .eq("id_animal", idAnimal)
    .order("fecha_solicitud", { ascending: false });

  if (error) {
    return null;
  }

  return (data ?? []) as SolicitudItem[];
}

export async function setEstadoPublicacion(params: {
  idAnimal: string;
  idPublicador: string;
  nuevoEstado: "pausado" | "disponible";
}) {
  const supabase = await createClient();

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", params.idAnimal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${params.idAnimal}?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== params.idPublicador) {
    redirect(`/publicaciones/${params.idAnimal}?error=sin_permisos`);
  }

  if (animal.estado === "adoptado") {
    redirect(
      `/publicaciones/${params.idAnimal}?error=publicacion_adoptada_bloqueada`,
    );
  }

  if (animal.estado === params.nuevoEstado) {
    redirect(`/publicaciones/${params.idAnimal}?ok=sin_cambios_publicacion`);
  }

  const { error } = await supabase
    .from("animales_adopcion")
    .update({ estado: params.nuevoEstado })
    .eq("id_animal", params.idAnimal);

  if (error) {
    redirect(
      `/publicaciones/${params.idAnimal}?error=error_actualizacion_publicacion`,
    );
  }

  redirect(
    `/publicaciones/${params.idAnimal}?ok=publicacion_${params.nuevoEstado}`,
  );
}

export async function deletePublicacionSegura(params: {
  idAnimal: string;
  idPublicador: string;
}) {
  const supabase = await createClient();

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", params.idAnimal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${params.idAnimal}?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== params.idPublicador) {
    redirect(`/publicaciones/${params.idAnimal}?error=sin_permisos`);
  }

  if (animal.estado === "adoptado") {
    redirect(
      `/publicaciones/${params.idAnimal}?error=publicacion_adoptada_bloqueada`,
    );
  }

  const { data: adopcionExistente } = await supabase
    .from("adopciones")
    .select("id_adopcion")
    .eq("id_animal", params.idAnimal)
    .maybeSingle();

  if (adopcionExistente) {
    redirect(
      `/publicaciones/${params.idAnimal}?error=publicacion_con_adopcion`,
    );
  }

  const { data: fotos } = await supabase
    .from("fotos_animales")
    .select("id_foto, storage_path")
    .eq("id_animal", params.idAnimal);

  const storagePaths = (fotos ?? [])
    .map((foto) => foto.storage_path)
    .filter((value): value is string => Boolean(value));

  if (storagePaths.length > 0) {
    const { error: storageDeleteError } = await supabase.storage
      .from("animales")
      .remove(storagePaths);

    if (storageDeleteError) {
      redirect(
        `/publicaciones/${params.idAnimal}?error=error_eliminacion_storage`,
      );
    }
  }

  const { error: deleteFotosError } = await supabase
    .from("fotos_animales")
    .delete()
    .eq("id_animal", params.idAnimal);

  if (deleteFotosError) {
    redirect(
      `/publicaciones/${params.idAnimal}?error=error_eliminacion_fotos`,
    );
  }

  const { error: deleteAnimalError } = await supabase
    .from("animales_adopcion")
    .delete()
    .eq("id_animal", params.idAnimal);

  if (deleteAnimalError) {
    redirect(
      `/publicaciones/${params.idAnimal}?error=error_eliminacion_publicacion`,
    );
  }

  redirect("/publicaciones?ok=publicacion_eliminada");
}
