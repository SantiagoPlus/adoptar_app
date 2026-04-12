"use client";

import { createContext, useContext } from "react";
import type { MascotaModuleData } from "@/lib/server/mascotas";

const MascotaModuleContext = createContext<MascotaModuleData | null>(null);

export function MascotaModuleProvider({
  value,
  children,
}: {
  value: MascotaModuleData;
  children: React.ReactNode;
}) {
  return (
    <MascotaModuleContext.Provider value={value}>
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
