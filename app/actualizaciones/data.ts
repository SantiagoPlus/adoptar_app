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
    slug: "chat-integrado-al-flujo-de-adopcion-mensajeria-operativa-en-el-mvp",
    category: "Novedades y Actualizaciones",
    title: "Chat integrado al flujo de adopción: mensajería operativa en el MVP",
    summary:
      "El módulo de chat ya funciona como parte estable del MVP y quedó integrado al circuito principal de adopción. Ahora publicadores y solicitantes pueden conversar con historial, estados de lectura y actualización en tiempo real.",
    date: "02 Apr 2026",
    status: "Hecho",
    content: [
      "En esta etapa, Adopta App consolidó el módulo de chat como un subsistema operativo dentro del MVP. La mensajería ya no es una prueba técnica aislada: quedó integrada al proceso de adopción y permite conversaciones persistentes entre las partes involucradas, con permisos restringidos por participante y acceso contextual desde solicitudes reales.",
      "Además de la conversación en sí, el producto suma una bandeja en “/chat” que funciona como inbox base, con acceso rápido desde la navegación privada y un indicador de mensajes no leídos. Esto mejora la continuidad del intercambio y reduce fricción: la comunicación sucede donde corresponde, sin perder el contexto del animal y la solicitud.",
      "A nivel de experiencia, el chat ya se siente cercano a una mensajería real: envío sin recargas completas, visualización inmediata del mensaje y sincronización en tiempo real entre sesiones, junto con estados de leído/no leído. Para esta fase, el resultado se considera suficientemente sólido para sostener el flujo principal sin bloquear el avance del producto.",
      "Por último, se incorporó una base mínima de moderación mediante reportes persistidos, limitada a participantes de la conversación. Quedan frentes de mejora para una etapa posterior —como una vista administrativa para revisar reportes y acciones sobre conversaciones—, pero el módulo actual ya cumple su rol dentro de la adopción responsable y acompaña la dirección de Adopta App de construir una plataforma clara, seria y en evolución.",
    ],
  },
  {
    slug: "bienvenidos-a-novedades-y-actualizaciones-de-adopta-app",
    category: "Novedades y Actualizaciones",
    title: "Bienvenidos a Novedades y Actualizaciones de Adopta App",
    summary:
      "Inauguramos este espacio para compartir avances reales del proyecto, de forma clara y transparente. Acá vas a poder seguir qué se implementó, qué mejoró y en qué estamos trabajando.",
    date: "31 Mar 2026",
    status: "Hecho",
    content: [
      "Hoy abrimos oficialmente la sección “Novedades y Actualizaciones” de Adopta App. Este espacio nace para contar, en lenguaje simple y con foco en lo que importa, cómo evoluciona la plataforma y qué cambios ya están disponibles para quienes la usan o la siguen de cerca.",
      "Adopta App comenzó con un objetivo concreto: ordenar y facilitar la adopción responsable con un circuito más claro para publicar casos, enviar solicitudes y acompañar el proceso hasta el cierre de una adopción. A partir de esa base, el proyecto avanza por etapas, priorizando una experiencia consistente y una construcción sólida antes de sumar módulos más amplios.",
      "En esta página vas a encontrar publicaciones breves con mejoras visibles, cierres de hitos y decisiones de producto que marcan dirección. La idea no es prometer de más: cada actualización busca diferenciar lo que ya está implementado de lo que está en camino, para que puedas entender el estado real del proyecto en cada momento.",
      "Si te interesa acompañar el desarrollo, te invitamos a volver a este espacio periódicamente y compartirlo con otras personas u organizaciones que trabajen alrededor de la adopción y el bienestar animal. Gracias por estar cerca: construir una plataforma útil también es una forma de cuidar.",
    ],
  },
  {
    slug: "en-que-vamos-a-enfocarnos-en-las-proximas-etapas",
    category: "Roadmap",
    title: "En qué vamos a enfocarnos en las próximas etapas",
    summary:
      "Compartimos las prioridades de trabajo para las próximas semanas, para que sepas qué mejoras estamos consolidando y qué novedades vas a empezar a ver.",
    date: "31 Mar 2026",
    status: "En progreso",
    content: [
      "En esta etapa el foco principal de Adopta App es consolidar una base sólida y presentable antes de sumar nuevas funciones. Eso significa cerrar pendientes que impactan directamente en la confianza del producto: coherencia entre secciones públicas y privadas, accesos sin errores, mensajes claros y una estructura mínima de ayuda, soporte y documentos básicos.",
      "Una vez que esa base esté ordenada, el siguiente objetivo es fortalecer el núcleo de adopción para que el circuito principal sea claro y confiable tanto para quienes publican como para quienes solicitan. En concreto, vamos a trabajar sobre una experiencia de inicio más entendible, un centro de adopción consistente, herramientas estables para gestionar publicaciones y un flujo de solicitudes más predecible de principio a fin.",
      "En paralelo, ya estamos preparando la evolución lógica del proyecto: que Adopta App no sea útil solo en el momento de adoptar, sino también después. Por eso, los próximos módulos apuntan a sumar herramientas de retención vinculadas a la vida cotidiana con mascotas, como “Mis mascotas” y una libreta sanitaria e historial de salud que ordenen el seguimiento y los recordatorios. Más adelante, esta línea se conectará con una visión más amplia de plataforma y servicios, sin adelantar promesas antes de tiempo.",
      "Este roadmap busca dar transparencia sobre el orden de construcción: primero estabilidad y núcleo confiable, después utilidad recurrente y, recién cuando corresponda, expansión hacia servicios del ecosistema animal.",
    ],
  },
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
