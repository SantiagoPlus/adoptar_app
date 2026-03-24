"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type EditProfileFormProps = {
  initialData: {
    nombre?: string | null;
    apellido?: string | null;
    email?: string | null;
    direccion?: string | null;
    ciudad?: string | null;
    foto_perfil?: string | null;
  };
  authUserId: string;
};

function ProfileField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  const displayValue = value && value.trim() !== "" ? value : "Sin completar";

  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
        {label}
      </p>
      <p className="text-sm text-white/80">{displayValue}</p>
    </div>
  );
}

async function compressImage(file: File): Promise<File> {
  const imageBitmap = await createImageBitmap(file);

  const maxWidth = 1200;
  const maxHeight = 1200;

  let { width, height } = imageBitmap;

  const scale = Math.min(maxWidth / width, maxHeight / height, 1);
  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    return file;
  }

  context.drawImage(imageBitmap, 0, 0, width, height);

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
          return;
        }

        reject(new Error("No se pudo comprimir la imagen."));
      },
      "image/jpeg",
      0.82,
    );
  });

  const originalName = file.name.replace(/\.[^.]+$/, "");

  return new File([blob], `${originalName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

function extractStoragePathFromPublicUrl(url: string, bucketName: string) {
  try {
    const parsed = new URL(url);
    const marker = `/storage/v1/object/public/${bucketName}/`;
    const index = parsed.pathname.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(parsed.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

export function EditProfileForm({
  initialData,
  authUserId,
}: EditProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [editing, setEditing] = useState(false);

  const [nombre, setNombre] = useState(initialData.nombre ?? "");
  const [apellido, setApellido] = useState(initialData.apellido ?? "");
  const [direccion, setDireccion] = useState(initialData.direccion ?? "");
  const [ciudad, setCiudad] = useState(initialData.ciudad ?? "");
  const [fotoPerfil, setFotoPerfil] = useState(initialData.foto_perfil ?? "");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  async function subirFotoPerfil() {
    if (!selectedFile) return fotoPerfil || null;

    const compressedFile = await compressImage(selectedFile);

    const timestamp = Date.now();
    const fileName = `perfil-${timestamp}.jpg`;
    const filePath = `${authUserId}/${fileName}`;

    const previousPath =
      fotoPerfil && fotoPerfil.trim() !== ""
        ? extractStoragePathFromPublicUrl(fotoPerfil, "avatars")
        : null;

    if (previousPath) {
      await supabase.storage.from("avatars").remove([previousPath]);
    }

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, compressedFile, {
        upsert: false,
        contentType: "image/jpeg",
      });

    if (uploadError) {
      throw new Error(uploadError.message || "No se pudo subir la foto.");
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const direccionLimpia = direccion.trim();
    const ciudadLimpia = ciudad.trim();

    if (!nombreLimpio || !apellidoLimpio || !direccionLimpia) {
      setError("Nombre, apellido y dirección son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const fotoSubida = await subirFotoPerfil();

      const { error: updateError } = await supabase
        .from("usuarios")
        .update({
          nombre: nombreLimpio,
          apellido: apellidoLimpio,
          direccion: direccionLimpia,
          ciudad: ciudadLimpia || null,
          foto_perfil: fotoSubida || null,
          updated_at: new Date().toISOString(),
        })
        .eq("auth_user_id", authUserId);

      if (updateError) {
        throw new Error(updateError.message || "No se pudo guardar el perfil.");
      }

      setFotoPerfil(fotoSubida || "");
      setSelectedFile(null);
      setMessage("Perfil actualizado correctamente.");
      setEditing(false);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar el perfil.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setEditing(false);
    setError(null);
    setMessage(null);
    setSelectedFile(null);
    setNombre(initialData.nombre ?? "");
    setApellido(initialData.apellido ?? "");
    setDireccion(initialData.direccion ?? "");
    setCiudad(initialData.ciudad ?? "");
    setFotoPerfil(initialData.foto_perfil ?? "");
  }

  const inputClassName =
    "w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
            Datos guardados
          </p>
          <h3 className="text-lg font-semibold text-white">
            {editing ? "Editar perfil" : "Datos personales"}
          </h3>
          <p className="mt-1 text-sm text-white/70">
            {editing
              ? "Modificá tu información directamente desde este bloque."
              : "Podés revisar tu información y editarla desde acá."}
          </p>
        </div>

        {editing ? (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
          >
            Cancelar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setMessage(null);
              setError(null);
            }}
            className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
          >
            Editar perfil
          </button>
        )}
      </div>

      {message ? (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      {!editing ? (
        <div className="grid gap-3 md:grid-cols-2">
          <ProfileField label="Nombre" value={initialData.nombre} />
          <ProfileField label="Apellido" value={initialData.apellido} />
          <ProfileField label="Correo" value={initialData.email} />
          <ProfileField label="Dirección" value={initialData.direccion} />
          <ProfileField label="Ciudad" value={initialData.ciudad} />
          <ProfileField
            label="Foto de perfil"
            value={initialData.foto_perfil ? "Cargada" : "Sin completar"}
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="nombre" className="mb-2 block text-sm text-white/70">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                className={inputClassName}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="apellido" className="mb-2 block text-sm text-white/70">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={(event) => setApellido(event.target.value)}
                className={inputClassName}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="correo" className="mb-2 block text-sm text-white/70">
                Correo
              </label>
              <input
                id="correo"
                type="text"
                value={initialData.email ?? ""}
                className={`${inputClassName} text-white/60`}
                disabled
              />
            </div>

            <div>
              <label htmlFor="direccion" className="mb-2 block text-sm text-white/70">
                Dirección
              </label>
              <input
                id="direccion"
                type="text"
                value={direccion}
                onChange={(event) => setDireccion(event.target.value)}
                className={inputClassName}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="ciudad" className="mb-2 block text-sm text-white/70">
                Ciudad
              </label>
              <input
                id="ciudad"
                type="text"
                value={ciudad}
                onChange={(event) => setCiudad(event.target.value)}
                className={inputClassName}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="foto_perfil" className="mb-2 block text-sm text-white/70">
                Foto de perfil
              </label>
              <input
                id="foto_perfil"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={inputClassName}
                disabled={loading}
              />
              {selectedFile ? (
                <p className="mt-2 text-sm text-white/60">
                  Archivo seleccionado: {selectedFile.name}
                </p>
              ) : fotoPerfil ? (
                <p className="mt-2 text-sm text-white/60">
                  Ya tenés una foto cargada.
                </p>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white px-4 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      )}
    </div>
  );
}
