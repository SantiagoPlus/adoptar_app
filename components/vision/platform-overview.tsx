import Link from "next/link";

export function PlatformOverview() {
  return (
    <section className="mb-14">
      <div className="max-w-4xl">
        <p className="text-base leading-7 text-black md:text-lg">
          <strong className="font-semibold text-black">
            Nuestra misión es desarrollar un sistema que integre toda la actividad en la vida con los animales.
          </strong>
        </p>

        <p className="mt-5 text-base leading-7 text-black/70 md:text-lg">
          Hoy, la adopción, el cuidado, el seguimiento de la salud y el acceso
          a servicios suelen resolverse en espacios separados. Vemos una
          oportunidad en construir una plataforma que ayude a centralizar esa
          experiencia, conectando información, personas y servicios dentro de un
          mismo entorno.
        </p>

        <p className="mt-5 text-base leading-7 text-black/70 md:text-lg">
          Buscamos aportar una base clara y centralizada para la vida
          con mascotas: un sistema que acompañe desde la adopción responsable
          hasta el cuidado cotidiano y la futura integración con profesionales
          y servicios.
        </p>

        <p className="mt-5 text-base leading-7 text-black/70 md:text-lg">
          Descubrí cómo estamos construyendo un negocio a largo plazo, impulsado
          por una misión, y por qué creemos que esto es solo el comienzo en
          nuestra sección de{" "}
          <Link
            href="/actualizaciones"
            className="font-medium text-blue-700 transition hover:text-blue-800"
          >
            roadmap y actualizaciones
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
