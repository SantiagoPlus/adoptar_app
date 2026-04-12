import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MascotaSectionNav } from "./section-nav";
import { MascotaHeader } from "./mascota-header";
import { MascotaShellProvider } from "./mascota-module-provider";
import { getMascotaModuleShell } from "@/lib/server/mascotas";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
};

function LayoutFallback() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-10">
        <div className="mb-5">
          <div className="inline-flex items-center gap-2 text-sm text-white/40">
            <ArrowLeft className="h-4 w-4" />
            Cargando mascota...
          </div>
        </div>

        <div className="mb-6 rounded-[22px] border border-white/10 bg-[#080808] p-6">
          <div className="h-32 rounded-[18px] bg-white/5" />
        </div>

        <div className="mb-6 rounded-[22px] border border-white/10 bg-[#080808] p-5">
          <div className="h-16 rounded-[14px] bg-white/5" />
        </div>

        <div className="mb-6 rounded-xl bg-white/[0.03] p-1.5">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 rounded-lg bg-white/5" />
            <div className="h-12 rounded-lg bg-white/5" />
          </div>
        </div>

        <div className="rounded-[22px] border border-white/10 bg-[#080808] p-6">
          <div className="h-40 rounded-[20px] bg-white/5" />
        </div>
      </section>
    </main>
  );
}

async function MascotaLayoutContent({ children, params }: LayoutProps) {
  const { id: idMascota } = await params;
  const mascota = await getMascotaModuleShell(idMascota);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-10">
        <div className="mb-5">
          <Link
            href="/perfil"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mi cuenta
          </Link>
        </div>

        <MascotaHeader mascota={mascota} />
        <MascotaSectionNav idMascota={idMascota} />

        <MascotaShellProvider mascota={mascota}>
          {children}
        </MascotaShellProvider>
      </section>
    </main>
  );
}

export default function MascotaLayout(props: LayoutProps) {
  return (
    <Suspense fallback={<LayoutFallback />}>
      <MascotaLayoutContent {...props} />
    </Suspense>
  );
}
