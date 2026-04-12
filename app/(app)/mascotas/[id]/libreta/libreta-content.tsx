"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  CalendarDays,
  ChevronRight,
  ClipboardPlus,
  ClipboardList,
  Activity,
  Syringe,
  Bug,
} from "lucide-react";
import { RegistrarAplicacionModal } from "./registrar-aplicacion-modal";
import { EventoDetalleModal } from "../evento-detalle-modal";
import type { LibretaItem } from "../types";

type LibretaView = "prevencion" | "clinica" | "vida";

function formatFecha(value: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-AR");
}

function parseDate(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
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

function getLibretaTone(item: LibretaItem) {
  const categoria = getLibretaCategoria(item);

  if (categoria === "vacunacion" || categoria === "vacuna") {
    return {
      icon: <Syringe className="h-5 w-5" strokeWidth={1.5} />,
      accent: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      label: "VACUNACIÓN",
    };
  }

  if (categoria === "desparasitacion_interna") {
    return {
      icon: <Bug className="h-5 w-5" strokeWidth={1.5} />,
      accent: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      label: "DESPARASITACIÓN INTERNA",
    };
  }

  if (categoria === "desparasitacion_externa") {
    return {
      icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.5} />,
      accent: "text-cyan-300",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      label: "DESPARASITACIÓN EXTERNA",
    };
  }

  if (categoria === "control_preventivo" || categoria === "control") {
    return {
      icon: <ClipboardList className="h-5 w-5" strokeWidth={1.5} />,
      accent: "text-white/80",
      bg: "bg-white/[0.06]",
      border: "border-white/10",
      label: "CONTROL PREVENTIVO",
    };
  }

  if (item.tipo === "desparasitacion") {
    return {
      icon: <Bug className="h-5 w-5" strokeWidth={1.5} />,
      accent: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      label: "DESPARASITACIÓN",
    };
  }

  if (item.tipo === "vacuna") {
    return {
      icon: <Syringe className="h-5 w-5" strokeWidth={1.5} />,
      accent: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      label: "VACUNA",
    };
  }

  return {
    icon: <ClipboardPlus className="h-5 w-5" strokeWidth={1.5} />,
    accent: "text-white/75",
    bg: "bg-white/[0.05]",
    border: "border-white/10",
    label: "REGISTRO",
  };
}

function getValidationMeta(value: string) {
  if (value === "validado_profesional") {
    return {
      label: "VALIDADO",
      className:
        "bg-emerald-500/12 text-emerald-300 border border-emerald-500/20",
    };
  }

  if (value === "avalado_manual") {
    return {
      label: "AVALADO",
      className:
        "bg-amber-500/12 text-amber-300 border border-amber-500/20",
    };
  }

  return {
    label: "CARGADO",
    className: "bg-white/[0.06] text-white/75 border border-white/10",
  };
}

function getFechaAccion(item: LibretaItem) {
  return item.fecha_proximo_evento || null;
}

function getEstadoProteccionMeta(item: LibretaItem) {
  const fechaAccionRaw = getFechaAccion(item);
  const fechaAccion = parseDate(fechaAccionRaw);

  if (!fechaAccion) {
    return {
      label: "PROTEGIDO",
      className:
        "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
      fechaVisible: "Sin próxima fecha",
    };
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const diffMs = fechaAccion.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: "PENDIENTE",
      className: "bg-rose-500/15 text-rose-300 border border-rose-500/20",
      fechaVisible: formatFecha(fechaAccionRaw),
    };
  }

  if (diffDays <= 90) {
    return {
      label: "PRÓXIMO",
      className:
        "bg-amber-500/15 text-amber-300 border border-amber-500/20",
      fechaVisible: formatFecha(fechaAccionRaw),
    };
  }

  return {
    label: "PROTEGIDO",
    className:
      "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
    fechaVisible: formatFecha(fechaAccionRaw),
  };
}

function matchesLibretaView(item: LibretaItem, view: LibretaView) {
  if (view === "vida") return true;

  const categoria = getLibretaCategoria(item);

  if (view === "prevencion") {
    return (
      categoria === "vacunacion" ||
      categoria === "vacuna" ||
      categoria === "desparasitacion" ||
      categoria === "desparasitacion_interna" ||
      categoria === "desparasitacion_externa" ||
      item.tipo === "vacuna" ||
      item.tipo === "desparasitacion"
    );
  }

  if (view === "clinica") {
    return (
      categoria === "control_preventivo" ||
      categoria === "control" ||
      item.tipo === "control_preventivo" ||
      item.tipo === "control"
    );
  }

  return true;
}

