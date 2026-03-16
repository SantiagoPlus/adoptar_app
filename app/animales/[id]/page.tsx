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

function formatEstadoAnimal(estado: string) {
  const labels: Record<string, string> = {
    disponible: "Disponible",
    adoptado: "Adoptado",
    pausado: "Pausado",
    cancelado: "Cancelado",
  };

  return labels[estado] ?? estado;
}

function AnimalDetailSkeleton() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <div className="aspect-[4/3] animate-pulse rounded-3xl bg-neutral-200" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] animate-pulse rounded-2xl bg-neutral-200"
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-6 animate-pulse rounded-xl bg-neutral-200"
          />
        ))}
      </div>
    </section>
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

  const puedeSolicitar = animalTipado.estado === "disponible";
  const adoptado = animalTipado.estado === "adoptado";

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        {fotoPrincipal ? (
          <img
            src={fotoPrincipal.url_foto}
            alt={animalTipado.nombre}
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-sm"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-neutral-200 text-neutral-500">
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
                className="aspect-[4/3] rounded-2xl object-cover"
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-neutral-500">
            {animalTipado.especie}
            {animalTipado.raza ? ` · ${animalTipado.raza}` : ""}
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {animalTipado.nombre}
          </h1>
          <p className="mt-3 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
            {formatEstadoAnimal(animalTipado.estado)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-neutral-200 p-5 text-sm text-neutral-700">
          <div>
            <p className="text-neutral-500">Ciudad</p>
            <p className="font-medium">{animalTipado.ciudad ?? "No informada"}</p>
          </div>
          <div>
            <p className="text-neutral-500">Sexo</p>
            <p className="font-medium">{animalTipado.sexo ?? "No informado"}</p>
          </div>
          <div>
            <p className="text-neutral-500">Edad</p>
            <p className="font-medium">
              {animalTipado.edad_aproximada ?? "No informada"}
            </p>
          </div>
          <div>
            <p className="text-neutral-500">Tamaño</p>
            <p className="font-medium">{animalTipado.tamano ?? "No informado"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-neutral-500">Estado de salud</p>
            <p className="font-medium">
              {animalTipado.estado_salud ?? "No informado"}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold">Sobre {animalTipado.nombre}</h2>
          <p className="mt-3 leading-7 text-neutral-700">
            {animalTipado.descripcion ?? "Sin descripción disponible."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {animalTipado.castrado && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
              Castrado
            </span>
          )}
          {animalTipado.vacunado && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
              Vacunado
            </span>
          )}
          {animalTipado.desparasitado && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
              Desparasitado
            </span>
          )}
          {animalTipado.apto_ninos && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
              Apto niños
            </span>
          )}
          {animalTipado.apto_gatos && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
              Apto gatos
            </span>
          )}
          {animalTipado.apto_perros && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
              Apto perros
            </span>
          )}
          {animalTipado.nivel_energia && (
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700">
              Energía: {animalTipado.nivel_energia}
            </span>
          )}
        </div>

        <div className="space-y-3">
          {puedeSolicitar && (
            <Link
              href={`/solicitudes/nueva?animal=${animalTipado.id_animal}`}
              className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Quiero adoptarlo
            </Link>
          )}

          {adoptado && (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
              Este animal ya fue adoptado.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function AnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-800">
          ← Volver al listado
        </Link>
      </div>

      <Suspense fallback={<AnimalDetailSkeleton />}>
        <AnimalDetailContent params={params} />
      </Suspense>
    </main>
  );
}
