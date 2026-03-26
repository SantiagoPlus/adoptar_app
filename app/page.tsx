import { Suspense } from "react";
import { HomeNavbar } from "@/components/home/navbar";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { AnimalsList } from "@/components/home/animals-list";
import { AnimalsSkeleton } from "@/components/home/animals-skeleton";

function NavbarSkeleton() {
  return (
    <nav className="border-b border-white/10">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-6">
        <div className="text-xl font-semibold tracking-tight">Adopta App</div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 rounded-xl bg-white/10 animate-pulse" />
          <div className="h-11 w-11 rounded-full bg-white/10 animate-pulse" />
        </div>
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

      <section className="mx-auto max-w-6xl px-6 py-12">
        <HeroCarousel />

        <section id="animales">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="mb-1 text-sm text-white/60">Listado actual</p>
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
