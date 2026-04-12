import { Suspense } from "react";
import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function RedirectToLibreta({ params }: PageProps) {
  const { id } = await params;
  redirect(`/mascotas/${id}/libreta`);
  return null;
}

export default function MascotaPage(props: PageProps) {
  return (
    <Suspense fallback={null}>
      <RedirectToLibreta {...props} />
    </Suspense>
  );
}
