import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { FichaMascotaContent } from "./ficha-mascota-content";

export default function FichaMascotaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-10">
        <div className="mb-6">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mi cuenta
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-white/50">
              Cargando ficha de mascota...
            </div>
          }
        >
          <FichaMascotaContent params={params} />
        </Suspense>
      </section>
    </main>
  );
}
