"use client";

import { HistorialContent } from "./historial-content";
import { useMascotaShell } from "../mascota-module-provider";
import type { HistorialItem } from "../types";

export function HistorialTab({
  historial,
}: {
  historial: HistorialItem[];
}) {
  const mascota = useMascotaShell();

  return (
    <HistorialContent
      idMascota={mascota.id_mascota}
      historial={historial}
    />
  );
}
