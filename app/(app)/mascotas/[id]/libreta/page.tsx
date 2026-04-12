import { LibretaContent } from "./libreta-content";
import { getMascotaLibreta } from "@/lib/server/mascotas-libreta";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LibretaPage(props: PageProps) {
  const { id: idMascota } = await props.params;
  const libreta = await getMascotaLibreta(idMascota);

  return <LibretaContent idMascota={idMascota} libreta={libreta} />;
}
