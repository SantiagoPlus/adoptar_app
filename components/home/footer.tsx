import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <h3 className="mb-4 text-xl font-semibold tracking-tight text-white">
              Adopta App
            </h3>
            <p className="max-w-sm text-sm leading-6 text-white/65">
              Una plataforma pensada para conectar adopciones responsables,
              acompañar el cuidado de las mascotas y abrir nuevas oportunidades
              para servicios vinculados al bienestar animal.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Plataforma
            </h4>
            <ul className="space-y-3 text-sm text-white/65">
              <li>Gestión de Mascotas</li>
              <li>Servicios para Mascotas</li>
              <li>
                <Link href="/vision" className="transition hover:text-white">
                  Visión Adopta App
                </Link>
              </li>
              <li>
                <Link
                  href="/actualizaciones"
                  className="transition hover:text-white"
                >
                  Novedades y actualizaciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Para usuarios
            </h4>
            <ul className="space-y-3 text-sm text-white/65">
              <li>
                <Link href="/animales" className="transition hover:text-white">
                  Centro de Adopción
                </Link>
              </li>
              <li>
                <Link href="/perfil" className="transition hover:text-white">
                  Cuidá a tu Mascota
                </Link>
              </li>
              <li>Servicios para Mascotas</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Para profesionales
            </h4>
            <ul className="space-y-3 text-sm text-white/65">
              <li>Sumarse a la plataforma</li>
              <li>Contacto</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              Ayuda y legal
            </h4>
            <ul className="space-y-3 text-sm text-white/65">
              <li>Soporte</li>
              <li>Reportar un error</li>
              <li>Política de privacidad</li>
              <li>Términos de uso</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-sm leading-6 text-white/50">
            Adopta App busca construir un ecosistema más ordenado para la
            adopción, el cuidado y los servicios alrededor de las mascotas.
          </p>
        </div>
      </div>
    </footer>
  );
}
