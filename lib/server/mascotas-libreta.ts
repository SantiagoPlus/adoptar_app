import "server-only";

import type { LibretaItem } from "@/app/(app)/mascotas/[id]/types";
import { getMascotaOwnerContext } from "@/lib/server/mascotas";
import {
  mapFeedRowToLibretaItem,
  type LibretaFeedRow,
} from "@/lib/server/mascotas-libreta-feed";

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
    .from("vw_mascotas_libreta_feed")
    .select("*")
    .eq("id_mascota", idMascota)
    .order("fecha_aplicacion", { ascending: false });

  if (error) {
    throw new Error("No se pudo cargar la libreta sanitaria.");
  }

  const libreta = (data ?? []).map((row) =>
    mapFeedRowToLibretaItem(row as LibretaFeedRow),
  );

  return JSON.parse(JSON.stringify(libreta)) as LibretaItem[];
}
