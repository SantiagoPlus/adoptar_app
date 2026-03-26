import Link from "next/link";
import { MapPin } from "lucide-react";
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

function AnimalChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
      {label}
    </span>
  );
}

function AnimalCard({ animal }: { animal: AnimalPreview }) {
  const fotoPrincipal =
    animal.fotos_animales?.find((foto) => foto.es_principal) ??
    animal.fotos_animales?.[0] ??
    null;

  const chips = [animal.sexo, animal.tamano].filter(Boolean).slice(0, 2) as string[];

  return (
    <Link href={`/animales/${animal.id_animal}`} className="block">
      <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.05]">
        <div className="relative h-40 w-full overflow-hidden bg-white/5">
          {fotoPrincipal ? (
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

        <div className="space-y-3 p-4">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-white/45">
              {animal.especie ?? "Mascota"}
              {animal.raza ? ` · ${animal.raza}` : ""}
            </p>

            <h3 className="text-lg font-semibold text-white">{animal.nombre}</h3>

            <p className="mt-1 flex items-center gap-2 text-sm text-white/60">
              <MapPin className="h-4 w-4" />
              {animal.ciudad ?? "Ubicación no informada"}
            </p>
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <AnimalChip key={chip} label={chip} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
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
      <div className="mb-12 rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
        No se pudieron cargar los animales disponibles en este momento.
      </div>
    );
  }

  if (animales.length === 0) {
    return (
      <section id="animales" className="mb-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <p className="text-white/75">
            Todavía no hay animales disponibles para mostrar.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="animales" className="mb-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm text-white/60">Adopciones activas</p>
          <h2 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Animales disponibles
          </h2>
          <p className="text-base leading-7 text-white/70 md:text-lg">
            Conocé algunas de las publicaciones más recientes dentro de la
            plataforma.
          </p>
        </div>

        <Link
          href="/animales"
          className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Ver todos los animales
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {animales.map((animal) => (
          <AnimalCard key={animal.id_animal} animal={animal} />
        ))}
      </div>
    </section>
  );
}
