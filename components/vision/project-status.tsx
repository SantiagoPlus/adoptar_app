import { CheckCircle2, LoaderCircle, Clock3 } from "lucide-react";

const statusColumns = [
  {
    title: "Actualmente",
    description:
      "Una base funcional ya operativa sobre la que se apoya el crecimiento del proyecto.",
    icon: CheckCircle2,
    items: [
      "Base funcional de adopción en marcha",
      "Home institucional renovada",
      "Espacio público de adopciones",
      "Gestión interna de publicaciones y perfil",
    ],
  },
  {
    title: "En desarrollo",
    description:
      "Bloques en construcción orientados a mejorar la experiencia y preparar la expansión.",
    icon: LoaderCircle,
    items: [
      "Ordenamiento de experiencia de usuario",
      "Ampliación de navegación pública",
      "Definición de páginas institucionales",
      "Preparación de módulos futuros",
    ],
  },
  {
    title: "Próximamente",
    description:
      "Líneas de evolución que forman parte del crecimiento proyectado de la plataforma.",
    icon: Clock3,
    items: [
      "Mis mascotas",
      "Herramientas de seguimiento y cuidado",
      "Página y arquitectura para servicios",
      "Evolución institucional del proyecto",
    ],
  },
];

export function ProjectStatus() {
  return (
    <section className="mb-14">
      <div className="mb-8 max-w-4xl">
        <p className="mb-2 text-sm text-white/60">Estado del proyecto</p>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
          En qué punto está hoy Adopta App
        </h2>
        <p className="text-base leading-7 text-white/70 md:text-lg">
          El crecimiento se plantea por etapas, priorizando una base operativa
          sólida antes de expandir módulos más complejos.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {statusColumns.map((column) => {
          const Icon = column.icon;

          return (
            <article
              key={column.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Icon className="h-5 w-5 text-white" />
              </div>

              <h3 className="mb-3 text-xl font-semibold">{column.title}</h3>

              <p className="mb-5 text-sm leading-6 text-white/65 md:text-base md:leading-7">
                {column.description}
              </p>

              <ul className="space-y-3">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
