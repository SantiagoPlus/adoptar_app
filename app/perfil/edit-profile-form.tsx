"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type EditProfileFormProps = {
  initialData: {
    nombre?: string | null;
    apellido?: string | null;
    direccion?: string | null;
    ciudad?: string | null;
    foto_perfil?: string | null;
  };
  authUserId: string;
};

export function EditProfileForm({
  initialData,
  authUserId,
}: EditProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(initialData.nombre ?? "");
  const [apellido, setApellido] = useState(initialData.apellido ?? "");
  const [direccion, setDireccion] = useState(initialData.direccion ?? "");
  const [ciudad, setCiudad] = useState(initialData.ciudad ?? "");
  const [fotoPerfil, setFotoPerfil] = useState(initialData.foto_perfil ?? "");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    const fotoPerfilLimpia = fotoPerfil.trim();

    if (!nombreLimpio || !apellidoLimpio || !direccionLimpia) {
      setError("Nombre, apellido y dirección son obligatorios.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("usuarios")
      .update({
        nombre: nombreLimpio,
        apellido: apellidoLimpio,
        direccion: direccionLimpia,
        ciudad: ciudadLimpia || null,
        foto_perfil: fotoPerfilLimpia || null,
        updated_at: new Date().toISOString(),
      })
      .eq("auth_user_id", authUserId);

    if (updateError) {
      setError(updateError.message || "No se pudo guardar el perfil.");
      setLoading(false);
      return;
    }

    setMessage("Perfil actualizado correctamente.");
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  const inputClassName =
    "w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-white/50">
            Edición
          </p>
          <h3 className="text-lg font-semibold text-white">Editar perfil</h3>
          <p className="mt-1 text-sm text-white/70">
            Podés actualizar tus datos personales desde acá.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setOpen((prev) => !prev);
            setMessage(null);
            setError(null);
          }}
          className="rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/15"
        >
          {open ? "Cancelar" : "Editar perfil"}
        </button>
      </div>

      {message ? (
        <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {message}
        </div>
      ) : null}

      {open ? (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
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
          </div>

          <div>
            <label htmlFor="foto_perfil" className="mb-2 block text-sm text-white/70">
              URL foto de perfil
            </label>
            <input
              id="foto_perfil"
              type="text"
              value={fotoPerfil}
              onChange={(event) => setFotoPerfil(event.target.value)}
              className={inputClassName}
              placeholder="https://..."
              disabled={loading}
            />
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
      ) : null}
    </div>
  );
}
