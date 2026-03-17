import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ id: string }>;

type FotoAnimal = {
  id_foto: string;
  url_foto: string;
  es_principal: boolean;
  orden: number;
};

type AnimalPublicacion = {
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

function formatEstadoSolicitud(estado: string) {
  const labels: Record<string, string> = {
    pendiente: "Pendiente",
    en_revision: "En revisión",
    rechazada: "Rechazada",
    cancelada: "Cancelada",
    adoptado: "Adoptado",
  };

  return labels[estado] ?? estado;
}

function formatEstadoAnimal(estado: string) {
  const labels: Record<string, string> = {
    disponible: "Disponible",
    adoptado: "Adoptado",
    pausado: "Pausado",
    cancelado: "Cancelado",
    en_proceso: "En proceso",
  };

  return labels[estado] ?? estado;
}

async function marcarEnRevision(formData: FormData) {
  "use server";

  const idSolicitud = String(formData.get("id_solicitud") ?? "").trim();
  const idAnimal = String(formData.get("id_animal") ?? "").trim();

  if (!idSolicitud || !idAnimal) {
    redirect("/publicaciones?error=solicitud_invalida");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect(`/auth/login?next=/publicaciones/${idAnimal}`);
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!usuario) {
    redirect(`/publicaciones/${idAnimal}?error=usuario_no_encontrado`);
  }

  const { data: solicitud } = await supabase
    .from("solicitudes_adopcion")
    .select("id_solicitud, id_animal, estado")
    .eq("id_solicitud", idSolicitud)
    .single();

  if (!solicitud) {
    redirect(`/publicaciones/${idAnimal}?error=solicitud_no_encontrada`);
  }

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", solicitud.id_animal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${idAnimal}?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== usuario.id_usuario) {
    redirect(`/publicaciones/${idAnimal}?error=sin_permisos`);
  }

  if (animal.estado !== "disponible") {
    redirect(
      `/publicaciones/${idAnimal}?error=animal_no_disponible_para_revision`,
    );
  }

  if (solicitud.estado !== "pendiente") {
    redirect(`/publicaciones/${idAnimal}?error=estado_invalido`);
  }

  const { error } = await supabase
    .from("solicitudes_adopcion")
    .update({ estado: "en_revision" })
    .eq("id_solicitud", idSolicitud);

  if (error) {
    redirect(
      `/publicaciones/${idAnimal}?error=error_actualizacion_solicitud`,
    );
  }

  redirect(`/publicaciones/${idAnimal}?ok=en_revision`);
}

async function actualizarEstadoSolicitud(formData: FormData) {
  "use server";

  const idSolicitud = String(formData.get("id_solicitud") ?? "").trim();
  const idAnimal = String(formData.get("id_animal") ?? "").trim();
  const nuevoEstado = String(formData.get("nuevo_estado") ?? "").trim();

  if (!idSolicitud || !idAnimal || !nuevoEstado) {
    redirect("/publicaciones?error=solicitud_invalida");
  }

  if (!["rechazada"].includes(nuevoEstado)) {
    redirect(`/publicaciones/${idAnimal}?error=estado_destino_invalido`);
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect(`/auth/login?next=/publicaciones/${idAnimal}`);
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!usuario) {
    redirect(`/publicaciones/${idAnimal}?error=usuario_no_encontrado`);
  }

  const { data: solicitud } = await supabase
    .from("solicitudes_adopcion")
    .select("id_solicitud, id_animal, estado")
    .eq("id_solicitud", idSolicitud)
    .single();

  if (!solicitud) {
    redirect(`/publicaciones/${idAnimal}?error=solicitud_no_encontrada`);
  }

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador")
    .eq("id_animal", solicitud.id_animal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${idAnimal}?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== usuario.id_usuario) {
    redirect(`/publicaciones/${idAnimal}?error=sin_permisos`);
  }

  if (!["pendiente", "en_revision"].includes(solicitud.estado)) {
    redirect(`/publicaciones/${idAnimal}?error=estado_invalido`);
  }

  const { error } = await supabase
    .from("solicitudes_adopcion")
    .update({ estado: nuevoEstado })
    .eq("id_solicitud", idSolicitud);

  if (error) {
    redirect(
      `/publicaciones/${idAnimal}?error=error_actualizacion_solicitud`,
    );
  }

  redirect(`/publicaciones/${idAnimal}?ok=${nuevoEstado}`);
}

