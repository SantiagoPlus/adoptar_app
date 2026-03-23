import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AnimalPhotosManager from "@/components/publicaciones/animal-photos-manager";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ id: string }>;

type SearchParams = Promise<{ ok?: string; error?: string }>;

type FotoAnimal = {
  id_foto: string;
  url_foto: string;
  es_principal: boolean;
  orden: number;
  storage_path?: string | null;
};

type AnimalPublicacion = {
  id_animal: string;
  nombre: string;
  especie: string;
  raza: string | null;
  sexo: string | null;
  edad_aproximada: string | null;
  tamano: string | null;
  descripcion: string | null;
  estado_salud: string | null;
  ciudad: string | null;
  estado: string;
  fecha_publicacion: string | null;
  id_publicador: string;
  nivel_energia: string | null;
  castrado: boolean | null;
  vacunado: boolean | null;
  desparasitado: boolean | null;
  apto_ninos: boolean | null;
  apto_gatos: boolean | null;
  apto_perros: boolean | null;
  fotos_animales: FotoAnimal[];
};

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

async function actualizarPublicacion(formData: FormData) {
  "use server";

  const idAnimal = String(formData.get("id_animal") ?? "").trim();

  if (!idAnimal) {
    redirect("/publicaciones?error=publicacion_invalida");
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect(`/auth/login?next=/publicaciones/${idAnimal}/editar`);
  }

  const { data: usuario, error: usuarioError } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (usuarioError || !usuario) {
    redirect(`/publicaciones/${idAnimal}/editar?error=usuario_no_encontrado`);
  }

  const { data: animal, error: animalError } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador, estado")
    .eq("id_animal", idAnimal)
    .single();

  if (animalError || !animal) {
    redirect(`/publicaciones/${idAnimal}/editar?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== usuario.id_usuario) {
    redirect(`/publicaciones/${idAnimal}/editar?error=sin_permisos`);
  }

  if (animal.estado === "adoptado") {
    redirect(
      `/publicaciones/${idAnimal}/editar?error=publicacion_adoptada_bloqueada`,
    );
  }

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

  const castrado = formData.get("castrado") === "on";
  const vacunado = formData.get("vacunado") === "on";
  const desparasitado = formData.get("desparasitado") === "on";
  const aptoNinos = formData.get("apto_ninos") === "on";
  const aptoGatos = formData.get("apto_gatos") === "on";
  const aptoPerros = formData.get("apto_perros") === "on";

  if (!nombre || !especie) {
    redirect(`/publicaciones/${idAnimal}/editar?error=campos_obligatorios`);
  }

  if (!["perro", "gato"].includes(especie)) {
    redirect(`/publicaciones/${idAnimal}/editar?error=especie_invalida`);
  }

  const payload = {
    nombre,
    especie,
    raza: raza || null,
    sexo: sexo || null,
    edad_aproximada: edadAproximada || null,
    tamano: tamano || null,
    descripcion: descripcion || null,
    estado_salud: estadoSalud || null,
    ciudad: ciudad || null,
    nivel_energia: nivelEnergia || null,
    castrado,
    vacunado,
    desparasitado,
    apto_ninos: aptoNinos,
    apto_gatos: aptoGatos,
    apto_perros: aptoPerros,
  };

  const { error: updateError } = await supabase
    .from("animales_adopcion")
    .update(payload)
    .eq("id_animal", idAnimal);

  if (updateError) {
    redirect(
      `/publicaciones/${idAnimal}/editar?error=error_actualizacion_publicacion`,
    );
  }

  redirect(`/publicaciones/${idAnimal}/editar?ok=publicacion_actualizada`);
}

async function marcarFotoPrincipal(formData: FormData) {
  "use server";

  const idAnimal = String(formData.get("id_animal") ?? "").trim();
  const idFoto = String(formData.get("id_foto") ?? "").trim();

  if (!idAnimal || !idFoto) {
    redirect(`/publicaciones/${idAnimal}/editar?error=foto_invalida`);
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect(`/auth/login?next=/publicaciones/${idAnimal}/editar`);
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!usuario) {
    redirect(`/publicaciones/${idAnimal}/editar?error=usuario_no_encontrado`);
  }

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador")
    .eq("id_animal", idAnimal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${idAnimal}/editar?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== usuario.id_usuario) {
    redirect(`/publicaciones/${idAnimal}/editar?error=sin_permisos`);
  }

  const { error: clearError } = await supabase
    .from("fotos_animales")
    .update({ es_principal: false })
    .eq("id_animal", idAnimal);

  if (clearError) {
    redirect(`/publicaciones/${idAnimal}/editar?error=error_foto_principal`);
  }

  const { error: setError } = await supabase
    .from("fotos_animales")
    .update({ es_principal: true })
    .eq("id_foto", idFoto)
    .eq("id_animal", idAnimal);

  if (setError) {
    redirect(`/publicaciones/${idAnimal}/editar?error=error_foto_principal`);
  }

  redirect(`/publicaciones/${idAnimal}/editar?ok=foto_principal_actualizada`);
}

async function eliminarFotoIndividual(formData: FormData) {
  "use server";

  const idAnimal = String(formData.get("id_animal") ?? "").trim();
  const idFoto = String(formData.get("id_foto") ?? "").trim();

  if (!idAnimal || !idFoto) {
    redirect(`/publicaciones/${idAnimal}/editar?error=foto_invalida`);
  }

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect(`/auth/login?next=/publicaciones/${idAnimal}/editar`);
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!usuario) {
    redirect(`/publicaciones/${idAnimal}/editar?error=usuario_no_encontrado`);
  }

  const { data: animal } = await supabase
    .from("animales_adopcion")
    .select("id_animal, id_publicador")
    .eq("id_animal", idAnimal)
    .single();

  if (!animal) {
    redirect(`/publicaciones/${idAnimal}/editar?error=animal_no_encontrado`);
  }

  if (animal.id_publicador !== usuario.id_usuario) {
    redirect(`/publicaciones/${idAnimal}/editar?error=sin_permisos`);
  }

  const { data: foto } = await supabase
    .from("fotos_animales")
    .select("id_foto, storage_path, es_principal")
    .eq("id_foto", idFoto)
    .eq("id_animal", idAnimal)
    .single();

  if (!foto) {
    redirect(`/publicaciones/${idAnimal}/editar?error=foto_no_encontrada`);
  }

  if (foto.storage_path) {
    const { error: removeStorageError } = await supabase.storage
      .from("animales")
      .remove([foto.storage_path]);

    if (removeStorageError) {
      redirect(
        `/publicaciones/${idAnimal}/editar?error=error_eliminacion_storage`,
      );
    }
  }

  const { error: deleteFotoError } = await supabase
    .from("fotos_animales")
    .delete()
    .eq("id_foto", idFoto)
    .eq("id_animal", idAnimal);

  if (deleteFotoError) {
    redirect(`/publicaciones/${idAnimal}/editar?error=error_eliminacion_foto`);
  }

  if (foto.es_principal) {
    const { data: restantes } = await supabase
      .from("fotos_animales")
      .select("id_foto")
      .eq("id_animal", idAnimal)
      .order("orden", { ascending: true })
      .limit(1);

    const siguiente = restantes?.[0];

    if (siguiente) {
      await supabase
        .from("fotos_animales")
        .update({ es_principal: true })
        .eq("id_foto", siguiente.id_foto)
        .eq("id_animal", idAnimal);
    }
  }

  redirect(`/publicaciones/${idAnimal}/editar?ok=foto_eliminada`);
}

function FeedbackBanner({ ok, error }: { ok?: string; error?: string }) {
  if (ok === "publicacion_actualizada") {
    return (
      <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La publicación fue actualizada correctamente.
      </div>
    );
  }

  if (ok === "foto_principal_actualizada") {
    return (
      <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La foto principal fue actualizada.
      </div>
    );
  }

  if (ok === "foto_eliminada") {
    return (
      <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La imagen fue eliminada correctamente.
      </div>
    );
  }

  if (!error) return null;

  const messages: Record<string, string> = {
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    campos_obligatorios: "Completá al menos nombre y especie.",
    especie_invalida: "La especie debe ser perro o gato.",
    publicacion_invalida: "La publicación indicada no es válida.",
    animal_no_encontrado: "No se encontró la publicación seleccionada.",
    sin_permisos: "No tenés permisos para editar esta publicación.",
    error_actualizacion_publicacion:
      "Ocurrió un error al actualizar la publicación.",
    publicacion_adoptada_bloqueada:
      "Una publicación adoptada no puede editarse.",
    foto_invalida: "La imagen indicada no es válida.",
    foto_no_encontrada: "No se encontró la imagen seleccionada.",
    error_foto_principal:
      "Ocurrió un error al actualizar la foto principal.",
    error_eliminacion_storage:
      "Ocurrió un error al eliminar las imágenes del almacenamiento.",
    error_eliminacion_foto:
      "Ocurrió un error al eliminar la imagen seleccionada.",
  };

  return (
    <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
    </div>
  );
}

function EditarPublicacionSkeleton() {
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

async function EditarPublicacionContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;

  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    redirect(`/auth/login?next=/publicaciones/${id}/editar`);
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

  const { data: animal, error: animalError } = await supabase
    .from("animales_adopcion")
    .select(
      `
        id_animal,
        nombre,
        especie,
        raza,
        sexo,
        edad_aproximada,
        tamano,
        descripcion,
        estado_salud,
        ciudad,
        estado,
        fecha_publicacion,
        id_publicador,
        nivel_energia,
        castrado,
        vacunado,
        desparasitado,
        apto_ninos,
        apto_gatos,
        apto_perros,
        fotos_animales (
          id_foto,
          url_foto,
          es_principal,
          orden,
          storage_path
        )
      `,
    )
    .eq("id_animal", id)
    .single();

  if (animalError || !animal) {
    notFound();
  }

  const animalTipado: AnimalPublicacion = {
    ...animal,
    fotos_animales: [...(animal.fotos_animales ?? [])].sort(
      (a, b) => a.orden - b.orden,
    ),
  };

  if (animalTipado.id_publicador !== usuario.id_usuario) {
    redirect("/publicaciones");
  }

  if (animalTipado.estado === "adoptado") {
    redirect(
      `/publicaciones/${animalTipado.id_animal}?error=publicacion_adoptada_bloqueada`,
    );
  }

  return (
    <>
      <FeedbackBanner ok={ok} error={error} />

      <form action={actualizarPublicacion} className="space-y-6">
        <input type="hidden" name="id_animal" value={animalTipado.id_animal} />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-xl font-semibold">Datos principales</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Campo
              label="Nombre"
              name="nombre"
              placeholder="Ej. Mora"
              required
              defaultValue={animalTipado.nombre}
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
                defaultValue={animalTipado.especie}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
            </div>

            <Campo
              label="Raza"
              name="raza"
              placeholder="Ej. mestizo"
              defaultValue={animalTipado.raza ?? ""}
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
                defaultValue={animalTipado.sexo ?? ""}
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
              defaultValue={animalTipado.edad_aproximada ?? ""}
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
                defaultValue={animalTipado.tamano ?? ""}
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
              defaultValue={animalTipado.ciudad ?? ""}
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
                defaultValue={animalTipado.nivel_energia ?? ""}
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
                defaultValue={animalTipado.descripcion ?? ""}
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
                defaultValue={animalTipado.estado_salud ?? ""}
                placeholder="Ej. Buen estado general, controles al día."
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-xl font-semibold">Características</h2>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                name: "castrado",
                label: "Castrado",
                checked: animalTipado.castrado,
              },
              {
                name: "vacunado",
                label: "Vacunado",
                checked: animalTipado.vacunado,
              },
              {
                name: "desparasitado",
                label: "Desparasitado",
                checked: animalTipado.desparasitado,
              },
              {
                name: "apto_ninos",
                label: "Apto niños",
                checked: animalTipado.apto_ninos,
              },
              {
                name: "apto_gatos",
                label: "Apto gatos",
                checked: animalTipado.apto_gatos,
              },
              {
                name: "apto_perros",
                label: "Apto perros",
                checked: animalTipado.apto_perros,
              },
            ].map(({ name, label, checked }) => (
              <label
                key={name}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <input
                  type="checkbox"
                  name={name}
                  defaultChecked={Boolean(checked)}
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
            Guardar cambios
          </button>

          <Link
            href={`/publicaciones/${animalTipado.id_animal}`}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Volver a gestión
          </Link>
        </div>
      </form>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-5">
          <p className="mb-2 text-sm text-white/60">Edición</p>
          <h2 className="text-2xl font-semibold">Imágenes de la publicación</h2>
        </div>

        <AnimalPhotosManager
          animalId={animalTipado.id_animal}
          authUserId={authData.user.id}
          fotos={animalTipado.fotos_animales}
          marcarFotoPrincipalAction={marcarFotoPrincipal}
          eliminarFotoIndividualAction={eliminarFotoIndividual}
        />
      </section>
    </>
  );
}

export default function EditarPublicacionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-white/60">
          <Link href="/publicaciones" className="transition hover:text-white">
            Publicaciones
          </Link>
          <span>/</span>
          <span className="opacity-70">Edición</span>
        </div>

        <header className="mb-8">
          <p className="mb-2 text-sm text-white/60">Publicaciones</p>
          <h1 className="mb-3 text-3xl font-bold">Editar publicación</h1>
          <p className="text-white/70">
            Modificá los datos, la descripción y las imágenes sin mezclar esta
            tarea con la gestión de solicitudes.
          </p>
        </header>

        <Suspense fallback={<EditarPublicacionSkeleton />}>
          <EditarPublicacionContent
            params={params}
            searchParams={searchParams}
          />
        </Suspense>
      </section>
    </main>
  );
}
