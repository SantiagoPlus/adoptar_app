//perfil
import Link from "next/link";
import { Suspense } from "react";
import { PerfilPersonalContent } from "./perfil-personal-content";

function Card({
  eyebrow,
  title,
  description,
  href,
  cta,
  variant = "default",
}: {
  eyebrow: string;
  title: string;
  description: string;
  href?: string;
  cta?: string;
  variant?: "default" | "compact";
}) {
  const isCompact = variant === "compact";

  const content = (
    <div
      className={[
        "rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/[0.07]",
        isCompact
          ? "flex h-full min-h-[150px] flex-col justify-between p-4"
          : "p-5",
      ].join(" ")}
    >
      <div>
        <p className="mb-1 text-[11px] uppercase tracking-wide text-white/50">
          {eyebrow}
        </p>
        <h3
          className={[
            "font-semibold text-white",
            isCompact ? "mb-1 text-lg" : "mb-2 text-lg",
          ].join(" ")}
        >
          {title}
        </h3>
        <p
          className={[
            "text-sm text-white/70",
            isCompact ? "line-clamp-2 leading-5" : "leading-6",
          ].join(" ")}
        >
          {description}
        </p>
      </div>

      {cta ? (
        <p className={isCompact ? "mt-3 text-sm text-white/60" : "mt-4 text-sm text-white/60"}>
          {cta}
        </p>
      ) : null}
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}

function PerfilPersonalSkeleton() {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Perfil personal</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
            Cargando...
          </span>
        </div>
        <div className="h-px w-full bg-white/10" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1.9fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full border border-white/10 bg-white/10" />
            <div className="flex-1">
              <div className="mb-2 h-3 w-16 rounded bg-white/10" />
              <div className="mb-2 h-6 w-40 rounded bg-white/10" />
              <div className="h-4 w-56 rounded bg-white/10" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="mb-2 h-3 w-20 rounded bg-white/10" />
                <div className="h-4 w-28 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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

        <Suspense fallback={<PerfilPersonalSkeleton />}>
          <PerfilPersonalContent />
        </Suspense>

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
              description="Acá vas a poder registrar tus mascotas, acceder a la información de cada una y gestionar su seguimiento."
              cta="Próximamente"
            />

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="mb-2 text-xs uppercase tracking-wide text-white/50">
                Arquitectura definida
              </p>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Libreta sanitaria dentro de cada mascota
              </h3>
              <p className="text-sm leading-6 text-white/70">
                La libreta sanitaria no funciona como módulo independiente. Va a
                estar dentro de cada ficha de mascota, junto con vacunas,
                controles, observaciones y seguimiento.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">Adopciones</h2>
            </div>
            <div className="h-px w-full bg-white/10" />
          </div>

          <div className="grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card
              href="/animales"
              eyebrow="Explorar"
              title="Buscar animal"
              description="Volvé al listado general para explorar animales disponibles."
              cta="Abrir"
              variant="compact"
            />

            <Card
              href="/publicaciones/nueva"
              eyebrow="Publicar"
              title="Nueva publicación"
              description="Creá una nueva publicación de adopción para uno de tus animales."
              cta="Abrir"
              variant="compact"
            />

            <Card
              href="/solicitudes"
              eyebrow="Seguimiento"
              title="Mis solicitudes"
              description="Revisá las solicitudes que realizaste y el estado actual de cada una."
              cta="Abrir"
              variant="compact"
            />

            <Card
              href="/publicaciones"
              eyebrow="Gestión"
              title="Publicaciones"
              description="Visualizá los animales que publicaste y gestioná sus casos."
              cta="Abrir"
              variant="compact"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
