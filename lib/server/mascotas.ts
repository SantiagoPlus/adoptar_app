import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUsuario } from "@/lib/server/auth";
import type {
  HistorialItem,
  LibretaItem,
} from "@/app/(app)/mascotas/[id]/types";

export type MascotaModuleShell = {
  id_mascota: string;
  id_usuario: string;
  nombre: string;
  especie: string | null;
  raza: string | null;
  sexo: string | null;
  url_foto: string | null;
};

export type MascotaModuleData = {
  mascota: MascotaModuleShell;
  libreta: LibretaItem[];
  historial: HistorialItem[];
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

export async function getMascotaModuleData(
  idMascota: string,
): Promise<MascotaModuleData> {
  const { supabase, mascota } = await getMascotaOwnerContext(idMascota, {
    loginNext: `/mascotas/${idMascota}`,
    redirects: {
      profileMissing: "/perfil",
      notFound: "/perfil",
      forbidden: "/perfil",
    },
  });

  const [
    { data: libreta, error: libretaError },
    { data: historial, error: historialError },
  ] = await Promise.all([
    supabase
      .from("mascotas_libreta_sanitaria")
      .select("*")
      .eq("id_mascota", idMascota)
      .order("fecha_aplicacion", { ascending: false }),
    supabase
      .from("mascotas_historial_clinico")
      .select("*")
      .eq("id_mascota", idMascota)
      .order("fecha_visita", { ascending: false }),
  ]);

  if (libretaError) {
    throw new Error("No se pudo cargar la libreta sanitaria.");
  }

  if (historialError) {
    throw new Error("No se pudo cargar el historial clínico.");
  }

  return JSON.parse(
    JSON.stringify({
      mascota,
      libreta: libreta ?? [],
      historial: historial ?? [],
    }),
  ) as MascotaModuleData;
}
