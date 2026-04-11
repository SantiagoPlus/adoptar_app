import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PawPrint } from "lucide-react";
import { MascotaFichaTabs } from "./mascota-ficha-tabs";

export async function FichaMascotaContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: id_mascota } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: usuarioPerfil } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (!usuarioPerfil) {
    redirect("/perfil");
  }

  const { data: rawMascota, error: mascotaError } = await supabase
    .from("mascotas")
    .select("*")
    .eq("id_mascota", id_mascota)
    .single();

  if (mascotaError || !rawMascota) {
    redirect("/perfil");
  }

  if (rawMascota.id_usuario !== usuarioPerfil.id_usuario) {
    redirect("/perfil");
  }

  const { data: rawLibreta } = await supabase
    .from("mascotas_libreta_sanitaria")
    .select("*")
    .eq("id_mascota", rawMascota.id_mascota)
    .order("fecha_aplicacion", { ascending: false });

  const { data: rawHistorial } = await supabase
    .from("mascotas_historial_clinico")
    .select("*")
    .eq("id_mascota", rawMascota.id_mascota)
    .order("fecha_visita", { ascending: false });

  const mascota = JSON.parse(JSON.stringify(rawMascota));
  const libreta = JSON.parse(JSON.stringify(rawLibreta || []));
  const historial = JSON.parse(JSON.stringify(rawHistorial || []));

  return (
    <>
      <div className="mb-5 rounded-[28px] border border-white/10 bg-white/[0.02] p-5 md:p-7">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-black/50 md:h-28 md:w-28">
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

          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-amber-500/90">
              Ficha médica
            </p>

            <h1 className="truncate text-4xl font-bold tracking-tight md:text-5xl">
              {mascota.nombre}
            </h1>

            <p className="mt-2 text-sm text-white/65 md:text-base capitalize">
              {mascota.especie} • {mascota.raza || "Mestizo"} •{" "}
              {mascota.sexo || "No especificado"}
            </p>
          </div>
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
