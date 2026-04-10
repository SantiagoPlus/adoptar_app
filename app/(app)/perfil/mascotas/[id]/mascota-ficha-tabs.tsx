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
      <div className="mb-6 flex space-x-2 rounded-xl bg-white/5 p-1">
        <button
          onClick={() => setActiveTab("libreta")}
          className={[
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition",
            activeTab === "libreta"
              ? "bg-amber-500 text-black shadow"
              : "text-white/60 hover:text-white hover:bg-white/5",
          ].join(" ")}
        >
          <Syringe className="h-4 w-4" />
          Libreta Sanitaria
        </button>
        <button
          onClick={() => setActiveTab("historial")}
          className={[
            "flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition",
            activeTab === "historial"
              ? "bg-amber-500 text-black shadow"
              : "text-white/60 hover:text-white hover:bg-white/5",
          ].join(" ")}
        >
          <Stethoscope className="h-4 w-4" />
          Historial Clínico
        </button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-white/80 md:p-8">
        {activeTab === "libreta" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Aplicaciones y Prevención</h2>
              <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium transition hover:bg-white/10">
                <PlusCircle className="h-4 w-4" />
                Registrar Dosis
              </button>
            </div>
            
            {libreta.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-black/40 p-10 text-center">
                <p className="text-white/50">La libreta sanitaria está vacía.</p>
                <p className="text-sm text-white/40 mt-1">Acá verás vacunas, desparasitaciones y aplicaciones preventivas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {libreta.map((item) => (
                  <div key={item.id_registro} className="flex flex-col md:flex-row md:items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 py-5 gap-4">
                    <div>
                      <span className="mb-1 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-300 uppercase tracking-wide">
                        {item.tipo}
                      </span>
                      <h3 className="text-lg font-medium text-white">{item.descripcion}</h3>
                    </div>
                    <div className="flex flex-col md:items-end text-sm">
                      <p className="text-white/60">
                        Aplicado: <span className="text-white">{item.fecha_aplicacion}</span>
                      </p>
                      {item.fecha_vencimiento && (
                        <p className="text-amber-500/80 mt-1 flex items-center gap-1.5">
                          Próximo refuerzo: <span className="font-medium">{item.fecha_vencimiento}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "historial" && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Bitácora Médica</h2>
              <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium transition hover:bg-white/10">
                <PlusCircle className="h-4 w-4" />
                Agregar Visita
              </button>
            </div>

            {historial.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-black/40 p-10 text-center">
                <p className="text-white/50">Sin historial de visitas o controles médicos.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-white/10 pl-6 ml-3 space-y-8 py-4">
                {historial.map((visita) => (
                  <div key={visita.id_historial} className="relative">
                    <div className="absolute -left-[35px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black ring-2 ring-white/10">
                      <Activity className="h-3 w-3 text-amber-500" />
                    </div>
                    
                    <div className="mb-1">
                      <span className="text-xs font-medium text-amber-500">{visita.fecha_visita}</span>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <h3 className="mb-2 text-lg font-medium text-white">{visita.motivo_consulta}</h3>
                      
                      {visita.diagnostico && (
                        <div className="mt-3">
                          <p className="text-xs uppercase text-white/40 mb-1">Diagnóstico</p>
                          <p className="text-sm text-white/80 leading-relaxed bg-black/30 p-3 rounded-lg">{visita.diagnostico}</p>
                        </div>
                      )}
                      
                      {visita.tratamiento_indicado && (
                        <div className="mt-3">
                          <p className="text-xs uppercase text-white/40 mb-1">Tratamiento Indicado</p>
                          <p className="text-sm text-white/80 leading-relaxed">{visita.tratamiento_indicado}</p>
                        </div>
                      )}
                    </div>
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
