import { createClient } from "@/lib/supabase/server";
import { LibretaContent } from "./libreta-content";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LibretaPage(props: PageProps) {
  const { id: idMascota } = await props.params;
  const supabase = await createClient();

  const { data: libreta } = await supabase
    .from("mascotas_libreta_sanitaria")
    .select("*")
    .eq("id_mascota", idMascota)
    .order("fecha_aplicacion", { ascending: false });

  const libretaSafe = JSON.parse(JSON.stringify(libreta || []));

  return <LibretaContent idMascota={idMascota} libreta={libretaSafe} />;
}
