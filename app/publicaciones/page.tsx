import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Publicacion = {
  id_animal: string;
  nombre: string;
  especie: string;
  raza: string | null;
  ciudad: string | null;
  estado: string;
  fecha_publicacion: string | null;
};

function formatEstadoAnimal(estado: string) {
  const labels: Record<string, string> = {
    disponible: "Disponible",
    adoptado: "Adoptado",
    pausado: "Pausado",
    cancelado: "Cancelado",
    en_proceso: "En proceso",
  };

  return labels[estado] ?? estado;
}

function PublicacionesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-3" />
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-2" />
          <div className="h-4 w-28 bg-white/10 rounded animate-pulse mb-2" />
          <div className="h-10 w-40 bg-white/10 rounded animate-pulse mt-4" />
        </div>
      ))}
    </div>
  );
}

async function PublicacionesContent() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login?next=/publicaciones");
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (usuarioError || !usuario) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        No se pudo cargar tu perfil de usuario.
      </div>
    );
  }

  const { data: publicaciones, error } = await supabase
    .from("animales_adopcion")
    .select(
      `
        id_animal,
        nombre,
        especie,
        raza,
        ciudad,
        estado,
        fecha_publicacion
      `,
    )
    .eq("id_publicador", usuario.id_usuario)
    .order("fecha_publicacion", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
        Ocurrió un error al cargar tus publicaciones.
      </div>
    );
  }

  const items = (publicaciones ?? []) as Publicacion[];

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-white/80 mb-2">Todavía no tenés publicaciones.</p>
        <Link
          href="/publicaciones/nueva"
          className="text-sm text-white/60 hover:text-white transition"
        >
          Crear nueva publicación
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((animal) => (
        <article
          key={animal.id_animal}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-xl font-semibold">{animal.nombre}</h2>
              <p className="text-sm text-white/60">
                {animal.especie}
                {animal.raza ? ` · ${animal.raza}` : ""}
              </p>
            </div>

            <span className="text-xs px-3 py-1 rounded-full border border-white/15 bg-white/10">
              {formatEstadoAnimal(animal.estado)}
            </span>
          </div>

          <div className="text-sm text-white/70 space-y-1 mb-4">
            <p>
              <span className="font-medium text-white">Ciudad:</span>{" "}
              {animal.ciudad ?? "No informada"}
            </p>
            <p>
              <span className="font-medium text-white">Publicado:</span>{" "}
              {animal.fecha_publicacion
                ? new Date(animal.fecha_publicacion).toLocaleString("es-AR")
                : "No informado"}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/publicaciones/${animal.id_animal}`}
              className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 transition"
            >
              Ver publicación
            </Link>

            <Link
              href={`/animales/${animal.id_animal}`}
              className="text-sm text-white/60 hover:text-white transition"
            >
              Ver ficha pública
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function PublicacionesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link
            href="/perfil"
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Volver a mi cuenta
          </Link>
        </div>

        <header className="mb-8">
          <p className="text-sm text-white/60 mb-2">Adopciones</p>
          <h1 className="text-3xl font-bold mb-3">Publicaciones</h1>
          <p className="text-white/70">
            Acá podés ver los animales que publicaste y acceder a la gestión de
            cada caso.
          </p>
        </header>

        <Suspense fallback={<PublicacionesSkeleton />}>
          <PublicacionesContent />
        </Suspense>
      </section>
    </main>
  );
}
