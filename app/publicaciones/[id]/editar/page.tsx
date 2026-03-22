import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AnimalPhotosManager from "@/components/publicaciones/animal-photos-manager";

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

async function guardarCambiosPublicacion(formData: FormData) {
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
    redirect(`/publicaciones/${idAnimal}?error=sin_permisos`);
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

  const { error: updateError } = await supabase
    .from("animales_adopcion")
    .update({
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
    })
    .eq("id_animal", idAnimal);

  if (updateError) {
    redirect(`/publicaciones/${idAnimal}/editar?error=error_guardado`);
  }

  redirect(`/publicaciones/${idAnimal}/editar?ok=guardado`);
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
    redirect(`/publicaciones/${idAnimal}?error=sin_permisos`);
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
    redirect(`/publicaciones/${idAnimal}?error=sin_permisos`);
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
      redirect(`/publicaciones/${idAnimal}/editar?error=error_eliminacion_storage`);
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

function FeedbackBanner({
  ok,
  error,
}: {
  ok?: string;
  error?: string;
}) {
  if (ok === "guardado") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        Los cambios de la publicación fueron guardados.
      </div>
    );
  }

  if (ok === "foto_principal_actualizada") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La portada fue actualizada.
      </div>
    );
  }

  if (ok === "foto_eliminada") {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
        La imagen fue eliminada correctamente.
      </div>
    );
  }

  if (!error) return null;

  const messages: Record<string, string> = {
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    animal_no_encontrado: "No se encontró la publicación.",
    campos_obligatorios: "Completá al menos nombre y especie.",
    especie_invalida: "La especie debe ser perro o gato.",
    error_guardado: "Ocurrió un error al guardar los cambios.",
    foto_invalida: "La imagen indicada no es válida.",
    foto_no_encontrada: "No se encontró la imagen seleccionada.",
    error_foto_principal:
      "Ocurrió un error al actualizar la portada.",
    error_eliminacion_storage:
      "Ocurrió un error al eliminar la imagen del almacenamiento.",
    error_eliminacion_foto:
      "Ocurrió un error al eliminar la imagen seleccionada.",
  };

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
    </div>
  );
}

function Campo({
  label,
  name,
  defaultValue,
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm text-white/70">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
      />
    </div>
  );
}

function EditarPublicacionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-[420px] animate-pulse rounded-2xl border border-white/10 bg-white/10" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-xl bg-white/10" />
        ))}
      </div>
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

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", authData.user.id)
    .single();

  if (!usuario) {
    redirect(`/publicaciones/${id}/editar?error=usuario_no_encontrado`);
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

  return (
    <div className="space-y-6">
      <FeedbackBanner ok={ok} error={error} />

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-5 text-xl font-semibold">Imágenes</h2>

        <AnimalPhotosManager
          animalId={animalTipado.id_animal}
          authUserId={authData.user.id}
          fotos={animalTipado.fotos_animales}
          marcarFotoPrincipalAction={marcarFotoPrincipal}
          eliminarFotoIndividualAction={eliminarFotoIndividual}
        />
      </section>

      <form action={guardarCambiosPublicacion} className="space-y-6">
        <input type="hidden" name="id_animal" value={animalTipado.id_animal} />

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-xl font-semibold">Datos principales</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Campo
              label="Nombre"
              name="nombre"
              required
              defaultValue={animalTipado.nombre}
            />

            <div>
              <label htmlFor="especie" className="mb-2 block text-sm text-white/70">
                Especie
              </label>
              <select
                id="especie"
                name="especie"
                defaultValue={animalTipado.especie ?? ""}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
            </div>

            <Campo label="Raza" name="raza" defaultValue={animalTipado.raza} />

            <div>
              <label htmlFor="sexo" className="mb-2 block text-sm text-white/70">
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
              defaultValue={animalTipado.edad_aproximada}
            />

            <div>
              <label htmlFor="tamano" className="mb-2 block text-sm text-white/70">
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

            <Campo label="Ciudad" name="ciudad" defaultValue={animalTipado.ciudad} />

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
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-5 text-xl font-semibold">Características</h2>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              ["castrado", "Castrado", animalTipado.castrado],
              ["vacunado", "Vacunado", animalTipado.vacunado],
              ["desparasitado", "Desparasitado", animalTipado.desparasitado],
              ["apto_ninos", "Apto niños", animalTipado.apto_ninos],
              ["apto_gatos", "Apto gatos", animalTipado.apto_gatos],
              ["apto_perros", "Apto perros", animalTipado.apto_perros],
            ].map(([name, label, checked]) => (
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
    </div>
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
      <section className="mx-auto max-w-6xl px-6 py-10">
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
          <h1 className="mb-3 text-3xl font-bold">Editar publicación</h1>
          <p className="text-white/70">
            Desde acá podés modificar los datos de la publicación y gestionar sus
            imágenes.
          </p>
        </header>

        <Suspense fallback={<EditarPublicacionSkeleton />}>
          <EditarPublicacionContent params={params} searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