function getEmptyMessage(view: LibretaView) {
  if (view === "prevencion") {
    return {
      title: "No hay registros preventivos en esta vista.",
      body: "Acá se agrupan vacunas y desparasitaciones.",
    };
  }

  if (view === "clinica") {
    return {
      title: "No hay registros clínicos en esta vista.",
      body: "Acá se agrupan controles preventivos vinculados a la libreta.",
    };
  }

  return {
    title: "La libreta sanitaria está vacía.",
    body: "Empezá registrando una vacuna, desparasitación o control preventivo.",
  };
}

function getSecondaryMeta(item: LibretaItem) {
  const categoria = getLibretaCategoria(item);

  if (categoria === "vacunacion" || categoria === "vacuna") {
    return [
      item.producto_nombre
        ? { label: "Producto", value: item.producto_nombre }
        : null,
      item.enfermedad_objetivo
        ? { label: "Objetivo", value: item.enfermedad_objetivo }
        : null,
      item.esquema_refuerzo
        ? { label: "Refuerzo", value: item.esquema_refuerzo }
        : null,
      item.via_aplicacion
        ? { label: "Vía", value: item.via_aplicacion }
        : null,
      item.lote ? { label: "Lote", value: item.lote } : null,
    ].filter(Boolean) as { label: string; value: string }[];
  }

  if (
    categoria === "desparasitacion_interna" ||
    categoria === "desparasitacion_externa" ||
    item.tipo === "desparasitacion"
  ) {
    return [
      item.producto_nombre
        ? { label: "Producto", value: item.producto_nombre }
        : null,
      item.principio_activo
        ? { label: "Activo", value: item.principio_activo }
        : null,
      item.desparasitacion_alcance
        ? { label: "Alcance", value: item.desparasitacion_alcance }
        : null,
      item.frecuencia_dias
        ? { label: "Frecuencia", value: `Cada ${item.frecuencia_dias} días` }
        : null,
      item.via_aplicacion
        ? { label: "Vía", value: item.via_aplicacion }
        : null,
    ].filter(Boolean) as { label: string; value: string }[];
  }

  if (categoria === "control_preventivo" || item.tipo === "control_preventivo") {
    return [
      item.tipo_control ? { label: "Tipo", value: item.tipo_control } : null,
      item.control_motivo
        ? { label: "Motivo", value: item.control_motivo }
        : null,
      item.institucion ? { label: "Institución", value: item.institucion } : null,
    ].filter(Boolean) as { label: string; value: string }[];
  }

  return [
    item.producto_nombre ? { label: "Producto", value: item.producto_nombre } : null,
    item.lote ? { label: "Lote", value: item.lote } : null,
  ].filter(Boolean) as { label: string; value: string }[];
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

  if (!error) return null;

  const messages: Record<string, string> = {
    campos_obligatorios: "Completá al menos tipo, título y fecha.",
    tipo_invalido: "El tipo de registro no es válido.",
    usuario_no_encontrado: "No se pudo vincular tu sesión con tu perfil.",
    mascota_no_encontrada: "No se encontró la mascota indicada.",
    sin_permisos: "No tenés permisos para registrar datos en esta mascota.",
    error_creacion_registro: "Ocurrió un error al guardar el registro.",
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

export function LibretaContent({
  idMascota,
  libreta,
  ownerDisplayName,
  qrMicrochip,
}: {
  idMascota: string;
  libreta: LibretaItem[];
  ownerDisplayName: string;
  qrMicrochip: string | null;
}) {
  const searchParams = useSearchParams();
  const ok = searchParams.get("ok");
  const error = searchParams.get("error");
  const dbError = searchParams.get("db_error");

  const [detalleOpen, setDetalleOpen] = useState(false);
  const [detalleItem, setDetalleItem] = useState<LibretaItem | null>(null);
  const [view, setView] = useState<LibretaView>("prevencion");

  const libretaOrdenada = useMemo(() => {
    return [...libreta].sort((a, b) => {
      const fa = new Date(a.fecha_aplicacion).getTime();
      const fb = new Date(b.fecha_aplicacion).getTime();
      return fb - fa;
    });
  }, [libreta]);

  const libretaFiltrada = useMemo(() => {
    return libretaOrdenada.filter((item) => matchesLibretaView(item, view));
  }, [libretaOrdenada, view]);

  const emptyState = getEmptyMessage(view);

  return (
    <div>
      <EventoDetalleModal
        open={detalleOpen}
        onClose={() => setDetalleOpen(false)}
        kind="libreta"
        item={detalleItem}
      />

      <FeedbackBanner ok={ok} error={error} dbError={dbError} />

      <section className="rounded-[22px] border border-white/10 bg-[#080808] p-5 md:p-6">
        <div className="overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-r from-[#0f0f0f] via-[#090909] to-[#120e07] p-6 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-4 md:gap-5">
              <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-[18px] border border-amber-500/20 bg-amber-500/10 p-5 text-amber-400">
                <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Estado preventivo ·{" "}
                  <span className="text-emerald-400">protegido</span>
                </p>

                <h2 className="text-4xl font-black italic tracking-tight text-white md:text-5xl">
                  Ecosistema de Salud
                </h2>

                <p className="mt-3 text-sm text-white/60">
                  QR/Microchip:{" "}
                  <span className="font-medium text-white/85">
                    {qrMicrochip?.trim() || "No informado"}
                  </span>
                  <span className="mx-3 text-white/25">•</span>
                  Dueño:{" "}
                  <span className="font-medium text-white/85">
                    {ownerDisplayName}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 justify-end">
              <RegistrarAplicacionModal idMascota={idMascota} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/[0.03] text-white/70">
              <Activity className="h-5 w-5" strokeWidth={1.5} />
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

          <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/[0.03] p-1.5 text-xs font-semibold uppercase tracking-wide lg:min-w-[520px]">
            <button
              type="button"
              onClick={() => setView("prevencion")}
              className={[
                "flex h-11 items-center justify-center rounded-lg px-4 transition active:scale-95",
                view === "prevencion"
                  ? "bg-amber-500 text-black"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/75",
              ].join(" ")}
            >
              Prevención
            </button>

            <button
              type="button"
              onClick={() => setView("clinica")}
              className={[
                "flex h-11 items-center justify-center rounded-lg px-4 transition active:scale-95",
                view === "clinica"
                  ? "bg-amber-500 text-black"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/75",
              ].join(" ")}
            >
              Clínica
            </button>

            <button
              type="button"
              onClick={() => setView("vida")}
              className={[
                "flex h-11 items-center justify-center rounded-lg px-4 transition active:scale-95",
                view === "vida"
                  ? "bg-amber-500 text-black"
                  : "text-white/40 hover:bg-white/[0.04] hover:text-white/75",
              ].join(" ")}
            >
              Vida
            </button>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {libretaFiltrada.length === 0 ? (
            <div className="rounded-[20px] border border-white/10 bg-white/[0.02] px-6 py-14 text-center">
              <p className="text-xl font-medium text-white/70">
                {emptyState.title}
              </p>
              <p className="mt-3 text-sm text-white/35">{emptyState.body}</p>
            </div>
          ) : (
            libretaFiltrada.map((item) => {
              const tone = getLibretaTone(item);
              const validationMeta = getValidationMeta(item.estado_validacion);
              const estadoProteccionMeta = getEstadoProteccionMeta(item);
              const secondaryMeta = getSecondaryMeta(item);

              return (
                <article
                  key={item.id_registro}
                  className="rounded-[18px] border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-white/15 hover:bg-white/[0.03]"
                >
                  <div className="grid grid-cols-[56px_minmax(0,1fr)_170px_44px] items-center gap-4">
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
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${tone.accent}`}
                        >
                          {tone.label}
                        </span>

                        <span
                          className={[
                            "rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide",
                            validationMeta.className,
                          ].join(" ")}
                        >
                          {validationMeta.label}
                        </span>

                        {item.tiene_adjuntos ? (
                          <span className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70">
                            ADJUNTO
                          </span>
                        ) : null}
                      </div>

                      <h4 className="truncate text-[22px] font-black italic leading-none tracking-tight text-white md:text-[24px]">
                        {(
                          item.titulo ||
                          item.producto_nombre ||
                          item.descripcion
                        ).toUpperCase()}
                      </h4>

                      {secondaryMeta.length > 0 ? (
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/55">
                          {secondaryMeta.map((meta) => (
                            <span key={`${item.id_registro}-${meta.label}`}>
                              {meta.label}:{" "}
                              <span className="text-white/75">{meta.value}</span>
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {item.profesional_nombre ? (
                        <p className="mt-1.5 text-[13px] text-white/55">
                          Vet:{" "}
                          <span className="text-white/75">
                            {item.profesional_nombre}
                            {item.profesional_matricula
                              ? ` (${item.profesional_matricula})`
                              : ""}
                          </span>
                        </p>
                      ) : null}

                      {item.observaciones ? (
                        <p className="mt-1.5 truncate text-[13px] italic text-white/35">
                          “{item.observaciones}”
                        </p>
                      ) : null}
                    </div>

                    <div className="text-right">
                      <div className="mb-2 flex items-center justify-end gap-2 text-[13px] text-white/45">
                        <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {estadoProteccionMeta.fechaVisible}
                      </div>

                      <span
                        className={[
                          "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                          estadoProteccionMeta.className,
                        ].join(" ")}
                      >
                        {estadoProteccionMeta.label}
                      </span>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setDetalleItem(item);
                          setDetalleOpen(true);
                        }}
                        className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/[0.04] text-white/35 transition hover:bg-white/[0.07] hover:text-white active:scale-95"
                      >
                        <ChevronRight className="h-4.5 w-4.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
