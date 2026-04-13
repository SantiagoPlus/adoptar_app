import "server-only";

import type { LibretaItem } from "@/app/(app)/mascotas/[id]/types";

export type LibretaFeedRow = {
  id_evento: string;
  id_mascota: string;
  tipo_evento: string;
  categoria_ui: string | null;
  titulo: string;
  descripcion: string | null;
  fecha_aplicacion: string;
  fecha_proximo_evento: string | null;
  estado_validacion: string;

  profesional_nombre: string | null;
  profesional_matricula: string | null;
  institucion: string | null;
  observaciones: string | null;

  producto_nombre: string | null;
  fabricante: string | null;
  lote: string | null;
  via_aplicacion: string | null;

  id_servicio: string | null;

  // compatibilidad visual mínima
  esquema_refuerzo: string | null;

  // modelo nuevo
  vacuna_aplicacion_unica: boolean | null;
  esquema_refuerzo_dias: number | null;

  desparasitacion_alcance: string | null;
  principio_activo: string | null;
  forma_administracion: string | null;
  desparasitacion_aplicacion_unica: boolean | null;
  cantidad_dias: number | null;
  frecuencia_horas: number | null;

  hallazgos_resumen: string | null;
  cantidad_adjuntos: number | null;
  tiene_adjuntos: boolean | null;
};

export function mapFeedRowToLibretaItem(row: LibretaFeedRow): LibretaItem {
  return {
    id_registro: row.id_evento,
    tipo: row.tipo_evento,
    categoria: row.categoria_ui,
    titulo: row.titulo,
    descripcion: row.descripcion ?? row.titulo,
    fecha_aplicacion: row.fecha_aplicacion,
    fecha_proximo_evento: row.fecha_proximo_evento,

    producto_nombre: row.producto_nombre,
    fabricante: row.fabricante,
    lote: row.lote,
    via_aplicacion: row.via_aplicacion,

    profesional_nombre: row.profesional_nombre,
    profesional_matricula: row.profesional_matricula,
    institucion: row.institucion,
    observaciones: row.observaciones,
    estado_validacion: row.estado_validacion,

    id_servicio: row.id_servicio,

    esquema_refuerzo: row.esquema_refuerzo,

    vacuna_aplicacion_unica: row.vacuna_aplicacion_unica,
    esquema_refuerzo_dias: row.esquema_refuerzo_dias,

    desparasitacion_alcance: row.desparasitacion_alcance,
    principio_activo: row.principio_activo,
    forma_administracion: row.forma_administracion,
    desparasitacion_aplicacion_unica: row.desparasitacion_aplicacion_unica,
    cantidad_dias: row.cantidad_dias,
    frecuencia_horas: row.frecuencia_horas,

    hallazgos_resumen: row.hallazgos_resumen,
    cantidad_adjuntos: row.cantidad_adjuntos ?? 0,
    tiene_adjuntos: row.tiene_adjuntos ?? false,
  };
}
