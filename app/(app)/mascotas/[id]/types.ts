export type LibretaItem = {
  id_registro: string;
  tipo: string;
  categoria: string | null;
  titulo: string | null;
  descripcion: string;
  fecha_aplicacion: string;
  fecha_proximo_evento: string | null;

  producto_nombre: string | null;
  fabricante: string | null;
  lote: string | null;
  via_aplicacion: string | null;

  profesional_nombre: string | null;
  profesional_matricula: string | null;
  institucion: string | null;
  observaciones: string | null;
  estado_validacion: string;

  id_servicio?: string | null;

  // Vacunas
  vacuna_aplicacion_unica?: boolean | null;
  esquema_refuerzo_dias?: number | null;
  esquema_refuerzo?: string | null; // fallback visual temporal

  // Desparasitación
  desparasitacion_alcance?: string | null;
  principio_activo?: string | null;
  forma_administracion?: string | null;
  desparasitacion_aplicacion_unica?: boolean | null;
  cantidad_dias?: number | null;
  frecuencia_horas?: number | null;

  // Control preventivo
  hallazgos_resumen?: string | null;

  // Adjuntos
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
