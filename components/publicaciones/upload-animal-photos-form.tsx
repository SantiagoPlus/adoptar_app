"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UploadAnimalPhotosFormProps = {
  animalId: string;
  authUserId: string;
  existingPhotosCount: number;
};

export default function UploadAnimalPhotosForm({
  animalId,
  authUserId,
  existingPhotosCount,
}: UploadAnimalPhotosFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    setFiles(selectedFiles);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    if (files.length === 0) {
      setError("Seleccioná al menos una imagen.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rows = [];

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${Date.now()}-${index}.${extension}`;
        const filePath = `${authUserId}/${animalId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("animales")
          .upload(filePath, file, {
            upsert: false,
            contentType: file.type || undefined,
          });

        if (uploadError) {
          throw new Error(uploadError.message || "No se pudo subir la imagen.");
        }

        const { data: publicUrlData } = supabase.storage
          .from("animales")
          .getPublicUrl(filePath);

        rows.push({
          id_animal: animalId,
          url_foto: publicUrlData.publicUrl,
          storage_path: filePath,
          es_principal: existingPhotosCount === 0 && index === 0,
          orden: existingPhotosCount + index + 1,
        });
      }

      const { error: insertError } = await supabase
        .from("fotos_animales")
        .insert(rows);

      if (insertError) {
        throw new Error(
          insertError.message || "No se pudo registrar la imagen.",
        );
      }

      setFiles([]);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo cargar la imagen.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label
          htmlFor="animal_photos"
          className="mb-2 block text-sm text-white/70"
        >
          {existingPhotosCount === 0
            ? "Subir imagen"
            : "Agregar / cambiar imágenes"}
        </label>

        <input
          id="animal_photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
          disabled={loading}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        />
      </div>

      {files.length > 0 ? (
        <p className="text-sm text-white/60">
          {files.length} archivo(s) seleccionado(s)
        </p>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Cargando..."
          : existingPhotosCount === 0
            ? "Subir imagen"
            : "Agregar imágenes"}
      </button>
    </form>
  );
}
