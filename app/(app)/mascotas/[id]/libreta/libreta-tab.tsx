"use client";

import { LibretaContent } from "./libreta-content";
import { useMascotaModuleData } from "../mascota-module-provider";
import type { LibretaItem } from "../types";

export function LibretaTab({
  libreta,
}: {
  libreta: LibretaItem[];
}) {
  const mascota = useMascotaModuleData();

  return (
    <LibretaContent
      idMascota={mascota.id_mascota}
      libreta={libreta}
      ownerDisplayName={mascota.owner_display_name}
      qrMicrochip={mascota.qr_microchip}
    />
  );
}
