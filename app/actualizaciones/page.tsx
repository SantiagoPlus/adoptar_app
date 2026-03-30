import Link from "next/link";
import { updates, type UpdateStatus } from "./data";

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

export default function ActualizacionesPage() {
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
              publicaciones sobre visión, avances del producto y próximos pasos.
            </p>
          </header>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 max-w-3xl">
          <p className="mb-2 text-sm uppercase tracking-[0.18em] text-black/45">
            Últimas publicaciones
          </p>
          <h2 className="text-2xl font-semibold md:text-3xl">
            Seguimiento del proyecto
          </h2>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-black/10 bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Todas
          </button>

          <button
            type="button"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/[0.04] hover:text-black"
          >
            Visión
          </button>

          <button
            type="button"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/[0.04] hover:text-black"
          >
            Actualizaciones
          </button>

          <button
            type="button"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black/70 transition hover:bg-black/[0.04] hover:text-black"
          >
            Roadmap
          </button>
        </div>

        <div className="mb-10 border-t border-black/10" />

        <div className="grid gap-5">
          {updates.map((item) => (
            <article
              key={item.slug}
              className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/20 hover:bg-black/[0.02] md:p-7"
            >
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-black/50">
                  {item.category}
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
      </section>
    </main>
  );
}
