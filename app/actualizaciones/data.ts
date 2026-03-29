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
    slug: "que-es-adopta-app-y-hacia-donde-va",
    category: "Visión",
    title: "Qué es Adopta App y hacia dónde va",
    summary:
      "Una síntesis del proyecto, su misión y la dirección de producto que estamos construyendo alrededor de la vida con mascotas.",
    date: "29 Mar 2026",
    status: "Hecho",
    content: [
      "Adopta App nació con una idea central: construir una base más clara, útil y escalable para la vida con mascotas. La adopción es la puerta de entrada, pero no el límite del proyecto.",
      "La visión de producto apunta a integrar en un mismo entorno la adopción, la gestión cotidiana de las mascotas y, más adelante, la conexión con servicios vinculados al bienestar animal.",
      "Esta dirección no implica abrir todos los frentes al mismo tiempo. Al contrario: el criterio actual es consolidar primero una base funcional coherente, capaz de crecer sin perder claridad ni orden.",
    ],
  },
  {
    slug: "estado-actual-del-mvp",
    category: "Actualización de producto",
    title: "Estado actual del MVP",
    summary:
      "Qué partes del circuito principal ya funcionan, qué quedó consolidado y cuáles son los próximos focos de construcción.",
    date: "29 Mar 2026",
    status: "Hecho",
    content: [
      "El MVP ya superó la etapa de maqueta. Hoy Adopta App cuenta con un circuito operativo de publicaciones, solicitudes y gestión del publicador, además de una capa pública más clara y mejor presentada.",
      "La base técnica elegida —Next.js, Supabase, Vercel y GitHub— sigue siendo correcta para esta etapa. El principal trabajo actual no pasa por cambiar infraestructura, sino por consolidar arquitectura, UX y narrativa pública.",
      "También quedaron resueltos bloques importantes del producto, como la gestión de publicaciones, la evolución del perfil y la incorporación de imágenes reales en Supabase Storage.",
    ],
  },
  {
    slug: "que-estamos-construyendo-ahora",
    category: "Roadmap",
    title: "Qué estamos construyendo ahora",
    summary:
      "Una lectura clara del punto actual del proyecto, los objetivos inmediatos y el orden de ejecución que seguimos para crecer con base sólida.",
    date: "29 Mar 2026",
    status: "En progreso",
    content: [
      "En esta etapa, el foco está en ordenar mejor la comunicación del proyecto y preparar una sección pública que permita seguir su evolución con más claridad.",
      "Eso incluye separar mejor visión, actualizaciones, roadmap y futuras páginas orientadas a prestadores o colaboradores, sin mezclar todos los mensajes en un mismo lugar.",
      "La lógica de trabajo sigue siendo la misma: avanzar por incisos, validar cada bloque y construir capas nuevas solo cuando la base previa ya quedó estable.",
    ],
  },
];
