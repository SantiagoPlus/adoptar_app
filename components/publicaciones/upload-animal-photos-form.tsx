"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type UploadAnimalPhotosFormProps = {
  animalId: string;
  authUserId: string;
  existingPhotosCount: number;
};

async function compressImage(file: File): Promise<File> {
  const imageBitmap = await createImageBitmap(file);

  const maxWidth = 1600;
  const maxHeight = 1600;

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
        if (result) resolve(result);
        else reject(new Error("No se pudo comprimir la imagen."));
      },
      "image/jpeg",
      0.8,
    );
  });

  const originalName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${originalName}.jpg`, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

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
        const originalFile = files[index];
        const file = await compressImage(originalFile);

        const fileName = `${Date.now()}-${index}.jpg`;
        const filePath = `${authUserId}/${animalId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("animales")
          .upload(filePath, file, {
            upsert: false,
            contentType: "image/jpeg",
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
          Seleccioná una o varias imágenes
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
        {loading ? "Subiendo..." : "Subir archivos"}
      </button>
    </form>
  );
}
