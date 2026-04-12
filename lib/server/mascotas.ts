import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUsuario } from "@/lib/server/auth";

export type MascotaModuleShell = {
  id_mascota: string;
  id_usuario: string;
  nombre: string;
  especie: string | null;
  raza: string | null;
  sexo: string | null;
  url_foto: string | null;
};

type MascotaOwnerContextOptions = {
  loginNext?: string;
  redirects?: {
    profileMissing?: string;
    notFound?: string;
    forbidden?: string;
  };
};

export async function getMascotaOwnerContext(
  idMascota: string,
  options: MascotaOwnerContextOptions = {},
) {
  const redirects = {
    profileMissing: "/perfil",
    notFound: "/perfil",
    forbidden: "/perfil",
    ...options.redirects,
  };

  const { supabase, authUser, usuario } = await getCurrentUsuario({
    loginNext: options.loginNext ?? `/mascotas/${idMascota}`,
    notFoundRedirect: redirects.profileMissing,
  });

  const { data: mascota, error } = await supabase
    .from("mascotas")
    .select("id_mascota, id_usuario, nombre, especie, raza, sexo, url_foto")
    .eq("id_mascota", idMascota)
    .single();

  if (error || !mascota) {
    redirect(redirects.notFound);
  }

  if (mascota.id_usuario !== usuario.id_usuario) {
    redirect(redirects.forbidden);
  }

  return {
    supabase,
    authUser,
    usuario,
    mascota: mascota as MascotaModuleShell,
  };
}

export async function getMascotaModuleShell(idMascota: string) {
  const { mascota } = await getMascotaOwnerContext(idMascota, {
    loginNext: `/mascotas/${idMascota}`,
    redirects: {
      profileMissing: "/perfil",
      notFound: "/perfil",
      forbidden: "/perfil",
    },
  });

  return mascota;
}
