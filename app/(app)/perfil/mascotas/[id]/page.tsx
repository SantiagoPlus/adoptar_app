import { connection } from "next/server";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PerfilMascotaLegacyPage({
  params,
}: PageProps) {
  await connection();

  const { id } = await params;
  redirect(`/mascotas/${id}`);
}
