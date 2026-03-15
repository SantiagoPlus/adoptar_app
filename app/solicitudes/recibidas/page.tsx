import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function marcarEnRevision(formData: FormData) {
  "use server";

  const idSolicitud = String(formData.get("id_solicitud") ?? "").trim();

  if (!idSolicitud) {
    redirect("/solicitudes/recibidas?error=solicitud_invalida");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login?next=/solicitudes/recibidas");
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (usuarioError || !usuario) {
    redirect("/solicitudes/recibidas?error=usuario_no_encontrado");
  }

  const { data: solicitud, error: solicitudError } = await supabase
    .from("solicitudes_adopcion")
    .select("id_solicitud, id_animal, estado")
    .eq("id_solicitud", idSolicitud)
    .single();

  if (solicitudError || !solicitud) {
    redirect("/solicitudes/recibidas?error=solicitud_no_encontrada");
  }

  const { data: animal, error: animalError } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador")
    .eq("id_animal", solicitud.id_animal)
    .single();

  if (animalError || !animal) {
    redirect("/solicitudes/recibidas?error=animal_no_encontrado");
  }

  if (animal.id_publicador !== usuario.id_usuario) {
    redirect("/solicitudes/recibidas?error=sin_permisos");
  }

  if (solicitud.estado !== "pendiente" && solicitud.estado !== "en_revision") {
    redirect("/solicitudes/recibidas?error=estado_invalido");
  }

  const { error: updateError } = await supabase
    .from("solicitudes_adopcion")
    .update({
      estado: "en_revision",
    })
    .eq("id_solicitud", idSolicitud);

  if (updateError) {
    redirect("/solicitudes/recibidas?error=error_actualizacion");
  }

  redirect("/solicitudes/recibidas?ok=en_revision");
}

async function concretarAdopcion(formData: FormData) {
  "use server";

  const idSolicitud = String(formData.get("id_solicitud") ?? "").trim();

  if (!idSolicitud) {
    redirect("/solicitudes/recibidas?error=solicitud_invalida");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login?next=/solicitudes/recibidas");
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (usuarioError || !usuario) {
    redirect("/solicitudes/recibidas?error=usuario_no_encontrado");
  }

  const { data: solicitud, error: solicitudError } = await supabase
    .from("solicitudes_adopcion")
    .select("id_solicitud, id_animal, id_solicitante, estado")
    .eq("id_solicitud", idSolicitud)
    .single();

  if (solicitudError || !solicitud) {
    redirect("/solicitudes/recibidas?error=solicitud_no_encontrada");
  }

  const { data: animal, error: animalError } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", solicitud.id_animal)
    .single();

  if (animalError || !animal) {
    redirect("/solicitudes/recibidas?error=animal_no_encontrado");
  }

  if (animal.id_publicador !== usuario.id_usuario) {
    redirect("/solicitudes/recibidas?error=sin_permisos");
  }

  if (animal.estado !== "disponible") {
    redirect("/solicitudes/recibidas?error=animal_no_disponible");
  }

  if (
    solicitud.estado !== "pendiente" &&
    solicitud.estado !== "en_revision"
  ) {
    redirect("/solicitudes/recibidas?error=estado_invalido_adopcion");
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
      redirect("/solicitudes/recibidas?error=adopcion_duplicada");
    }

    redirect("/solicitudes/recibidas?error=error_adopcion");
  }

  const { error: updateAnimalError } = await supabase
    .from("animales_adopcion")
    .update({
      estado: "adoptado",
    })
    .eq("id_animal", solicitud.id_animal);

  if (updateAnimalError) {
    redirect("/solicitudes/recibidas?error=error_estado_animal");
  }

  redirect("/solicitudes/recibidas?ok=adoptado");
}

function SolicitudesRecibidasSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="h-5 w-40 bg-white/10 rounded animate-pulse mb-3" />
          <div className="h-4 w-28 bg-white/10 rounded animate-pulse mb-2" />
          <div className="h-4 w-56 bg-white/10 rounded animate-pulse mb-2" />
          <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
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
        La solicitud fue marcada como en proceso.
      </div>
    );
  }

  if (ok === "adoptado") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La adopción fue concretada y el animal pasó a estado adoptado.
      </div>
    );
  }

  if (!error) return null;

  const messages: Record<string, string> = {
    solicitud_invalida: "La solicitud indicada no es válida.",
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    solicitud_no_encontrada: "No se encontró la solicitud seleccionada.",
    animal_no_encontrado: "No se encontró el animal asociado.",
    sin_permisos: "No tenés permisos para gestionar esta solicitud.",
    estado_invalido: "Esta solicitud no puede pasar a proceso en su estado actual.",
    estado_invalido_adopcion:
      "Esta solicitud no puede usarse para concretar una adopción en su estado actual.",
    error_actualizacion: "Ocurrió un error al actualizar la solicitud.",
    animal_no_disponible: "El animal ya no se encuentra disponible.",
    error_adopcion: "Ocurrió un error al registrar la adopción.",
    adopcion_duplicada: "Esta adopción ya fue registrada previamente.",
    error_estado_animal:
      "La adopción se intentó registrar, pero hubo un problema al actualizar el estado del animal.",
  };

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
    </div>
  );
}

