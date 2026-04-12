import "server-only";

import type { HistorialItem } from "@/app/(app)/mascotas/[id]/types";
import { getMascotaOwnerContext } from "@/lib/server/mascotas";

export async function getMascotaHistorial(
  idMascota: string,
): Promise<HistorialItem[]> {
  const { supabase } = await getMascotaOwnerContext(idMascota, {
    loginNext: `/mascotas/${idMascota}/historial`,
    redirects: {
      profileMissing: "/perfil",
      notFound: "/perfil",
      forbidden: "/perfil",
    },
  });

  const { data, error } = await supabase
    .from("mascotas_historial_clinico")
    .select("*")
    .eq("id_mascota", idMascota)
    .order("fecha_visita", { ascending: false });

  if (error) {
    throw new Error("No se pudo cargar el historial clínico.");
  }

  return JSON.parse(JSON.stringify(data ?? [])) as HistorialItem[];
}
