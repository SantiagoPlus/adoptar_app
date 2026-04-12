"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  X,
  Plus,
  ShieldPlus,
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

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-12 md:h-14 items-center justify-center rounded-[1.25rem] md:rounded-[1.5rem] border border-amber-500/20 bg-amber-500 px-6 text-sm font-black uppercase tracking-[0.08em] text-black transition hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Guardando..." : "Guardar registro preventivo"}
    </button>
  );
}

export function RegistrarAplicacionModal({
  idMascota,
}: {
  idMascota: string;
}) {
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] = useState<
    | "vacunacion"
    | "desparasitacion_interna"
    | "desparasitacion_externa"
    | "control_preventivo"
  >("vacunacion");

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
    if (categoria === "desparasitacion_externa")
      return "Ej: Tópica, collar, spot-on...";
    return "Ej: Consulta presencial...";
  }, [categoria]);

  const ActiveIcon = activeOption.icon;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 md:h-14 items-center gap-3 rounded-[1.25rem] md:rounded-[1.5rem] border border-white/10 bg-white text-sm font-black uppercase tracking-[0.08em] text-black transition hover:opacity-95 active:scale-95"
      >
        <div className="flex h-full items-center gap-3 px-5 md:px-6">
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Registrar aplicación
        </div>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] md:rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] shadow-2xl">
            <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-amber-500/10 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-emerald-500/10 blur-[90px]" />

            <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-white/10" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-[1rem] border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white active:scale-95"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <div className="px-5 pb-6 pt-6 md:px-8 md:pb-8 md:pt-7">
              <div className="mb-6 md:mb-8">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                  Libreta sanitaria
                </p>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                  Registrar aplicación
                </h2>
                <p className="mt-2 text-sm italic text-white/40">
                  Cargá un registro preventivo coherente con la libreta sanitaria.
                </p>
              </div>

              <form action={registrarAplicacion} className="space-y-6">
                <input type="hidden" name="id_mascota" value={idMascota} />
                <input type="hidden" name="tipo" value={categoria} />
                <input type="hidden" name="descripcion" value="" />

                <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                      Tipo de registro
                    </label>

                    <div className="relative">
                      <select
                        name="categoria_visible"
                        value={categoria}
                        onChange={(event) =>
                          setCategoria(
                            event.target.value as
                              | "vacunacion"
                              | "desparasitacion_interna"
                              | "desparasitacion_externa"
                              | "control_preventivo",
                          )
                        }
                        className="h-12 md:h-14 w-full appearance-none rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 pr-12 text-sm font-semibold text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
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
                        "mt-4 rounded-[1.25rem] border p-4",
                        activeOption.border,
                        activeOption.bg,
                      ].join(" ")}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={[
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border",
                            activeOption.border,
                            activeOption.bg,
                            activeOption.accent,
                          ].join(" ")}
                        >
                          <ActiveIcon className="h-5 w-5" strokeWidth={1.5} />
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

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                      Fecha de aplicación
                    </label>
                    <input
                      type="date"
                      name="fecha_aplicacion"
                      required
                      className="h-12 md:h-14 w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                    />
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                  <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                    Nombre del registro / producto
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    required
                    placeholder={tituloPlaceholder}
                    className="h-12 md:h-14 w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                      Lote
                    </label>
                    <input
                      type="text"
                      name="lote"
                      placeholder="Ej: ABC-1234"
                      className="h-12 md:h-14 w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                    />
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                      Fabricante
                    </label>
                    <input
                      type="text"
                      name="fabricante"
                      placeholder="Ej: Merial, Zoetis..."
                      className="h-12 md:h-14 w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                    />
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                      Vía de aplicación
                    </label>
                    <input
                      type="text"
                      name="via_aplicacion"
                      placeholder={viaPlaceholder}
                      className="h-12 md:h-14 w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                    />
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                    <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                      Próximo evento
                    </label>
                    <input
                      type="date"
                      name="fecha_proximo_evento"
                      className="h-12 md:h-14 w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                    />
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                  <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                    Aval profesional
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Profesional
                      </label>
                      <input
                        type="text"
                        name="profesional_nombre"
                        placeholder="Nombre completo"
                        className="h-12 md:h-14 w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-emerald-500/30 focus:bg-white/[0.05]"
                      />
                    </div>

                    <div>
                      <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                        Matrícula
                      </label>
                      <input
                        type="text"
                        name="profesional_matricula"
                        placeholder="Ej: MP 1234 / MN 5678"
                        className="h-12 md:h-14 w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 text-white outline-none transition hover:border-white/15 focus:border-emerald-500/30 focus:bg-white/[0.05]"
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-xs italic text-white/35">
                    Si completás profesional y matrícula, el registro se guarda como{" "}
                    <span className="text-emerald-300">avalado_manual</span>.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
                  <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.3em] text-white/35">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    rows={3}
                    placeholder="Dato complementario, reacción, indicación o nota breve..."
                    className="w-full rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition hover:border-white/15 focus:border-amber-500/30 focus:bg-white/[0.05]"
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-[220px_1fr]">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-12 md:h-14 items-center justify-center rounded-[1.25rem] md:rounded-[1.5rem] border border-white/10 bg-transparent px-6 text-sm font-black uppercase tracking-[0.08em] text-white/70 transition hover:border-white/15 hover:bg-white/[0.04] hover:text-white active:scale-95"
                  >
                    Cancelar
                  </button>

                  <SubmitButton />
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
