"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function NuevaMascotaForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre") as string;
    const especie = formData.get("especie") as string;
    const raza = formData.get("raza") as string;
    const sexo = formData.get("sexo") as string;
    const fechaNacimiento = formData.get("fecha_nacimiento") as string;

    try {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión para registrar una mascota.");

      // 1. Obtener id_usuario ligado al auth.uid()
      const { data: usuarioPerfil, error: userError } = await supabase
        .from("usuarios")
        .select("id_usuario")
        .eq("auth_user_id", user.id)
        .single();

      if (userError || !usuarioPerfil) {
        throw new Error("No se pudo encontrar tu perfil de usuario legado.");
      }

      // 2. Insertar con nomenclatura legacy
      const { data, error: insertError } = await supabase
        .from("mascotas")
        .insert({
          id_usuario: usuarioPerfil.id_usuario,
          nombre,
          especie,
          raza,
          sexo,
          fecha_nacimiento: fechaNacimiento || null,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error de inserción:", insertError);
        throw new Error(insertError.message || "Error al Guardar en Base de Datos");
      }

      // Navegar a la ficha con el id_mascota
      if (data?.id_mascota) {
        router.push(`/perfil/mascotas/${data.id_mascota}?success=true`);
        router.refresh();
      } else {
        setLoading(false);
        router.push("/perfil");
      }
      
    } catch (err: any) {
      console.error("Error capturado:", err);
      setError(err.message || "Ocurrió un error al registrar la mascota.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Nombre de tu mascota *
          </label>
          <input
            type="text"
            name="nombre"
            required
            placeholder="Ej: Firulais"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Especie *
          </label>
          <select
            name="especie"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            <option value="" disabled selected className="bg-black text-white">Selecciona una especie</option>
            <option value="perro" className="bg-zinc-800">Perro</option>
            <option value="gato" className="bg-zinc-800">Gato</option>
            <option value="otro" className="bg-zinc-800">Otro</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Raza
          </label>
          <input
            type="text"
            name="raza"
            placeholder="Ej: Mestizo, Labrador..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Sexo *
          </label>
          <select
            name="sexo"
            required
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          >
            <option value="" disabled selected className="bg-black text-white">Selecciona el sexo</option>
            <option value="macho" className="bg-zinc-800">Macho</option>
            <option value="hembra" className="bg-zinc-800">Hembra</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/80">
            Fecha de Nacimiento (Aprox.)
          </label>
          <input
            type="date"
            name="fecha_nacimiento"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200 animate-in fade-in slide-in-from-top-1">
          <p className="font-semibold mb-1">No se pudo guardar:</p>
          <p>{error}</p>
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-medium text-black transition hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></span>
              Guardando...
            </>
          ) : "Crear Perfil Mascota"}
        </button>
      </div>
    </form>
  );
}
