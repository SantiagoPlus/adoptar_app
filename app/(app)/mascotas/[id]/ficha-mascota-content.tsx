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
      <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/50 md:h-24 md:w-24">
            {mascota.url_foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mascota.url_foto}
                alt={mascota.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <PawPrint className="h-8 w-8 text-white/30 md:h-10 md:w-10" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="mb-1 text-[11px] uppercase tracking-wider text-amber-500/80">
              Ficha médica
            </p>

            <h1 className="truncate text-3xl font-bold tracking-tight md:text-4xl">
              {mascota.nombre}
            </h1>

            <p className="mt-1 text-sm text-white/60 md:text-base capitalize">
              {mascota.especie} • {mascota.raza || "Mestizo"} •{" "}
              {mascota.sexo || "Sexo no especificado"}
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
