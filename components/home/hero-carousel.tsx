"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, ShieldPlus, Stethoscope } from "lucide-react";

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  icon: React.ComponentType<{ className?: string }>;
};

const slides: Slide[] = [
  {
    eyebrow: "Plataforma de adopción y gestión de mascotas",
    title: "Encontrá un compañero y promové adopciones responsables",
    description:
      "Explorá animales en adopción, conocé mejor cada caso y conectate con publicadores para concretar adopciones con más información, orden y seguimiento.",
    primaryCta: {
      label: "Ver animales",
      href: "#animales",
    },
    secondaryCta: {
      label: "Comenzar",
      href: "/auth/login",
    },
    icon: Heart,
  },
  {
    eyebrow: "Gestión y cuidado de mascotas",
    title: "Organizá la vida de tus mascotas en un solo lugar",
    description:
      "Adopta App también evoluciona para ayudarte a centralizar información, seguimiento y futuras herramientas pensadas para acompañar el cuidado diario de tus mascotas.",
    primaryCta: {
      label: "Conocer la propuesta",
      href: "#vision",
    },
    secondaryCta: {
      label: "Ingresar",
      href: "/auth/login",
    },
    icon: ShieldPlus,
  },
  {
    eyebrow: "Servicios y oportunidades",
    title: "Conectá con servicios y oportunidades para el mundo mascota",
    description:
      "La plataforma busca reunir veterinarias, entrenadores, paseadores, cuidadores y otros perfiles para crear una red más útil alrededor del bienestar animal.",
    primaryCta: {
      label: "Explorar la visión",
      href: "#servicios",
    },
    secondaryCta: {
      label: "Quiero ofrecer servicios",
      href: "#prestadores",
    },
    icon: Stethoscope,
  },
];

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, []);

  const activeSlide = slides[activeIndex];
  const ActiveIcon = activeSlide.icon;

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className="mb-14">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="grid gap-8 px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm text-white/60">{activeSlide.eyebrow}</p>

            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              {activeSlide.title}
            </h1>

            <p className="max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              {activeSlide.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={activeSlide.primaryCta.href}
                className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
              >
                {activeSlide.primaryCta.label}
              </Link>

              <Link
                href={activeSlide.secondaryCta.href}
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                {activeSlide.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="flex min-h-[280px] flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-6 md:min-h-[320px]">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-white/70">
                  Visión de plataforma
                </span>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <ActiveIcon className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="mb-1 text-sm text-white/60">Hoy</p>
                  <p className="text-sm text-white/85">
                    Adopciones responsables con publicaciones activas y gestión
                    de solicitudes.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="mb-1 text-sm text-white/60">Próximamente</p>
                  <p className="text-sm text-white/85">
                    Gestión de mascotas, seguimiento de cuidados y nuevas
                    oportunidades para servicios vinculados al bienestar animal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-4 md:px-8">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ir al slide ${index + 1}`}
                className={`h-2.5 rounded-full transition ${
                  index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/25"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Slide anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Slide siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
