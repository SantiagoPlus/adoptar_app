import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type FotoAnimal = {
  id_foto: string;
  url_foto: string;
  es_principal: boolean;
  orden: number;
};

type Publicacion = {
  id_animal: string;
  nombre: string;
  especie: string;
  raza: string | null;
  ciudad: string | null;
  estado: string;
  fecha_publicacion: string | null;
  fotos_animales: FotoAnimal[];
};

type SolicitudResumen = {
  id_animal: string;
  estado: string;
};

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

function PublicacionesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
        >
          <div className="h-52 w-full animate-pulse bg-white/10" />
          <div className="p-5">
            <div className="mb-3 h-6 w-32 animate-pulse rounded bg-white/10" />
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="mb-2 h-4 w-28 animate-pulse rounded bg-white/10" />
            <div className="mt-4 h-10 w-40 animate-pulse rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function PublicacionesContent() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login?next=/publicaciones");
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
          orden
        )
      `,
    )
    .eq("id_publicador", usuario.id_usuario)
    .order("fecha_publicacion", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        Ocurrió un error al cargar tus publicaciones.
      </div>
    );
  }

  const items = ((publicaciones ?? []) as Publicacion[]).map((animal) => ({
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  }));

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="mb-2 text-white/80">Todavía no tenés publicaciones.</p>
        <Link
          href="/publicaciones/nueva"
          className="text-sm text-white/60 transition hover:text-white"
        >
          Crear nueva publicación
        </Link>
      </div>
    );
  }

  const ids = items.map((item) => item.id_animal);

  const { data: solicitudes } = await supabase
    .from("solicitudes_adopcion")
    .select("id_animal, estado")
    .in("id_animal", ids);

  const solicitudesPorAnimal = new Map<
    string,
    {
      total: number;
      pendientes: number;
      enRevision: number;
      adoptadas: number;
    }
  >();

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

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((animal) => {
        const fotoPrincipal =
          animal.fotos_animales.find((foto) => foto.es_principal) ??
          animal.fotos_animales[0];

        const resumen = solicitudesPorAnimal.get(animal.id_animal) ?? {
          total: 0,
          pendientes: 0,
          enRevision: 0,
          adoptadas: 0,
        };

        return (
          <article
            key={animal.id_animal}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            {fotoPrincipal ? (
              <img
                src={fotoPrincipal.url_foto}
                alt={animal.nombre}
                className="h-56 w-full object-cover"
              />
            ) : (
              <div className="flex h-56 w-full items-center justify-center bg-white/10 text-white/50">
                Sin imagen
              </div>
            )}

            <div className="p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">{animal.nombre}</h2>
                  <p className="text-sm text-white/60">
                    {animal.especie}
                    {animal.raza ? ` · ${animal.raza}` : ""}
                  </p>
                </div>

                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">
                  {formatEstadoAnimal(animal.estado)}
                </span>
              </div>

              <div className="mb-4 space-y-1 text-sm text-white/70">
                <p>
                  <span className="font-medium text-white">Ciudad:</span>{" "}
                  {animal.ciudad ?? "No informada"}
                </p>
                <p>
                  <span className="font-medium text-white">Publicado:</span>{" "}
                  {animal.fecha_publicacion
                    ? new Date(animal.fecha_publicacion).toLocaleString("es-AR")
                    : "No informado"}
                </p>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-white/60">Solicitudes</p>
                  <p className="text-lg font-semibold">{resumen.total}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-white/60">En revisión</p>
                  <p className="text-lg font-semibold">{resumen.enRevision}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/publicaciones/${animal.id_animal}`}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
                >
                  Ver publicación
                </Link>

                <Link
                  href={`/animales/${animal.id_animal}`}
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Ver ficha pública
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function PublicacionesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/perfil"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a mi cuenta
          </Link>
        </div>

        <header className="mb-8">
          <p className="mb-2 text-sm text-white/60">Adopciones</p>
          <h1 className="mb-3 text-3xl font-bold">Publicaciones</h1>
          <p className="text-white/70">
            Acá podés ver los animales que publicaste y acceder a la gestión de
            cada caso.
          </p>
        </header>

        <Suspense fallback={<PublicacionesSkeleton />}>
          <PublicacionesContent />
        </Suspense>
      </section>
    </main>
  );
}
