import { HistorialContent } from "./historial-content";
import { getMascotaHistorial } from "@/lib/server/mascotas-historial";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function HistorialPage(props: PageProps) {
  const { id: idMascota } = await props.params;
  const historial = await getMascotaHistorial(idMascota);

  return <HistorialContent idMascota={idMascota} historial={historial} />;
}
