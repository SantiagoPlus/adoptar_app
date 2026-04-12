"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  X,
  Plus,
  Syringe,
  Bug,
  ShieldCheck,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import { registrarAplicacion } from "./actions";

const OPCIONES_REGISTRO = [
  {
    value: "vacunacion",
    label: "Vacunación",
    icon: Syringe,
    accent: "text-emerald-300",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    hint: "Vacunas preventivas con esquema y próxima acción.",
  },
  {
    value: "desparasitacion_interna",
    label: "Desparasitación interna",
    icon: Bug,
    accent: "text-amber-300",
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
    hint: "Antiparasitarios orales o internos con seguimiento propio.",
  },
  {
    value: "desparasitacion_externa",
    label: "Desparasitación externa",
    icon: ShieldCheck,
    accent: "text-cyan-300",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/10",
    hint: "Pipetas, collares u otros tratamientos externos.",
  },
  {
    value: "control_preventivo",
    label: "Control preventivo",
    icon: ClipboardList,
    accent: "text-white/80",
    border: "border-white/10",
    bg: "bg-white/[0.06]",
    hint: "Chequeos preventivos, revisiones y seguimiento general.",
  },
] as const;

type CategoriaRegistro =
  | "vacunacion"
  | "desparasitacion_interna"
  | "desparasitacion_externa"
  | "control_preventivo";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 items-center justify-center rounded-[1.15rem] border border-amber-500/20 bg-amber-500 px-6 text-sm font-black uppercase tracking-[0.08em] text-black transition hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Guardando..." : "Guardar registro"}
    </button>
  );
}

function FieldShell({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "rounded-[1.45rem] border border-white/10 bg-white/[0.02] p-3.5 backdrop-blur-md",
        className,
      ].join(" ")}
    >
      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
        {label}
      </label>
      {children}
    </div>
  );
}

