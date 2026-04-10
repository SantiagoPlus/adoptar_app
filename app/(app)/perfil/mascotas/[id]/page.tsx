import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { FichaMascotaContent } from "./ficha-mascota-content";

export default async function FichaMascotaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/perfil/mascotas"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Mis Mascotas
          </Link>
        </div>

        <Suspense fallback={<div className="text-white/50">Cargando ficha de mascota...</div>}>
          <FichaMascotaContent id_mascota={id} />
        </Suspense>
      </section>
    </main>
  );
}
