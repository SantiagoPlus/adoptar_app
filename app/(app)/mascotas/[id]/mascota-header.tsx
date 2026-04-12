import { QrCode, PawPrint } from "lucide-react";

type MascotaHeaderProps = {
  mascota: {
    nombre: string;
    especie: string | null;
    raza: string | null;
    sexo: string | null;
    url_foto: string | null;
  };
};

export function MascotaHeader({ mascota }: MascotaHeaderProps) {
  const subtitulo = [mascota.especie, mascota.raza, mascota.sexo]
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="mb-6 space-y-5">
      <section className="overflow-hidden rounded-[22px] border border-white/10 bg-[#080808] p-5 md:p-6">
        <div className="flex items-center gap-5">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.03] text-white/35">
            {mascota.url_foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mascota.url_foto}
                alt={mascota.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <PawPrint className="h-12 w-12" />
            )}
          </div>

          <div className="min-w-0">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-400">
              Ficha médica
            </p>

            <h1 className="truncate text-4xl font-bold tracking-tight text-white md:text-5xl">
              {mascota.nombre}
            </h1>

            {subtitulo ? (
              <p className="mt-3 text-lg text-white/65">{subtitulo}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[22px] border border-white/10 bg-[#080808] p-4 md:p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-amber-500/10 text-amber-400">
              <QrCode className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-white">
                Configurar Acceso QR y Servicios
              </h2>
              <p className="mt-1 text-sm text-white/55">
                Vinculación con veterinarios, paseadores y pagos profesionales.
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Próximamente
          </div>
        </div>
      </section>
    </div>
  );
}
