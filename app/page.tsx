import { Suspense } from "react";
import { HomeNavbar } from "@/components/home/navbar";
import { HomeHero } from "@/components/home/hero";
import { AnimalsList } from "@/components/home/animals-list";
import { AnimalsSkeleton } from "@/components/home/animals-skeleton";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <HomeNavbar />

      <section className="max-w-6xl mx-auto px-6 py-12">
        <HomeHero />

        <section id="animales">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-white/60 mb-1">Listado actual</p>
              <h2 className="text-2xl font-semibold">Animales disponibles</h2>
            </div>
          </div>

          <Suspense fallback={<AnimalsSkeleton />}>
            <AnimalsList />
          </Suspense>
        </section>
      </section>
    </main>
  );
}
