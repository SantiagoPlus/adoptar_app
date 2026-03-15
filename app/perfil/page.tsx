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

        <header className="mb-8">
          <p className="text-sm text-white/60 mb-2">Cuenta</p>
          <h1 className="text-3xl font-bold mb-3">Mi cuenta</h1>
          <p className="text-white/70">
            Desde acá vas a poder gestionar tu actividad dentro de Adopta App.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/solicitudes"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
          >
            <p className="text-sm text-white/60 mb-2">Seguimiento</p>
            <h2 className="text-xl font-semibold mb-2">Mis solicitudes</h2>
            <p className="text-white/70 text-sm">
              Revisá las solicitudes que hiciste y el estado actual de cada una.
            </p>
          </Link>

          <Link
            href="/solicitudes/recibidas"
            className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
          >
            <p className="text-sm text-white/60 mb-2">Gestión</p>
            <h2 className="text-xl font-semibold mb-2">
              Solicitudes recibidas
            </h2>
            <p className="text-white/70 text-sm">
              Consultá las solicitudes que llegaron a tus publicaciones.
            </p>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mt-6">
          <p className="text-sm text-white/60 mb-2">Próximo bloque</p>
          <h2 className="text-xl font-semibold mb-2">Perfil del usuario</h2>
          <p className="text-white/70">
            Esta sección más adelante mostrará y permitirá editar la información
            real del perfil.
          </p>
        </div>
      </section>
    </main>
  );
}
