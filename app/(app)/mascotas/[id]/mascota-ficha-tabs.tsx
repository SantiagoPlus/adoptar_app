"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Syringe,
  Stethoscope,
  ShieldCheck,
  Pill,
  CalendarDays,
  ChevronRight,
  ClipboardPlus,
  Search,
  Filter,
  FileText,
  Paperclip,
  Activity,
} from "lucide-react";
import { RegistrarAplicacionModal } from "./registrar-aplicacion-modal";
import { RegistrarVisitaModal } from "./registrar-visita-modal";
import { EventoDetalleModal } from "./evento-detalle-modal";

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

function formatFecha(value: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-AR");
}

function getLibrettaTone(tipo: string) {
  if (tipo === "vacunacion" || tipo === "vacuna") {
    return {
      icon: <Syringe className="h-5 w-5" />,
      accent: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      label: "RABIA",
    };
  }

  if (tipo === "desparasitacion_interna" || tipo === "desparasitacion") {
    return {
      icon: <Pill className="h-5 w-5" />,
      accent: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      label: "INTERNA",
    };
  }

  if (tipo === "desparasitacion_externa") {
    return {
      icon: <ShieldCheck className="h-5 w-5" />,
      accent: "text-cyan-300",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      label: "EXTERNA",
    };
  }

  return {
    icon: <ClipboardPlus className="h-5 w-5" />,
    accent: "text-emerald-300",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "CONTROL",
  };
}

function getValidationBadge(value: string) {
  if (value === "validado_profesional") return "VALIDADO";
  if (value === "avalado_manual") return "AVALADO";
  return "CARGADO";
}

function getEstadoEvento(item: LibretaItem) {
  if (item.fecha_proximo_evento) return "PRÓXIMO";
  return "PROTEGIDO";
}