async function concretarAdopcion(formData: FormData) {
  "use server";

  const idSolicitud = String(formData.get("id_solicitud") ?? "").trim();
  const idAnimal = String(formData.get("id_animal") ?? "").trim();

  if (!idSolicitud || !idAnimal) {
    redirect("/publicaciones?error=solicitud_invalida");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect(`/auth/login?next=/publicaciones/${idAnimal}`);
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!usuario) {
    redirect(`/publicaciones/${idAnimal}?error=usuario_no_encontrado`);
  }

  const { data: solicitud } = await supabase
    .from("solicitudes_adopcion")
    .select("id_solicitud, id_animal, id_solicitante, estado")
    .eq("id_solicitud", idSolicitud)
    .single();

  if (!solicitud) {
    redirect(`/publicaciones/${idAnimal}?error=solicitud_no_encontrada`);
  }

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", solicitud.id_animal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${idAnimal}?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== usuario.id_usuario) {
    redirect(`/publicaciones/${idAnimal}?error=sin_permisos`);
  }

  if (animal.estado !== "disponible") {
    redirect(
      `/publicaciones/${idAnimal}?error=animal_no_disponible_para_adopcion`,
    );
  }

  if (solicitud.estado !== "en_revision") {
    redirect(`/publicaciones/${idAnimal}?error=estado_invalido_adopcion`);
  }

  const { error: insertAdopcionError } = await supabase
    .from("adopciones")
    .insert({
      id_animal: solicitud.id_animal,
      id_adoptante: solicitud.id_solicitante,
      id_publicador: usuario.id_usuario,
      id_solicitud: solicitud.id_solicitud,
      fecha_adopcion: new Date().toISOString(),
    });

  if (insertAdopcionError) {
    if (insertAdopcionError.code === "23505") {
      redirect(`/publicaciones/${idAnimal}?error=adopcion_duplicada`);
    }
    redirect(`/publicaciones/${idAnimal}?error=error_adopcion`);
  }

  const { error: updateSolicitudGanadoraError } = await supabase
    .from("solicitudes_adopcion")
    .update({ estado: "adoptado" })
    .eq("id_solicitud", solicitud.id_solicitud);

  if (updateSolicitudGanadoraError) {
    redirect(
      `/publicaciones/${idAnimal}?error=error_estado_solicitud_ganadora`,
    );
  }

  const { error: updateAnimalError } = await supabase
    .from("animales_adopcion")
    .update({ estado: "adoptado" })
    .eq("id_animal", solicitud.id_animal);

  if (updateAnimalError) {
    redirect(`/publicaciones/${idAnimal}?error=error_estado_animal`);
  }

  const { error: cancelRestError } = await supabase
    .from("solicitudes_adopcion")
    .update({ estado: "cancelada" })
    .eq("id_animal", solicitud.id_animal)
    .neq("id_solicitud", solicitud.id_solicitud)
    .in("estado", ["pendiente", "en_revision"]);

  if (cancelRestError) {
    redirect(`/publicaciones/${idAnimal}?error=error_cierre_restantes`);
  }

  redirect(`/publicaciones/${idAnimal}?ok=adoptado`);
}

async function actualizarEstadoPublicacion(formData: FormData) {
  "use server";

  const idAnimal = String(formData.get("id_animal") ?? "").trim();
  const nuevoEstado = String(formData.get("nuevo_estado") ?? "").trim();

  if (!idAnimal || !nuevoEstado) {
    redirect("/publicaciones?error=publicacion_invalida");
  }

  if (!["pausado", "cancelado", "disponible"].includes(nuevoEstado)) {
    redirect(`/publicaciones/${idAnimal}?error=estado_publicacion_invalido`);
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect(`/auth/login?next=/publicaciones/${idAnimal}`);
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!usuario) {
    redirect(`/publicaciones/${idAnimal}?error=usuario_no_encontrado`);
  }

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", idAnimal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${idAnimal}?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== usuario.id_usuario) {
    redirect(`/publicaciones/${idAnimal}?error=sin_permisos`);
  }

  if (animal.estado === "adoptado") {
    redirect(`/publicaciones/${idAnimal}?error=publicacion_adoptada_bloqueada`);
  }

  if (animal.estado === nuevoEstado) {
    redirect(`/publicaciones/${idAnimal}?ok=sin_cambios_publicacion`);
  }

  const { error } = await supabase
    .from("animales_adopcion")
    .update({ estado: nuevoEstado })
    .eq("id_animal", idAnimal);

  if (error) {
    redirect(
      `/publicaciones/${idAnimal}?error=error_actualizacion_publicacion`,
    );
  }

  redirect(`/publicaciones/${idAnimal}?ok=publicacion_${nuevoEstado}`);
}

