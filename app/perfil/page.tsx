import Link from "next/link";

function Card({
  eyebrow,
  title,
  description,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  cta?: string;
}) {
  const content = (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]">
      <p className="mb-2 text-xs uppercase tracking-wide text-white/50">
        {eyebrow}
      </p>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-6 text-white/70">{description}</p>
      {cta ? <p className="mt-4 text-sm text-white/60">{cta}</p> : null}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export default function PerfilPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver al inicio
          </Link>
        </div>

        <header className="mb-10">
          <p className="mb-2 text-sm text-white/60">Cuenta</p>
          <h1 className="mb-3 text-3xl font-bold">Mi cuenta</h1>
          <p className="max-w-3xl text-white/70">
            Desde acá podés gestionar tu perfil, tus mascotas, tus procesos de
            adopción y tus publicaciones.
          </p>
        </header>

        <section className="mb-10">
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Perfil personal</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                Próximamente
              </span>
            </div>
            <div className="h-px w-full bg-white/10" />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_1.9fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm text-white/50">
                  Foto
                </div>

                <div>
                  <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
                    Perfil
                  </p>
                  <h3 className="text-lg font-semibold">Datos personales</h3>
                  <p className="mt-1 text-sm text-white/70">
                    Acá vas a poder completar tu información personal y agregar
                    una imagen de perfil si querés.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
                    Información
                  </p>
                  <p className="text-sm text-white/70">
                    Nombre, ciudad, contacto y datos básicos de la cuenta.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
                    Imagen
                  </p>
                  <p className="text-sm text-white/70">
                    Foto de perfil opcional para identificar al usuario.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Mis mascotas</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                Desarrollo posterior
              </span>
            </div>
            <div className="h-px w-full bg-white/10" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card
              eyebrow="Gestión personal"
              title="Mis mascotas"
              description="Acá vas a poder registrar tus mascotas y acceder a la información de cada una."
              cta="Próximamente"
            />

            <Card
              eyebrow="Salud y seguimiento"
              title="Libreta sanitaria dentro de cada mascota"
              description="La libreta sanitaria no funciona como módulo independiente: va a estar dentro de cada ficha de mascota, junto con vacunas, controles y seguimiento."
              cta="Definido en arquitectura"
            />
          </div>
        </section>

        <section>
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Adopciones</h2>
            </div>
            <div className="h-px w-full bg-white/10" />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              href="/animales"
              eyebrow="Explorar"
              title="Buscar animal"
              description="Volvé al listado general para explorar animales disponibles."
              cta="Abrir"
            />

            <Card
              href="/publicaciones/nueva"
              eyebrow="Publicar"
              title="Nueva publicación"
              description="Creá una nueva publicación de adopción para uno de tus animales."
              cta="Abrir"
            />

            <Card
              href="/solicitudes"
              eyebrow="Seguimiento"
              title="Mis solicitudes"
              description="Revisá las solicitudes que realizaste y el estado actual de cada una."
              cta="Abrir"
            />

            <Card
              href="/publicaciones"
              eyebrow="Gestión"
              title="Publicaciones"
              description="Visualizá los animales que publicaste y gestioná sus casos."
              cta="Abrir"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
