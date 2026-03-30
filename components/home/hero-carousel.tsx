"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShieldPlus,
  Stethoscope,
} from "lucide-react";

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
  backgroundImage: string;
};

const slides: Slide[] = [
  {
    eyebrow: "Plataforma de adopción y gestión de mascotas",
    title: "Encontrá un compañero y promové adopciones responsables",
    description:
      "Conocé casos reales, explorá publicaciones individuales y accedé a una experiencia más ordenada para adoptar, publicar y seguir cada proceso.",
    primaryCta: {
      label: "Ingresar para explorar",
      href: "/auth/login?next=/animales",
    },
    secondaryCta: {
      label: "Ver publicaciones recientes",
      href: "#animales",
    },
    icon: Heart,
    backgroundImage:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=80",
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
    backgroundImage:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "Servicios y oportunidades",
    title: "Conectá con servicios y oportunidades para el mundo mascota",
    description:
      "La plataforma busca reunir veterinarias, entrenadores, paseadores, cuidadores y otros perfiles para crear una red más útil alrededor del bienestar animal.",
    primaryCta: {
      label: "Explorar la visión",
      href: "#vision",
    },
    secondaryCta: {
      label: "Quiero ofrecer servicios",
      href: "#vision",
    },
    icon: Stethoscope,
    backgroundImage:
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=1600&q=80",
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

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section className="mb-12">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => {
            const SlideIcon = slide.icon;

            return (
              <div key={slide.title} className="relative min-w-full">
                <div className="absolute inset-0">
                  <img
                    src={slide.backgroundImage}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />
                </div>

                <div className="relative px-6 py-8 md:px-8 md:py-10">
                  <div className="max-w-3xl">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5">
                        <SlideIcon className="h-5 w-5 text-white" />
                      </div>

                      <p className="text-sm text-white/70">{slide.eyebrow}</p>
                    </div>

                    <h1 className="mb-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
                      {slide.title}
                    </h1>

                    <p className="max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                      {slide.description}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        href={slide.primaryCta.href}
                        className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
                      >
                        {slide.primaryCta.label}
                      </Link>

                      <Link
                        href={slide.secondaryCta.href}
                        className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
                      >
                        {slide.secondaryCta.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
