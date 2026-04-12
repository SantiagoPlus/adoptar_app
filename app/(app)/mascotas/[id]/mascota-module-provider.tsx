"use client";

import { createContext, useContext } from "react";
import type { MascotaModuleShell } from "@/lib/server/mascotas";

const MascotaShellContext = createContext<MascotaModuleShell | null>(null);

export function MascotaShellProvider({
  mascota,
  children,
}: {
  mascota: MascotaModuleShell;
  children: React.ReactNode;
}) {
  return (
    <MascotaShellContext.Provider value={mascota}>
      {children}
    </MascotaShellContext.Provider>
  );
}

export function useMascotaShell() {
  const context = useContext(MascotaShellContext);

  if (!context) {
    throw new Error(
      "useMascotaShell debe usarse dentro de MascotaShellProvider.",
    );
  }

  return context;
}
