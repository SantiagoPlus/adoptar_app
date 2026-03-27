import { Clock3, PawPrint, Stethoscope, Users, ShieldPlus } from "lucide-react";

const evolutionItems = [
  {
    title: "Mis mascotas",
    description:
      "Espacio pensado para registrar, organizar y hacer seguimiento de cada mascota en un solo lugar.",
    detail:
      "Cada ficha podrá integrar información general, historial médico, libreta sanitaria, tratamientos activos y recordatorios de seguimiento.",
    icon: PawPrint,
    badge: "En evolución",
  },
  {
    title: "Servicios para mascotas",
    description:
      "La plataforma también busca abrir un espacio para servicios vinculados al bienestar animal.",
    detail:
      "Esto permitirá generar nuevas oportunidades de conexión entre usuarios y prestadores dentro del ecosistema.",
    icon: Stethoscope,
    badge: "Próximamente",
  },
  {
    title: "Comunidad y oportunidades",
    description:
      "Adopta App quiere crecer como una red útil para personas, profesionales y actores vinculados al cuidado animal.",
    detail:
      "La idea es construir un entorno más claro y conectado para mejorar la experiencia alrededor de las mascotas.",
    icon: Users,
    badge: "Visión de crecimiento",
  },
  {
    title: "Gestión sanitaria conectada",
    description:
      "Una línea de evolución orientada a integrar mejor el seguimiento sanitario de las mascotas dentro del ecosistema digital de la plataforma.",
    detail:
      "Esta dirección busca ampliar el valor del proyecto sin perder claridad sobre el foco actual de desarrollo.",
    icon: ShieldPlus,
    badge: "Línea estratégica",
  },
];

export function PlatformEvolution() {
  return (
    <section id="evolucion" className="mb-14">
      <div className="mb-8 max-w-4xl">
        <p className="mb-2 text-sm text-white/60">
          Evolución de la plataforma
        </p>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
          Hacia dónde evoluciona Adopta App
        </h2>
        <p className="text-base leading-7 text-white/70 md:text-lg">
          La adopción es la puerta de entrada, pero no el límite del proyecto.
          El desarrollo apunta a construir un ecosistema más amplio para
          acompañar distintas etapas de la vida con mascotas.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {evolutionItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <Clock3 className="h-3.5 w-3.5" />
                  {item.badge}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>

              <p className="mb-3 text-sm leading-6 text-white/75 md:text-base md:leading-7">
                {item.description}
              </p>

              <p className="text-sm leading-6 text-white/55 md:text-base md:leading-7">
                {item.detail}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
