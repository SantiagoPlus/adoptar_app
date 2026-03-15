import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  apto_ninos: boolean | null;
  apto_gatos: boolean | null;
  apto_perros: boolean | null;
  fotos_animales: FotoAnimal[];
};

function AnimalDetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="w-full h-[420px] rounded-2xl border border-white/10 bg-white/10 animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-full h-28 rounded-xl border border-white/10 bg-white/10 animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
          <div className="h-10 w-56 bg-white/10 rounded animate-pulse" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-5 w-28 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="h-6 w-40 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

async function AnimalDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
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

  if (error || !animal) {
    notFound();
  }

  const animalTipado: AnimalAdopcion = {
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  };

  const fotoPrincipal =
    animalTipado.fotos_animales.find((foto) => foto.es_principal) ??
    animalTipado.fotos_animales[0];

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        {fotoPrincipal ? (
          <img
            src={fotoPrincipal.url_foto}
            alt={animalTipado.nombre}
            className="w-full h-[420px] object-cover rounded-2xl border border-white/10"
          />
        ) : (
          <div className="w-full h-[420px] rounded-2xl border border-white/10 bg-white/10 flex items-center justify-center text-white/50">
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
                className="w-full h-28 object-cover rounded-xl border border-white/10"
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-white/60 mb-2">
            {animalTipado.especie}
            {animalTipado.raza ? ` · ${animalTipado.raza}` : ""}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl font-bold">{animalTipado.nombre}</h1>
            <span className="text-sm px-3 py-1 rounded-full border border-white/15 bg-white/10">
              {animalTipado.estado}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 mb-1">Ciudad</p>
            <p>{animalTipado.ciudad ?? "No informada"}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 mb-1">Sexo</p>
            <p>{animalTipado.sexo ?? "No informado"}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 mb-1">Edad</p>
            <p>{animalTipado.edad_aproximada ?? "No informada"}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 mb-1">Tamaño</p>
            <p>{animalTipado.tamano ?? "No informado"}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
            <p className="text-white/60 mb-1">Estado de salud</p>
            <p>{animalTipado.estado_salud ?? "No informado"}</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">
            Sobre {animalTipado.nombre}
          </h2>
          <p className="text-white/80 leading-7">
            {animalTipado.descripcion ?? "Sin descripción disponible."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {animalTipado.castrado && (
            <span className="text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/10">
              Castrado
            </span>
          )}
          {animalTipado.vacunado && (
            <span className="text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/10">
              Vacunado
            </span>
          )}
          {animalTipado.desparasitado && (
            <span className="text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/10">
              Desparasitado
            </span>
          )}
          {animalTipado.apto_ninos && (
            <span className="text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/10">
              Apto niños
            </span>
          )}
          {animalTipado.apto_gatos && (
            <span className="text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/10">
              Apto gatos
            </span>
          )}
          {animalTipado.apto_perros && (
            <span className="text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/10">
              Apto perros
            </span>
          )}
          {animalTipado.nivel_energia && (
            <span className="text-sm px-3 py-2 rounded-lg bg-white/10 border border-white/10">
              Energía: {animalTipado.nivel_energia}
            </span>
          )}
        </div>

        <div className="pt-4">
          <Link
            href="/auth/login"
            className="inline-flex px-5 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 transition"
          >
            Quiero adoptarlo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Volver al listado
          </Link>
        </div>

        <Suspense fallback={<AnimalDetailSkeleton />}>
          <AnimalDetailContent params={params} />
        </Suspense>
      </section>
    </main>
  );
}
