import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ ok?: string; error?: string }>;

type Mascota = {
  id_mascota: string;
  id_usuario: string;
  nombre: string;
  especie: string;
  raza: string | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  url_foto: string | null;
  color: string | null;
  observaciones: string | null;
  castrado: boolean | null;
  vacunado: boolean | null;
  desparasitado: boolean | null;
  created_at: string | null;
};

function formatEspecie(value: string) {
  const labels: Record<string, string> = {
    perro: "Perro",
    gato: "Gato",
    otro: "Otro",
  };

  return labels[value] ?? value;
}

function formatSexo(value: string | null) {
  if (!value) return "No informado";

  const labels: Record<string, string> = {
    macho: "Macho",
    hembra: "Hembra",
    desconocido: "Desconocido",
  };

  return labels[value] ?? value;
}

function formatFecha(value: string | null) {
  if (!value) return "No informada";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("es-AR");
}

function FeedbackBanner({
  ok,
  error,
}: {
  ok?: string;
  error?: string;
}) {
  if (ok === "mascota_creada") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La mascota fue registrada correctamente.
      </div>
    );
  }

  if (!error) return null;

  const messages: Record<string, string> = {
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    sin_permisos: "No tenés permisos para acceder a esta mascota.",
    error_carga_mascota: "Ocurrió un error al cargar la ficha de la mascota.",
  };

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
    </div>
  );
}

function MascotaSkeleton() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="aspect-[16/7] animate-pulse bg-white/10" />
        <div className="p-6">
          <div className="mb-3 h-8 w-40 rounded bg-white/10" />
          <div className="mb-2 h-4 w-32 rounded bg-white/10" />
          <div className="h-4 w-52 rounded bg-white/10" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="mb-2 h-4 w-24 rounded bg-white/10" />
            <div className="h-5 w-28 rounded bg-white/10" />
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 h-5 w-40 rounded bg-white/10" />
          <div className="h-20 rounded bg-white/10" />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 h-5 w-36 rounded bg-white/10" />
          <div className="h-20 rounded bg-white/10" />
        </div>
      </section>
    </div>
  );
}

function AttributeChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/90">
      {children}
    </span>
  );
}

async function MascotaDetailContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { ok, error: searchError } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?next=/mascotas/${id}`);
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (usuarioError || !usuario) {
    return <FeedbackBanner error="usuario_no_encontrado" />;
  }

  const { data: mascota, error } = await supabase
    .from("mascotas")
    .select(
      "id_mascota, id_usuario, nombre, especie, raza, sexo, fecha_nacimiento, url_foto, color, observaciones, castrado, vacunado, desparasitado, created_at",
    )
    .eq("id_mascota", id)
    .single();

  if (error || !mascota) {
    notFound();
  }

  const item = mascota as Mascota;

  if (item.id_usuario !== usuario.id_usuario) {
    redirect("/perfil?error=sin_permisos");
  }

  const { count: libretaCount } = await supabase
    .from("mascotas_libreta_sanitaria")
    .select("*", { count: "exact", head: true })
    .eq("id_mascota", item.id_mascota);

  const { count: historialCount } = await supabase
    .from("mascotas_historial_clinico")
    .select("*", { count: "exact", head: true })
    .eq("id_mascota", item.id_mascota);

  return (
    <div className="space-y-6">
      <FeedbackBanner ok={ok} error={searchError} />

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="aspect-[16/7] w-full overflow-hidden bg-white/10">
          {item.url_foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url_foto}
              alt={item.nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/35">
              <span className="text-sm uppercase tracking-wide">Sin foto</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="mb-2 text-sm text-white/60">Ficha de mascota</p>
          <h1 className="text-3xl font-bold text-[#f5a623]">{item.nombre}</h1>
          <p className="mt-2 text-white/70">
            {formatEspecie(item.especie)}
            {item.raza ? ` • ${item.raza}` : ""}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {item.castrado && <AttributeChip>Castrado</AttributeChip>}
            {item.vacunado && <AttributeChip>Vacunado</AttributeChip>}
            {item.desparasitado && <AttributeChip>Desparasitado</AttributeChip>}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">Especie</p>
          <p className="text-lg font-semibold">{formatEspecie(item.especie)}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">Sexo</p>
          <p className="text-lg font-semibold">{formatSexo(item.sexo)}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">Fecha de nacimiento</p>
          <p className="text-lg font-semibold">
            {formatFecha(item.fecha_nacimiento)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-1 text-sm text-white/60">Raza</p>
          <p className="text-lg font-semibold">{item.raza ?? "No informada"}</p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
                Salud
              </p>
              <h2 className="text-xl font-semibold">Libreta sanitaria</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
              {libretaCount ?? 0} registros
            </span>
          </div>

          <p className="text-sm leading-6 text-white/70">
            Acá vas a poder registrar vacunas, desparasitaciones, controles y
            otros eventos periódicos de salud.
          </p>

          <div className="mt-5">
            <span className="text-sm text-white/50">Próximamente</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
                Clínica
              </p>
              <h2 className="text-xl font-semibold">Historial clínico</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
              {historialCount ?? 0} registros
            </span>
          </div>

          <p className="text-sm leading-6 text-white/70">
            Este bloque va a reunir consultas, diagnósticos, estudios,
            tratamientos y observaciones clínicas de la mascota.
          </p>

          <div className="mt-5">
            <span className="text-sm text-white/50">Próximamente</span>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="mb-2 text-xs uppercase tracking-wide text-white/50">
          Información adicional
        </p>
        <h2 className="mb-3 text-xl font-semibold">Observaciones</h2>
        <p className="text-sm leading-6 text-white/70">
          {item.observaciones ?? "Todavía no hay observaciones cargadas para esta mascota."}
        </p>
      </section>
    </div>
  );
}

export default function MascotaDetailPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            href="/perfil"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a mi cuenta
          </Link>

          <Link
            href="/mascotas"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Ver todas mis mascotas
          </Link>
        </div>

        <Suspense fallback={<MascotaSkeleton />}>
          <MascotaDetailContent params={params} searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
