import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUsuario } from "@/lib/server/auth";
import type {
  HistorialItem,
  LibretaItem,
} from "@/app/(app)/mascotas/[id]/types";

export type MascotaModuleShell = {
  id_mascota: string;
  id_usuario: string;
  nombre: string;
  especie: string | null;
  raza: string | null;
  sexo: string | null;
  url_foto: string | null;
  qr_microchip: string | null;
  owner_display_name: string;
};

export type MascotaModuleData = {
  mascota: MascotaModuleShell;
  libreta: LibretaItem[];
  historial: HistorialItem[];
};

type MascotaOwnerContextOptions = {
  loginNext?: string;
  redirects?: {
    profileMissing?: string;
    notFound?: string;
    forbidden?: string;
  };
};

type LibretaFeedRow = {
  id_evento: string;
  id_mascota: string;
  dominio: string;
  tipo_evento: string;
  subtipo_evento: string | null;
  categoria_ui: string | null;
  titulo: string;
  descripcion: string | null;
  fecha_aplicacion: string;
  fecha_proximo_evento: string | null;
  estado_validacion: string;
  created_by_role: string | null;
  created_by_user_id: string | null;
  id_proveedor: string | null;
  profesional_nombre: string | null;
  profesional_matricula: string | null;
  profesional_documento: string | null;
  institucion: string | null;
  observaciones: string | null;
  created_at: string | null;
  updated_at: string | null;
  producto_nombre: string | null;
  fabricante: string | null;
  lote: string | null;
  via_aplicacion: string | null;
  dosis: string | null;
  producto_lote: string | null;
  enfermedad_objetivo: string | null;
  esquema_refuerzo: string | null;
  desparasitacion_alcance: string | null;
  principio_activo: string | null;
  frecuencia_dias: number | null;
  tipo_control: string | null;
  control_motivo: string | null;
  hallazgos_resumen: string | null;
  indicaciones: string | null;
  cantidad_adjuntos: number | null;
  tiene_adjuntos: boolean | null;
};

function buildOwnerDisplayName(usuario: {
  nombre: string | null;
  apellido: string | null;
  email?: string | null;
}) {
  const nombre = String(usuario.nombre ?? "").trim();
  const apellido = String(usuario.apellido ?? "").trim();
  const fullName = [nombre, apellido].filter(Boolean).join(" ").trim();

  if (fullName) return fullName;
  if (usuario.email) return usuario.email;
  return "Titular no informado";
}

function mapFeedRowToLibretaItem(row: LibretaFeedRow): LibretaItem {
  return {
    id_registro: row.id_evento,
    tipo: row.tipo_evento,
    descripcion: row.descripcion ?? row.titulo,
    fecha_aplicacion: row.fecha_aplicacion,
    fecha_vencimiento: null,
    producto_lote: row.producto_lote,
    observaciones: row.observaciones,
    titulo: row.titulo,
    categoria: row.categoria_ui,
    producto_nombre: row.producto_nombre,
    fabricante: row.fabricante,
    lote: row.lote,
    profesional_nombre: row.profesional_nombre,
    profesional_matricula: row.profesional_matricula,
    profesional_documento: row.profesional_documento,
    institucion: row.institucion,
    estado_validacion: row.estado_validacion,
    fecha_proximo_evento: row.fecha_proximo_evento,

    dominio: row.dominio,
    subtipo_evento: row.subtipo_evento,
    via_aplicacion: row.via_aplicacion,
    dosis: row.dosis,
    created_by_role: row.created_by_role,
    created_by_user_id: row.created_by_user_id,
    id_proveedor: row.id_proveedor,
    created_at: row.created_at,
    updated_at: row.updated_at,
    enfermedad_objetivo: row.enfermedad_objetivo,
    esquema_refuerzo: row.esquema_refuerzo,
    desparasitacion_alcance: row.desparasitacion_alcance,
    principio_activo: row.principio_activo,
    frecuencia_dias: row.frecuencia_dias,
    tipo_control: row.tipo_control,
    control_motivo: row.control_motivo,
    hallazgos_resumen: row.hallazgos_resumen,
    indicaciones: row.indicaciones,
    cantidad_adjuntos: row.cantidad_adjuntos ?? 0,
    tiene_adjuntos: row.tiene_adjuntos ?? false,
  };
}

export async function getMascotaOwnerContext(
  idMascota: string,
  options: MascotaOwnerContextOptions = {},
) {
  const redirects = {
    profileMissing: "/perfil",
    notFound: "/perfil",
    forbidden: "/perfil",
    ...options.redirects,
  };

  const { supabase, authUser, usuario } = await getCurrentUsuario({
    loginNext: options.loginNext ?? `/mascotas/${idMascota}`,
    notFoundRedirect: redirects.profileMissing,
  });

  const { data: mascota, error } = await supabase
    .from("mascotas")
    .select("id_mascota, id_usuario, nombre, especie, raza, sexo, url_foto")
    .eq("id_mascota", idMascota)
    .single();

  if (error || !mascota) {
    redirect(redirects.notFound);
  }

  if (mascota.id_usuario !== usuario.id_usuario) {
    redirect(redirects.forbidden);
  }

  return {
    supabase,
    authUser,
    usuario,
    mascota: {
      ...(mascota as Omit<
        MascotaModuleShell,
        "qr_microchip" | "owner_display_name"
      >),
      qr_microchip: null,
      owner_display_name: buildOwnerDisplayName(usuario),
    } as MascotaModuleShell,
  };
}

export async function getMascotaModuleShell(idMascota: string) {
  const { mascota } = await getMascotaOwnerContext(idMascota, {
    loginNext: `/mascotas/${idMascota}`,
    redirects: {
      profileMissing: "/perfil",
      notFound: "/perfil",
      forbidden: "/perfil",
    },
  });

  return mascota;
}

export async function getMascotaModuleData(
  idMascota: string,
): Promise<MascotaModuleData> {
  const { supabase, mascota } = await getMascotaOwnerContext(idMascota, {
    loginNext: `/mascotas/${idMascota}`,
    redirects: {
      profileMissing: "/perfil",
      notFound: "/perfil",
      forbidden: "/perfil",
    },
  });

  const [
    { data: libretaFeed, error: libretaError },
    { data: historial, error: historialError },
  ] = await Promise.all([
    supabase
      .from("vw_mascotas_libreta_feed")
      .select("*")
      .eq("id_mascota", idMascota)
      .order("fecha_aplicacion", { ascending: false }),
    supabase
      .from("mascotas_historial_clinico")
      .select("*")
      .eq("id_mascota", idMascota)
      .order("fecha_visita", { ascending: false }),
  ]);

  if (libretaError) {
    throw new Error("No se pudo cargar la libreta sanitaria.");
  }

  if (historialError) {
    throw new Error("No se pudo cargar el historial clínico.");
  }

  const libreta = (libretaFeed ?? []).map((row) =>
    mapFeedRowToLibretaItem(row as LibretaFeedRow),
  );

  return JSON.parse(
    JSON.stringify({
      mascota,
      libreta,
      historial: historial ?? [],
    }),
  ) as MascotaModuleData;
}
