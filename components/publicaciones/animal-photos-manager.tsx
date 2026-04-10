"use client";

import { useState } from "react";
import UploadAnimalPhotosForm from "@/components/publicaciones/upload-animal-photos-form";

type FotoAnimal = {
  id_foto: string;
  url_foto: string;
  es_principal: boolean;
  orden: number;
};

type Props = {
  animalId: string;
  authUserId: string;
  fotos: FotoAnimal[];
  marcarFotoPrincipalAction: (formData: FormData) => void;
  eliminarFotoIndividualAction: (formData: FormData) => void;
};

type Mode = "none" | "cover" | "delete";

export default function AnimalPhotosManager({
  animalId,
  authUserId,
  fotos,
  marcarFotoPrincipalAction,
  eliminarFotoIndividualAction,
}: Props) {
  const [mode, setMode] = useState<Mode>("none");

  const fotoPrincipal = fotos.find((foto) => foto.es_principal) ?? fotos[0];

  function getCardStyle(foto: FotoAnimal) {
    if (foto.es_principal) {
      return "border-green-500/40 ring-1 ring-green-500/30";
    }

    if (mode === "cover") {
      return "border-white/30 hover:border-white/60";
    }

    if (mode === "delete") {
      return "border-red-500/30 hover:border-red-500/60";
    }

    return "border-white/10";
  }

  return (
    <div className="space-y-4">
      {fotoPrincipal ? (
        <img
          src={fotoPrincipal.url_foto}
          alt="Imagen principal"
          className="h-[420px] w-full rounded-2xl border border-white/10 object-cover"
        />
      ) : (
        <div className="flex h-[320px] w-full items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/10 text-white/50">
          Sin imagen principal
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setMode("none")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === "none"
                ? "bg-white text-black"
                : "border border-white/10 bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            Agregar imágenes
          </button>

          <button
            type="button"
            onClick={() =>
              setMode((prev) => (prev === "cover" ? "none" : "cover"))
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === "cover"
                ? "bg-white text-black"
                : "border border-white/10 bg-white/10 text-white hover:bg-white/15"
            }`}
          >
            Cambiar portada
          </button>

          <button
            type="button"
            onClick={() =>
              setMode((prev) => (prev === "delete" ? "none" : "delete"))
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              mode === "delete"
                ? "bg-red-500/90 text-white"
                : "border border-red-500/30 bg-red-500/10 text-red-200 hover:bg-red-500/20"
            }`}
          >
            Eliminar imagen
          </button>
        </div>

        {mode === "none" && (
          <UploadAnimalPhotosForm
            animalId={animalId}
            authUserId={authUserId}
            existingPhotosCount={fotos.length}
          />
        )}

        {mode === "cover" && (
          <p className="text-sm text-white/60">
            Seleccioná una miniatura para convertirla en portada.
          </p>
        )}

        {mode === "delete" && (
          <p className="text-sm text-white/60">
            Seleccioná una miniatura para eliminarla.
          </p>
        )}
      </div>

      {fotos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {fotos.map((foto) => (
            <div
              key={foto.id_foto}
              className={`rounded-xl border bg-white/5 p-2 transition ${getCardStyle(foto)}`}
            >
              <img
                src={foto.url_foto}
                alt="Foto del animal"
                className="mb-2 h-28 w-full rounded-lg object-cover"
              />

              {mode === "cover" ? (
                foto.es_principal ? (
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-center text-xs text-green-200">
                    Ya es portada
                  </div>
                ) : (
                  <form action={marcarFotoPrincipalAction}>
                    <input type="hidden" name="id_animal" value={animalId} />
                    <input type="hidden" name="id_foto" value={foto.id_foto} />
                    <button
                      type="submit"
                      className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/15"
                    >
                      Usar como portada
                    </button>
                  </form>
                )
              ) : mode === "delete" ? (
                <form action={eliminarFotoIndividualAction}>
                  <input type="hidden" name="id_animal" value={animalId} />
                  <input type="hidden" name="id_foto" value={foto.id_foto} />
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200 transition hover:bg-red-500/20"
                  >
                    Eliminar esta imagen
                  </button>
                </form>
              ) : foto.es_principal ? (
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-center text-xs text-green-200">
                  Foto principal
                </div>
              ) : (
                <div className="rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-center text-xs text-white/60">
                  Imagen secundaria
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
