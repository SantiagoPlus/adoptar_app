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
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="mb-10">
          <Link
            href="/vision"
            className="text-sm text-black/60 transition hover:text-black"
          >
            ← Volver a visión
          </Link>
        </div>

        <header className="mb-14 max-w-4xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-black/45">
            Actualizaciones
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-black md:text-6xl">
            Roadmap y actualizaciones
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-black/70 md:text-lg">
            Este espacio reúne avances, hitos y dirección de producto de Adopta
            App. La idea es mostrar qué estamos construyendo, por qué importa y
            cómo evoluciona el proyecto a medida que consolidamos una plataforma
            para la vida de las mascotas.
          </p>
        </header>

        <section className="mb-14 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-black/10 bg-black px-7 py-8 text-white md:px-9 md:py-10">
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-white/50">
              En qué estamos ahora
            </p>

            <h2 className="text-2xl font-semibold md:text-3xl">
              Consolidando la base pública y la evolución del producto
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base">
              Hoy el foco está en ordenar la narrativa pública del proyecto,
              mostrar mejor la visión de largo plazo y preparar una capa de
              comunicación que acompañe el crecimiento del MVP, sus mejoras y la
              futura expansión hacia servicios del ecosistema animal.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
                Visión de producto
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
                Comunicación pública
              </span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85">
                Base para roadmap
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-black/[0.03] p-7 md:p-8">
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-black/45">
              Cómo usar esta sección
            </p>

            <div className="space-y-4 text-sm leading-7 text-black/70 md:text-base">
              <p>
                <span className="font-medium text-black">Roadmap:</span> marca
                la dirección y los próximos focos.
              </p>
              <p>
                <span className="font-medium text-black">Actualizaciones:</span>{" "}
                muestran avances concretos ya realizados.
              </p>
              <p>
                <span className="font-medium text-black">Hitos:</span> ayudan a
                entender cómo evoluciona el proyecto y qué capacidad de
                ejecución ya demostró.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-8 max-w-3xl">
            <p className="mb-2 text-sm uppercase tracking-[0.18em] text-black/45">
              Publicaciones
            </p>
            <h2 className="text-2xl font-semibold md:text-3xl">
              Últimas actualizaciones
            </h2>
            <p className="mt-3 text-base leading-7 text-black/70">
              Acá vamos a documentar hitos relevantes del producto, decisiones
              importantes y avances que ayuden a entender tanto el estado actual
              como la dirección del proyecto.
            </p>
          </div>

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
                    Leer actualización →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-black/[0.03] px-7 py-8 md:px-10 md:py-10">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm uppercase tracking-[0.18em] text-black/45">
              Continuidad
            </p>

            <h2 className="text-2xl font-semibold text-black md:text-3xl">
              Una sección para seguir el desarrollo del proyecto
            </h2>

            <p className="mt-4 text-base leading-7 text-black/70">
              Esta página va a ayudarnos a mostrar el avance del producto con
              más claridad, conectar mejor la visión con la ejecución y dejar
              una base ordenada para futuras novedades, hitos, convocatorias y
              colaboraciones.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href="/vision"
                className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Ver visión del proyecto
              </Link>

              <Link
                href="/"
                className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-black/[0.03]"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