function getEstadoTone(value: string) {
  if (value === "PRÓXIMO") {
    return "bg-amber-500/15 text-amber-300 border border-amber-500/20";
  }
  return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20";
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
  if (ok === "aplicacion_registrada") {
    return (
      <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        El registro preventivo fue creado correctamente.
      </div>
    );
  }

  if (ok === "visita_registrada") {
    return (
      <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        El evento clínico fue creado correctamente.
      </div>
    );
  }

  if (!error) return null;

  const messages: Record<string, string> = {
    campos_obligatorios: "Completá al menos tipo, título y fecha.",
    tipo_invalido: "El tipo de registro no es válido.",
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    mascota_no_encontrada: "No se encontró la mascota indicada.",
    sin_permisos: "No tenés permisos para registrar datos en esta mascota.",
    error_creacion_registro: "Ocurrió un error al guardar el registro.",
    campos_obligatorios_historial:
      "Completá al menos categoría, título, motivo y fecha de visita.",
    categoria_invalida_historial:
      "La categoría del evento clínico no es válida.",
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

export function MascotaFichaTabs({
  id_mascota,
  libreta,
  historial,
}: {
  id_mascota: string;
  libreta: LibretaItem[];
  historial: HistorialItem[];
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "historial" ? "historial" : "libreta";

  const [activeTab, setActiveTab] = useState<"libreta" | "historial">(initialTab);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleKind, setDetalleKind] = useState<"libreta" | "historial">("libreta");
  const [detalleItem, setDetalleItem] = useState<LibretaItem | HistorialItem | null>(null);

  const ok = searchParams.get("ok");
  const error = searchParams.get("error");
  const dbError = searchParams.get("db_error");

  const libretaOrdenada = useMemo(() => {
    return [...libreta].sort((a, b) => {
      const fa = new Date(a.fecha_aplicacion).getTime();
      const fb = new Date(b.fecha_aplicacion).getTime();
      return fb - fa;
    });
  }, [libreta]);

  const historialOrdenado = useMemo(() => {
    return [...historial].sort((a, b) => {
      const fa = new Date(a.fecha_visita).getTime();
      const fb = new Date(b.fecha_visita).getTime();
      return fb - fa;
    });
  }, [historial]);

  function openLibrettaDetail(item: LibretaItem) {
    setDetalleKind("libreta");
    setDetalleItem(item);
    setDetalleOpen(true);
  }

  function openHistorialDetail(item: HistorialItem) {
    setDetalleKind("historial");
    setDetalleItem(item);
    setDetalleOpen(true);
  }

  return (
    <div>
      <EventoDetalleModal
        open={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        kind={detalleKind}
        item={detalleItem}
      />

      <div className="mb-5 rounded-xl bg-white/[0.03] p-1.5">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("libreta")}
            className={[
              "flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition",
              activeTab === "libreta"
                ? "bg-amber-500 text-black"
                : "bg-transparent text-white/55 hover:bg-white/[0.03] hover:text-white",
            ].join(" ")}
          >
            <Syringe className="h-4 w-4" />
            Libreta Sanitaria
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("historial")}
            className={[
              "flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition",
              activeTab === "historial"
                ? "bg-emerald-500 text-black"
                : "bg-transparent text-white/55 hover:bg-white/[0.03] hover:text-white",
            ].join(" ")}
          >
            <Stethoscope className="h-4 w-4" />
            Historial Clínico
          </button>
        </div>
      </div>

      <FeedbackBanner ok={ok} error={error} dbError={dbError} />

      {activeTab === "libreta" && (
        <section className="rounded-[22px] border border-white/10 bg-[#080808] p-5 md:p-6">
          <div className="overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-r from-[#0f0f0f] via-[#090909] to-[#120e07] p-6 md:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4 md:gap-5">
                <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-[18px] border border-amber-500/20 bg-amber-500/10 p-5 text-amber-400">
                  <ShieldCheck className="h-8 w-8" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Estado preventivo · <span className="text-emerald-400">protegido</span>
                  </p>

                  <h2 className="text-4xl font-black italic tracking-tight text-white md:text-5xl">
                    Ecosistema de Salud
                  </h2>

                  <p className="mt-3 text-sm text-white/60">
                    Microchip: <span className="font-medium text-white/85">900-111-000-1234</span>
                    <span className="mx-3 text-white/25">•</span>
                    Dueño: <span className="font-medium text-white/85">Santiago B.</span>
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 justify-end">
                <RegistrarAplicacionModal idMascota={id_mascota} />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/[0.03] text-white/70">
                <Activity className="h-5 w-5" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Línea de vida médica
                </p>
                <h3 className="mt-1 text-xl font-black italic tracking-tight text-white md:text-2xl">
                  LÍNEA DE VIDA MÉDICA
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 rounded-xl bg-white/[0.03] p-1.5 text-xs font-semibold uppercase tracking-wide lg:min-w-[560px]">
              <div className="flex h-11 items-center justify-center rounded-lg bg-amber-500 px-4 text-black">
                Prevención
              </div>
              <div className="flex h-11 items-center justify-center rounded-lg px-4 text-white/40">
                Clínica
              </div>
              <div className="flex h-11 items-center justify-center rounded-lg px-4 text-white/40">
                Diagnóstico
              </div>
              <div className="flex h-11 items-center justify-center rounded-lg px-4 text-white/40">
                Vida
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {libretaOrdenada.length === 0 ? (
              <div className="rounded-[20px] border border-white/10 bg-white/[0.02] px-6 py-14 text-center">
                <p className="text-xl font-medium text-white/70">
                  La libreta sanitaria está vacía.
                </p>
                <p className="mt-3 text-sm text-white/35">
                  Empezá registrando una vacuna, desparasitación o control preventivo.
                </p>
              </div>
            ) : (
              libretaOrdenada.map((item) => {
                const tone = getLibrettaTone(item.tipo);
                const badge = getValidationBadge(item.estado_validacion);
                const estadoEvento = getEstadoEvento(item);

                return (
                  <article
                    key={item.id_registro}
                    className="rounded-[18px] border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-white/15 hover:bg-white/[0.03]"
                  >
                    <div className="grid grid-cols-[56px_minmax(0,1fr)_140px_44px] items-center gap-4">
                      <div
                        className={[
                          "flex h-14 w-14 items-center justify-center rounded-[14px] border",
                          tone.bg,
                          tone.border,
                          tone.accent,
                        ].join(" ")}
                      >
                        {tone.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1.5 flex flex-wrap items-center gap-2">
                          <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${tone.accent}`}>
                            {tone.label}
                          </span>
                          <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                            {badge}
                          </span>
                        </div>

                        <h4 className="truncate text-[22px] font-black italic leading-none tracking-tight text-white md:text-[24px]">
                          {(item.titulo || item.producto_nombre || item.descripcion).toUpperCase()}
                        </h4>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/55">
                          {item.producto_nombre ? (
                            <span>
                              Marca: <span className="text-white/75">{item.producto_nombre}</span>
                            </span>
                          ) : null}

                          {(item.lote || item.producto_lote) ? (
                            <span>
                              Lote: <span className="text-white/75">{item.lote || item.producto_lote}</span>
                            </span>
                          ) : null}

                          {item.profesional_nombre ? (
                            <span>
                              Vet:{" "}
                              <span className="text-white/75">
                                {item.profesional_nombre}
                                {item.profesional_matricula ? ` (${item.profesional_matricula})` : ""}
                              </span>
                            </span>
                          ) : null}
                        </div>

                        {item.observaciones ? (
                          <p className="mt-1.5 truncate text-[13px] italic text-white/35">
                            “{item.observaciones}”
                          </p>
                        ) : null}
                      </div>

                      <div className="text-right">
                        <div className="mb-2 flex items-center justify-end gap-2 text-[13px] text-white/45">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatFecha(item.fecha_aplicacion)}
                        </div>

                        <span
                          className={[
                            "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                            getEstadoTone(estadoEvento),
                          ].join(" ")}
                        >
                          {estadoEvento}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => openLibrettaDetail(item)}
                          className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/[0.04] text-white/35 transition hover:bg-white/[0.07] hover:text-white"
                        >
                          <ChevronRight className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      )}

      {activeTab === "historial" && (
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

            <RegistrarVisitaModal idMascota={id_mascota} />
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
                  className="rounded-[20px] border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.03]"
                >
                  <div className="grid gap-5 lg:grid-cols-[180px_1fr_48px]">
                    <div>
                      <p className="text-4xl font-black italic tracking-tight text-white">
                        {formatFecha(item.fecha_visita)}
                      </p>

                      <div className="mt-4 space-y-2 text-sm text-white/55">
                        {item.institucion ? <p>{item.institucion}</p> : null}
                        {item.profesional_nombre ? (
                          <p>
                            {item.profesional_nombre}
                            {item.profesional_matricula ? ` · ${item.profesional_matricula}` : ""}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-4 inline-flex rounded-md bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                        {getValidationBadge(item.estado_validacion)}
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 flex flex-wrap gap-2">
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

                      <h4 className="text-4xl font-black italic tracking-tight text-white">
                        {(item.titulo || item.motivo_consulta).toUpperCase()}
                      </h4>

                      <div className="mt-4 rounded-xl border border-white/10 bg-black/30 px-4 py-4 text-white/70">
                        {item.resultado_resumen ||
                          item.diagnostico ||
                          item.tratamiento_indicado ||
                          item.observaciones ||
                          "Sin resumen clínico cargado."}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-6 text-xs font-semibold uppercase tracking-wide text-white/35">
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

                    <div className="flex items-start justify-end">
                      <button
                        type="button"
                        onClick={() => openHistorialDetail(item)}
                        className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white/[0.04] text-white/45 transition hover:bg-white/[0.07] hover:text-white"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}
