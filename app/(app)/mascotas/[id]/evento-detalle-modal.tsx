"use client";

import { X, CalendarDays } from "lucide-react";
import type { HistorialItem, LibretaItem } from "./types";

function formatFecha(value: string | null | undefined) {
  if (!value) return "Sin fecha";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("es-AR");
}

function getLibretaCategoria(item: LibretaItem) {
  if (item.categoria?.trim()) return item.categoria.trim();

  if (item.tipo === "vacuna") return "vacunacion";
  if (item.tipo === "desparasitacion") return "desparasitacion";
  if (item.tipo === "control_preventivo" || item.tipo === "control") {
    return "control_preventivo";
  }

  return item.tipo;
}

function getValidationLabel(value: string) {
  if (value === "validado_profesional") return "VALIDADO";
  if (value === "avalado_manual") return "AVALADO";
  return "CARGADO";
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
    <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>
      <p className="text-sm text-white/85">{value}</p>
    </div>
  );
}

function DetailRowNumber({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value?: number | null;
  suffix?: string;
}) {
  if (value == null) return null;

  return (
    <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
        {label}
      </p>
      <p className="text-sm text-white/85">
        {value}
        {suffix}
      </p>
    </div>
  );
}

function LibretaDetails({ item }: { item: LibretaItem }) {
  const categoria = getLibretaCategoria(item);

  if (categoria === "vacunacion" || categoria === "vacuna") {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DetailRow label="Producto" value={item.producto_nombre} />
        <DetailRow label="Enfermedad objetivo" value={item.enfermedad_objetivo} />
        <DetailRow label="Próxima acción" value={formatFecha(item.fecha_proximo_evento)} />
        <DetailRow label="Fabricante" value={item.fabricante} />
        <DetailRow label="Lote" value={item.lote || item.producto_lote} />
        <DetailRow label="Vía de aplicación" value={item.via_aplicacion} />
        <DetailRow label="Dosis" value={item.dosis} />
        <DetailRow label="Esquema / refuerzo" value={item.esquema_refuerzo} />
      </div>
    );
  }

  if (
    categoria === "desparasitacion_interna" ||
    categoria === "desparasitacion_externa" ||
    item.tipo === "desparasitacion"
  ) {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DetailRow label="Producto" value={item.producto_nombre} />
        <DetailRow label="Alcance" value={item.desparasitacion_alcance} />
        <DetailRow label="Próxima acción" value={formatFecha(item.fecha_proximo_evento)} />
        <DetailRow label="Principio activo" value={item.principio_activo} />
        <DetailRow label="Fabricante" value={item.fabricante} />
        <DetailRow label="Lote" value={item.lote || item.producto_lote} />
        <DetailRow label="Vía de aplicación" value={item.via_aplicacion} />
        <DetailRow label="Dosis" value={item.dosis} />
        <DetailRowNumber
          label="Frecuencia"
          value={item.frecuencia_dias}
          suffix=" días"
        />
      </div>
    );
  }

  if (categoria === "control_preventivo" || item.tipo === "control_preventivo") {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <DetailRow label="Tipo de control" value={item.tipo_control} />
        <DetailRow label="Próximo control" value={formatFecha(item.fecha_proximo_evento)} />
        <DetailRow label="Institución" value={item.institucion} />
        <DetailRow label="Motivo" value={item.control_motivo} />
        <DetailRow label="Hallazgos resumen" value={item.hallazgos_resumen} />
        <DetailRow label="Indicaciones" value={item.indicaciones} />
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <DetailRow label="Tipo" value={item.tipo} />
      <DetailRow label="Categoría" value={item.categoria} />
      <DetailRow label="Próxima acción" value={formatFecha(item.fecha_proximo_evento)} />
    </div>
  );
}

function HistorialDetails({ item }: { item: HistorialItem }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      <DetailRow label="Categoría" value={item.categoria} />
      <DetailRow label="Motivo de consulta" value={item.motivo_consulta} />
      <DetailRow label="Fecha de visita" value={formatFecha(item.fecha_visita)} />
      <DetailRow label="Diagnóstico" value={item.diagnostico} />
      <DetailRow label="Tratamiento indicado" value={item.tratamiento_indicado} />
      <DetailRow label="Tipo de estudio" value={item.tipo_estudio} />
      <DetailRow label="Resultado resumen" value={item.resultado_resumen} />
      <DetailRow label="Medicación / tratamiento" value={item.medicacion_o_tratamiento} />
      <DetailRow label="Dosis" value={item.dosis} />
      <DetailRow label="Duración" value={item.duracion_tratamiento} />
      <DetailRow label="Próximo control" value={formatFecha(item.fecha_proximo_control)} />
      <DetailRow label="Institución" value={item.institucion} />
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

  const validationLabel = getValidationLabel(item.estado_validacion);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] shadow-2xl">
        <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-amber-500/10 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-[90px]" />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-95"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="border-b border-white/10 px-5 pb-5 pt-5 md:px-6 md:pb-6 md:pt-6">
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
            {kind === "libreta" ? "Detalle preventivo" : "Detalle clínico"}
          </p>

          <div className="pr-14">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white md:text-4xl">
              {String(title || "Registro")}
            </h3>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/75">
              {validationLabel}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/65">
              <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
              {fecha}
            </span>
          </div>
        </div>

        <div className="max-h-[76vh] overflow-y-auto px-5 py-5 md:px-6 md:py-6">
          {kind === "libreta" ? (
            <LibretaDetails item={item as LibretaItem} />
          ) : (
            <HistorialDetails item={item as HistorialItem} />
          )}

          {item.profesional_nombre || item.profesional_matricula ? (
            <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                Aval profesional
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <DetailRow label="Profesional" value={item.profesional_nombre} />
                <DetailRow label="Matrícula" value={item.profesional_matricula} />
              </div>
            </div>
          ) : null}

          {item.observaciones ? (
            <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                Observaciones
              </p>
              <p className="text-sm italic text-white/70">{item.observaciones}</p>
            </div>
          ) : null}

          {kind === "libreta" && (item as LibretaItem).tiene_adjuntos ? (
            <div className="mt-6 rounded-[1.25rem] border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-white/35">
                Adjuntos
              </p>
              <p className="text-sm text-white/65">
                Este registro tiene {(item as LibretaItem).cantidad_adjuntos ?? 0} adjunto(s).
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
