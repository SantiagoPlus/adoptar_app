import { Suspense } from "react";
import { HomeNavbar } from "@/components/home/navbar";
import { HomeHero } from "@/components/home/hero";
import { AnimalsList } from "@/components/home/animals-list";
import { AnimalsSkeleton } from "@/components/home/animals-skeleton";

function NavbarSkeleton() {
  return (
    <nav className="border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="text-lg font-semibold">Adopta App</div>
        <div className="h-10 w-24 rounded-lg bg-white/10 animate-pulse" />
      </div>
    </nav>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Suspense fallback={<NavbarSkeleton />}>
        <HomeNavbar />
      </Suspense>

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
