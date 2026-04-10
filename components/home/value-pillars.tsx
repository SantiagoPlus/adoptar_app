import { Heart, ShieldPlus, Stethoscope } from "lucide-react";

const pillars = [
  {
    title: "Adoptá",
    description:
      "Encontrá animales disponibles, conocé mejor cada publicación y gestioná procesos de adopción de forma más clara y ordenada.",
    icon: Heart,
  },
  {
    title: "Gestioná tus mascotas",
    description:
      "La plataforma evoluciona para acompañar la organización y el seguimiento de cada mascota en un solo lugar, incluyendo su historial y cuidados.",
    icon: ShieldPlus,
  },
  {
    title: "Conectá servicios",
    description:
      "Un espacio pensado para reunir profesionales, servicios y nuevas oportunidades dentro del mundo mascota.",
    icon: Stethoscope,
  },
];

export function ValuePillars() {
  return (
    <section className="mb-14">
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm text-white/60">Propuesta de valor</p>
        <h2 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Todo en un mismo ecosistema para la vida con mascotas
        </h2>
        <p className="text-base leading-7 text-white/70 md:text-lg">
          Adopta App busca acompañar adopciones responsables, el cuidado
          cotidiano y el crecimiento de servicios vinculados al bienestar
          animal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <article
              key={pillar.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Icon className="h-5 w-5 text-white" />
              </div>

              <h3 className="mb-3 text-xl font-semibold">{pillar.title}</h3>

              <p className="text-sm leading-6 text-white/70 md:text-base md:leading-7">
                {pillar.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
