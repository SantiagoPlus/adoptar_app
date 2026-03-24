import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUsuario } from "@/lib/server/auth";
import { getPublicacionesDashboardData } from "@/lib/server/publicaciones";

type SearchParams = Promise<{ filtro?: string }>;

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
    <div className="space-y-10">
      {Array.from({ length: 2 }).map((_, blockIndex) => (
        <section key={blockIndex}>
          <div className="mb-5">
            <div className="mb-2 h-4 w-40 animate-pulse rounded bg-white/10" />
            <div className="h-px w-full bg-white/10" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
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
        </section>
      ))}
    </div>
  );
}

function Toolbar({ filtroActual }: { filtroActual: string }) {
  const filtros = [
    { value: "gestion", label: "Gestión actual" },
    { value: "activas", label: "Activas" },
    { value: "pausadas", label: "Pausadas" },
    { value: "pendientes", label: "Pendientes" },
  ];

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {filtros.map((filtro) => {
          const activo = filtroActual === filtro.value;

          return (
            <Link
              key={filtro.value}
              href={`/publicaciones?filtro=${filtro.value}`}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activo
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {filtro.label}
            </Link>
          );
        })}
      </div>

      <Link
        href="/publicaciones/historial"
        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Historial
      </Link>
    </div>
  );
}

function PublicacionCard({
  animal,
  resumen,
}: {
  animal: {
    id_animal: string;
    nombre: string;
    especie: string;
    raza: string | null;
    ciudad: string | null;
    estado: string;
    fecha_publicacion: string | null;
    fotos_animales: {
      id_foto: string;
      url_foto: string;
      es_principal: boolean;
      orden: number;
      storage_path?: string | null;
    }[];
  };
  resumen: {
    total: number;
    pendientes: number;
    enRevision: number;
    adoptadas: number;
  };
}) {
  const fotoPrincipal =
    animal.fotos_animales.find((foto) => foto.es_principal) ??
    animal.fotos_animales[0];

  return (
    <Link
      href={`/publicaciones/${animal.id_animal}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
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
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-white/60">Solicitudes</p>
            <p className="text-lg font-semibold">{resumen.total}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-white/60">Pendientes</p>
            <p className="text-lg font-semibold">{resumen.pendientes}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-3">
            <p className="text-white/60">En revisión</p>
            <p className="text-lg font-semibold">{resumen.enRevision}</p>
          </div>
        </div>

        <p className="text-sm text-white/60 transition hover:text-white">
          Gestionar publicación
        </p>
      </div>
    </Link>
  );
}

function BloquePublicaciones({
  titulo,
  items,
  solicitudesPorAnimal,
  vacio,
}: {
  titulo: string;
  items: {
    id_animal: string;
    nombre: string;
    especie: string;
    raza: string | null;
    ciudad: string | null;
    estado: string;
    fecha_publicacion: string | null;
    fotos_animales: {
      id_foto: string;
      url_foto: string;
      es_principal: boolean;
      orden: number;
      storage_path?: string | null;
    }[];
  }[];
  solicitudesPorAnimal: Map<
    string,
    {
      total: number;
      pendientes: number;
      enRevision: number;
      adoptadas: number;
    }
  >;
  vacio: string;
}) {
  return (
    <section>
      <div className="mb-5">
        <h2 className="mb-2 text-xl font-semibold">{titulo}</h2>
        <div className="h-px w-full bg-white/10" />
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
          {vacio}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((animal) => {
            const resumen = solicitudesPorAnimal.get(animal.id_animal) ?? {
              total: 0,
              pendientes: 0,
              enRevision: 0,
              adoptadas: 0,
            };

            return (
              <PublicacionCard
                key={animal.id_animal}
                animal={animal}
                resumen={resumen}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

async function PublicacionesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { filtro } = await searchParams;
  const filtroActual = filtro ?? "gestion";

  const { usuario } = await getCurrentUsuario({
    loginNext: "/publicaciones",
    notFoundRedirect: "/publicaciones?error=usuario_no_encontrado",
  });

  const dashboard = await getPublicacionesDashboardData(usuario.id_usuario);

  if (!dashboard) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        Ocurrió un error al cargar tus publicaciones.
      </div>
    );
  }

  const {
    items,
    publicacionesActivasBase,
    publicacionesPausadasBase,
    solicitudesPorAnimal,
  } = dashboard;

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

  const publicacionesPendientesBase = publicacionesActivasBase.filter(
    (animal) => {
      const resumen = solicitudesPorAnimal.get(animal.id_animal);
      return (resumen?.pendientes ?? 0) > 0;
    },
  );

  if (filtroActual === "activas") {
    return (
      <>
        <Toolbar filtroActual={filtroActual} />
        <BloquePublicaciones
          titulo="Publicaciones activas"
          items={publicacionesActivasBase}
          solicitudesPorAnimal={solicitudesPorAnimal}
          vacio="No tenés publicaciones activas."
        />
      </>
    );
  }

  if (filtroActual === "pausadas") {
    return (
      <>
        <Toolbar filtroActual={filtroActual} />
        <BloquePublicaciones
          titulo="Publicaciones pausadas"
          items={publicacionesPausadasBase}
          solicitudesPorAnimal={solicitudesPorAnimal}
          vacio="No tenés publicaciones pausadas."
        />
      </>
    );
  }

  if (filtroActual === "pendientes") {
    return (
      <>
        <Toolbar filtroActual={filtroActual} />
        <BloquePublicaciones
          titulo="Publicaciones pendientes"
          items={publicacionesPendientesBase}
          solicitudesPorAnimal={solicitudesPorAnimal}
          vacio="No tenés publicaciones con solicitudes pendientes."
        />
      </>
    );
  }

  return (
    <>
      <Toolbar filtroActual={filtroActual} />

      <div className="space-y-10">
        <BloquePublicaciones
          titulo="Publicaciones pausadas"
          items={publicacionesPausadasBase}
          solicitudesPorAnimal={solicitudesPorAnimal}
          vacio="No tenés publicaciones pausadas."
        />

        <BloquePublicaciones
          titulo="Publicaciones activas"
          items={publicacionesActivasBase}
          solicitudesPorAnimal={solicitudesPorAnimal}
          vacio="No tenés publicaciones activas."
        />

        <BloquePublicaciones
          titulo="Publicaciones pendientes"
          items={publicacionesPendientesBase}
          solicitudesPorAnimal={solicitudesPorAnimal}
          vacio="No tenés publicaciones con solicitudes pendientes."
        />
      </div>
    </>
  );
}

export default function PublicacionesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
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
          <PublicacionesContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
