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

function ActionButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white/80 transition hover:border-amber-500/25 hover:bg-white/[0.07] hover:text-white">
      <PlusCircle className="h-4 w-4 text-white/65" />
      <span>{children}</span>
    </button>
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
  const [activeTab, setActiveTab] = useState<"libreta" | "historial">("libreta");

  return (
    <div>
      <div className="mb-5 rounded-xl bg-white/[0.03] p-1.5">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab("libreta")}
            className={[
              "flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition",
              activeTab === "libreta"
                ? "bg-amber-500 text-black"
                : "bg-transparent text-white/70 hover:bg-white/[0.04] hover:text-white",
            ].join(" ")}
          >
            <Syringe className="h-4 w-4" />
            <span className="truncate">Libreta Sanitaria</span>
          </button>

          <button
            onClick={() => setActiveTab("historial")}
            className={[
              "flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition",
              activeTab === "historial"
                ? "bg-amber-500 text-black"
                : "bg-transparent text-white/70 hover:bg-white/[0.04] hover:text-white",
            ].join(" ")}
          >
            <Stethoscope className="h-4 w-4" />
            <span className="truncate">Historial Clínico</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
        {activeTab === "libreta" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">
                Aplicaciones y Prevención
              </h2>

              <ActionButton>Registrar Dosis</ActionButton>
            </div>

            {libreta.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/25 px-6 py-12 text-center">
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
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.045]"
                  >
                    <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className="mb-2 inline-block rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-blue-300">
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
                      <div className="mt-3 border-t border-white/8 pt-3">
                        <p className="text-xs text-white/40">
                          Lote / producto: {item.producto_lote}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "historial" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-white">Bitácora Médica</h2>

              <ActionButton>Agregar Visita</ActionButton>
            </div>

            {historial.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/25 px-6 py-12 text-center">
                <p className="text-lg text-white/55">
                  Sin historial de visitas o controles médicos.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {historial.map((visita) => (
                  <div
                    key={visita.id_historial}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/15 hover:bg-white/[0.045]"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/40">
                          <Activity className="h-4 w-4 text-amber-500" />
                        </div>

                        <div>
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-amber-500/90">
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
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-white/40">
                          Diagnóstico
                        </p>
                        <p className="rounded-lg bg-black/30 p-3 text-sm leading-relaxed text-white/80">
                          {visita.diagnostico}
                        </p>
                      </div>
                    ) : null}

                    {visita.tratamiento_indicado ? (
                      <div className="mt-3">
                        <p className="mb-1 text-[11px] uppercase tracking-wide text-white/40">
                          Tratamiento indicado
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
