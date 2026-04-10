"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useRef } from "react";
import type { AnimalPreview } from "@/components/home/animals-preview";

function AnimalChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70">
      {label}
    </span>
  );
}

function AnimalCard({ animal }: { animal: AnimalPreview }) {
  const fotoPrincipal =
    animal.fotos_animales?.find((foto) => foto.es_principal) ??
    animal.fotos_animales?.[0] ??
    null;

  const chips = [animal.sexo, animal.tamano]
    .filter(Boolean)
    .slice(0, 2) as string[];

  return (
    <Link
      href={`/animales/${animal.id_animal}`}
      className="block min-w-[220px] max-w-[220px] sm:min-w-[230px] sm:max-w-[230px] lg:min-w-[210px] lg:max-w-[210px] xl:min-w-[220px] xl:max-w-[220px]"
    >
      <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:border-white/20 hover:bg-white/[0.05]">
        <div className="relative h-32 w-full overflow-hidden bg-white/5">
          {fotoPrincipal ? (
            <img
              src={fotoPrincipal.url_foto}
              alt={animal.nombre}
              className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/45">
              Sin imagen
            </div>
          )}
        </div>

        <div className="space-y-2.5 p-4">
          <div>
            <p className="mb-1 text-[11px] uppercase tracking-wide text-white/45">
              {animal.especie ?? "Mascota"}
              {animal.raza ? ` · ${animal.raza}` : ""}
            </p>

            <h3 className="line-clamp-1 text-base font-semibold text-white">
              {animal.nombre}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">
                {animal.ciudad ?? "Ubicación no informada"}
              </span>
            </p>
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <AnimalChip key={chip} label={chip} />
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export function AnimalsPreviewCarousel({
  animales,
}: {
  animales: AnimalPreview[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: "left" | "right") => {
    const container = trackRef.current;
    if (!container) return;

    const cardWidth = 236;
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * 2;

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      <div className="mb-5 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollByCards("left")}
          aria-label="Ver animales anteriores"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => scrollByCards("right")}
          aria-label="Ver más animales"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {animales.map((animal) => (
          <AnimalCard key={animal.id_animal} animal={animal} />
        ))}
      </div>
    </div>
  );
}
