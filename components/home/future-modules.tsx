import { Clock3, PawPrint, Stethoscope, Users } from "lucide-react";

const modules = [
  {
    title: "Mis mascotas",
    description:
      "Un espacio pensado para registrar, organizar y hacer seguimiento de cada mascota en un solo lugar. Cada ficha podrá integrar información general, historial médico, libreta sanitaria, tratamientos activos y recordatorios.",
    icon: PawPrint,
    badge: "En desarrollo",
  },
  {
    title: "Servicios para mascotas",
    description:
      "Veterinarias, entrenadores, paseadores, cuidadores y otros perfiles podrán tener presencia dentro de la plataforma para acercar soluciones útiles a la comunidad.",
    icon: Stethoscope,
    badge: "Próximamente",
  },
  {
    title: "Comunidad y oportunidades",
    description:
      "Una red en crecimiento para conectar usuarios, profesionales y nuevas oportunidades vinculadas al cuidado, el bienestar animal y la vida con mascotas.",
    icon: Users,
    badge: "Visión de crecimiento",
  },
];

export function FutureModules() {
  return (
    <section id="vision" className="mb-14">
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm text-white/60">Evolución de la plataforma</p>
        <h2 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Una plataforma en crecimiento para acompañar toda la experiencia con mascotas
        </h2>
        <p className="text-base leading-7 text-white/70 md:text-lg">
          Hoy Adopta App ya permite explorar publicaciones y gestionar procesos de adopción.
          La evolución de la plataforma apunta a sumar herramientas para la gestión y el cuidado de mascotas,
          además de abrir nuevas oportunidades para servicios vinculados al bienestar animal.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <article
              key={module.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <Icon className="h-5 w-5 text-white" />
                </div>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                  <Clock3 className="h-3.5 w-3.5" />
                  {module.badge}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold">{module.title}</h3>

              <p className="text-sm leading-6 text-white/70 md:text-base md:leading-7">
                {module.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
