"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { Activity, FileText, Pill, Scissors, Stethoscope, X } from "lucide-react";
import { registrarVisita } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-14 items-center justify-center rounded-2xl bg-emerald-500 px-6 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Guardando..." : "CONFIRMAR EVENTO CLÍNICO"}
    </button>
  );
}

function CategoriaButton({
  value,
  label,
  icon,
  active,
  onClick,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={[
        "flex h-14 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition",
        active
          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
          : "border-white/10 bg-white/[0.03] text-white/55 hover:bg-white/[0.05] hover:text-white",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}

export function RegistrarVisitaModal({
  idMascota,
}: {
  idMascota: string;
}) {
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] = useState("consulta");

  const tituloPlaceholder = useMemo(() => {
    if (categoria === "consulta") return "Ej: Control dermatológico";
    if (categoria === "estudio") return "Ej: Hemograma completo";
    if (categoria === "cirugia") return "Ej: Esterilización laparoscópica";
    return "Ej: Tratamiento antibiótico";
  }, [categoria]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/80 transition hover:border-emerald-500/25 hover:bg-white/[0.07] hover:text-white"
      >
        <Activity className="h-4 w-4 text-white/65" />
        Agregar Visita
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/10 bg-[#080808] shadow-2xl">
            <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-white/10" />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-white/70 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="px-8 pb-8 pt-6 md:px-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">Registrar Visita</h2>
                <p className="mt-2 text-sm text-white/55">
                  Ingresá los datos del evento clínico o intervención realizada.
                </p>
              </div>

              <form action={registrarVisita} className="space-y-6">
                <input type="hidden" name="id_mascota" value={idMascota} />
                <input type="hidden" name="categoria" value={categoria} />

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                    Categoría
                  </p>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <CategoriaButton
                      value="consulta"
                      label="Consulta"
                      icon={<Stethoscope className="h-4 w-4" />}
                      active={categoria === "consulta"}
                      onClick={setCategoria}
                    />
                    <CategoriaButton
                      value="estudio"
                      label="Estudio"
                      icon={<FileText className="h-4 w-4" />}
                      active={categoria === "estudio"}
                      onClick={setCategoria}
                    />
                    <CategoriaButton
                      value="cirugia"
                      label="Cirugía"
                      icon={<Scissors className="h-4 w-4" />}
                      active={categoria === "cirugia"}
                      onClick={setCategoria}
                    />
                    <CategoriaButton
                      value="medicacion_tratamiento"
                      label="Tratamiento"
                      icon={<Pill className="h-4 w-4" />}
                      active={categoria === "medicacion_tratamiento"}
                      onClick={setCategoria}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Título del evento
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      required
                      placeholder={tituloPlaceholder}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Fecha de visita
                    </label>
                    <input
                      type="date"
                      name="fecha_visita"
                      required
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                    Motivo de consulta
                  </label>
                  <input
                    type="text"
                    name="motivo_consulta"
                    required
                    placeholder="Ej: revisión de control, decaimiento, estudio prequirúrgico..."
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Diagnóstico
                    </label>
                    <textarea
                      name="diagnostico"
                      rows={4}
                      placeholder="Detalle diagnóstico o hallazgo principal..."
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Tratamiento indicado
                    </label>
                    <textarea
                      name="tratamiento_indicado"
                      rows={4}
                      placeholder="Indicación general, conducta terapéutica..."
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Tipo de estudio
                    </label>
                    <input
                      type="text"
                      name="tipo_estudio"
                      placeholder="Ej: radiografía, hemograma, ecografía..."
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Resultado resumen
                    </label>
                    <input
                      type="text"
                      name="resultado_resumen"
                      placeholder="Ej: resultado normal, hallazgo leve..."
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Medicación / tratamiento
                    </label>
                    <input
                      type="text"
                      name="medicacion_o_tratamiento"
                      placeholder="Ej: antibiótico oral"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Dosis
                    </label>
                    <input
                      type="text"
                      name="dosis"
                      placeholder="Ej: 1 comprimido cada 12 hs"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Duración
                    </label>
                    <input
                      type="text"
                      name="duracion_tratamiento"
                      placeholder="Ej: 7 días"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="md:col-span-2">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Médico veterinario
                    </label>
                    <input
                      type="text"
                      name="profesional_nombre"
                      placeholder="Nombre completo"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Matrícula
                    </label>
                    <input
                      type="text"
                      name="profesional_matricula"
                      placeholder="MP 1234"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      Institución
                    </label>
                    <input
                      type="text"
                      name="institucion"
                      placeholder="Clínica / veterinaria"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                    Observaciones
                  </label>
                  <textarea
                    name="observaciones"
                    rows={3}
                    placeholder="Notas adicionales del evento..."
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-transparent px-6 text-sm font-semibold text-white/75 transition hover:bg-white/[0.04] hover:text-white"
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
