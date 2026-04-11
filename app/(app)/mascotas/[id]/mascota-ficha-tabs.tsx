"use client";

import React, { useState } from "react";
import { Syringe, Stethoscope, PlusCircle, Activity } from "lucide-react";

type LibretaItem = {
  id_registro: string;
  tipo: string;
  descripcion: string;
  fecha_aplicacion: string;
  fecha_vencimiento: string | null;
  producto_lote: string | null;
};

type HistorialItem = {
  id_historial: string;
  fecha_visita: string;
  motivo_consulta: string;
  diagnostico: string | null;
  tratamiento_indicado: string | null;
};

function formatFecha(value: string | null) {
  if (!value) return "No informado";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("es-AR");
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
  const [activeTab, setActiveTab] = useState<"libreta" | "historial">("libreta");

  return (
    <div>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <button
          onClick={() => setActiveTab("libreta")}
          className={[
            "flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-medium transition",
            activeTab === "libreta"
              ? "bg-amber-500 text-black"
              : "bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white",
          ].join(" ")}
        >
          <Syringe className="h-4 w-4" />
          <span className="truncate">Libreta Sanitaria</span>
        </button>

        <button
          onClick={() => setActiveTab("historial")}
          className={[
            "flex items-center justify-center gap-2 rounded-2xl px-4 py-4 text-sm font-medium transition",
            activeTab === "historial"
              ? "bg-amber-500 text-black"
              : "bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white",
          ].join(" ")}
        >
          <Stethoscope className="h-4 w-4" />
          <span className="truncate">Historial Clínico</span>
        </button>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-5 md:p-7">
        {activeTab === "libreta" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">
                Aplicaciones y Prevención
              </h2>

              <button className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10">
                <PlusCircle className="h-4 w-4" />
                <span>Registrar Dosis</span>
              </button>
            </div>

            {libreta.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/30 px-6 py-12 text-center">
                <p className="text-lg text-white/55">
                  La libreta sanitaria está vacía.
                </p>
                <p className="mt-3 text-base text-white/35">
                  Acá verás vacunas, desparasitaciones y aplicaciones preventivas.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {libreta.map((item) => (
                  <div
                    key={item.id_registro}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="mb-2 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-blue-300">
                          {item.tipo}
                        </span>
                        <h3 className="text-base font-medium text-white">
                          {item.descripcion}
                        </h3>
                      </div>

                      <div className="text-sm text-white/60 md:text-right">
                        <p>
                          Aplicado:{" "}
                          <span className="text-white">
                            {formatFecha(item.fecha_aplicacion)}
                          </span>
                        </p>

                        {item.fecha_vencimiento && (
                          <p className="mt-1 text-amber-500/80">
                            Próximo refuerzo:{" "}
                            <span className="font-medium">
                              {formatFecha(item.fecha_vencimiento)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {item.producto_lote ? (
                      <p className="text-xs text-white/40">
                        Lote / producto: {item.producto_lote}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "historial" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">Bitácora Médica</h2>

              <button className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium transition hover:bg-white/10">
                <PlusCircle className="h-4 w-4" />
                <span>Agregar Visita</span>
              </button>
            </div>

            {historial.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/30 px-6 py-12 text-center">
                <p className="text-lg text-white/55">
                  Sin historial de visitas o controles médicos.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {historial.map((visita) => (
                  <div
                    key={visita.id_historial}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black ring-1 ring-white/10">
                          <Activity className="h-3.5 w-3.5 text-amber-500" />
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-medium text-amber-500">
                            {formatFecha(visita.fecha_visita)}
                          </p>
                          <h3 className="text-base font-medium text-white">
                            {visita.motivo_consulta}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {visita.diagnostico ? (
                      <div className="mt-3">
                        <p className="mb-1 text-[11px] uppercase text-white/40">
                          Diagnóstico
                        </p>
                        <p className="rounded-lg bg-black/30 p-3 text-sm leading-relaxed text-white/80">
                          {visita.diagnostico}
                        </p>
                      </div>
                    ) : null}

                    {visita.tratamiento_indicado ? (
                      <div className="mt-3">
                        <p className="mb-1 text-[11px] uppercase text-white/40">
                          Tratamiento Indicado
                        </p>
                        <p className="text-sm leading-relaxed text-white/80">
                          {visita.tratamiento_indicado}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
