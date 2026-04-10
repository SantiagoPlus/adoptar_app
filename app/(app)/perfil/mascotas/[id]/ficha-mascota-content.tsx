import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PawPrint } from "lucide-react";
import { MascotaFichaTabs } from "./mascota-ficha-tabs";

export async function FichaMascotaContent({ id_mascota }: { id_mascota: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 1. Obtener el id_usuario del perfil
  const { data: usuarioPerfil } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (!usuarioPerfil) {
    redirect("/perfil");
  }

  // 2. Cargar Mascota con nomenclatura id_...
  const { data: rawMascota, error: mascotaError } = await supabase
    .from("mascotas")
    .select("*")
    .eq("id_mascota", id_mascota)
    .single();

  if (mascotaError || !rawMascota) {
    redirect("/perfil");
  }

  // Seguridad: Comparar id_usuario
  if (rawMascota.id_usuario !== usuarioPerfil.id_usuario) {
    redirect("/perfil");
  }

  // 3. Cargar Libreta Sanitaria
  const { data: rawLibreta } = await supabase
    .from("mascotas_libreta_sanitaria")
    .select("*")
    .eq("id_mascota", rawMascota.id_mascota)
    .order("fecha_aplicacion", { ascending: false });

  // 4. Cargar Historial Clínico
  const { data: rawHistorial } = await supabase
    .from("mascotas_historial_clinico")
    .select("*")
    .eq("id_mascota", rawMascota.id_mascota)
    .order("fecha_visita", { ascending: false });

  // Saneamiento de datos para Next.js 16/Turbopack
  const mascota = JSON.parse(JSON.stringify(rawMascota));
  const libreta = JSON.parse(JSON.stringify(rawLibreta || []));
  const historial = JSON.parse(JSON.stringify(rawHistorial || []));

  return (
    <>
      <div className="mb-8 flex items-end gap-6 rounded-3xl border border-white/10 bg-white/[0.02] p-8">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-black/50 md:h-32 md:w-32">
          {mascota.url_foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mascota.url_foto}
              alt={mascota.nombre}
              className="h-full w-full object-cover"
            />
          ) : (
            <PawPrint className="h-10 w-10 text-white/30 md:h-12 md:w-12" />
          )}
        </div>
        <div className="flex-1 pb-2">
          <p className="mb-1 text-xs uppercase tracking-wider text-amber-500/80">
            Ficha Médica
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
            {mascota.nombre}
          </h1>
          <p className="mt-2 text-sm text-white/60 md:text-base capitalize">
            {mascota.especie} • {mascota.raza || "Mestizo"} •{" "}
            {mascota.sexo || "Sexo no especificado"}
          </p>
        </div>
      </div>

      <MascotaFichaTabs
        id_mascota={mascota.id_mascota}
        libreta={libreta}
        historial={historial}
      />
    </>
  );
}
