import "server-only";

import type { LibretaItem } from "@/app/(app)/mascotas/[id]/types";
import { getMascotaOwnerContext } from "@/lib/server/mascotas";

type LibretaFeedRow = {
  id_evento: string;
  id_mascota: string;
  dominio: string;
  tipo_evento: string;
  subtipo_evento: string | null;
  categoria_ui: string | null;
  titulo: string;
  descripcion: string | null;
  fecha_aplicacion: string;
  fecha_proximo_evento: string | null;
  estado_validacion: string;
  created_by_role: string | null;
  created_by_user_id: string | null;
  id_proveedor: string | null;
  profesional_nombre: string | null;
  profesional_matricula: string | null;
  profesional_documento: string | null;
  institucion: string | null;
  observaciones: string | null;
  created_at: string | null;
  updated_at: string | null;
  producto_nombre: string | null;
  fabricante: string | null;
  lote: string | null;
  via_aplicacion: string | null;
  dosis: string | null;
  producto_lote: string | null;
  enfermedad_objetivo: string | null;
  esquema_refuerzo: string | null;
  desparasitacion_alcance: string | null;
  principio_activo: string | null;
  frecuencia_dias: number | null;
  tipo_control: string | null;
  control_motivo: string | null;
  hallazgos_resumen: string | null;
  indicaciones: string | null;
  cantidad_adjuntos: number | null;
  tiene_adjuntos: boolean | null;
};

function mapFeedRowToLibretaItem(row: LibretaFeedRow): LibretaItem {
  return {
    id_registro: row.id_evento,
    tipo: row.tipo_evento,
    descripcion: row.descripcion ?? row.titulo,
    fecha_aplicacion: row.fecha_aplicacion,
    fecha_vencimiento: null,
    producto_lote: row.producto_lote,
    observaciones: row.observaciones,
    titulo: row.titulo,
    categoria: row.categoria_ui,
    producto_nombre: row.producto_nombre,
    fabricante: row.fabricante,
    lote: row.lote,
    profesional_nombre: row.profesional_nombre,
    profesional_matricula: row.profesional_matricula,
    profesional_documento: row.profesional_documento,
    institucion: row.institucion,
    estado_validacion: row.estado_validacion,
    fecha_proximo_evento: row.fecha_proximo_evento,

    dominio: row.dominio,
    subtipo_evento: row.subtipo_evento,
    via_aplicacion: row.via_aplicacion,
    dosis: row.dosis,
    created_by_role: row.created_by_role,
    created_by_user_id: row.created_by_user_id,
    id_proveedor: row.id_proveedor,
    created_at: row.created_at,
    updated_at: row.updated_at,
    enfermedad_objetivo: row.enfermedad_objetivo,
    esquema_refuerzo: row.esquema_refuerzo,
    desparasitacion_alcance: row.desparasitacion_alcance,
    principio_activo: row.principio_activo,
    frecuencia_dias: row.frecuencia_dias,
    tipo_control: row.tipo_control,
    control_motivo: row.control_motivo,
    hallazgos_resumen: row.hallazgos_resumen,
    indicaciones: row.indicaciones,
    cantidad_adjuntos: row.cantidad_adjuntos ?? 0,
    tiene_adjuntos: row.tiene_adjuntos ?? false,
  };
}

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