function FeedbackBanner({
  ok,
  error,
}: {
  ok?: string;
  error?: string;
}) {
  if (ok === "en_revision") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La solicitud fue marcada como en revisión.
      </div>
    );
  }

  if (ok === "adoptado") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La adopción fue concretada, la solicitud quedó en adoptado y las demás solicitudes activas fueron canceladas.
      </div>
    );
  }

  if (ok === "rechazada") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La solicitud fue rechazada correctamente.
      </div>
    );
  }

  if (ok === "publicacion_pausado") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La publicación fue pausada correctamente.
      </div>
    );
  }

  if (ok === "publicacion_cancelado") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La publicación fue cancelada correctamente.
      </div>
    );
  }

  if (ok === "publicacion_disponible") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La publicación fue reactivada y volvió a estar disponible.
      </div>
    );
  }

  if (ok === "sin_cambios_publicacion") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La publicación ya se encontraba en ese estado.
      </div>
    );
  }

  if (!error) return null;

  const messages: Record<string, string> = {
    solicitud_invalida: "La solicitud indicada no es válida.",
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    solicitud_no_encontrada: "No se encontró la solicitud seleccionada.",
    animal_no_encontrado: "No se encontró el animal asociado.",
    sin_permisos: "No tenés permisos para gestionar este contenido.",
    estado_invalido: "La acción no se puede aplicar en el estado actual.",
    estado_destino_invalido: "El estado de destino indicado no es válido.",
    error_actualizacion_solicitud:
      "Ocurrió un error al actualizar la solicitud.",
    animal_no_disponible_para_revision:
      "El animal ya no está disponible para continuar gestionando solicitudes.",
    animal_no_disponible_para_adopcion:
      "El animal ya no está disponible para concretar esta adopción.",
    estado_invalido_adopcion:
      "Solo una solicitud en revisión puede concretar la adopción.",
    error_adopcion: "Ocurrió un error al registrar la adopción.",
    adopcion_duplicada: "Esta adopción ya fue registrada previamente.",
    error_estado_animal:
      "La adopción se registró, pero hubo un problema al actualizar el estado del animal.",
    error_cierre_restantes:
      "La adopción se concretó, pero hubo un problema al cerrar las demás solicitudes activas.",
    error_estado_solicitud_ganadora:
      "La adopción se registró, pero hubo un problema al actualizar la solicitud ganadora.",
    publicacion_invalida: "La publicación indicada no es válida.",
    estado_publicacion_invalido:
      "El estado de publicación indicado no es válido.",
    error_actualizacion_publicacion:
      "Ocurrió un error al actualizar el estado de la publicación.",
    publicacion_adoptada_bloqueada:
      "Una publicación adoptada no puede volver a cambiar de estado.",
  };

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
    </div>
  );
}

function PublicacionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <div className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-white/10" />
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="h-8 w-52 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-60 animate-pulse rounded bg-white/10" />
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-white/10"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-3 h-6 w-40 animate-pulse rounded bg-white/10" />
        <div className="mb-2 h-4 w-full animate-pulse rounded bg-white/10" />
        <div className="mb-2 h-4 w-5/6 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-white/10" />
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="h-8 w-10 animate-pulse rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AtributoChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/90">
      {children}
    </span>
  );
}

