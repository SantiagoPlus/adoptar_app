import Link from "next/link";
import { notFound } from "next/navigation";

type UpdatePost = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  date: string;
  status: "Hecho" | "En progreso" | "Próximo";
  content: string[];
};

const updates: UpdatePost[] = [
  {
    slug: "que-es-adopta-app-y-hacia-donde-va",
    category: "Visión",
    title: "Qué es Adopta App y hacia dónde va",
    summary:
      "Una síntesis del proyecto, su misión y la dirección de producto que estamos construyendo alrededor de la vida con mascotas.",
    date: "29 Mar 2026",
    status: "Hecho",
    content: [
      "Adopta App nació con una idea central: construir una base más clara, útil y escalable para la vida con mascotas. La adopción es la puerta de entrada, pero no el límite del proyecto.",
      "La visión de producto apunta a integrar en un mismo entorno la adopción, la gestión cotidiana de las mascotas y, más adelante, la conexión con servicios vinculados al bienestar animal.",
      "Esta dirección no implica abrir todos los frentes al mismo tiempo. Al contrario: el criterio actual es consolidar primero una base funcional coherente, capaz de crecer sin perder claridad ni orden.",
    ],
  },
  {
    slug: "estado-actual-del-mvp",
    category: "Actualización de producto",
    title: "Estado actual del MVP",
    summary:
      "Qué partes del circuito principal ya funcionan, qué quedó consolidado y cuáles son los próximos focos de construcción.",
    date: "29 Mar 2026",
    status: "Hecho",
    content: [
      "El MVP ya superó la etapa de maqueta. Hoy Adopta App cuenta con un circuito operativo de publicaciones, solicitudes y gestión del publicador, además de una capa pública más clara y mejor presentada.",
      "La base técnica elegida —Next.js, Supabase, Vercel y GitHub— sigue siendo correcta para esta etapa. El principal trabajo actual no pasa por cambiar infraestructura, sino por consolidar arquitectura, UX y narrativa pública.",
      "También quedaron resueltos bloques importantes del producto, como la gestión de publicaciones, la evolución del perfil y la incorporación de imágenes reales en Supabase Storage.",
    ],
  },
  {
    slug: "que-estamos-construyendo-ahora",
    category: "Roadmap",
    title: "Qué estamos construyendo ahora",
    summary:
      "Una lectura clara del punto actual del proyecto, los objetivos inmediatos y el orden de ejecución que seguimos para crecer con base sólida.",
    date: "29 Mar 2026",
    status: "En progreso",
    content: [
      "En esta etapa, el foco está en ordenar mejor la comunicación del proyecto y preparar una sección pública que permita seguir su evolución con más claridad.",
      "Eso incluye separar mejor visión, actualizaciones, roadmap y futuras páginas orientadas a prestadores o colaboradores, sin mezclar todos los mensajes en un mismo lugar.",
      "La lógica de trabajo sigue siendo la misma: avanzar por incisos, validar cada bloque y construir capas nuevas solo cuando la base previa ya quedó estable.",
    ],
  },
];

function StatusBadge({
  status,
}: {
  status: UpdatePost["status"];
}) {
  const classes: Record<UpdatePost["status"], string> = {
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
