import { Suspense } from "react";
import { EditarPublicacionContent } from "./editar-publicacion-content";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ ok?: string; error?: string }>;

function EditarPublicacionSkeleton() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 h-5 w-40 animate-pulse rounded bg-white/10" />
        <div className="mb-8">
          <div className="mb-2 h-4 w-28 animate-pulse rounded bg-white/10" />
          <div className="mb-3 h-10 w-72 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-[28rem] animate-pulse rounded bg-white/10" />
        </div>
      </section>
    </main>
  );
}

export default function EditarPublicacionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<EditarPublicacionSkeleton />}>
      <EditarPublicacionContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
