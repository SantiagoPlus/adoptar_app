import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HistorialContent } from "./historial-content";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HistorialPage(props: PageProps) {
  const { id: idMascota } = await props.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id_usuario")
    .eq("auth_user_id", user.id)
    .single();

  if (!usuario) {
    redirect("/perfil");
  }

  const { data: mascota } = await supabase
    .from("mascotas")
    .select("id_mascota, id_usuario")
    .eq("id_mascota", idMascota)
    .single();

  if (!mascota || mascota.id_usuario !== usuario.id_usuario) {
    redirect("/perfil");
  }

  const { data: historial } = await supabase
    .from("mascotas_historial_clinico")
    .select("*")
    .eq("id_mascota", idMascota)
    .order("fecha_visita", { ascending: false });

  const historialSafe = JSON.parse(JSON.stringify(historial || []));

  return <HistorialContent idMascota={idMascota} historial={historialSafe} />;
}
