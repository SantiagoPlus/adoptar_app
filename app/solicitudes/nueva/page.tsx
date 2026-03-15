import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{
  animal_id?: string;
  ok?: string;
  error?: string;
}>;

async function submitSolicitud(formData: FormData) {
  "use server";

  const animalId = String(formData.get("animal_id") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim();

  if (!animalId) {
    redirect("/?error=animal_invalido");
  }

  if (!mensaje) {
    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(animalId)}&error=mensaje_vacio`,
    );
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect(
      `/auth/login?next=${encodeURIComponent(
        `/solicitudes/nueva?animal_id=${animalId}`,
      )}`,
    );
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (usuarioError || !usuario) {
    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(animalId)}&error=usuario_no_encontrado`,
    );
  }

  const { data: animal, error: animalError } = await supabase
    .from("animales_adopcion")
    .select("id_animal, estado")
    .eq("id_animal", animalId)
    .single();

  if (animalError || !animal) {
    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(animalId)}&error=animal_no_encontrado`,
    );
  }

  if (animal.estado !== "disponible") {
    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(animalId)}&error=animal_no_disponible`,
    );
  }

  const { error: insertError } = await supabase
    .from("solicitudes_adopcion")
    .insert({
      id_animal: animalId,
      id_solicitante: usuario.id_usuario,
      mensaje,
      estado: "pendiente",
      fecha_solicitud: new Date().toISOString(),
    });

  if (insertError) {
    if (insertError.code === "23505") {
      redirect(
        `/solicitudes/nueva?animal_id=${encodeURIComponent(animalId)}&error=solicitud_duplicada`,
      );
    }

    redirect(
      `/solicitudes/nueva?animal_id=${encodeURIComponent(animalId)}&error=error_insercion`,
    );
  }

  redirect(`/solicitudes/nueva?animal_id=${encodeURIComponent(animalId)}&ok=1`);
}

function NuevaSolicitudSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="h-4 w-36 bg-white/10 rounded animate-pulse mb-3" />
        <div className="h-9 w-72 bg-white/10 rounded animate-pulse mb-3" />
        <div className="h-4 w-80 bg-white/10 rounded animate-pulse" />

        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-5 w-28 bg-white/10 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="h-6 w-40 bg-white/10 rounded animate-pulse mb-4" />
        <div className="h-4 w-72 bg-white/10 rounded animate-pulse mb-3" />
        <div className="w-full h-40 rounded-xl border border-white/10 bg-black/40 animate-pulse" />
        <div className="h-11 w-52 bg-white/10 rounded-xl animate-pulse mt-4" />
      </div>
    </div>
  );
}

function FeedbackBanner({
  ok,
  error,
}: {
  ok?: string;
  error?: string;
}) {
  if (ok === "1") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        Solicitud enviada correctamente. El publicador podrá verla y evaluarla.
      </div>
    );
  }

  if (!error) return null;

  const messages: Record<string, string> = {
    mensaje_vacio: "Tenés que escribir un mensaje antes de enviar la solicitud.",
    solicitud_duplicada:
      "Ya tenés una solicitud activa para este animal. No hace falta enviar otra.",
    usuario_no_encontrado:
      "No se pudo vincular tu sesión con tu perfil de usuario.",
    animal_no_encontrado: "No se encontró el animal seleccionado.",
    animal_no_disponible:
      "Este animal ya no se encuentra disponible para adopción.",
    error_insercion:
      "Ocurrió un error al guardar la solicitud. Intentá nuevamente.",
  };

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
    </div>
  );
}

async function NuevaSolicitudContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { animal_id, ok, error } = await searchParams;

  if (!animal_id) {
    notFound();
  }

  const supabase = await createClient();

  const { data: animal, error: animalError } = await supabase
    .from("animales_adopcion")
    .select(
      `
        id_animal,
        nombre,
        especie,
        raza,
        ciudad,
        estado
      `,
    )
    .eq("id_animal", animal_id)
    .single();

  if (animalError || !animal) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <FeedbackBanner ok={ok} error={error} />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
        <p className="text-sm text-white/60 mb-2">Solicitud de adopción</p>
        <h1 className="text-3xl font-bold mb-3">
          Quiero adoptar a {animal.nombre}
        </h1>
        <p className="text-white/70">
          Estás iniciando una solicitud para este animal:
        </p>

        <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 mb-1">Nombre</p>
            <p>{animal.nombre}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 mb-1">Estado</p>
            <p>{animal.estado}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 mb-1">Especie</p>
            <p>
              {animal.especie}
              {animal.raza ? ` · ${animal.raza}` : ""}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-white/60 mb-1">Ciudad</p>
            <p>{animal.ciudad ?? "No informada"}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold mb-4">Mensaje inicial</h2>

        <form action={submitSolicitud} className="space-y-4">
          <input type="hidden" name="animal_id" value={animal.id_animal} />

          <div>
            <label
              htmlFor="mensaje"
              className="block text-sm text-white/70 mb-2"
            >
              Contale al publicador por qué querés adoptar a este animal
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={6}
              placeholder="Hola, me interesa iniciar el proceso de adopción..."
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 outline-none"
              defaultValue=""
            />
          </div>

          <button
            type="submit"
            className="inline-flex px-5 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 transition"
          >
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NuevaSolicitudPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Volver al inicio
          </Link>
        </div>

        <Suspense fallback={<NuevaSolicitudSkeleton />}>
          <NuevaSolicitudContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
