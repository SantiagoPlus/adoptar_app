import Link from "next/link";
import { Sparkles, Heart, ShieldPlus, Stethoscope } from "lucide-react";

const heroHighlights = [
  {
    title: "Adoptá",
    icon: Heart,
  },
  {
    title: "Gestioná tus mascotas",
    icon: ShieldPlus,
  },
  {
    title: "Conectá servicios",
    icon: Stethoscope,
  },
];

export function VisionHero() {
  return (
    <section className="mb-14">
      <div className="relative overflow-hidden border-b border-black/10 bg-[#f3f0ea]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.06),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_30%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] via-transparent to-black/[0.015]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-24 lg:py-28">
          <div className="max-w-5xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-sm text-black/65">
              <Sparkles className="h-4 w-4" />
              Visión Adopta App
            </div>

            <h1 className="mb-5 text-4xl font-bold leading-tight text-black md:text-5xl lg:text-6xl">
              Una plataforma para la vida de las mascotas
            </h1>

            <p className="mx-auto max-w-3xl text-center text-base leading-7 text-black/75 md:text-lg lg:text-xl">
              Adopta App es una plataforma pensada para conectar adopciones
              responsables, acompañar el cuidado de las mascotas y abrir nuevas
              oportunidades alrededor del bienestar animal.
            </p>

            <div className="mt-8 flex flex-wrap items-stretch gap-3">
              <Link
                href="/animales"
                className="inline-flex h-[72px] items-center rounded-2xl bg-black px-6 font-medium text-white transition hover:opacity-90"
              >
                Explorar adopciones
              </Link>

              <Link
                href="#evolucion"
                className="inline-flex h-[72px] items-center rounded-2xl border border-black/15 bg-black/[0.03] px-6 font-medium text-black transition hover:bg-black/[0.06]"
              >
                Ver evolución de la plataforma
              </Link>

              {heroHighlights.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center rounded-2xl border border-black/10 bg-white/65 text-center backdrop-blur-sm"
                    title={item.title}
                  >
                    <Icon className="mb-1.5 h-4.5 w-4.5 text-black" />
                    <span className="px-1 text-[10px] font-semibold leading-3 text-black">
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
