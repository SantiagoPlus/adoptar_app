import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ error?: string; ok?: string }>;

async function registrarMascota(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/mascotas/nueva");
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (usuarioError || !usuario) {
    redirect("/mascotas/nueva?error=usuario_no_encontrado");
  }

  const nombre = String(formData.get("nombre") ?? "").trim();
  const especie = String(formData.get("especie") ?? "").trim();
  const raza = String(formData.get("raza") ?? "").trim();
  const sexo = String(formData.get("sexo") ?? "").trim();
  const fechaNacimiento = String(formData.get("fecha_nacimiento") ?? "").trim();
  const urlFoto = String(formData.get("url_foto") ?? "").trim();

  if (!nombre || !especie) {
    redirect("/mascotas/nueva?error=campos_obligatorios");
  }

  if (!["perro", "gato", "otro"].includes(especie)) {
    redirect("/mascotas/nueva?error=especie_invalida");
  }

  if (sexo && !["macho", "hembra", "desconocido"].includes(sexo)) {
    redirect("/mascotas/nueva?error=sexo_invalido");
  }

  const payload = {
    id_usuario: usuario.id_usuario,
    nombre,
    especie,
    raza: raza || null,
    sexo: sexo || null,
    fecha_nacimiento: fechaNacimiento || null,
    url_foto: urlFoto || null,
  };

  const { error: insertError } = await supabase.from("mascotas").insert(payload);

  if (insertError) {
    redirect("/mascotas/nueva?error=error_creacion");
  }

  redirect("/perfil?ok=mascota_creada");
}

function Campo({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm text-white/70">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
      />
    </div>
  );
}

function NuevaMascotaSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="mb-6 h-6 w-48 animate-pulse rounded bg-white/10" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-12 animate-pulse rounded-xl bg-white/10"
          />
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        <div className="h-12 w-40 animate-pulse rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

function FeedbackBanner({
  error,
  ok,
}: {
  error?: string;
  ok?: string;
}) {
  if (ok === "mascota_creada") {
    return (
      <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La mascota fue registrada correctamente.
      </div>
    );
  }

  if (!error) return null;

  const messages: Record<string, string> = {
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    campos_obligatorios: "Completá al menos nombre y especie.",
    especie_invalida: "La especie indicada no es válida.",
    sexo_invalido: "El sexo indicado no es válido.",
    error_creacion: "Ocurrió un error al registrar la mascota.",
  };

  return (
    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
    </div>
  );
}

async function NuevaMascotaContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, ok } = await searchParams;

  return (
    <>
      <FeedbackBanner error={error} ok={ok} />

      <form action={registrarMascota} className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Campo
            label="Nombre de tu mascota *"
            name="nombre"
            placeholder="Ej. Qabuz"
            required
          />

          <div>
            <label
              htmlFor="especie"
              className="mb-2 block text-sm text-white/70"
            >
              Especie *
            </label>
            <select
              id="especie"
              name="especie"
              required
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            >
              <option value="" disabled>
                Seleccionar
              </option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <Campo
            label="Raza"
            name="raza"
            placeholder="Ej. Pastor alemán"
          />

          <div>
            <label
              htmlFor="sexo"
              className="mb-2 block text-sm text-white/70"
            >
              Sexo
            </label>
            <select
              id="sexo"
              name="sexo"
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
            >
              <option value="">No informado</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
              <option value="desconocido">Desconocido</option>
            </select>
          </div>

          <Campo
            label="Fecha de Nacimiento (Aprox.)"
            name="fecha_nacimiento"
            type="date"
          />

          <Campo
            label="Foto de perfil (URL)"
            name="url_foto"
            placeholder="https://..."
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Link
            href="/perfil"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="rounded-xl bg-[#b8860b] px-5 py-3 font-medium text-black transition hover:opacity-90"
          >
            Registrar mascota
          </button>
        </div>
      </form>
    </>
  );
}

export default function NuevaMascotaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/perfil"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a mi cuenta
          </Link>
        </div>

        <header className="mb-8">
          <p className="mb-2 text-sm text-white/60">Gestión</p>
          <h1 className="mb-3 text-3xl font-bold">Registrar Mascota</h1>
          <p className="max-w-3xl text-white/70">
            Ingresá los datos básicos de tu mascota para crear su ficha y
            habilitar su historial clínico y libreta sanitaria.
          </p>
        </header>

        <Suspense fallback={<NuevaMascotaSkeleton />}>
          <NuevaMascotaContent searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
