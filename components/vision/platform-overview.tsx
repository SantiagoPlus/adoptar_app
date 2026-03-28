import { FolderHeart, Search, FileText, Layers3 } from "lucide-react";

const currentCapabilities = [
  {
    title: "Publicaciones activas de adopción",
    description:
      "Los usuarios pueden publicar animales en adopción con información, imágenes y estado de disponibilidad.",
    icon: FolderHeart,
  },
  {
    title: "Exploración pública",
    description:
      "Las personas interesadas pueden recorrer publicaciones, conocer mejor cada caso y entrar en el espacio público de adopciones.",
    icon: Search,
  },
  {
    title: "Gestión básica del proceso",
    description:
      "La plataforma ya contempla el circuito de solicitudes vinculado a publicaciones para ordenar mejor el proceso de adopción.",
    icon: FileText,
  },
  {
    title: "Base estructural para crecer",
    description:
      "El MVP actual no busca cerrar la historia del producto, sino construir una base operativa real para futuros módulos.",
    icon: Layers3,
  },
];

export function PlatformOverview() {
  return (
    <section className="mb-14">
      <div className="mb-8 max-w-4xl">
        <p className="mb-2 text-sm text-black/55">Origen y estado actual</p>
        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-black md:text-4xl">
          Por qué nace y qué construye hoy
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 md:p-7">
          <h3 className="mb-4 text-2xl font-semibold text-black">
            Por qué nace Adopta App
          </h3>

          <div className="space-y-4 text-base leading-7 text-black/70">
            <p>
              La experiencia alrededor de una mascota suele resolverse en
              espacios fragmentados. La adopción, el seguimiento de su cuidado y
              el acceso a servicios vinculados al bienestar animal muchas veces
              no están conectados entre sí.
            </p>

            <p>
              Adopta App nace con la intención de construir un entorno más claro
              y útil: un lugar donde la adopción responsable tenga mejores
              herramientas, donde el cuidado cotidiano pueda organizarse mejor y
              donde, con el tiempo, también se integren nuevas oportunidades
              para la vida con mascotas.
            </p>
          </div>
        </article>

        <article className="rounded-3xl border border-black/10 bg-black/[0.02] p-6 md:p-7">
          <h3 className="mb-4 text-2xl font-semibold text-black">
            Qué permite hoy la plataforma
          </h3>

          <div className="grid gap-4">
            {currentCapabilities.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.03]">
                    <Icon className="h-[18px] w-[18px] text-black" />
                  </div>

                  <h4 className="mb-2 text-base font-semibold text-black">
                    {item.title}
                  </h4>
                  <p className="text-sm leading-6 text-black/65">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-5 text-sm leading-6 text-black/50">
            La versión actual del proyecto busca consolidar una base operativa
            real antes de abrir nuevos módulos de negocio y nuevas experiencias
            dentro del ecosistema.
          </p>
        </article>
      </div>
    </section>
  );
}
