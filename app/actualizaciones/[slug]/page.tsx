import Link from "next/link";
import { notFound } from "next/navigation";
import { updates, type UpdateStatus } from "../data";

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

export function generateStaticParams() {
  return updates.map((post) => ({
    slug: post.slug,
  }));
}

export default async function ActualizacionDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = updates.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto max-w-4xl px-6 py-14 md:py-20">
        <div className="mb-10">
          <Link
            href="/actualizaciones"
            className="text-sm text-black/60 transition hover:text-black"
          >
            ← Volver a actualizaciones
          </Link>
        </div>

        <header className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-black/50">
              {post.category}
            </span>
            <span className="text-black/20">•</span>
            <span className="text-sm text-black/50">{post.date}</span>
            <StatusBadge status={post.status} />
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-black md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-black/70 md:text-lg">
            {post.summary}
          </p>
        </header>

        <article className="max-w-3xl space-y-6">
          {post.content.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-8 text-black/80 md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </article>

        <section className="mt-14 rounded-3xl border border-black/10 bg-black/[0.03] px-7 py-8 md:px-8 md:py-9">
          <p className="mb-3 text-sm uppercase tracking-[0.18em] text-black/45">
            Continuidad
          </p>

          <h2 className="text-2xl font-semibold text-black">
            Esta sección va a crecer con el proyecto
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-black/70">
            Más adelante, este espacio va a reunir hitos del producto, avances
            del roadmap, mejoras visibles para usuarios y señales del desarrollo
            de largo plazo de Adopta App.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/actualizaciones"
              className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Ver más actualizaciones
            </Link>

            <Link
              href="/vision"
              className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-black/[0.03]"
            >
              Volver a visión
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
