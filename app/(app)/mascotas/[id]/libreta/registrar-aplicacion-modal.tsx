"use client";

import { useMemo, useState } from "react";
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
import { registrarAplicacion } from "../actions";

const OPCIONES_REGISTRO = [
  {
    value: "vacunacion",
    label: "Vacunación",
    short: "Vacuna",
    icon: Syringe,
    accent: "text-emerald-300",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    hint: "Vacunas preventivas con próximo refuerzo o control.",
  },
  {
    value: "desparasitacion_interna",
    label: "Desparasitación interna",
    short: "Interna",
    icon: Bug,
    accent: "text-amber-300",
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
    hint: "Antiparasitarios orales o internos.",
  },
  {
    value: "desparasitacion_externa",
    label: "Desparasitación externa",
    short: "Externa",
    icon: ShieldCheck,
    accent: "text-cyan-300",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/10",
    hint: "Pipetas, collares u otros externos.",
  },
  {
    value: "control_preventivo",
    label: "Control preventivo",
    short: "Control",
    icon: ClipboardList,
    accent: "text-white/80",
    border: "border-white/10",
    bg: "bg-white/[0.06]",
    hint: "Chequeo general, control anual o revisión preventiva.",
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

export function RegistrarAplicacionModal({
  idMascota,
}: {
  idMascota: string;
}) {
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] =
    useState<CategoriaRegistro>("vacunacion");

  const activeOption = useMemo(() => {
    return (
      OPCIONES_REGISTRO.find((item) => item.value === categoria) ??
      OPCIONES_REGISTRO[0]
    );
  }, [categoria]);

  const tituloPlaceholder = useMemo(() => {
    if (categoria === "vacunacion") {
      return "Ej: Rabia, Séxtuple, Triple Felina...";
    }

    if (categoria === "desparasitacion_interna") {
      return "Ej: Desparasitación interna comprimido...";
    }

    if (categoria === "desparasitacion_externa") {
      return "Ej: Pipeta antipulgas, collar, spot-on...";
    }

    return "Ej: Control anual, revisión general...";
  }, [categoria]);

  const viaPlaceholder = useMemo(() => {
    if (categoria === "vacunacion") return "Ej: Subcutánea, intramuscular...";
    if (categoria === "desparasitacion_interna") return "Ej: Oral...";
    if (categoria === "desparasitacion_externa") {
      return "Ej: Tópica, collar, spot-on...";
    }
    return "Ej: Consulta presencial...";
  }, [categoria]);

  const ActiveIcon = activeOption.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center gap-3 rounded-[1.15rem] border border-white/10 bg-white text-sm font-black uppercase tracking-[0.08em] text-black transition hover:opacity-95 active:scale-95"
      >
        <div className="flex h-full items-center gap-3 px-5">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Registrar aplicación
        </div>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="flex min-h-screen items-end justify-center px-0 py-0 md:px-4 md:py-4">
            <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden rounded-none border border-white/10 bg-[#0a0a0a] shadow-2xl md:h-auto md:max-h-[94vh] md:w-[calc(100vw-32px)] md:max-w-[1480px] md:rounded-[2rem]">
              <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-amber-500/10 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-[100px]" />

              <div className="relative z-10 border-b border-white/10 bg-[#0a0a0a]/95 px-4 pb-4 pt-4 backdrop-blur-md md:px-6 md:pb-5 md:pt-5">
                <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/10 md:hidden" />

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-95"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>

                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                  Libreta sanitaria
                </p>

                <div className="pr-14">
                  <h2 className="text-[28px] leading-none font-black italic uppercase tracking-tighter text-white md:text-[38px]">
                    Registrar aplicación
                  </h2>
                  <p className="mt-2 text-sm italic text-white/40">
                    Panel preventivo compacto para carga rápida.
                  </p>
                </div>
              </div>

              <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6 md:py-5">
                <form action={registrarAplicacion} className="space-y-4">
                  <input type="hidden" name="id_mascota" value={idMascota} />
                  <input type="hidden" name="tipo" value={categoria} />
                  <input type="hidden" name="descripcion" value="" />

                  <div className="grid gap-4 xl:grid-cols-12">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-4">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Tipo de registro
                      </label>

                      <div className="relative">
                        <select
                          name="categoria_visible"
                          value={categoria}
                          onChange={(event) =>
                            setCategoria(event.target.value as CategoriaRegistro)
                          }
                          className="h-12 w-full appearance-none rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 pr-12 text-sm font-semibold text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                        >
                          {OPCIONES_REGISTRO.map((item) => (
                            <option key={item.value} value={item.value}>
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
                          "mt-3 rounded-[1.15rem] border p-3",
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

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-2">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Fecha de aplicación
                      </label>
                      <input
                        type="date"
                        name="fecha_aplicacion"
                        required
                        className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                      />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-4">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Nombre del registro / producto
                      </label>
                      <input
                        type="text"
                        name="titulo"
                        required
                        placeholder={tituloPlaceholder}
                        className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                      />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-2">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Próximo evento
                      </label>
                      <input
                        type="date"
                        name="fecha_proximo_evento"
                        className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-12">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-2">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Lote
                      </label>
                      <input
                        type="text"
                        name="lote"
                        placeholder="Ej: ABC-1234"
                        className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                      />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-3">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Fabricante
                      </label>
                      <input
                        type="text"
                        name="fabricante"
                        placeholder="Ej: Merial, Zoetis..."
                        className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                      />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-3">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Vía de aplicación
                      </label>
                      <input
                        type="text"
                        name="via_aplicacion"
                        placeholder={viaPlaceholder}
                        className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                      />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-2">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Profesional
                      </label>
                      <input
                        type="text"
                        name="profesional_nombre"
                        placeholder="Nombre"
                        className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-emerald-500/30 focus:bg-white/[0.05]"
                      />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-2">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Matrícula
                      </label>
                      <input
                        type="text"
                        name="profesional_matricula"
                        placeholder="Ej: MP 1234"
                        className="h-12 w-full rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-emerald-500/30 focus:bg-white/[0.05]"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-12">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-8">
                      <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Observaciones
                      </label>
                      <textarea
                        name="observaciones"
                        rows={2}
                        placeholder="Dato complementario, reacción, indicación o nota breve..."
                        className="w-full rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                      />
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-4 backdrop-blur-md xl:col-span-4">
                      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Aval profesional
                      </p>
                      <p className="text-sm italic text-white/40">
                        Si completás profesional y matrícula, el registro se guarda como{" "}
                        <span className="font-medium text-emerald-300">
                          avalado_manual
                        </span>
                        .
                      </p>
                    </div>
                  </div>

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
        </div>
      ) : null}
    </>
  );
}
