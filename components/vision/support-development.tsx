import Link from "next/link";
import { ArrowUpRight, Megaphone, Handshake, Rocket } from "lucide-react";

const progressItems = [
  {
    title: "Base pública de adopciones",
    description:
      "Se consolidó una experiencia inicial para explorar publicaciones y conocer mejor los animales disponibles.",
    icon: Megaphone,
  },
  {
    title: "Mejora de la experiencia general",
    description:
      "Se trabajó sobre la estructura de la home, la coherencia visual y la organización general del producto.",
    icon: Rocket,
  },
  {
    title: "Preparación para expansión",
    description:
      "Se definieron líneas de crecimiento hacia gestión de mascotas, servicios y evolución del ecosistema.",
    icon: Handshake,
  },
];

export function SupportDevelopment() {
  return (
    <section className="mb-14">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 md:p-7">
          <p className="mb-2 text-sm text-black/55">Novedades y avances</p>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-black md:text-4xl">
            Cómo viene evolucionando el proyecto
          </h2>
          <p className="mb-6 text-base leading-7 text-black/70 md:text-lg">
            Adopta App evoluciona a partir de mejoras concretas sobre la
            experiencia de adopción, la estructura de la plataforma y la
            preparación de nuevas líneas de desarrollo.
          </p>

          <div className="grid gap-4">
            {progressItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03]">
                    <Icon className="h-[18px] w-[18px] text-black" />
                  </div>

                  <h3 className="mb-2 text-base font-semibold text-black">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-black/65">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 md:p-7">
          <p className="mb-2 text-sm text-black/55">Acompañar el desarrollo</p>
          <h2 className="mb-4 text-3xl font-semibold tracking-tight text-black md:text-4xl">
            Cómo seguir y acompañar el proyecto
          </h2>

          <p className="mb-4 text-base leading-7 text-black/70 md:text-lg">
            Adopta App también busca abrir un espacio para quienes quieran
            acompañar su crecimiento, ya sea desde la difusión, la colaboración,
            el intercambio profesional o futuras formas de apoyo al desarrollo.
          </p>

          <div className="mb-6 space-y-3 text-sm leading-6 text-black/65">
            <p>• Seguir la evolución del proyecto</p>
            <p>• Compartir la iniciativa</p>
            <p>• Acercar ideas o vínculos estratégicos</p>
            <p>• Acompañar futuras etapas de expansión</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/animales"
              className="rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              Explorar adopciones
            </Link>

            <Link
              href="#evolucion"
              className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-black/[0.03] px-5 py-3 font-medium text-black transition hover:bg-black/[0.06]"
            >
              Seguir la evolución del proyecto
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-sm leading-6 text-black/75">
              <span className="font-semibold text-black">
                Construir una plataforma útil también es una forma de cuidar.
              </span>
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
