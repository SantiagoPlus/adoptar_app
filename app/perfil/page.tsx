import Link from "next/link";

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Volver al inicio
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <p className="text-sm text-white/60 mb-2">Perfil</p>
          <h1 className="text-3xl font-bold mb-4">Mi perfil</h1>
          <p className="text-white/70">
            Esta sección todavía está en construcción. En el próximo bloque se
            usará para mostrar y editar la información del usuario.
          </p>
        </div>
      </section>
    </main>
  );
}
