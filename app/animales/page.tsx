import { Suspense } from "react";
import Link from "next/link";
import { Search, Heart, MapPin, Filter, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { HomeNavbar } from "@/components/home/navbar";

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
  fecha_publicacion: string | null;
  fotos_animales: FotoAnimal[];
};

type SearchParams = Promise<{
  q?: string;
  especie?: string;
  sexo?: string;
  tamano?: string;
  ciudad?: string;
}>;

function formatValue(value?: string | null) {
  if (!value) return "";

  const labels: Record<string, string> = {
    perro: "Perro",
    gato: "Gato",
    macho: "Macho",
    hembra: "Hembra",
    pequeno: "Pequeño",
    mediano: "Mediano",
    grande: "Grande",
    disponible: "Disponible",
    adoptado: "Adoptado",
    pausado: "Pausado",
    cancelado: "Cancelado",
    en_proceso: "En proceso",
  };

  return labels[value] ?? value;
}

function NavbarSkeleton() {
  return (
    <nav className="border-b border-white/10">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-6">
        <div className="text-xl font-semibold tracking-tight">Adopta App</div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-white/10" />
          <div className="h-11 w-11 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
    </nav>
  );
}

function AnimalsExplorerSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 space-y-4">
        <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-white/10" />
        <div className="h-6 w-2/3 animate-pulse rounded bg-white/10" />
      </div>

      <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-11 animate-pulse rounded-xl bg-white/10"
          />
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
          >
            <div className="h-56 animate-pulse bg-white/10" />
            <div className="space-y-3 p-5">
              <div className="h-6 w-2/3 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
              <div className="h-16 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
      {label}
    </span>
  );
}