function InputBase(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "h-11 w-full rounded-[1.05rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition",
        "hover:border-white/15 focus:bg-white/[0.05]",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

function TextareaBase(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={[
        "w-full rounded-[1.05rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition",
        "hover:border-white/15 focus:bg-white/[0.05]",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

export function RegistrarAplicacionModal({
  idMascota,
}: {
  idMascota: string;
}) {
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] =
    useState<CategoriaRegistro>("vacunacion");

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const activeOption = useMemo(() => {
    return (
      OPCIONES_REGISTRO.find((item) => item.value === categoria) ??
      OPCIONES_REGISTRO[0]
    );
  }, [categoria]);

  const ActiveIcon = activeOption.icon;

  const titlePlaceholder = useMemo(() => {
    if (categoria === "vacunacion") return "Ej: Rabia anual";
    if (categoria === "desparasitacion_interna") {
      return "Ej: Desparasitación interna trimestral";
    }
    if (categoria === "desparasitacion_externa") {
      return "Ej: Pipeta externa mensual";
    }
    return "Ej: Control preventivo general";
  }, [categoria]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center gap-3 rounded-[1.15rem] border border-white/10 bg-white text-sm font-black uppercase tracking-[0.08em] text-black transition hover:opacity-95 active:scale-95"
      >
        <div className="flex h-full items-center gap-3 px-5">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Nuevo registro
        </div>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          style={{ animation: "pet-backdrop-in 180ms ease-out" }}
        >
          <div className="flex min-h-screen items-end justify-center px-0 py-0 md:px-4 md:py-4">
            <div
              className="relative flex h-[100dvh] w-full flex-col overflow-hidden rounded-t-[2rem] border border-white/10 bg-[#0a0a0a] shadow-2xl md:h-auto md:max-h-[92vh] md:w-[calc(100vw-32px)] md:max-w-[1560px] md:rounded-[2rem]"
              style={{ animation: "pet-sheet-up 240ms ease-out" }}
            >
              <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-amber-500/10 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-[100px]" />

              <div className="relative z-10 border-b border-white/10 bg-[#0a0a0a]/95 px-4 pb-3 pt-4 backdrop-blur-md md:px-6 md:pb-4 md:pt-4">
                <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/10" />

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-95"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>

                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
                  Libreta sanitaria
                </p>

                <div className="pr-14">
                  <h2 className="text-[26px] leading-none font-black italic uppercase tracking-tighter text-white md:text-[36px]">
                    Registrar aplicación
                  </h2>
                  <p className="mt-1.5 text-sm italic text-white/40">
                    Formulario dinámico según el tipo de evento preventivo.
                  </p>
                </div>
              </div>

              <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6 md:py-4">
                <form action={registrarAplicacion} className="space-y-4">
                  <input type="hidden" name="id_mascota" value={idMascota} />
                  <input type="hidden" name="tipo" value={categoria} />

                  <div className="grid gap-4 xl:grid-cols-12">
                    <div className="xl:col-span-8 rounded-[1.45rem] border border-white/10 bg-white/[0.02] p-3.5 backdrop-blur-md">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
                        Tipo de registro
                      </label>

                      <div className="relative">
                        <select
                          value={categoria}
                          onChange={(event) =>
                            setCategoria(event.target.value as CategoriaRegistro)
                          }
                          className="h-11 w-full appearance-none rounded-[1.05rem] border border-white/10 bg-white/[0.03] px-4 pr-12 text-sm font-semibold text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                        >
                          {OPCIONES_REGISTRO.map((item) => (
                            <option
                              key={item.value}
                              value={item.value}
                              className="bg-white text-black"
                              style={{
                                color: "#000000",
                                backgroundColor: "#ffffff",
                              }}
                            >
                              {item.label}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45"
                          strokeWidth={1.5}
                        />
                      </div>

                      <div
                        className={[
                          "mt-3 rounded-[1.05rem] border p-3",
                          activeOption.border,
                          activeOption.bg,
                        ].join(" ")}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-[0.9rem] border",
                              activeOption.border,
                              activeOption.bg,
                              activeOption.accent,
                            ].join(" ")}
                          >
                            <ActiveIcon className="h-4.5 w-4.5" strokeWidth={1.5} />
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`text-sm font-black uppercase tracking-[0.08em] ${activeOption.accent}`}
                            >
                              {activeOption.label}
                            </p>
                            <p className="mt-1 text-sm italic text-white/45">
                              {activeOption.hint}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <FieldShell label="Fecha del evento" className="xl:col-span-4">
                      <InputBase
                        type="date"
                        name="fecha_aplicacion"
                        required
                        className="focus:border-amber-500/30"
                      />
                    </FieldShell>
                  </div>

                  <FieldShell label="Título visible del registro">
                    <InputBase
                      type="text"
                      name="titulo"
                      required
                      placeholder={titlePlaceholder}
                      className="focus:border-amber-500/30"
                    />
                  </FieldShell>

                  {categoria === "vacunacion" ? (
                    <>
                      <div className="grid gap-4 xl:grid-cols-12">
                        <FieldShell label="Producto / vacuna" className="xl:col-span-4">
                          <InputBase
                            type="text"
                            name="producto_nombre"
                            placeholder="Ej: Rabia"
                            className="focus:border-emerald-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Enfermedad objetivo" className="xl:col-span-4">
                          <InputBase
                            type="text"
                            name="enfermedad_objetivo"
                            placeholder="Ej: Rabia"
                            className="focus:border-emerald-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Próxima acción" className="xl:col-span-4">
                          <InputBase
                            type="date"
                            name="fecha_proximo_evento"
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-12">
                        <FieldShell label="Fabricante" className="xl:col-span-3">
                          <InputBase
                            type="text"
                            name="fabricante"
                            placeholder="Ej: Merial"
                            className="focus:border-emerald-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Lote" className="xl:col-span-2">
                          <InputBase
                            type="text"
                            name="lote"
                            placeholder="Ej: ABC-123"
                            className="focus:border-emerald-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Vía de aplicación" className="xl:col-span-3">
                          <InputBase
                            type="text"
                            name="via_aplicacion"
                            placeholder="Ej: Subcutánea"
                            className="focus:border-emerald-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Dosis" className="xl:col-span-2">
                          <InputBase
                            type="text"
                            name="dosis"
                            placeholder="Ej: 1 dosis"
                            className="focus:border-emerald-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Esquema / refuerzo" className="xl:col-span-2">
                          <InputBase
                            type="text"
                            name="esquema_refuerzo"
                            placeholder="Ej: Anual"
                            className="focus:border-emerald-500/30"
                          />
                        </FieldShell>
                      </div>
                    </>
                  ) : null}

                  {categoria === "desparasitacion_interna" ||
                  categoria === "desparasitacion_externa" ? (
                    <>
                      <div className="grid gap-4 xl:grid-cols-12">
                        <FieldShell label="Producto" className="xl:col-span-4">
                          <InputBase
                            type="text"
                            name="producto_nombre"
                            placeholder="Ej: Comprimido antiparasitario"
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Principio activo" className="xl:col-span-4">
                          <InputBase
                            type="text"
                            name="principio_activo"
                            placeholder="Ej: Fenbendazol"
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Próxima acción" className="xl:col-span-4">
                          <InputBase
                            type="date"
                            name="fecha_proximo_evento"
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-12">
                        <FieldShell label="Fabricante" className="xl:col-span-3">
                          <InputBase
                            type="text"
                            name="fabricante"
                            placeholder="Ej: Laboratorio"
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Lote" className="xl:col-span-2">
                          <InputBase
                            type="text"
                            name="lote"
                            placeholder="Ej: LOTE-456"
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Vía de aplicación" className="xl:col-span-3">
                          <InputBase
                            type="text"
                            name="via_aplicacion"
                            placeholder={
                              categoria === "desparasitacion_interna"
                                ? "Ej: Oral"
                                : "Ej: Tópica"
                            }
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Dosis" className="xl:col-span-2">
                          <InputBase
                            type="text"
                            name="dosis"
                            placeholder="Ej: 1 comprimido"
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Frecuencia (días)" className="xl:col-span-2">
                          <InputBase
                            type="number"
                            min="1"
                            step="1"
                            name="frecuencia_dias"
                            placeholder="Ej: 90"
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>
                      </div>
                    </>
                  ) : null}

                  {categoria === "control_preventivo" ? (
                    <>
                      <div className="grid gap-4 xl:grid-cols-12">
                        <FieldShell label="Tipo de control" className="xl:col-span-4">
                          <InputBase
                            type="text"
                            name="tipo_control"
                            placeholder="Ej: Chequeo clínico"
                            className="focus:border-white/20"
                          />
                        </FieldShell>

                        <FieldShell label="Próximo control" className="xl:col-span-4">
                          <InputBase
                            type="date"
                            name="fecha_proximo_evento"
                            className="focus:border-amber-500/30"
                          />
                        </FieldShell>

                        <FieldShell label="Institución" className="xl:col-span-4">
                          <InputBase
                            type="text"
                            name="institucion"
                            placeholder="Ej: Veterinaria Ejemplo"
                            className="focus:border-white/20"
                          />
                        </FieldShell>
                      </div>

                      <div className="grid gap-4 xl:grid-cols-12">
                        <FieldShell label="Motivo" className="xl:col-span-4">
                          <TextareaBase
                            name="motivo"
                            rows={3}
                            placeholder="Ej: Revisión preventiva anual"
                            className="focus:border-white/20"
                          />
                        </FieldShell>

                        <FieldShell label="Hallazgos resumen" className="xl:col-span-4">
                          <TextareaBase
                            name="hallazgos_resumen"
                            rows={3}
                            placeholder="Ej: Sin hallazgos relevantes"
                            className="focus:border-white/20"
                          />
                        </FieldShell>

                        <FieldShell label="Indicaciones" className="xl:col-span-4">
                          <TextareaBase
                            name="indicaciones"
                            rows={3}
                            placeholder="Ej: Continuar seguimiento preventivo"
                            className="focus:border-white/20"
                          />
                        </FieldShell>
                      </div>
                    </>
                  ) : null}

                  <div className="grid gap-4 xl:grid-cols-12">
                    <FieldShell label="Profesional" className="xl:col-span-6">
                      <InputBase
                        type="text"
                        name="profesional_nombre"
                        placeholder="Nombre completo"
                        className="focus:border-emerald-500/30"
                      />
                    </FieldShell>

                    <FieldShell label="Matrícula" className="xl:col-span-6">
                      <InputBase
                        type="text"
                        name="profesional_matricula"
                        placeholder="Ej: MP 1234 / MN 5678"
                        className="focus:border-emerald-500/30"
                      />
                    </FieldShell>
                  </div>

                  <div className="rounded-[1.45rem] border border-white/10 bg-white/[0.02] p-3.5 backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">
                      Aval profesional
                    </p>
                    <p className="mt-2 text-sm italic text-white/40">
                      Si completás profesional y matrícula, el registro se guarda como{" "}
                      <span className="font-medium text-emerald-300">
                        avalado_manual
                      </span>
                      .
                    </p>
                  </div>

                  <FieldShell label="Observaciones">
                    <TextareaBase
                      name="observaciones"
                      rows={2}
                      placeholder="Dato complementario, nota breve o comentario adicional..."
                      className="focus:border-amber-500/30"
                    />
                  </FieldShell>

                  <div className="border-t border-white/10 pt-4">
                    <div className="grid gap-3 md:grid-cols-[220px_1fr]">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="flex h-12 items-center justify-center rounded-[1.15rem] border border-white/10 bg-transparent px-6 text-sm font-black uppercase tracking-[0.08em] text-white/70 transition hover:border-white/15 hover:bg-white/[0.04] hover:text-white active:scale-95"
                      >
                        Cancelar
                      </button>

                      <SubmitButton />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <style jsx global>{`
            @keyframes pet-backdrop-in {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes pet-sheet-up {
              from {
                opacity: 0;
                transform: translateY(40px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      ) : null}
    </>
  );
}
