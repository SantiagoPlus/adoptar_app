import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LibretaContent } from "./libreta-content";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LibretaPage(props: PageProps) {
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

  const { data: libreta } = await supabase
    .from("mascotas_libreta_sanitaria")
    .select("*")
    .eq("id_mascota", idMascota)
    .order("fecha_aplicacion", { ascending: false });

  const libretaSafe = JSON.parse(JSON.stringify(libreta || []));

  return <LibretaContent idMascota={idMascota} libreta={libretaSafe} />;
}
