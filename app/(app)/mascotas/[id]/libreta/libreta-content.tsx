"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Pill,
  CalendarDays,
  ChevronRight,
  ClipboardPlus,
  Activity,
} from "lucide-react";
import { RegistrarAplicacionModal } from "./registrar-aplicacion-modal";
import { EventoDetalleModal } from "../evento-detalle-modal";
import type { LibretaItem } from "../types";

function formatFecha(value: string | null) {
  if (!value) return "Sin fecha";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-AR");
}

function getLibretaTone(tipo: string) {
  if (tipo === "vacunacion" || tipo === "vacuna") {
    return {
      icon: <ClipboardPlus className="h-5 w-5" />,
      accent: "text-emerald-300",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      label: "VACUNA",
    };
  }

  if (tipo === "desparasitacion_interna" || tipo === "desparasitacion") {
    return {
      icon: <Pill className="h-5 w-5" />,
      accent: "text-amber-300",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      label: "DESPARASITACIÓN",
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

  const libretaOrdenada = useMemo(() => {
    return [...libreta].sort((a, b) => {
      const fa = new Date(a.fecha_aplicacion).getTime();
      const fb = new Date(b.fecha_aplicacion).getTime();
      return fb - fa;
    });
  }, [libreta]);

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
                <ShieldCheck className="h-8 w-8" />
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
                Empezá registrando una vacuna, desparasitación o control
                preventivo.
              </p>
            </div>
          ) : (
            libretaOrdenada.map((item) => {
              const tone = getLibretaTone(item.tipo);
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
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${tone.accent}`}
                        >
                          {tone.label}
                        </span>
                        <span className="rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                          {badge}
                        </span>
                      </div>

                      <h4 className="truncate text-[22px] font-black italic leading-none tracking-tight text-white md:text-[24px]">
                        {(
                          item.titulo ||
                          item.producto_nombre ||
                          item.descripcion
                        ).toUpperCase()}
                      </h4>

                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/55">
                        {item.producto_nombre ? (
                          <span>
                            Marca:{" "}
                            <span className="text-white/75">
                              {item.producto_nombre}
                            </span>
                          </span>
                        ) : null}

                        {item.lote || item.producto_lote ? (
                          <span>
                            Lote:{" "}
                            <span className="text-white/75">
                              {item.lote || item.producto_lote}
                            </span>
                          </span>
                        ) : null}

                        {item.profesional_nombre ? (
                          <span>
                            Vet:{" "}
                            <span className="text-white/75">
                              {item.profesional_nombre}
                              {item.profesional_matricula
                                ? ` (${item.profesional_matricula})`
                                : ""}
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
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
