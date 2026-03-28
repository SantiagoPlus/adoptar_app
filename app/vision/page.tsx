import { Suspense } from "react";
import { HomeNavbar } from "@/components/home/navbar";
import { HomeFooter } from "@/components/home/footer";
import { VisionHero } from "@/components/vision/hero";
import { PlatformOverview } from "@/components/vision/platform-overview";
import { PlatformEvolution } from "@/components/vision/evolution";
import { ProjectStatus } from "@/components/vision/project-status";
import { SupportDevelopment } from "@/components/vision/support-development";

function NavbarSkeleton() {
  return (
    <nav className="border-b border-white/10">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-6">
        <div className="text-xl font-semibold tracking-tight">Adopta App</div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-white/10" />
          <div className="h-11 w-11 animate-pulse rounded-full bg-white/10" />
        </div>
      </div>
    </nav>
  );
}

export default function VisionPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Suspense fallback={<NavbarSkeleton />}>
        <HomeNavbar />
      </Suspense>

      <VisionHero />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <PlatformOverview />
        <PlatformEvolution />
        <ProjectStatus />
        <SupportDevelopment />
      </section>

      <HomeFooter />
    </main>
  );
}
