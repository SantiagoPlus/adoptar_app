import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

async function SolicitudesRecibidasContent() {
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
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-white/80">
          Todavía no tenés animales publicados con solicitudes recibidas.
        </p>
      </div>
    );
  }

  const { data: solicitudes, error } = await supabase
    .from("solicitudes_adopcion")
    .select(
      `
        id_solicitud,
        id_animal,
        mensaje,
        estado,
        fecha_solicitud
      `
    )
    .in("id_animal", animalIds)
    .order("fecha_solicitud", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        Ocurrió un error al cargar las solicitudes recibidas.
      </div>
    );
  }

  if (!solicitudes || solicitudes.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-white/80">
          Aún no recibiste solicitudes para tus publicaciones.
        </p>
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
    (animalesPublicados ?? []).map((animal) => [animal.id_animal, animal])
  );

  const solicitantesMap = new Map(
    (solicitantes ?? []).map((solicitante) => [solicitante.id_usuario, solicitante])
  );

  return (
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
                {solicitud.estado}
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

            {animal?.id_animal && (
              <div className="mt-4">
                <Link
                  href={`/animales/${animal.id_animal}`}
                  className="text-sm text-white/60 hover:text-white transition"
                >
                  Ver detalle del animal
                </Link>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

export default function SolicitudesRecibidasPage() {
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
          <SolicitudesRecibidasContent />
        </Suspense>
      </section>
    </main>
  );
}
