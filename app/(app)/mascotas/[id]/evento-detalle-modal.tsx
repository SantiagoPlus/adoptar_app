"use client";

import { X, FileText, Paperclip, CalendarDays, ShieldCheck } from "lucide-react";

type LibretaItem = {
  id_registro: string;
  tipo: string;
  descripcion: string;
  fecha_aplicacion: string;
  fecha_vencimiento: string | null;
  producto_lote: string | null;
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
};

type HistorialItem = {
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

function formatFecha(value: string | null | undefined) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("es-AR");
}

function validationLabel(value: string) {
  if (value === "validado_profesional") return "VALIDADO PROFESIONAL";
  if (value === "avalado_manual") return "AVALADO MANUAL";
  return "CARGADO POR TUTOR";
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
        {label}
      </p>
      <p className="text-sm text-white/85">{value}</p>
    </div>
  );
}

export function EventoDetalleModal({
  open,
  onClose,
  kind,
  item,
}: {
  open: boolean;
  onClose: () => void;
  kind: "libreta" | "historial";
  item: LibretaItem | HistorialItem | null;
}) {
  if (!open || !item) return null;

  const title =
    kind === "libreta"
      ? (item as LibretaItem).titulo ||
        (item as LibretaItem).producto_nombre ||
        (item as LibretaItem).descripcion
      : (item as HistorialItem).titulo || (item as HistorialItem).motivo_consulta;

  const fecha =
    kind === "libreta"
      ? formatFecha((item as LibretaItem).fecha_aplicacion)
      : formatFecha((item as HistorialItem).fecha_visita);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-[#080808] shadow-2xl">
        <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-white/10" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-8 pb-8 pt-6 md:px-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                {kind === "libreta" ? "Detalle preventivo" : "Detalle clínico"}
              </p>

              <h2 className="max-w-3xl text-3xl font-bold text-white md:text-4xl">
                {title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/55">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {fecha}
                </span>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
                  {validationLabel(item.estado_validacion)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/75 transition hover:bg-white/[0.07] hover:text-white"
              >
                <FileText className="h-4 w-4" />
                Descargar evento.pdf
              </button>

              <button
                type="button"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/75 transition hover:bg-white/[0.07] hover:text-white"
              >
                <Paperclip className="h-4 w-4" />
                Descargar evento completo.zip
              </button>
            </div>
          </div>

          {kind === "libreta" ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <DetailRow label="Tipo" value={(item as LibretaItem).tipo} />
                <DetailRow label="Categoría" value={(item as LibretaItem).categoria} />
                <DetailRow
                  label="Descripción"
                  value={(item as LibretaItem).descripcion}
                />
                <DetailRow
                  label="Producto"
                  value={(item as LibretaItem).producto_nombre}
                />
                <DetailRow
                  label="Fabricante"
                  value={(item as LibretaItem).fabricante}
                />
                <DetailRow label="Lote" value={(item as LibretaItem).lote} />
                <DetailRow
                  label="Fecha próximo evento"
                  value={formatFecha((item as LibretaItem).fecha_proximo_evento)}
                />
                <DetailRow
                  label="Fecha vencimiento"
                  value={formatFecha((item as LibretaItem).fecha_vencimiento)}
                />
                <DetailRow
                  label="Profesional"
                  value={(item as LibretaItem).profesional_nombre}
                />
                <DetailRow
                  label="Matrícula"
                  value={(item as LibretaItem).profesional_matricula}
                />
                <DetailRow
                  label="Institución"
                  value={(item as LibretaItem).institucion}
                />
                <DetailRow
                  label="Documento profesional"
                  value={(item as LibretaItem).profesional_documento}
                />
              </div>

              {(item as LibretaItem).observaciones ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    Observaciones
                  </p>
                  <p className="text-sm leading-relaxed text-white/80">
                    {(item as LibretaItem).observaciones}
                  </p>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <DetailRow label="Categoría" value={(item as HistorialItem).categoria} />
                <DetailRow
                  label="Motivo de consulta"
                  value={(item as HistorialItem).motivo_consulta}
                />
                <DetailRow
                  label="Diagnóstico"
                  value={(item as HistorialItem).diagnostico}
                />
                <DetailRow
                  label="Tratamiento indicado"
                  value={(item as HistorialItem).tratamiento_indicado}
                />
                <DetailRow
                  label="Tipo de estudio"
                  value={(item as HistorialItem).tipo_estudio}
                />
                <DetailRow
                  label="Resultado resumen"
                  value={(item as HistorialItem).resultado_resumen}
                />
                <DetailRow
                  label="Medicación / tratamiento"
                  value={(item as HistorialItem).medicacion_o_tratamiento}
                />
                <DetailRow label="Dosis" value={(item as HistorialItem).dosis} />
                <DetailRow
                  label="Duración tratamiento"
                  value={(item as HistorialItem).duracion_tratamiento}
                />
                <DetailRow
                  label="Próximo control"
                  value={formatFecha((item as HistorialItem).fecha_proximo_control)}
                />
                <DetailRow
                  label="Profesional"
                  value={(item as HistorialItem).profesional_nombre}
                />
                <DetailRow
                  label="Matrícula"
                  value={(item as HistorialItem).profesional_matricula}
                />
                <DetailRow
                  label="Institución"
                  value={(item as HistorialItem).institucion}
                />
                <DetailRow
                  label="Documento profesional"
                  value={(item as HistorialItem).profesional_documento}
                />
              </div>

              {(item as HistorialItem).observaciones ? (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">
                    Observaciones
                  </p>
                  <p className="text-sm leading-relaxed text-white/80">
                    {(item as HistorialItem).observaciones}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 text-sm text-white/60">
            <div className="inline-flex items-center gap-2 text-amber-300">
              <ShieldCheck className="h-4 w-4" />
              Próxima etapa
            </div>
            <p className="mt-2">
              En el siguiente inciso vamos a conectar esta vista con adjuntos reales y
              preparar la generación de PDF/ZIP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
