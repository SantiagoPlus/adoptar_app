import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUsuario } from "@/lib/server/auth";
import { getPublicacionesArchivoData } from "@/lib/server/publicaciones";

function ArchivoSkeleton() {
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

function EmptySection() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-white/80">
        Todavía no tenés publicaciones archivadas.
      </p>
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
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
            Adoptado
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
            <p className="text-white/60">Adoptadas</p>
            <p className="text-lg font-semibold">{resumen.adoptadas}</p>
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
}

async function ArchivoContent() {
  const { usuario } = await getCurrentUsuario({
    loginNext: "/publicaciones/historial",
    notFoundRedirect: "/publicaciones/historial?error=usuario_no_encontrado",
  });

  const archivo = await getPublicacionesArchivoData(usuario.id_usuario);

  if (!archivo) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        Ocurrió un error al cargar el archivo.
      </div>
    );
  }

  const { items, solicitudesPorAnimal } = archivo;

  if (items.length === 0) {
    return <EmptySection />;
  }

  return (
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
  );
}

export default function PublicacionesHistorialPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            href="/publicaciones"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a publicaciones
          </Link>
        </div>

        <header className="mb-8">
          <p className="mb-2 text-sm text-white/60">Adopciones</p>
          <h1 className="mb-3 text-3xl font-bold">Archivo</h1>
          <p className="text-white/70">
            Acá podés ver las publicaciones cerradas con adopción exitosa.
          </p>
        </header>

        <Suspense fallback={<ArchivoSkeleton />}>
          <ArchivoContent />
        </Suspense>
      </section>
    </main>
  );
}
