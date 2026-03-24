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

export type PublicacionResumen = {
  id_animal: string;
  nombre: string;
  especie: string;
  raza: string | null;
  ciudad: string | null;
  estado: string;
  fecha_publicacion: string | null;
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

export type SolicitudResumen = {
  id_animal: string;
  estado: string;
};

export type ResumenSolicitudes = {
  total: number;
  pendientes: number;
  enRevision: number;
  adoptadas: number;
};

export type CrearPublicacionInput = {
  idPublicador: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  edadAproximada: string;
  tamano: string;
  ciudad: string;
  descripcion: string;
  estadoSalud: string;
  nivelEnergia: string;
  castrado: boolean;
  vacunado: boolean;
  desparasitado: boolean;
  aptoNinos: boolean;
  aptoGatos: boolean;
  aptoPerros: boolean;
};

export type ActualizarPublicacionInput = {
  idAnimal: string;
  idPublicador: string;
  nombre: string;
  especie: string;
  raza: string;
  sexo: string;
  edadAproximada: string;
  tamano: string;
  ciudad: string;
  descripcion: string;
  estadoSalud: string;
  nivelEnergia: string;
  castrado: boolean;
  vacunado: boolean;
  desparasitado: boolean;
  aptoNinos: boolean;
  aptoGatos: boolean;
  aptoPerros: boolean;
};

export type PublicacionesDashboardData = {
  items: PublicacionResumen[];
  itemsGestion: PublicacionResumen[];
  publicacionesActivasBase: PublicacionResumen[];
  publicacionesPausadasBase: PublicacionResumen[];
  solicitudesPorAnimal: Map<string, ResumenSolicitudes>;
};

export type PublicacionesArchivoData = {
  items: PublicacionResumen[];
  solicitudesPorAnimal: Map<string, ResumenSolicitudes>;
};

export async function crearPublicacion(input: CrearPublicacionInput) {
  const supabase = await createClient();

  if (!input.nombre || !input.especie) {
    redirect("/publicaciones/nueva?error=campos_obligatorios");
  }

  if (!["perro", "gato"].includes(input.especie)) {
    redirect("/publicaciones/nueva?error=especie_invalida");
  }

  const payload = {
    id_publicador: input.idPublicador,
    nombre: input.nombre,
    especie: input.especie,
    raza: input.raza || null,
    sexo: input.sexo || null,
    edad_aproximada: input.edadAproximada || null,
    tamano: input.tamano || null,
    descripcion: input.descripcion || null,
    estado_salud: input.estadoSalud || null,
    ciudad: input.ciudad || null,
    estado: "disponible",
    fecha_publicacion: new Date().toISOString(),
    nivel_energia: input.nivelEnergia || null,
    castrado: input.castrado,
    vacunado: input.vacunado,
    desparasitado: input.desparasitado,
    apto_ninos: input.aptoNinos,
    apto_gatos: input.aptoGatos,
    apto_perros: input.aptoPerros,
  };

  const { data: animalCreado, error } = await supabase
    .from("animales_adopcion")
    .insert(payload)
    .select("id_animal")
    .single();

  if (error || !animalCreado) {
    redirect("/publicaciones/nueva?error=error_creacion_publicacion");
  }

  return animalCreado;
}

export async function actualizarPublicacionEditable(
  input: ActualizarPublicacionInput,
) {
  const supabase = await createClient();

  if (!input.nombre || !input.especie) {
    redirect(
      `/publicaciones/${input.idAnimal}/editar?error=campos_obligatorios`,
    );
  }

  if (!["perro", "gato"].includes(input.especie)) {
    redirect(`/publicaciones/${input.idAnimal}/editar?error=especie_invalida`);
  }

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", input.idAnimal)
    .single();

  if (!animal) {
    redirect(
      `/publicaciones/${input.idAnimal}/editar?error=animal_no_encontrado`,
    );
  }

  if (animal.id_publicador !== input.idPublicador) {
    redirect(`/publicaciones/${input.idAnimal}/editar?error=sin_permisos`);
  }

  if (animal.estado === "adoptado") {
    redirect(
      `/publicaciones/${input.idAnimal}/editar?error=publicacion_adoptada_bloqueada`,
    );
  }

  const payload = {
    nombre: input.nombre,
    especie: input.especie,
    raza: input.raza || null,
    sexo: input.sexo || null,
    edad_aproximada: input.edadAproximada || null,
    tamano: input.tamano || null,
    descripcion: input.descripcion || null,
    estado_salud: input.estadoSalud || null,
    ciudad: input.ciudad || null,
    nivel_energia: input.nivelEnergia || null,
    castrado: input.castrado,
    vacunado: input.vacunado,
    desparasitado: input.desparasitado,
    apto_ninos: input.aptoNinos,
    apto_gatos: input.aptoGatos,
    apto_perros: input.aptoPerros,
  };

  const { error } = await supabase
    .from("animales_adopcion")
    .update(payload)
    .eq("id_animal", input.idAnimal);

  if (error) {
    redirect(
      `/publicaciones/${input.idAnimal}/editar?error=error_actualizacion_publicacion`,
    );
  }

  redirect(`/publicaciones/${input.idAnimal}?ok=publicacion_actualizada`);
}

export async function getPublicacionesDashboardData(idPublicador: string) {
  const supabase = await createClient();

  const { data: publicaciones, error } = await supabase
    .from("animales_adopcion")
    .select(
      `
        id_animal,
        nombre,
        especie,
        raza,
        ciudad,
        estado,
        fecha_publicacion,
        fotos_animales (
          id_foto,
          url_foto,
          es_principal,
          orden,
          storage_path
        )
      `,
    )
    .eq("id_publicador", idPublicador)
    .order("fecha_publicacion", { ascending: false });

  if (error) {
    return null;
  }

  const items = ((publicaciones ?? []) as PublicacionResumen[]).map((animal) => ({
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  }));

  const itemsGestion = items.filter((item) => item.estado !== "adoptado");
  const publicacionesPausadasBase = itemsGestion.filter(
    (item) => item.estado === "pausado",
  );
  const publicacionesActivasBase = itemsGestion.filter(
    (item) => item.estado === "disponible",
  );

  const ids = itemsGestion.map((item) => item.id_animal);

  const { data: solicitudes } = await supabase
    .from("solicitudes_adopcion")
    .select("id_animal, estado")
    .in(
      "id_animal",
      ids.length ? ids : ["00000000-0000-0000-0000-000000000000"],
    );

  const solicitudesPorAnimal = new Map<string, ResumenSolicitudes>();

  ((solicitudes ?? []) as SolicitudResumen[]).forEach((solicitud) => {
    const actual = solicitudesPorAnimal.get(solicitud.id_animal) ?? {
      total: 0,
      pendientes: 0,
      enRevision: 0,
      adoptadas: 0,
    };

    actual.total += 1;
    if (solicitud.estado === "pendiente") actual.pendientes += 1;
    if (solicitud.estado === "en_revision") actual.enRevision += 1;
    if (solicitud.estado === "adoptado") actual.adoptadas += 1;

    solicitudesPorAnimal.set(solicitud.id_animal, actual);
  });

  return {
    items,
    itemsGestion,
    publicacionesActivasBase,
    publicacionesPausadasBase,
    solicitudesPorAnimal,
  } as PublicacionesDashboardData;
}

export async function getPublicacionesArchivoData(idPublicador: string) {
  const supabase = await createClient();

  const { data: publicaciones, error } = await supabase
    .from("animales_adopcion")
    .select(
      `
        id_animal,
        nombre,
        especie,
        raza,
        ciudad,
        estado,
        fecha_publicacion,
        fotos_animales (
          id_foto,
          url_foto,
          es_principal,
          orden,
          storage_path
        )
      `,
    )
    .eq("id_publicador", idPublicador)
    .eq("estado", "adoptado")
    .order("fecha_publicacion", { ascending: false });

  if (error) {
    return null;
  }

  const items = ((publicaciones ?? []) as PublicacionResumen[]).map((animal) => ({
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  }));

  const ids = items.map((item) => item.id_animal);

  const { data: solicitudes } = await supabase
    .from("solicitudes_adopcion")
    .select("id_animal, estado")
    .in(
      "id_animal",
      ids.length ? ids : ["00000000-0000-0000-0000-000000000000"],
    );

  const solicitudesPorAnimal = new Map<string, ResumenSolicitudes>();

  ((solicitudes ?? []) as SolicitudResumen[]).forEach((solicitud) => {
    const actual = solicitudesPorAnimal.get(solicitud.id_animal) ?? {
      total: 0,
      pendientes: 0,
      enRevision: 0,
      adoptadas: 0,
    };

    actual.total += 1;
    if (solicitud.estado === "pendiente") actual.pendientes += 1;
    if (solicitud.estado === "en_revision") actual.enRevision += 1;
    if (solicitud.estado === "adoptado") actual.adoptadas += 1;

    solicitudesPorAnimal.set(solicitud.id_animal, actual);
  });

  return {
    items,
    solicitudesPorAnimal,
  } as PublicacionesArchivoData;
}

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

export async function getPublicacionEditableDelPublicador(
  idAnimal: string,
  idPublicador: string,
) {
  return getPublicacionDelPublicador(idAnimal, idPublicador);
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
