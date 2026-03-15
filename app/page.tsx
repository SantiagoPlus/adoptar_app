import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type FotoAnimal = {
  id_foto: string;
  url_foto: string;
  es_principal: boolean;
  orden: number;
};

type AnimalAdopcion = {
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
  nivel_energia: string | null;
  castrado: boolean | null;
  vacunado: boolean | null;
  desparasitado: boolean | null;
  fotos_animales: FotoAnimal[];
};

function AnimalesSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl overflow-hidden border border-white/10 bg-white/5"
        >
          <div className="w-full h-64 bg-white/10 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-7 w-32 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function AnimalesList() {
  const supabase = await createClient();

  const { data: animales, error } = await supabase
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
        nivel_energia,
        castrado,
        vacunado,
        desparasitado,
        fotos_animales (
          id_foto,
          url_foto,
          es_principal,
          orden
        )
      `,
    )
    .eq("estado", "disponible")
    .order("fecha_publicacion", { ascending: false });

  if (error) {
    return (
      <div className="border border-red-500/40 bg-red-500/10 rounded-xl p-4 mb-6">
        <p className="font-semibold mb-2">Error al leer animales</p>
        <p className="text-sm text-white/80">{error.message}</p>
      </div>
    );
  }

  const animalesTipados: AnimalAdopcion[] = (animales ?? []).map((animal) => ({
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  }));

  if (animalesTipados.length === 0) {
    return (
      <div className="border border-white/10 bg-white/5 rounded-xl p-6">
        <p>No hay animales disponibles por el momento.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {animalesTipados.map((animal) => {
        const fotoPrincipal =
          animal.fotos_animales.find((foto) => foto.es_principal) ??
          animal.fotos_animales[0];

        return (
          <article
            key={animal.id_animal}
            className="rounded-2xl overflow-hidden border border-white/10 bg-white/5"
          >
            {fotoPrincipal ? (
              <img
                src={fotoPrincipal.url_foto}
                alt={animal.nombre}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-white/10 flex items-center justify-center text-white/50">
                Sin imagen
              </div>
            )}

            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold">{animal.nombre}</h2>
                  <p className="text-sm text-white/60">
                    {animal.especie}
                    {animal.raza ? ` · ${animal.raza}` : ""}
                  </p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full border border-white/15 bg-white/10">
                  {animal.estado}
                </span>
              </div>

              <div className="text-sm text-white/70 space-y-1">
                <p>
                  <span className="font-medium text-white">Ciudad:</span>{" "}
                  {animal.ciudad ?? "No informada"}
                </p>
                <p>
                  <span className="font-medium text-white">Sexo:</span>{" "}
                  {animal.sexo ?? "No informado"}
                </p>
                <p>
                  <span className="font-medium text-white">Edad:</span>{" "}
                  {animal.edad_aproximada ?? "No informada"}
                </p>
                <p>
                  <span className="font-medium text-white">Tamaño:</span>{" "}
                  {animal.tamano ?? "No informado"}
                </p>
                <p>
                  <span className="font-medium text-white">
                    Estado de salud:
                  </span>{" "}
                  {animal.estado_salud ?? "No informado"}
                </p>
              </div>

              <p className="text-sm text-white/80 line-clamp-4">
                {animal.descripcion ?? "Sin descripción."}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {animal.castrado && (
                  <span className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10">
                    Castrado
                  </span>
                )}
                {animal.vacunado && (
                  <span className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10">
                    Vacunado
                  </span>
                )}
                {animal.desparasitado && (
                  <span className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10">
                    Desparasitado
                  </span>
                )}
                {animal.nivel_energia && (
                  <span className="text-xs px-2 py-1 rounded-md bg-white/10 border border-white/10">
                    Energía: {animal.nivel_energia}
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            Adopta App
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-3xl mb-12">
          <p className="text-sm text-white/60 mb-3">
            Plataforma de adopción y gestión de mascotas
          </p>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Encontrá un compañero y promové adopciones responsables
          </h1>
          <p className="text-white/70 text-lg">
            Explorá animales en adopción, conectá con publicadores y construí
            una experiencia más ordenada para adoptar, publicar y gestionar la
            información de tus mascotas.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/auth/login"
              className="px-5 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 transition"
            >
              Comenzar
            </Link>

            <a
              href="#animales"
              className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Ver animales
            </a>
          </div>
        </div>

        <section id="animales">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-white/60 mb-1">Listado actual</p>
              <h2 className="text-2xl font-semibold">Animales disponibles</h2>
            </div>
          </div>

          <Suspense fallback={<AnimalesSkeleton />}>
            <AnimalesList />
          </Suspense>
        </section>
      </section>
    </main>
  );
}
