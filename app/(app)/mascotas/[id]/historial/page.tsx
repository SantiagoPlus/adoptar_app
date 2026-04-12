import { createClient } from "@/lib/supabase/server";
import { HistorialContent } from "./historial-content";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HistorialPage(props: PageProps) {
  const { id: idMascota } = await props.params;
  const supabase = await createClient();

  const { data: historial } = await supabase
    .from("mascotas_historial_clinico")
    .select("*")
    .eq("id_mascota", idMascota)
    .order("fecha_visita", { ascending: false });

  const historialSafe = JSON.parse(JSON.stringify(historial || []));

  return <HistorialContent idMascota={idMascota} historial={historialSafe} />;
}
