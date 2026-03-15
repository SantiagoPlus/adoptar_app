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

export default async function Home() {
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

  const animalesTipados: AnimalAdopcion[] = (animales ?? []).map((animal) => ({
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  }));

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-10">
          <p className="text-sm text-white/60 mb-2">Adopta App</p>
          <h1 className="text-4xl font-bold mb-3">Animales en adopción</h1>
          <p className="text-white/70 max-w-2xl">
            Primera integración real entre Next.js y Supabase. Esta pantalla ya
            debería mostrar datos cargados desde la tabla{" "}
            <span className="font-semibold">animales_adopcion</span>.
          </p>
        </header>

        {error && (
          <div className="border border-red-500/40 bg-red-500/10 rounded-xl p-4 mb-6">
            <p className="font-semibold mb-2">Error al leer Supabase</p>
            <p className="text-sm text-white/80">{error.message}</p>
          </div>
        )}

        {!error && animalesTipados.length === 0 && (
          <div className="border border-white/10 bg-white/5 rounded-xl p-6">
            <p>No hay animales disponibles para mostrar.</p>
          </div>
        )}

        {!error && animalesTipados.length > 0 && (
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
                        <h2 className="text-2xl font-semibold">
                          {animal.nombre}
                        </h2>
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
        )}
      </section>
    </main>
  );
}
