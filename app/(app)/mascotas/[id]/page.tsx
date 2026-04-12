import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MascotaPage(props: PageProps) {
  const params = await props.params;
  redirect(`/mascotas/${params.id}/libreta`);
}
