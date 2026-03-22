import Link from "next/link";

type Params = Promise<{ id: string }>;

export default async function EditarPublicacionPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;

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
            Desde acá vas a poder modificar los datos y las imágenes de esta
            publicación.
          </p>
        </header>
      </section>
    </main>
  );
}
