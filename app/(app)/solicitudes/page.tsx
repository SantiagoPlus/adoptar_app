import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrCreateAdoptionConversation } from "@/lib/server/chat";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ error?: string }>;

async function abrirChatDesdeSolicitud(formData: FormData) {
  "use server";

  const idSolicitud = String(formData.get("id_solicitud") ?? "").trim();

  if (!idSolicitud) {
    redirect("/solicitudes?error=solicitud_invalida");
  }

  let idConversation: string;

  try {
    idConversation = await getOrCreateAdoptionConversation(idSolicitud);
  } catch {
    redirect("/solicitudes?error=chat_no_disponible");
  }

  redirect(`/chat/${idConversation}`);
}

function SolicitudesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="mb-3 h-5 w-40 animate-pulse rounded bg-white/10" />
          <div className="mb-2 h-4 w-28 animate-pulse rounded bg-white/10" />
          <div className="mb-2 h-4 w-56 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-full animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function formatEstado(estado: string) {
  const labels: Record<string, string> = {
    pendiente: "Pendiente",
    en_revision: "En proceso",
    rechazada: "Rechazada",
    cancelada: "Cancelada",
    adoptado: "Adoptado",
  };

  return labels[estado] ?? estado;
}

function FeedbackBanner({ error }: { error?: string }) {
  if (!error) return null;

  const messages: Record<string, string> = {
    solicitud_invalida: "La solicitud indicada no es válida.",
    chat_no_disponible: "No se pudo abrir el chat para esta solicitud.",
  };

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
    </div>
  );
}

async function MisSolicitudesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error: searchError } = await searchParams;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login?next=/solicitudes");
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (usuarioError || !usuario) {
    return (
      <div className="space-y-6">
        <FeedbackBanner error={searchError} />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          No se pudo cargar tu perfil de usuario.
        </div>
      </div>
    );
  }

  const { data: solicitudes, error } = await supabase
    .from("solicitudes_adopcion")
    .select(
      `
        id_solicitud,
        mensaje,
        estado,
        fecha_solicitud,
        animales_adopcion (
          id_animal,
          nombre,
          especie,
          raza,
          ciudad,
          estado
        )
      `,
    )
    .eq("id_solicitante", usuario.id_usuario)
    .order("fecha_solicitud", { ascending: false });

  if (error) {
    return (
      <div className="space-y-6">
        <FeedbackBanner error={searchError} />
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          Ocurrió un error al cargar tus solicitudes.
        </div>
      </div>
    );
  }

  if (!solicitudes || solicitudes.length === 0) {
    return (
      <div className="space-y-6">
        <FeedbackBanner error={searchError} />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-2 text-white/80">Todavía no hiciste solicitudes.</p>
          <Link
            href="/"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Ver animales disponibles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FeedbackBanner error={searchError} />

      <div className="space-y-4">
        {solicitudes.map((solicitud) => {
          const animal = Array.isArray(solicitud.animales_adopcion)
            ? solicitud.animales_adopcion[0]
            : solicitud.animales_adopcion;

          const puedeAbrirChat =
            solicitud.estado === "pendiente" ||
            solicitud.estado === "en_revision" ||
            solicitud.estado === "adoptado";

          return (
            <article
              key={solicitud.id_solicitud}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {animal?.nombre ?? "Animal"}
                  </h2>
                  <p className="text-sm text-white/60">
                    {animal?.especie ?? "Especie no informada"}
                    {animal?.raza ? ` · ${animal.raza}` : ""}
                  </p>
                </div>

                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs">
                  {formatEstado(solicitud.estado)}
                </span>
              </div>

              <div className="mb-4 space-y-1 text-sm text-white/70">
                <p>
                  <span className="font-medium text-white">Ciudad:</span>{" "}
                  {animal?.ciudad ?? "No informada"}
                </p>
                <p>
                  <span className="font-medium text-white">Fecha:</span>{" "}
                  {new Date(solicitud.fecha_solicitud).toLocaleString("es-AR")}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-white/80">
                {solicitud.mensaje}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {animal?.id_animal && (
                  <Link
                    href={`/animales/${animal.id_animal}`}
                    className="text-sm text-white/60 transition hover:text-white"
                  >
                    Ver detalle del animal
                  </Link>
                )}

                {puedeAbrirChat && (
                  <form action={abrirChatDesdeSolicitud}>
                    <input
                      type="hidden"
                      name="id_solicitud"
                      value={solicitud.id_solicitud}
                    />
                    <button
                      type="submit"
                      className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                    >
                      Abrir chat
                    </button>
                  </form>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default function MisSolicitudesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver al inicio
          </Link>
        </div>

        <header className="mb-8">
          <p className="mb-2 text-sm text-white/60">Solicitudes</p>
          <h1 className="mb-3 text-3xl font-bold">Mis solicitudes</h1>
          <p className="text-white/70">
            Acá podés ver el estado de las solicitudes que realizaste.
          </p>
        </header>

        <Suspense fallback={<SolicitudesSkeleton />}>
          <MisSolicitudesContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
