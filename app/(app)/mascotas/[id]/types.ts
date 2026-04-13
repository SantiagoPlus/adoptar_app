export type LibretaItem = {
  id_registro: string;
  tipo: string;
  descripcion: string;
  fecha_aplicacion: string;
  observaciones: string | null;
  titulo: string | null;
  categoria: string | null;
  producto_nombre: string | null;
  fabricante: string | null;
  lote: string | null;
  profesional_nombre: string | null;
  profesional_matricula: string | null;
  profesional_documento?: string | null;
  institucion?: string | null;
  estado_validacion: string;
  fecha_proximo_evento: string | null;

  dominio?: string | null;
  subtipo_evento?: string | null;
  via_aplicacion?: string | null;
  dosis?: string | null;
  created_by_role?: string | null;
  created_by_user_id?: string | null;
  id_proveedor?: string | null;
  id_servicio?: string | null;
  created_at?: string | null;
  updated_at?: string | null;

  // legado / compatibilidad
  enfermedad_objetivo?: string | null;
  esquema_refuerzo?: string | null;
  frecuencia_dias?: number | null;
  tipo_control?: string | null;
  control_motivo?: string | null;
  indicaciones?: string | null;

  // modelo nuevo
  vacuna_aplicacion_unica?: boolean | null;
  esquema_refuerzo_dias?: number | null;

  desparasitacion_alcance?: string | null;
  principio_activo?: string | null;
  forma_administracion?: string | null;
  desparasitacion_aplicacion_unica?: boolean | null;
  cantidad_dias?: number | null;
  frecuencia_horas?: number | null;

  hallazgos_resumen?: string | null;
  cantidad_adjuntos?: number;
  tiene_adjuntos?: boolean;
};

export type HistorialItem = {
  id_historial: string;
  fecha_visita: string;
  motivo_consulta: string;
  diagnostico: string | null;
  tratamiento_indicado: string | null;
  observaciones: string | null;
  titulo: string | null;
  categoria: string | null;
  profesional_nombre: string | null;
  profesional_matricula: string | null;
  profesional_documento?: string | null;
  institucion: string | null;
  estado_validacion: string;
  tipo_estudio: string | null;
  resultado_resumen: string | null;
  medicacion_o_tratamiento?: string | null;
  dosis?: string | null;
  duracion_tratamiento?: string | null;
  fecha_proximo_control?: string | null;
};
