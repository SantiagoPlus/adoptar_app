import { Suspense } from "react";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function RedirectToMascota({ params }: PageProps) {
  const { id } = await params;
  redirect(`/mascotas/${id}`);
  return null;
}

export default function PerfilMascotaLegacyPage(props: PageProps) {
  return (
    <Suspense fallback={null}>
      <RedirectToMascota {...props} />
    </Suspense>
  );
}
