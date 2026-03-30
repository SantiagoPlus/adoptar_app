export type UpdateStatus = "Hecho" | "En progreso" | "Próximo";

export type UpdatePost = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  date: string;
  status: UpdateStatus;
  content: string[];
};

export const updates: UpdatePost[] = [
  {
    slug: "estado-actual-del-mvp",
    category: "Novedades y Actualizaciones",
    title: "Estado actual del MVP",
    summary:
      "El producto ya superó la etapa de maqueta: hoy Adopta App cuenta con un circuito funcional de publicaciones, solicitudes, gestión del publicador y una capa pública más clara para presentar el proyecto.",
    date: "29 Mar 2026",
    status: "Hecho",
    content: [
      "Adopta App ya dejó atrás la fase de prueba conceptual. En este punto, el MVP cuenta con un circuito principal operativo que permite publicar animales, gestionar solicitudes, pausar publicaciones, concretar adopciones y mantener un archivo de casos cerrados.",
      "A nivel técnico, la infraestructura sigue siendo adecuada para la etapa del proyecto. El stack actual —Next.js, Supabase, Vercel y GitHub— permite iterar con velocidad, resolver autenticación, almacenamiento y despliegue continuo sin sumar complejidad innecesaria.",
      "Además del núcleo funcional, durante los últimos bloques de trabajo se consolidaron avances importantes sobre el perfil del usuario, las imágenes reales de animales en Storage, la gestión visual de publicaciones y una arquitectura más ordenada en el módulo principal del publicador.",
      "La lectura actual del proyecto es positiva: el circuito producto → solicitud → revisión → adopción ya está materializado. El principal desafío ahora no pasa por cambiar infraestructura, sino por seguir ordenando arquitectura, pulir experiencia de uso y comunicar mejor la evolución del proyecto hacia afuera.",
    ],
  },
  {
    slug: "que-estamos-construyendo-ahora",
    category: "Roadmap",
    title: "Qué estamos construyendo ahora",
    summary:
      "En esta etapa, el foco está en consolidar la capa pública e institucional del proyecto, ordenar cómo comunicamos la evolución del producto y preparar una base más clara para futuras páginas de roadmap, servicios y colaboración.",
    date: "29 Mar 2026",
    status: "En progreso",
    content: [
      "Hoy estamos trabajando sobre una necesidad distinta a la de los primeros bloques técnicos: ya no se trata solo de hacer que el MVP funcione, sino también de mostrar con mayor claridad qué es Adopta App, qué sostiene hoy y hacia dónde evoluciona.",
      "Por eso, uno de los focos actuales está en la capa pública del proyecto. Venimos ordenando la home, fortaleciendo la página de visión y construyendo esta nueva sección de actualizaciones para separar mejor los avances concretos del producto y la dirección futura del roadmap.",
      "Esta etapa también busca dejar una base más útil para futuras audiencias. No solo para usuarios que quieren entender el producto, sino también para colaboradores, aliados o personas interesadas en seguir cómo evoluciona la plataforma y qué capacidad de ejecución ya mostró.",
      "El criterio de trabajo sigue siendo el mismo que venimos sosteniendo en todo el proyecto: cambios por inciso, validación breve, consolidación de cada bloque y recién después apertura del siguiente. Esa lógica es la que nos permite crecer sin perder orden, y también es parte de cómo queremos comunicar Adopta App hacia afuera.",
    ],
  },
];
