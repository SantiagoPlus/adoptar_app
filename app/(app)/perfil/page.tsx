import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PerfilPersonalContent } from "./perfil-personal-content";

type Mascota = {
  id_mascota: string;
  nombre: string;
  especie: string;
  raza: string | null;
  foto_url: string | null;
};

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
        <p
          className={
            isCompact ? "mt-3 text-sm text-white/60" : "mt-4 text-sm text-white/60"
          }
        >
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
    </section>
  );
}

function MascotasSectionSkeleton() {
  return (
    <section className="mb-10">
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Mis mascotas</h2>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
            Gestión de Salud
          </span>
        </div>
        <div className="h-px w-full bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
          >
            <div className="aspect-[4/3] animate-pulse bg-white/10" />
            <div className="p-4">
              <div className="mb-2 h-5 w-24 rounded bg-white/10" />
              <div className="mb-4 h-4 w-28 rounded bg-white/10" />
              <div className="h-4 w-16 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getMascotaSubtitle(mascota: Mascota) {
  const especie =
    mascota.especie.charAt(0).toUpperCase() + mascota.especie.slice(1);

  return mascota.raza ? `${especie} • ${mascota.raza}` : especie;
}

function MascotaCard({ mascota }: { mascota: Mascota }) {
  return (
    <Link
      href={`/mascotas/${mascota.id_mascota}`}
      className="block overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-white/10">
        {mascota.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mascota.foto_url}
            alt={mascota.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/35">
            <span className="text-xs uppercase tracking-wide">Sin foto</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-[#f5a623]">
          {mascota.nombre}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/70">
          {getMascotaSubtitle(mascota)}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm text-white/80">
          <span>Ver ficha</span>
          <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  );
}

function AgregarMascotaCard() {
  return (
    <Link
      href="/mascotas/nueva"
      className="block overflow-hidden rounded-2xl border border-dashed border-[#f5a623]/60 bg-white/5 transition hover:border-[#f5a623] hover:bg-white/[0.07]"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-white/[0.02]">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5a623]/20 text-3xl text-[#f5a623]">
          +
        </div>
      </div>

      <div className="p-4 text-center">
        <h3 className="text-base font-semibold text-white">Agregar Mascota</h3>
        <p className="mt-1 text-sm text-white/60">
          Crear ficha y habilitar seguimiento
        </p>
      </div>
    </Link>
  );
}

async function MascotasSectionContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (usuarioError || !usuario) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        No se pudo cargar el vínculo de tu cuenta con tus mascotas.
      </div>
    );
  }

  const { data: mascotas, error } = await supabase
    .from("mascotas")
    .select("id_mascota, nombre, especie, raza, foto_url")
    .eq("id_usuario", usuario.id_usuario)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
        Ocurrió un error al cargar tus mascotas.
      </div>
    );
  }

  const items = (mascotas ?? []) as Mascota[];

  return (
    <section className="mb-10">
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Mis mascotas</h2>
          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
            Gestión de Salud
          </span>
        </div>
        <div className="h-px w-full bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        <AgregarMascotaCard />
        {items.map((mascota) => (
          <MascotaCard key={mascota.id_mascota} mascota={mascota} />
        ))}
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

        <Suspense fallback={<MascotasSectionSkeleton />}>
          <MascotasSectionContent />
        </Suspense>

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
