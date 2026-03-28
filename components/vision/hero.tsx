import Link from "next/link";
import { Sparkles } from "lucide-react";

export function VisionHero() {
  return (
    <section className="mb-14">
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <div className="grid h-full w-full grid-cols-1 md:grid-cols-3">
            <div className="relative h-[220px] md:h-full">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80"
                alt="Persona usando el celular en casa con su perro"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />
            </div>

            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1200&q=80"
                alt="Veterinaria atendiendo a un perro"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60" />
            </div>

            <div className="relative hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1200&q=80"
                alt="Persona paseando a su perro en un parque"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55" />
            </div>
          </div>

          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/68 to-black/52" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-8 md:py-24 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Visión Adopta App
            </div>

            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Una plataforma para la vida de las mascotas
            </h1>

            <p className="max-w-3xl text-base leading-7 text-white/85 md:text-lg lg:text-xl">
              Adopta App es una plataforma pensada para conectar adopciones
              responsables, acompañar el cuidado de las mascotas y abrir nuevas
              oportunidades alrededor del bienestar animal.
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
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
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
