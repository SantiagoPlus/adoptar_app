import { Suspense } from "react";
import { LibretaTab } from "./libreta-tab";
import { getMascotaLibreta } from "@/lib/server/mascotas-libreta";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function LibretaFallback() {
  return (
    <section className="rounded-[22px] border border-white/10 bg-[#080808] p-6">
      <div className="h-56 rounded-[20px] bg-white/5" />
    </section>
  );
}

async function LibretaPageContent({ params }: PageProps) {
  const { id } = await params;
  const libreta = await getMascotaLibreta(id);

  return <LibretaTab libreta={libreta} />;
}

export default function LibretaPage(props: PageProps) {
  return (
    <Suspense fallback={<LibretaFallback />}>
      <LibretaPageContent {...props} />
    </Suspense>
  );
}
