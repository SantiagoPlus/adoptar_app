import Link from "next/link";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ ok?: string; error?: string }>;

export async function EditarPublicacionContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { ok, error } = await searchParams;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link
            href={`/publicaciones/${id}`}
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a gestión
          </Link>
        </div>

        <header className="mb-8">
          <p className="mb-2 text-sm text-white/60">Publicaciones</p>
          <h1 className="mb-3 text-3xl font-bold">Editar publicación</h1>
          <p className="text-white/70">
            Esta es la nueva pantalla de edición separada de la gestión.
          </p>
        </header>

        {ok ? (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
            OK: {ok}
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            Error: {error}
          </div>
        ) : null}

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-white/60">ID de publicación</p>
          <p className="mt-2 text-lg text-white">{id}</p>
        </section>
      </section>
    </main>
  );
}
