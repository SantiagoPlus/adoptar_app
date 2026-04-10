import Link from "next/link";
import { NuevaMascotaForm } from "@/app/(app)/perfil/mascotas/nueva/nueva-mascota-form";

export default function NuevaMascotaPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/perfil/mascotas"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a Mis Mascotas
          </Link>
        </div>

        <header className="mb-10">
          <p className="mb-2 text-sm text-white/60">Gestión</p>
          <h1 className="mb-3 text-3xl font-bold">Registrar Mascota</h1>
          <p className="text-white/70">
            Ingresá los datos básicos de tu mascota para crear su Libreta
            Sanitaria y habilitar su historial clínico.
          </p>
        </header>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8">
          <NuevaMascotaForm />
        </div>
      </section>
    </main>
  );
}
