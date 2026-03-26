import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type FotoAnimal = {
  id_foto: string;
  url_foto: string;
  es_principal: boolean | null;
};

type AnimalPreview = {
  id_animal: string;
  nombre: string;
  especie: string | null;
  raza: string | null;
  ciudad: string | null;
  sexo: string | null;
  tamano: string | null;
  edad_aproximada: string | null;
  descripcion: string | null;
  fecha_publicacion: string | null;
  fotos_animales: FotoAnimal[];
};

function AnimalCard({ animal }: { animal: AnimalPreview }) {
  const fotoPrincipal =
    animal.fotos_animales?.find((foto) => foto.es_principal) ??
    animal.fotos_animales?.[0] ??
    null;

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <Link href={`/animales/${animal.id_animal}`} className="block">
        <div className="relative h-56 w-full overflow-hidden bg-white/5">
          {fotoPrincipal ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoPrincipal.url_foto}
              alt={animal.nombre}
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/45">
              Sin imagen
            </div>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-white/45">
              {animal.especie ?? "Mascota"}
            </p>
            <h3 className="text-xl font-semibold text-white">{animal.nombre}</h3>
            <p className="mt-1 text-sm text-white/60">
              {[animal.raza, animal.ciudad].filter(Boolean).join(" · ") ||
                "Información básica disponible"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {animal.sexo && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {animal.sexo}
              </span>
            )}

            {animal.tamano && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {animal.tamano}
              </span>
            )}

            {animal.edad_aproximada && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                {animal.edad_aproximada}
              </span>
            )}
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-white/70">
            {animal.descripcion || "Conocé más sobre esta publicación."}
          </p>

          <div className="pt-1">
            <span className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
              Ver publicación
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export async function AnimalsPreview() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animales_adopcion")
    .select(
      `
        id_animal,
        nombre,
        especie,
        raza,
        ciudad,
        sexo,
        tamano,
        edad_aproximada,
        descripcion,
        fecha_publicacion,
        fotos_animales (
          id_foto,
          url_foto,
          es_principal
        )
      `,
    )
    .eq("estado", "disponible")
    .order("fecha_publicacion", { ascending: false })
    .limit(9);

  const animales = (data ?? []) as AnimalPreview[];

  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        No se pudieron cargar los animales disponibles en este momento.
      </div>
    );
  }

  if (animales.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-white/75">
          Todavía no hay animales disponibles para mostrar.
        </p>
      </div>
    );
  }

  return (
    <section id="animales" className="mb-14">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm text-white/60">Adopciones activas</p>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Animales disponibles
          </h2>
          <p className="text-base leading-7 text-white/70 md:text-lg">
            Conocé algunas de las publicaciones más recientes dentro de la
            plataforma y explorá nuevas oportunidades de adopción.
          </p>
        </div>

        <Link
          href="/animales"
          className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Ver todos los animales
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {animales.map((animal) => (
          <AnimalCard key={animal.id_animal} animal={animal} />
        ))}
      </div>
    </section>
  );
}
