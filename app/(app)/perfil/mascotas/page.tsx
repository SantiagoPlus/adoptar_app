import Link from "next/link";
import { Suspense } from "react";
import { PlusCircle } from "lucide-react";
import { MascotasContent } from "@/app/(app)/perfil/mascotas/mascotas-content";

export default async function MisMascotasPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/perfil"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver al Perfil
          </Link>
        </div>

        <header className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm text-white/60">Gestión de Salud</p>
            <h1 className="text-3xl font-bold">Mis Mascotas</h1>
            <p className="mt-3 max-w-2xl text-white/70">
              Administrá la libreta sanitaria, el historial clínico y la información médica
              de tus mascotas en un solo lugar.
            </p>
          </div>
          
          <Link
            href="/perfil/mascotas/nueva"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva Mascota
          </Link>
        </header>

        <Suspense fallback={<div className="text-white/50">Cargando mascotas...</div>}>
          <MascotasContent />
        </Suspense>
      </section>
    </main>
  );
}


