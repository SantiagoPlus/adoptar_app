"use client";

import { HistorialContent } from "./historial-content";
import { useMascotaModuleData } from "../mascota-module-provider";

export function HistorialTab() {
  const { mascota, historial } = useMascotaModuleData();

  return (
    <HistorialContent
      idMascota={mascota.id_mascota}
      historial={historial}
    />
  );
}
