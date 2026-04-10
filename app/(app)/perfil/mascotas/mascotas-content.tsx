import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PawPrint, Calendar, Plus } from "lucide-react";

export async function MascotasContent() {
  const supabase = await createClient();

  // 1. Obtener usuario actual (auth)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 2. Obtener el id_usuario del perfil (legacy link)
  const { data: usuarioPerfil } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (!usuarioPerfil) {
    return <div className="text-white/50">Error: No se encontró el perfil de usuario.</div>;
  }

  // 3. Traer mascotas usando la nueva nomenclatura id_...
  const { data: rawMascotas, error } = await supabase
    .from("mascotas")
    .select("*")
    .eq("id_usuario", usuarioPerfil.id_usuario)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al cargar mascotas:", error);
  }

  // Saneamiento de datos para Next.js 16/Turbopack
  const list = JSON.parse(JSON.stringify(rawMascotas || []));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Tarjeta de Agregar Nueva */}
      <Link
        href="/perfil/mascotas/nueva"
        className="group flex min-h-[160px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-5 transition hover:border-amber-500/50 hover:bg-white/[0.08]"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 transition group-hover:bg-amber-500/20">
          <Plus className="h-6 w-6 text-white/40 group-hover:text-amber-500" />
        </div>
        <p className="text-sm font-medium text-white/60 group-hover:text-white">
          Agregar Mascota
        </p>
      </Link>

      {/* Lista de Mascotas */}
      {list.map((mascota: any) => (
        <Link
          key={mascota.id_mascota}
          href={`/perfil/mascotas/${mascota.id_mascota}`}
          className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
        >
          <div className="mb-4 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/50">
              {mascota.url_foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={mascota.url_foto} 
                  alt={mascota.nombre} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <PawPrint className="h-6 w-6 text-white/40" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white transition group-hover:text-amber-500">
                {mascota.nombre}
              </h3>
              <p className="text-sm text-white/60 capitalize">
                {mascota.especie} • {mascota.raza || "Mestizo"}
              </p>
            </div>
          </div>
          
          <div className="mt-auto border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-white/60 group-hover:text-white/80">
                <Calendar className="h-4 w-4" />
                Ver Ficha
              </span>
              <span className="text-white/40 transition group-hover:text-white/80">
                →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
