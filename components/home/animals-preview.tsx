import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AnimalsPreviewCarousel } from "@/components/home/animals-preview-carousel";

export type FotoAnimal = {
  id_foto: string;
  url_foto: string;
  es_principal: boolean | null;
};

export type AnimalPreview = {
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
            Animales en adopción
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

      <AnimalsPreviewCarousel animales={animales} />
    </section>
  );
}
