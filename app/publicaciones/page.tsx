import Link from "next/link";

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Volver al inicio
          </Link>
        </div>

        <header className="mb-10">
          <p className="text-sm text-white/60 mb-2">Cuenta</p>
          <h1 className="text-3xl font-bold mb-3">Mi cuenta</h1>
          <p className="text-white/70 max-w-3xl">
            Desde acá podés gestionar tus procesos de adopción, tus
            publicaciones y, más adelante, la información de tus mascotas.
          </p>
        </header>

        <div className="space-y-10">
          <section>
            <div className="mb-5">
              <p className="text-sm text-white/60 mb-2">Sección principal</p>
              <h2 className="text-2xl font-semibold">Adopciones</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Link
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <p className="text-sm text-white/60 mb-2">Explorar</p>
                <h3 className="text-lg font-semibold mb-2">Buscar animal</h3>
                <p className="text-sm text-white/70">
                  Volvé al listado general para explorar animales disponibles.
                </p>
              </Link>

              <Link
                href="/publicaciones/nueva"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <p className="text-sm text-white/60 mb-2">Publicar</p>
                <h3 className="text-lg font-semibold mb-2">Nueva publicación</h3>
                <p className="text-sm text-white/70">
                  Creá una nueva publicación de adopción para uno de tus
                  animales.
                </p>
              </Link>

              <Link
                href="/solicitudes"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <p className="text-sm text-white/60 mb-2">Seguimiento</p>
                <h3 className="text-lg font-semibold mb-2">Mis solicitudes</h3>
                <p className="text-sm text-white/70">
                  Revisá las solicitudes que realizaste y el estado actual de
                  cada una.
                </p>
              </Link>

              <Link
                href="/publicaciones"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <p className="text-sm text-white/60 mb-2">Gestión</p>
                <h3 className="text-lg font-semibold mb-2">Publicaciones</h3>
                <p className="text-sm text-white/70">
                  Visualizá los animales que publicaste y gestioná sus casos.
                </p>
              </Link>
            </div>
          </section>

          <section>
            <div className="mb-5">
              <p className="text-sm text-white/60 mb-2">Desarrollo posterior</p>
              <h2 className="text-2xl font-semibold">Mis mascotas</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href="/mascotas"
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
              >
                <p className="text-sm text-white/60 mb-2">Gestión personal</p>
                <h3 className="text-lg font-semibold mb-2">Mis mascotas</h3>
                <p className="text-sm text-white/70">
                  Accedé al futuro módulo de mascotas, historial de salud y
                  seguimiento.
                </p>
              </Link>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm text-white/60 mb-2">Próximamente</p>
                <h3 className="text-lg font-semibold mb-2">
                  Libreta sanitaria
                </h3>
                <p className="text-sm text-white/70">
                  Esta área se integrará con controles, vacunas, desparasitación
                  e historial clínico.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
