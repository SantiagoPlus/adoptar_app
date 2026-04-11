import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PawPrint, QrCode } from "lucide-react";
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
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/50 md:h-28 md:w-28">
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

      <div className="group relative mb-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-amber-500/30 hover:bg-white/[0.05]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/[0.02] via-transparent to-transparent opacity-70" />

        <div className="relative flex items-center justify-between gap-4 px-4 py-3 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-500/15 bg-amber-500/10 text-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.10)]">
              <QrCode className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-white">
                Configurar Acceso QR y Servicios
              </p>
              <p className="truncate text-sm text-white/55">
                Vinculación con veterinarios, paseadores y pagos profesionales.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
              Próximamente
            </span>
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
