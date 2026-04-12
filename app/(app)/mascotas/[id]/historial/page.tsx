import { Suspense } from "react";
import { HistorialTab } from "./historial-tab";
import { getMascotaHistorial } from "@/lib/server/mascotas-historial";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function HistorialFallback() {
  return (
    <section className="rounded-[22px] border border-white/10 bg-[#080808] p-6">
      <div className="h-56 rounded-[20px] bg-white/5" />
    </section>
  );
}

async function HistorialPageContent({ params }: PageProps) {
  const { id } = await params;
  const historial = await getMascotaHistorial(id);

  return <HistorialTab historial={historial} />;
}

export default function HistorialPage(props: PageProps) {
  return (
    <Suspense fallback={<HistorialFallback />}>
      <HistorialPageContent {...props} />
    </Suspense>
  );
}
