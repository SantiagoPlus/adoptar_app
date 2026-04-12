"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { Syringe, Stethoscope } from "lucide-react";

export function MascotaSectionNav({
  idMascota,
}: {
  idMascota: string;
}) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment();

  const libretaHref = `/mascotas/${idMascota}/libreta`;
  const historialHref = `/mascotas/${idMascota}/historial`;

  useEffect(() => {
    router.prefetch(libretaHref);
    router.prefetch(historialHref);
  }, [router, libretaHref, historialHref]);

  const isLibreta = segment === "libreta" || segment === null;
  const isHistorial = segment === "historial";

  return (
    <div className="mb-6 rounded-xl bg-white/[0.03] p-1.5">
      <div className="grid grid-cols-2 gap-2">
        <Link
          href={libretaHref}
          scroll={false}
          className={[
            "flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition active:scale-[0.98]",
            isLibreta
              ? "bg-amber-500 text-black"
              : "bg-transparent text-white/55 hover:bg-white/[0.03] hover:text-white",
          ].join(" ")}
        >
          <Syringe className="h-4 w-4" />
          Libreta Sanitaria
        </Link>

        <Link
          href={historialHref}
          scroll={false}
          className={[
            "flex h-12 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition active:scale-[0.98]",
            isHistorial
              ? "bg-emerald-500 text-black"
              : "bg-transparent text-white/55 hover:bg-white/[0.03] hover:text-white",
          ].join(" ")}
        >
          <Stethoscope className="h-4 w-4" />
          Historial Clínico
        </Link>
      </div>
    </div>
  );
}
