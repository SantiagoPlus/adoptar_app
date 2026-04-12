import { FichaMascotaContent } from "../ficha-mascota-content";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default function HistorialPage(props: PageProps) {
  return <FichaMascotaContent params={props.params} />;
}