function formatEstado(estado: string) {
  const labels: Record<string, string> = {
    pendiente: "Pendiente",
    en_revision: "En proceso",
    rechazada: "Rechazada",
    cancelada: "Cancelada",
  };

  return labels[estado] ?? estado;
}

async function SolicitudesRecibidasContent({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const { ok, error: searchError } = await searchParams;
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login?next=/solicitudes/recibidas");
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

  const { data: animalesPublicados, error: animalesError } = await supabase
    .from("animales_adopcion")
    .select("id_animal, nombre")
    .eq("id_publicador", usuario.id_usuario);

  if (animalesError) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        Ocurrió un error al cargar tus publicaciones.
      </div>
    );
  }

  const animalIds = (animalesPublicados ?? []).map((animal) => animal.id_animal);

  if (animalIds.length === 0) {
    return (
      <div className="space-y-6">
        <FeedbackBanner ok={ok} error={searchError} />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/80">
            Todavía no tenés animales publicados con solicitudes recibidas.
          </p>
        </div>
      </div>
    );
  }

  const { data: solicitudes, error } = await supabase
    .from("solicitudes_adopcion")
    .select(
      `
        id_solicitud,
        id_animal,
        id_solicitante,
        mensaje,
        estado,
        fecha_solicitud
      `,
    )
    .in("id_animal", animalIds)
    .order("fecha_solicitud", { ascending: false });

  if (error) {
    return (
      <div className="space-y-6">
        <FeedbackBanner ok={ok} error={searchError} />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          Ocurrió un error al cargar las solicitudes recibidas.
        </div>
      </div>
    );
  }

  if (!solicitudes || solicitudes.length === 0) {
    return (
      <div className="space-y-6">
        <FeedbackBanner ok={ok} error={searchError} />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/80">
            Aún no recibiste solicitudes para tus publicaciones.
          </p>
        </div>
      </div>
    );
  }

  const solicitanteIds = [
    ...new Set(solicitudes.map((solicitud) => solicitud.id_solicitante)),
  ];

  const { data: solicitantes } = await supabase
    .from("usuarios")
    .select("id_usuario, nombre, email")
    .in("id_usuario", solicitanteIds);

  const animalesMap = new Map(
    (animalesPublicados ?? []).map((animal) => [animal.id_animal, animal]),
  );

  const solicitantesMap = new Map(
    (solicitantes ?? []).map((solicitante) => [
      solicitante.id_usuario,
      solicitante,
    ]),
  );

  return (
    <div className="space-y-6">
      <FeedbackBanner ok={ok} error={searchError} />

      <div className="space-y-4">
        {solicitudes.map((solicitud) => {
          const animal = animalesMap.get(solicitud.id_animal);
          const solicitante = solicitantesMap.get(solicitud.id_solicitante);

          return (
            <article
              key={solicitud.id_solicitud}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    {animal?.nombre ?? "Animal"}
                  </h2>
                  <p className="text-sm text-white/60">
                    Solicitud recibida para esta publicación
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full border border-white/15 bg-white/10">
                  {formatEstado(solicitud.estado)}
                </span>
              </div>

              <div className="text-sm text-white/70 space-y-1 mb-4">
                <p>
                  <span className="font-medium text-white">Solicitante:</span>{" "}
                  {solicitante?.nombre ?? "Usuario"}
                </p>
                <p>
                  <span className="font-medium text-white">Email:</span>{" "}
                  {solicitante?.email ?? "No informado"}
                </p>
                <p>
                  <span className="font-medium text-white">Fecha:</span>{" "}
                  {new Date(solicitud.fecha_solicitud).toLocaleString("es-AR")}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-white/80">
                {solicitud.mensaje}
              </div>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                {solicitud.estado === "pendiente" ? (
                  <form action={marcarEnRevision}>
                    <input
                      type="hidden"
                      name="id_solicitud"
                      value={solicitud.id_solicitud}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 transition"
                    >
                      Marcar en proceso
                    </button>
                  </form>
                ) : null}

                {(solicitud.estado === "pendiente" ||
                  solicitud.estado === "en_revision") && (
                  <form action={concretarAdopcion}>
                    <input
                      type="hidden"
                      name="id_solicitud"
                      value={solicitud.id_solicitud}
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10 text-green-200 text-sm font-medium hover:bg-green-500/20 transition"
                    >
                      Marcar como adoptado
                    </button>
                  </form>
                )}

                {animal?.id_animal && (
                  <Link
                    href={`/animales/${animal.id_animal}`}
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    Ver detalle del animal
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function SolicitudesRecibidasPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Volver al inicio
          </Link>
        </div>

        <header className="mb-8">
          <p className="text-sm text-white/60 mb-2">Gestión de adopciones</p>
          <h1 className="text-3xl font-bold mb-3">Solicitudes recibidas</h1>
          <p className="text-white/70">
            Acá podés ver las solicitudes que llegaron a tus animales publicados.
          </p>
        </header>

        <Suspense fallback={<SolicitudesRecibidasSkeleton />}>
          <SolicitudesRecibidasContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
