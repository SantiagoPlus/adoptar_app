"use client";

import { createContext, useContext } from "react";
import type { MascotaModuleShell } from "@/lib/server/mascotas";

const MascotaModuleContext = createContext<MascotaModuleShell | null>(null);

export function MascotaModuleProvider({
  mascota,
  children,
}: {
  mascota: MascotaModuleShell;
  children: React.ReactNode;
}) {
  return (
    <MascotaModuleContext.Provider value={mascota}>
      {children}
    </MascotaModuleContext.Provider>
  );
}

export function useMascotaModuleData() {
  const context = useContext(MascotaModuleContext);

  if (!context) {
    throw new Error(
      "useMascotaModuleData debe usarse dentro de MascotaModuleProvider.",
    );
  }

  return context;
}
