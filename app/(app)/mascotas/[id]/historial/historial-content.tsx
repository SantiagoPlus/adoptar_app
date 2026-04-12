"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  FileText,
  Paperclip,
  ChevronRight,
} from "lucide-react";
import { RegistrarVisitaModal } from "./registrar-visita-modal";
import { EventoDetalleModal } from "../evento-detalle-modal";
import type { HistorialItem } from "../types";

function formatFecha(value: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-AR");
}

function getValidationBadge(value: string) {
  if (value === "validado_profesional") return "VALIDADO";
  if (value === "avalado_manual") return "AVALADO";
  return "CARGADO";
}

function FeedbackBanner({
  ok,
  error,
  dbError,
}: {
  ok?: string | null;
  error?: string | null;
  dbError?: string | null;
}) {
  if (ok === "visita_registrada") {
    return (
      <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        El evento clínico fue creado correctamente.
      </div>
    );
  }

  if (!error) return null;

  const messages: Record<string, string> = {
    campos_obligatorios_historial:
      "Completá al menos categoría, título, motivo y fecha de visita.",
    categoria_invalida_historial:
      "La categoría del evento clínico no es válida.",
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    mascota_no_encontrada: "No se encontró la mascota indicada.",
    sin_permisos: "No tenés permisos para registrar datos en esta mascota.",
    error_creacion_historial: "Ocurrió un error al guardar el evento clínico.",
  };

  return (
    <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      <div>{messages[error] ?? "Ocurrió un error inesperado."}</div>
      {dbError ? (
        <div className="mt-2 text-xs text-red-200/80">
          Detalle técnico: {decodeURIComponent(dbError)}
        </div>
      ) : null}
    </div>
  );
}

export function HistorialContent({
  idMascota,
  historial,
}: {
  idMascota: string;
  historial: HistorialItem[];
}) {
  const searchParams = useSearchParams();
  const ok = searchParams.get("ok");
  const error = searchParams.get("error");
  const dbError = searchParams.get("db_error");

  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleItem, setDetalleItem] = useState<HistorialItem | null>(null);

  const historialOrdenado = useMemo(() => {
    return [...historial].sort((a, b) => {
      const fa = new Date(a.fecha_visita).getTime();
      const fb = new Date(b.fecha_visita).getTime();
      return fb - fa;
    });
  }, [historial]);

  return (
    <div>
      <EventoDetalleModal
        open={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        kind="historial"
        item={detalleItem}
      />

      <FeedbackBanner ok={ok} error={error} dbError={dbError} />

      <section className="rounded-[22px] border border-white/10 bg-[#080808] p-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-400/80">
              Historial médico total
            </p>
            <h3 className="mt-2 text-5xl font-black italic tracking-tight text-white">
              EXPEDIENTE CLÍNICO
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-white/45">
              Registro auditado de todas las intervenciones, patologías y diagnósticos del paciente.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 items-center gap-3 rounded-xl bg-white/[0.03] px-4 text-white/40">
              <Search className="h-4 w-4" />
              <span className="text-sm">Buscar registro...</span>
            </div>

            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.03] text-white/45"
            >
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="grid grid-cols-4 gap-2 rounded-xl bg-white/[0.03] p-1.5 text-xs font-semibold uppercase tracking-wide">
            <div className="flex h-12 items-center justify-center rounded-lg bg-emerald-500 text-black">
              Historial total
            </div>
            <div className="flex h-12 items-center justify-center rounded-lg text-white/45">
              Consultas
            </div>
            <div className="flex h-12 items-center justify-center rounded-lg text-white/45">
              Cirugías
            </div>
            <div className="flex h-12 items-center justify-center rounded-lg text-white/45">
              Estudios / Lab
            </div>
          </div>

          <RegistrarVisitaModal idMascota={idMascota} />
        </div>

        <div className="space-y-4">
          {historialOrdenado.length === 0 ? (
            <div className="rounded-[20px] border border-white/10 bg-white/[0.02] px-6 py-14 text-center">
              <p className="text-xl font-medium text-white/70">
                Sin historial clínico cargado.
              </p>
              <p className="mt-3 text-sm text-white/35">
                Empezá cargando consultas, estudios, cirugías o tratamientos.
              </p>
            </div>
          ) : (
            historialOrdenado.map((item) => (
              <article
                key={item.id_historial}
                className="rounded-[18px] border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-white/15 hover:bg-white/[0.03]"
              >
                <div className="grid grid-cols-[160px_minmax(0,1fr)_44px] items-center gap-4">
                  <div>
                    <div className="mb-2 text-[13px] text-white/45">
                      {formatFecha(item.fecha_visita)}
                    </div>

                    <div className="space-y-1 text-[13px] text-white/55">
                      {item.institucion ? <p>{item.institucion}</p> : null}
                      {item.profesional_nombre ? (
                        <p>
                          {item.profesional_nombre}
                          {item.profesional_matricula ? ` · ${item.profesional_matricula}` : ""}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-3 inline-flex rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                      {getValidationBadge(item.estado_validacion)}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {item.categoria ? (
                        <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/40">
                          {item.categoria}
                        </span>
                      ) : null}

                      {item.tipo_estudio ? (
                        <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/40">
                          {item.tipo_estudio}
                        </span>
                      ) : null}
                    </div>

                    <h4 className="truncate text-[22px] font-black italic leading-none tracking-tight text-white md:text-[24px]">
                      {(item.titulo || item.motivo_consulta).toUpperCase()}
                    </h4>

                    <div className="mt-2 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-[13px] leading-relaxed text-white/70">
                      {item.resultado_resumen ||
                        item.diagnostico ||
                        item.tratamiento_indicado ||
                        item.observaciones ||
                        "Sin resumen clínico cargado."}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-5 text-[11px] font-semibold uppercase tracking-wide text-white/35">
                      <button type="button" className="inline-flex items-center gap-2 hover:text-white/70">
                        <FileText className="h-4 w-4" />
                        Ver informe completo
                      </button>

                      <button type="button" className="inline-flex items-center gap-2 hover:text-white/70">
                        <Paperclip className="h-4 w-4" />
                        Ver adjuntos
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setDetalleItem(item);
                        setDetalleOpen(true);
                      }}
                      className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/[0.04] text-white/35 transition hover:bg-white/[0.07] hover:text-white"
                    >
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
