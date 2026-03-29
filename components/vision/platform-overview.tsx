export function PlatformOverview() {
  return (
    <section className="mb-14">
      <div className="max-w-4xl">
        <p className="mb-2 text-sm text-black/55">Origen y estado actual</p>
        <h2 className="mb-6 text-3xl font-semibold tracking-tight text-black md:text-4xl">
          Por qué existe Adopta App
        </h2>

        <div className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 md:p-8">
          <p className="text-base leading-8 text-black/75 md:text-lg">
            <strong className="font-semibold text-black">
              Nuestra misión es desarrollar un sistema que integre toda la actividad en la vida con los animales.
            </strong>{" "}
            Hoy, la adopción, el cuidado, el seguimiento de la salud y el acceso
            a servicios suelen resolverse en espacios separados. Vemos una
            oportunidad en construir una plataforma que ayude a centralizar esa
            experiencia, conectando información, personas y servicios dentro de
            un mismo entorno.
          </p>

          <p className="mt-5 text-base leading-8 text-black/75 md:text-lg">
            Buscamos aportar una base más clara, útil y escalable para la vida
            con mascotas: un sistema que acompañe desde la adopción responsable
            hasta el cuidado cotidiano y la futura integración con profesionales
            y servicios.
          </p>
        </div>
      </div>
    </section>
  );
}
