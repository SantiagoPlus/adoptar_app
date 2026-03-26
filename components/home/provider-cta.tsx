import Link from "next/link";
import { BriefcaseBusiness, Stethoscope, Users, PawPrint } from "lucide-react";

export function ProviderCta() {
  return (
    <section id="prestadores" className="mb-14">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="grid gap-8 px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm text-white/60">
              Oportunidad para profesionales y prestadores
            </p>

            <h2 className="mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
              ¿Ofrecés servicios para mascotas?
            </h2>

            <p className="max-w-2xl text-base leading-7 text-white/70 md:text-lg">
              Adopta App también busca convertirse en un espacio para
              veterinarias, entrenadores, paseadores, cuidadores y otros
              perfiles que quieran ofrecer servicios dentro de una comunidad
              vinculada al cuidado animal.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/auth/login"
                className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
              >
                Quiero ofrecer mis servicios
              </Link>

              <Link
                href="#vision"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Conocer futuras funcionalidades
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <Stethoscope className="mb-4 h-5 w-5 text-white" />
              <h3 className="mb-2 text-base font-semibold">Veterinarias</h3>
              <p className="text-sm leading-6 text-white/65">
                Espacio para dar visibilidad a servicios de salud y cuidado.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <Users className="mb-4 h-5 w-5 text-white" />
              <h3 className="mb-2 text-base font-semibold">Entrenadores y cuidadores</h3>
              <p className="text-sm leading-6 text-white/65">
                Nuevas formas de acercarse a dueños de mascotas y generar confianza.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <PawPrint className="mb-4 h-5 w-5 text-white" />
              <h3 className="mb-2 text-base font-semibold">Paseadores y servicios afines</h3>
              <p className="text-sm leading-6 text-white/65">
                Un canal temático para conectarse con una comunidad específica.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <BriefcaseBusiness className="mb-4 h-5 w-5 text-white" />
              <h3 className="mb-2 text-base font-semibold">Presencia profesional</h3>
              <p className="text-sm leading-6 text-white/65">
                La plataforma apunta a abrir nuevas oportunidades dentro del ecosistema mascota.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
