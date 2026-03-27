import Link from "next/link";
import { Sparkles } from "lucide-react";

export function VisionHero() {
  return (
    <section className="mb-14">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="relative px-6 py-10 md:px-8 md:py-12">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.02]" />

          <div className="relative max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70">
              <Sparkles className="h-4 w-4" />
              Visión Adopta App
            </div>

            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">
              Una plataforma pensada para mejorar la adopción, el cuidado y las
              oportunidades alrededor de las mascotas
            </h1>

            <p className="mb-4 max-w-3xl text-base leading-7 text-white/80 md:text-lg">
              Adopta App es una plataforma pensada para conectar adopciones
              responsables, acompañar el cuidado de las mascotas y abrir nuevas
              oportunidades alrededor del bienestar animal.
            </p>

            <p className="max-w-3xl text-base leading-7 text-white/65 md:text-lg">
              Hoy el proyecto ya cuenta con una base funcional para
              publicaciones y procesos de adopción, y evoluciona hacia un
              ecosistema más amplio que integre gestión de mascotas, servicios y
              nuevas formas de acompañar a la comunidad.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/animales"
                className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
              >
                Explorar adopciones
              </Link>

              <Link
                href="#evolucion"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Ver evolución de la plataforma
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
