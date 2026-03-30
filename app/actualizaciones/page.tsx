import { Suspense } from "react";
import Link from "next/link";
import { updates, type UpdateStatus } from "./data";

type CategoryFilter = "todas" | "actualizacion" | "roadmap";
type SearchParams = Promise<{ categoria?: string }>;

function StatusBadge({
  status,
}: {
  status: UpdateStatus;
}) {
  const classes: Record<UpdateStatus, string> = {
    Hecho: "border-emerald-200 bg-emerald-50 text-emerald-700",
    "En progreso": "border-amber-200 bg-amber-50 text-amber-700",
    Próximo: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${classes[status]}`}
    >
      {status}
    </span>
  );
}

function normalizeCategory(
  category: string,
): Exclude<CategoryFilter, "todas"> | null {
  const normalized = category.trim().toLowerCase();

  if (
    normalized === "actualización de producto" ||
    normalized === "actualizaciones" ||
    normalized === "novedades y actualizaciones"
  ) {
    return "actualizacion";
  }

  if (normalized === "roadmap") return "roadmap";

  return null;
}

function FilterLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active
          ? "relative pb-3 text-sm uppercase tracking-[0.18em] text-black transition hover:text-black/80 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-black"
          : "relative pb-3 text-sm uppercase tracking-[0.18em] text-black/45 transition hover:text-black"
      }
    >
      {label}
    </Link>
  );
}

function ActualizacionesListSkeleton() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        {["Quitar filtros", "Novedades y Actualizaciones", "Roadmap"].map(
          (label) => (
            <div
              key={label}
              className="pb-3 text-sm uppercase tracking-[0.18em] text-black/30"
            >
              {label}
            </div>
          ),
        )}
      </div>

      <div className="mb-10 border-t border-black/10" />

      <div className="grid gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-black/10 bg-white p-6 md:p-7"
          >
            <div className="mb-4 h-4 w-48 animate-pulse rounded bg-black/10" />
            <div className="mb-3 h-8 w-80 animate-pulse rounded bg-black/10" />
            <div className="h-16 w-full animate-pulse rounded bg-black/10" />
          </div>
        ))}
      </div>
    </>
  );
}

async function ActualizacionesList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoria } = await searchParams;

  const activeCategory: CategoryFilter =
    categoria === "actualizacion" || categoria === "roadmap"
      ? categoria
      : "todas";

  const filteredUpdates =
    activeCategory === "todas"
      ? updates.filter((item) => normalizeCategory(item.category) !== null)
      : updates.filter(
          (item) => normalizeCategory(item.category) === activeCategory,
        );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <FilterLink
          href="/actualizaciones"
          label="Quitar filtros"
          active={activeCategory === "todas"}
        />
        <FilterLink
          href="/actualizaciones?categoria=actualizacion"
          label="Novedades y Actualizaciones"
          active={activeCategory === "actualizacion"}
        />
        <FilterLink
          href="/actualizaciones?categoria=roadmap"
          label="Roadmap"
          active={activeCategory === "roadmap"}
        />
      </div>

      <div className="mb-10 border-t border-black/10" />

      <div className="grid gap-5">
        {filteredUpdates.map((item) => (
          <article
            key={item.slug}
            className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/20 hover:bg-black/[0.02] md:p-7"
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-black/50">
                {normalizeCategory(item.category) === "actualizacion"
                  ? "Novedades y Actualizaciones"
                  : item.category}
              </span>
              <span className="text-black/20">•</span>
              <span className="text-sm text-black/50">{item.date}</span>
              <StatusBadge status={item.status} />
            </div>

            <h3 className="text-xl font-semibold text-black md:text-2xl">
              {item.title}
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-black/70 md:text-base">
              {item.summary}
            </p>

            <div className="mt-5">
              <Link
                href={`/actualizaciones/${item.slug}`}
                className="text-sm font-medium text-blue-700 transition hover:text-blue-800"
              >
                Leer publicación →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {filteredUpdates.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-black/10 bg-black/[0.03] px-6 py-8 text-black/70">
          No hay publicaciones para esta categoría todavía.
        </div>
      ) : null}
    </>
  );
}

export default function ActualizacionesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="bg-black/[0.04]">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="mb-10">
            <Link
              href="/vision"
              className="text-sm text-black/60 transition hover:text-black"
            >
              ← Volver a visión
            </Link>
          </div>

          <header className="max-w-4xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-black/45">
              Actualizaciones
            </p>

            <h1 className="text-4xl font-semibold tracking-tight text-black md:text-6xl">
              Roadmap y actualizaciones
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-black/70 md:text-lg">
              Un espacio para seguir la evolución de Adopta App a través de
              publicaciones sobre avances del producto, novedades y próximos
              pasos.
            </p>
          </header>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="mb-2 text-sm uppercase tracking-[0.18em] text-black/45">
              Vision
            </p>
            <h2 className="text-xl font-semibold text-black md:text-2xl">
              Quiénes somos y a dónde vamos
            </h2>
            <p className="mt-3 text-sm leading-7 text-black/70 md:text-base">
              Conocenos y explorá nuestra misión, metas y objetivos.
            </p>
            <div className="mt-5">
              <Link
                href="/vision"
                className="text-sm font-medium text-blue-700 transition hover:text-blue-800"
              >
                Ir a visión →
              </Link>
            </div>
          </article>

          <article className="rounded-3xl border border-black/10 bg-white p-6">
            <p className="mb-2 text-sm uppercase tracking-[0.18em] text-black/45">
              Home
            </p>
            <h2 className="text-xl font-semibold text-black md:text-2xl">
              Home
            </h2>
            <p className="mt-3 text-sm leading-7 text-black/70 md:text-base">
              Recorrer la aplicación.
            </p>
            <div className="mt-5">
              <Link
                href="/"
                className="text-sm font-medium text-blue-700 transition hover:text-blue-800"
              >
                Ir a home →
              </Link>
            </div>
          </article>
        </div>

        <div className="mb-8 max-w-3xl">
          <p className="mb-2 text-sm uppercase tracking-[0.18em] text-black/45">
            Últimas publicaciones
          </p>
        </div>

        <Suspense fallback={<ActualizacionesListSkeleton />}>
          <ActualizacionesList searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