async function PublicacionContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { id } = await params;
  const { ok, error: searchError } = await searchParams;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect(`/auth/login?next=/publicaciones/${id}`);
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (usuarioError || !usuario) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        No se pudo cargar tu perfil de usuario.
      </div>
    );
  }

  const { data: animal, error: animalError } = await supabase
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
          orden
        )
      `,
    )
    .eq("id_animal", id)
    .single();

  if (animalError || !animal) {
    notFound();
  }

  const animalTipado: AnimalPublicacion = {
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  };

  if (animalTipado.id_publicador !== usuario.id_usuario) {
    redirect("/publicaciones");
  }

  const fotoPrincipal =
    animalTipado.fotos_animales.find((foto) => foto.es_principal) ??
    animalTipado.fotos_animales[0];

  const { data: solicitudes, error: solicitudesError } = await supabase
    .from("solicitudes_adopcion")
    .select(
      `
        id_solicitud,
        id_solicitante,
        mensaje,
        estado,
        fecha_solicitud
      `,
    )
    .eq("id_animal", animalTipado.id_animal)
    .order("fecha_solicitud", { ascending: false });

  if (solicitudesError) {
    return (
      <div className="space-y-6">
        <FeedbackBanner ok={ok} error={searchError} />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          Ocurrió un error al cargar las solicitudes de esta publicación.
        </div>
      </div>
    );
  }

  const solicitanteIds = [
    ...new Set((solicitudes ?? []).map((s) => s.id_solicitante)),
  ];

  const { data: solicitantes } = await supabase
    .from("usuarios")
    .select("id_usuario, nombre, email")
    .in(
      "id_usuario",
      solicitanteIds.length
        ? solicitanteIds
        : ["00000000-0000-0000-0000-000000000000"],
    );

  const solicitantesMap = new Map(
    (solicitantes ?? []).map((solicitante) => [
      solicitante.id_usuario,
      solicitante,
    ]),
  );

  const totalSolicitudes = solicitudes?.length ?? 0;
  const pendientes =
    solicitudes?.filter((s) => s.estado === "pendiente").length ?? 0;
  const enRevision =
    solicitudes?.filter((s) => s.estado === "en_revision").length ?? 0;
  const rechazadas =
    solicitudes?.filter((s) => s.estado === "rechazada").length ?? 0;
  const canceladas =
    solicitudes?.filter((s) => s.estado === "cancelada").length ?? 0;
  const adoptadas =
    solicitudes?.filter((s) => s.estado === "adoptado").length ?? 0;

  return (
    <div className="space-y-6">
      <FeedbackBanner ok={ok} error={searchError} />

      <section className="grid gap-8 lg:grid-cols-[420px_1fr]">
        <div className="space-y-4">
          {fotoPrincipal ? (
            <img
              src={fotoPrincipal.url_foto}
              alt={animalTipado.nombre}
              className="h-[420px] w-full rounded-2xl border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-[420px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white/50">
              Sin imagen
            </div>
          )}

          {animalTipado.fotos_animales.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {animalTipado.fotos_animales.map((foto) => (
                <img
                  key={foto.id_foto}
                  src={foto.url_foto}
                  alt={animalTipado.nombre}
                  className="h-28 w-full rounded-xl border border-white/10 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="mb-2 text-sm text-white/60">Publicación</p>
              <h1 className="mb-2 text-3xl font-bold">{animalTipado.nombre}</h1>
              <p className="text-white/70">
                {animalTipado.especie}
                {animalTipado.raza ? ` · ${animalTipado.raza}` : ""}
              </p>
            </div>

            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">
              {formatEstadoAnimal(animalTipado.estado)}
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-white/60">Ciudad</p>
              <p>{animalTipado.ciudad ?? "No informada"}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-white/60">Sexo</p>
              <p>{animalTipado.sexo ?? "No informado"}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-white/60">Edad</p>
              <p>{animalTipado.edad_aproximada ?? "No informada"}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-1 text-white/60">Tamaño</p>
              <p>{animalTipado.tamano ?? "No informado"}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
              <p className="mb-1 text-white/60">Estado de salud</p>
              <p>{animalTipado.estado_salud ?? "No informado"}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:col-span-2">
              <p className="mb-1 text-white/60">Publicado</p>
              <p>
                {animalTipado.fecha_publicacion
                  ? new Date(animalTipado.fecha_publicacion).toLocaleString(
                      "es-AR",
                    )
                  : "No informado"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {animalTipado.estado === "disponible" && (
              <>
                <form action={actualizarEstadoPublicacion}>
                  <input
                    type="hidden"
                    name="id_animal"
                    value={animalTipado.id_animal}
                  />
                  <input type="hidden" name="nuevo_estado" value="pausado" />
                  <button
                    type="submit"
                    className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Pausar publicación
                  </button>
                </form>

                <form action={actualizarEstadoPublicacion}>
                  <input
                    type="hidden"
                    name="id_animal"
                    value={animalTipado.id_animal}
                  />
                  <input type="hidden" name="nuevo_estado" value="cancelado" />
                  <button
                    type="submit"
                    className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                  >
                    Cancelar publicación
                  </button>
                </form>
              </>
            )}

            {(animalTipado.estado === "pausado" ||
              animalTipado.estado === "cancelado") && (
              <form action={actualizarEstadoPublicacion}>
                <input
                  type="hidden"
                  name="id_animal"
                  value={animalTipado.id_animal}
                />
                <input type="hidden" name="nuevo_estado" value="disponible" />
                <button
                  type="submit"
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                >
                  Reactivar publicación
                </button>
              </form>
            )}

            <Link
              href={`/animales/${animalTipado.id_animal}`}
              className="self-center text-sm text-white/60 transition hover:text-white"
            >
              Ver ficha pública
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-3 text-xl font-semibold">
          Sobre {animalTipado.nombre}
        </h2>
        <p className="leading-7 text-white/80">
          {animalTipado.descripcion ?? "Sin descripción disponible."}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {animalTipado.castrado && <AtributoChip>Castrado</AtributoChip>}
          {animalTipado.vacunado && <AtributoChip>Vacunado</AtributoChip>}
          {animalTipado.desparasitado && (
            <AtributoChip>Desparasitado</AtributoChip>
          )}
          {animalTipado.apto_ninos && <AtributoChip>Apto niños</AtributoChip>}
          {animalTipado.apto_gatos && <AtributoChip>Apto gatos</AtributoChip>}
          {animalTipado.apto_perros && (
            <AtributoChip>Apto perros</AtributoChip>
          )}
          {animalTipado.nivel_energia && (
            <AtributoChip>Energía: {animalTipado.nivel_energia}</AtributoChip>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">Total</p>
          <p className="text-2xl font-semibold">{totalSolicitudes}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">Pendientes</p>
          <p className="text-2xl font-semibold">{pendientes}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">En revisión</p>
          <p className="text-2xl font-semibold">{enRevision}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">Rechazadas</p>
          <p className="text-2xl font-semibold">{rechazadas}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">Canceladas</p>
          <p className="text-2xl font-semibold">{canceladas}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">Adoptada</p>
          <p className="text-2xl font-semibold">{adoptadas}</p>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <p className="mb-2 text-sm text-white/60">Gestión</p>
          <h2 className="text-2xl font-semibold">Solicitudes recibidas</h2>
        </div>

        {!solicitudes || solicitudes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/80">
              Esta publicación todavía no recibió solicitudes.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solicitud) => {
              const solicitante = solicitantesMap.get(solicitud.id_solicitante);
              const animalDisponible = animalTipado.estado === "disponible";
              const animalAdoptado = animalTipado.estado === "adoptado";
              const solicitudActiva =
                solicitud.estado === "pendiente" ||
                solicitud.estado === "en_revision";

              return (
                <article
                  key={solicitud.id_solicitud}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {solicitante?.nombre ?? "Usuario"}
                      </h3>
                      <p className="text-sm text-white/60">
                        {solicitante?.email ?? "Email no informado"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">
                        Solicitud: {formatEstadoSolicitud(solicitud.estado)}
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">
                        Animal: {formatEstadoAnimal(animalTipado.estado)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 text-sm text-white/70">
                    <span className="font-medium text-white">Fecha:</span>{" "}
                    {new Date(solicitud.fecha_solicitud).toLocaleString("es-AR")}
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-white/80">
                    {solicitud.mensaje}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {animalDisponible && solicitud.estado === "pendiente" && (
                      <form action={marcarEnRevision}>
                        <input
                          type="hidden"
                          name="id_solicitud"
                          value={solicitud.id_solicitud}
                        />
                        <input
                          type="hidden"
                          name="id_animal"
                          value={animalTipado.id_animal}
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                        >
                          Marcar en revisión
                        </button>
                      </form>
                    )}

                    {solicitudActiva && animalDisponible && (
                      <form action={actualizarEstadoSolicitud}>
                        <input
                          type="hidden"
                          name="id_solicitud"
                          value={solicitud.id_solicitud}
                        />
                        <input
                          type="hidden"
                          name="id_animal"
                          value={animalTipado.id_animal}
                        />
                        <input
                          type="hidden"
                          name="nuevo_estado"
                          value="rechazada"
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
                        >
                          Rechazar
                        </button>
                      </form>
                    )}

                    {animalDisponible && solicitud.estado === "en_revision" && (
                      <form action={concretarAdopcion}>
                        <input
                          type="hidden"
                          name="id_solicitud"
                          value={solicitud.id_solicitud}
                        />
                        <input
                          type="hidden"
                          name="id_animal"
                          value={animalTipado.id_animal}
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-200 transition hover:bg-green-500/20"
                        >
                          Marcar como adoptado
                        </button>
                      </form>
                    )}

                    {animalAdoptado && (
                      <span className="text-sm text-white/50">
                        Proceso finalizado
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default function PublicacionDetallePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/publicaciones"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a publicaciones
          </Link>
        </div>

        <Suspense fallback={<PublicacionSkeleton />}>
          <PublicacionContent params={params} searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
