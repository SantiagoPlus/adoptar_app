"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { X, Camera, Plus } from "lucide-react";
import { registrarAplicacion } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-14 items-center justify-center rounded-xl bg-amber-500 px-6 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Guardando..." : "CONFIRMAR REGISTRO AVALADO"}
    </button>
  );
}

function TipoButton({
  value,
  label,
  active,
  onClick,
}: {
  value: string;
  label: string;
  active: boolean;
  onClick: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={[
        "flex h-14 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition",
        active
          ? "border-amber-500 bg-amber-500/10 text-amber-400"
          : "border-white/10 bg-white/[0.03] text-white/55 hover:bg-white/[0.05] hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export function RegistrarAplicacionModal({
  idMascota,
}: {
  idMascota: string;
}) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState("vacunacion");

  const descripcionPlaceholder = useMemo(() => {
    if (tipo === "vacunacion") return "Ej: Rabia, Séxtuple, Triple Felina...";
    if (tipo === "desparasitacion_interna") return "Ej: Desparasitación interna comprimido...";
    if (tipo === "desparasitacion_externa") return "Ej: Pipeta antipulgas, collar...";
    return "Ej: Control preventivo general...";
  }, [tipo]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-14 items-center gap-3 rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:opacity-90"
      >
        <Plus className="h-4 w-4" />
        REGISTRAR DOSIS / VISITA
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[24px] border border-white/10 bg-[#080808] shadow-2xl">
            <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-white/10" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-8 pb-8 pt-6 md:px-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Registrar Aplicación
                </h2>
                <p className="mt-2 text-sm text-white/55">
                  Ingresá los datos de la nueva dosis aplicada.
                </p>
              </div>

              <form action={registrarAplicacion} className="space-y-6">
                <input type="hidden" name="id_mascota" value={idMascota} />
                <input type="hidden" name="tipo" value={tipo} />

                <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Tipo de registro
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <TipoButton
                        value="vacunacion"
                        label="Vacuna"
                        active={tipo === "vacunacion"}
                        onClick={setTipo}
                      />
                      <TipoButton
                        value="desparasitacion_interna"
                        label="Parásitos"
                        active={tipo === "desparasitacion_interna"}
                        onClick={setTipo}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Fecha de aplicación
                    </label>
                    <input
                      type="date"
                      name="fecha_aplicacion"
                      required
                      className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                    Descripción / producto
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    required
                    placeholder={descripcionPlaceholder}
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                  />
                </div>

                <input type="hidden" name="descripcion" value="" />

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Lote / etiqueta
                    </label>
                    <input
                      type="text"
                      name="lote"
                      placeholder="Ej: ABC-1234"
                      className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Fabricante
                    </label>
                    <input
                      type="text"
                      name="fabricante"
                      placeholder="Ej: Merial, Zoetis..."
                      className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Fecha prox.
                    </label>
                    <input
                      type="date"
                      name="fecha_proximo_evento"
                      className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="border-t border-white/8 pt-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                        Médico veterinario
                      </label>
                      <input
                        type="text"
                        name="profesional_nombre"
                        placeholder="Nombre completo"
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                        Matrícula (aval)
                      </label>
                      <input
                        type="text"
                        name="profesional_matricula"
                        placeholder="Ej: MP 1234 / MN 5678"
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                    Evidencia veterinaria (foto sello/etiqueta)
                  </label>

                  <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-white/35">
                    <div className="flex items-center gap-3">
                      <Camera className="h-5 w-5" />
                      <span>Capturar Firma o Sticker del Frasco</span>
                    </div>
                  </div>
                </div>

                <input type="hidden" name="estado_validacion" value="cargado_por_tutor" />

                <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-14 items-center justify-center rounded-xl border border-white/10 bg-transparent px-6 text-sm font-semibold text-white/75 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    CANCELAR
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