function AnimalCard({ animal }: { animal: AnimalAdopcion }) {
  const fotoPrincipal =
    animal.fotos_animales.find((foto) => foto.es_principal) ??
    animal.fotos_animales[0];

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.05]">
      <Link href={`/animales/${animal.id_animal}`} className="block">
        <div className="relative h-56 w-full overflow-hidden bg-white/5">
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

          <div className="absolute left-4 top-4">
            <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs text-white">
              {formatValue(animal.estado) || "Disponible"}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-white/45">
              {formatValue(animal.especie) || "Mascota"}
              {animal.raza ? ` · ${animal.raza}` : ""}
            </p>

            <h3 className="text-2xl font-semibold text-white">
              {animal.nombre}
            </h3>

            <p className="mt-2 flex items-center gap-2 text-sm text-white/60">
              <MapPin className="h-4 w-4" />
              {animal.ciudad ?? "Ubicación no informada"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {animal.sexo && <FilterChip label={formatValue(animal.sexo)} />}
            {animal.tamano && <FilterChip label={formatValue(animal.tamano)} />}
            {animal.edad_aproximada && (
              <FilterChip label={animal.edad_aproximada} />
            )}
          </div>

          <p className="line-clamp-3 text-sm leading-6 text-white/70">
            {animal.descripcion || "Conocé más sobre esta publicación."}
          </p>

          <div className="pt-1">
            <span className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
              Ver historia y detalles
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

async function AnimalsExplorerContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const q = params.q?.trim() ?? "";
  const especie = params.especie?.trim() ?? "";
  const sexo = params.sexo?.trim() ?? "";
  const tamano = params.tamano?.trim() ?? "";
  const ciudad = params.ciudad?.trim() ?? "";

  const supabase = await createClient();

  let query = supabase
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
        fecha_publicacion,
        fotos_animales (
          id_foto,
          url_foto,
          es_principal,
          orden
        )
      `,
      { count: "exact" },
    )
    .eq("estado", "disponible")
    .order("fecha_publicacion", { ascending: false })
    .limit(36);

  if (q) {
    query = query.or(
      `nombre.ilike.%${q}%,raza.ilike.%${q}%,descripcion.ilike.%${q}%,ciudad.ilike.%${q}%`,
    );
  }

  if (especie) {
    query = query.eq("especie", especie);
  }

  if (sexo) {
    query = query.eq("sexo", sexo);
  }

  if (tamano) {
    query = query.eq("tamano", tamano);
  }

  if (ciudad) {
    query = query.ilike("ciudad", `%${ciudad}%`);
  }

  const { data, error, count } = await query;

  const animales: AnimalAdopcion[] = (data ?? []).map((animal) => ({
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  }));

  const filtrosActivos = [q, especie, sexo, tamano, ciudad].filter(Boolean);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
            Acceso con cuenta
          </span>

          <Link
            href="/"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              Encontrá adopciones activas y descubrí nuevas historias
            </h1>
            <p className="max-w-3xl text-base leading-7 text-white/70 md:text-lg">
              Este espacio está pensado para ayudarte a explorar publicaciones,
              conocer mejor cada caso y acercarte a una adopción responsable con
              más información y mejor contexto.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Heart className="mb-3 h-5 w-5 text-white" />
              <p className="mb-1 text-sm font-medium text-white">
                Adopción responsable
              </p>
              <p className="text-sm text-white/60">
                Más contexto para tomar mejores decisiones.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Search className="mb-3 h-5 w-5 text-white" />
              <p className="mb-1 text-sm font-medium text-white">
                Exploración simple
              </p>
              <p className="text-sm text-white/60">
                Filtros claros para encontrar mejor.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <Sparkles className="mb-3 h-5 w-5 text-white" />
              <p className="mb-1 text-sm font-medium text-white">
                Más que un listado
              </p>
              <p className="text-sm text-white/60">
                Un espacio pensado para conectar historias.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        action="/animales"
        method="get"
        className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="mb-4 flex items-center gap-2 text-sm text-white/70">
          <Filter className="h-4 w-4" />
          Filtrar publicaciones
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm text-white/65">
              Buscar
            </label>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Nombre, raza, ciudad..."
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/65">
              Especie
            </label>
            <select
              name="especie"
              defaultValue={especie}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
            >
              <option value="">Todas</option>
              <option value="perro">Perros</option>
              <option value="gato">Gatos</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/65">Sexo</label>
            <select
              name="sexo"
              defaultValue={sexo}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
            >
              <option value="">Todos</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/65">Tamaño</label>
            <select
              name="tamano"
              defaultValue={tamano}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
            >
              <option value="">Todos</option>
              <option value="pequeno">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-white/65">Ciudad</label>
            <input
              type="text"
              name="ciudad"
              defaultValue={ciudad}
              placeholder="Ej: Bahía Blanca"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90"
          >
            Aplicar filtros
          </button>

          <Link
            href="/animales"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Limpiar filtros
          </Link>
        </div>
      </form>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/60">
            {typeof count === "number"
              ? `${count} resultado${count === 1 ? "" : "s"} encontrado${count === 1 ? "" : "s"}`
              : "Resultados disponibles"}
          </p>

          {filtrosActivos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {q && <FilterChip label={`Búsqueda: ${q}`} />}
              {especie && (
                <FilterChip label={`Especie: ${formatValue(especie)}`} />
              )}
              {sexo && <FilterChip label={`Sexo: ${formatValue(sexo)}`} />}
              {tamano && (
                <FilterChip label={`Tamaño: ${formatValue(tamano)}`} />
              )}
              {ciudad && <FilterChip label={`Ciudad: ${ciudad}`} />}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/65">
          Explorá, compará y entrá en cada publicación para conocer más.
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
          No se pudieron cargar las publicaciones en este momento.
        </div>
      ) : animales.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
          <h2 className="mb-3 text-2xl font-semibold">
            No encontramos publicaciones con esos filtros
          </h2>
          <p className="mx-auto max-w-2xl text-white/65">
            Probá ampliando la búsqueda o quitando algunos filtros para explorar
            más animales disponibles.
          </p>
          <div className="mt-6">
            <Link
              href="/animales"
              className="inline-flex rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ver todas las publicaciones
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {animales.map((animal) => (
            <AnimalCard key={animal.id_animal} animal={animal} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function AnimalesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Suspense fallback={<NavbarSkeleton />}>
        <HomeNavbar />
      </Suspense>

      <Suspense fallback={<AnimalsExplorerSkeleton />}>
        <AnimalsExplorerContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
