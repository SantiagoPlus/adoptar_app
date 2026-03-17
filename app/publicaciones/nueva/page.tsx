import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{ error?: string }>;

async function crearPublicacion(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login?next=/publicaciones/nueva");
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (usuarioError || !usuario) {
    redirect("/publicaciones/nueva?error=usuario_no_encontrado");
  }

  const idAnimal = String(formData.get("id_animal") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const especie = String(formData.get("especie") ?? "").trim();
  const raza = String(formData.get("raza") ?? "").trim();
  const sexo = String(formData.get("sexo") ?? "").trim();
  const edadAproximada = String(formData.get("edad_aproximada") ?? "").trim();
  const tamano = String(formData.get("tamano") ?? "").trim();
  const ciudad = String(formData.get("ciudad") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const estadoSalud = String(formData.get("estado_salud") ?? "").trim();
  const nivelEnergia = String(formData.get("nivel_energia") ?? "").trim();
  const fotoPrincipal = String(formData.get("foto_principal") ?? "").trim();

  const castrado = formData.get("castrado") === "on";
  const vacunado = formData.get("vacunado") === "on";
  const desparasitado = formData.get("desparasitado") === "on";
  const aptoNinos = formData.get("apto_ninos") === "on";
  const aptoGatos = formData.get("apto_gatos") === "on";
  const aptoPerros = formData.get("apto_perros") === "on";

  if (!idAnimal) {
    redirect("/publicaciones/nueva?error=publicacion_invalida");
  }

  if (!nombre || !especie) {
    redirect("/publicaciones/nueva?error=campos_obligatorios");
  }

  if (!["perro", "gato"].includes(especie)) {
    redirect("/publicaciones/nueva?error=especie_invalida");
  }

  const payload = {
    id_animal: idAnimal,
    id_publicador: usuario.id_usuario,
    nombre,
    especie,
    raza: raza || null,
    sexo: sexo || null,
    edad_aproximada: edadAproximada || null,
    tamano: tamano || null,
    descripcion: descripcion || null,
    estado_salud: estadoSalud || null,
    ciudad: ciudad || null,
    estado: "disponible",
    fecha_publicacion: new Date().toISOString(),
    nivel_energia: nivelEnergia || null,
    castrado,
    vacunado,
    desparasitado,
    apto_ninos: aptoNinos,
    apto_gatos: aptoGatos,
    apto_perros: aptoPerros,
  };

  const { data: animalCreado, error: insertAnimalError } = await supabase
    .from("animales_adopcion")
    .insert(payload)
    .select("id_animal")
    .single();

  if (insertAnimalError) {
    if (insertAnimalError.code === "23505") {
      redirect(`/publicaciones/${idAnimal}?ok=publicacion_creada`);
    }

    redirect("/publicaciones/nueva?error=error_creacion_publicacion");
  }

  if (!animalCreado) {
    redirect("/publicaciones/nueva?error=error_creacion_publicacion");
  }

  if (fotoPrincipal) {
    const { error: fotoError } = await supabase.from("fotos_animales").insert({
      id_animal: animalCreado.id_animal,
      url_foto: fotoPrincipal,
      es_principal: true,
      orden: 1,
    });

    if (fotoError) {
      redirect(
        `/publicaciones/${animalCreado.id_animal}?error=publicacion_creada_sin_foto`,
      );
    }
  }

  redirect(`/publicaciones/${animalCreado.id_animal}?ok=publicacion_creada`);
}

function Campo({
  label,
  name,
  placeholder,
  required = false,
  defaultValue = "",
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm text-white/70">
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
      />
    </div>
  );
}

function NuevaPublicacionSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 h-6 w-48 animate-pulse rounded bg-white/10" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl bg-white/10"
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 h-6 w-56 animate-pulse rounded bg-white/10" />
        <div className="space-y-4">
          <div className="h-28 animate-pulse rounded-xl bg-white/10" />
          <div className="h-20 animate-pulse rounded-xl bg-white/10" />
          <div className="h-12 animate-pulse rounded-xl bg-white/10" />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5 h-6 w-40 animate-pulse rounded bg-white/10" />
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-xl bg-white/10"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function FeedbackBanner({ error }: { error?: string }) {
  if (!error) return null;

  const messages: Record<string, string> = {
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    campos_obligatorios: "Completá al menos nombre y especie.",
    especie_invalida: "La especie debe ser perro o gato.",
    error_creacion_publicacion:
      "Ocurrió un error al crear la publicación.",
    publicacion_invalida: "No se pudo preparar correctamente la publicación.",
  };

  return (
    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
    </div>
  );
}

async function NuevaPublicacionContent({
  searchParams,
  idAnimal,
}: {
  searchParams: SearchParams;
  idAnimal: string;
}) {
  const { error } = await searchParams;

  return (
    <>
      <FeedbackBanner error={error} />

      <form action={crearPublicacion} className="space-y-6">
        <input type="hidden" name="id_animal" value={idAnimal} />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-xl font-semibold">Datos principales</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Campo
              label="Nombre"
              name="nombre"
              placeholder="Ej. Mora"
              required
            />

            <div>
              <label
                htmlFor="especie"
                className="mb-2 block text-sm text-white/70"
              >
                Especie
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
              </select>
            </div>

            <Campo label="Raza" name="raza" placeholder="Ej. mestizo" />

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
              </select>
            </div>

            <Campo
              label="Edad aproximada"
              name="edad_aproximada"
              placeholder="Ej. 2 años"
            />

            <div>
              <label
                htmlFor="tamano"
                className="mb-2 block text-sm text-white/70"
              >
                Tamaño
              </label>
              <select
                id="tamano"
                name="tamano"
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                <option value="">No informado</option>
                <option value="pequeno">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
            </div>

            <Campo
              label="Ciudad"
              name="ciudad"
              placeholder="Ej. Bahía Blanca"
            />

            <div>
              <label
                htmlFor="nivel_energia"
                className="mb-2 block text-sm text-white/70"
              >
                Nivel de energía
              </label>
              <select
                id="nivel_energia"
                name="nivel_energia"
                defaultValue=""
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                <option value="">No informado</option>
                <option value="bajo">Bajo</option>
                <option value="medio">Medio</option>
                <option value="alto">Alto</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-xl font-semibold">Descripción y salud</h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="descripcion"
                className="mb-2 block text-sm text-white/70"
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows={5}
                placeholder="Contá cómo es el animal, su carácter y qué tipo de hogar buscás."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="estado_salud"
                className="mb-2 block text-sm text-white/70"
              >
                Estado de salud
              </label>
              <textarea
                id="estado_salud"
                name="estado_salud"
                rows={3}
                placeholder="Ej. Buen estado general, controles al día."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>

            <Campo
              label="Foto principal (URL)"
              name="foto_principal"
              placeholder="https://..."
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-xl font-semibold">Características</h2>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              ["castrado", "Castrado"],
              ["vacunado", "Vacunado"],
              ["desparasitado", "Desparasitado"],
              ["apto_ninos", "Apto niños"],
              ["apto_gatos", "Apto gatos"],
              ["apto_perros", "Apto perros"],
            ].map(([name, label]) => (
              <label
                key={name}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <input
                  type="checkbox"
                  name={name}
                  className="h-4 w-4 accent-white"
                />
                <span className="text-sm text-white/90">{label}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
          >
            Crear publicación
          </button>

          <Link
            href="/publicaciones"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </>
  );
}

export default function NuevaPublicacionPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const idAnimal = crypto.randomUUID();

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/publicaciones"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a publicaciones
          </Link>
        </div>

        <header className="mb-8">
          <p className="mb-2 text-sm text-white/60">Publicaciones</p>
          <h1 className="mb-3 text-3xl font-bold">Nueva publicación</h1>
          <p className="text-white/70">
            Creá una nueva publicación de adopción para uno de tus animales.
          </p>
        </header>

        <Suspense fallback={<NuevaPublicacionSkeleton />}>
          <NuevaPublicacionContent
            searchParams={searchParams}
            idAnimal={idAnimal}
          />
        </Suspense>
      </section>
    </main>
  );
}
