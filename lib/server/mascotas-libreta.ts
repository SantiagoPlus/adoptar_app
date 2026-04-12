import "server-only";

import type { LibretaItem } from "@/app/(app)/mascotas/[id]/types";
import { getMascotaOwnerContext } from "@/lib/server/mascotas";

export async function getMascotaLibreta(idMascota: string): Promise<LibretaItem[]> {
  const { supabase } = await getMascotaOwnerContext(idMascota, {
    loginNext: `/mascotas/${idMascota}/libreta`,
    redirects: {
      profileMissing: "/perfil",
      notFound: "/perfil",
      forbidden: "/perfil",
    },
  });

  const { data, error } = await supabase
    .from("mascotas_libreta_sanitaria")
    .select("*")
    .eq("id_mascota", idMascota)
    .order("fecha_aplicacion", { ascending: false });

  if (error) {
    throw new Error("No se pudo cargar la libreta sanitaria.");
  }

  return JSON.parse(JSON.stringify(data ?? [])) as LibretaItem[];
}
