"use client";

import { LibretaContent } from "./libreta-content";
import { useMascotaModuleData } from "../mascota-module-provider";

export function LibretaTab() {
  const { mascota, libreta } = useMascotaModuleData();

  return <LibretaContent idMascota={mascota.id_mascota} libreta={libreta} />;
}
