import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{
  animal_id?: string;
}>;

export default async function NuevaSolicitudPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { animal_id } = await searchParams;

  if (!animal_id) {
    notFound();
  }

  const supabase = await createClient();

  const { data: animal, error } = await supabase
    .from("animales_adopcion")
    .select(
      `
        id_animal,
        nombre,
        especie,
        raza,
        ciudad,
        estado
      `,
    )
    .eq("id_animal", animal_id)
    .single();

  if (error || !animal) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <Link
            href={`/animales/${animal.id_animal}`}
            className="text-sm text-white/60 hover:text-white transition"
          >
            ← Volver al detalle
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6">
          <p className="text-sm text-white/60 mb-2">Solicitud de adopción</p>
          <h1 className="text-3xl font-bold mb-3">
            Quiero adoptar a {animal.nombre}
          </h1>
          <p className="text-white/70">
            Estás iniciando una solicitud para este animal:
          </p>

          <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/60 mb-1">Nombre</p>
              <p>{animal.nombre}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/60 mb-1">Estado</p>
              <p>{animal.estado}</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/60 mb-1">Especie</p>
              <p>
                {animal.especie}
                {animal.raza ? ` · ${animal.raza}` : ""}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/60 mb-1">Ciudad</p>
              <p>{animal.ciudad ?? "No informada"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">Mensaje inicial</h2>

          <form className="space-y-4">
            <div>
              <label
                htmlFor="mensaje"
                className="block text-sm text-white/70 mb-2"
              >
                Contale al publicador por qué querés adoptar a este animal
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows={6}
                placeholder="Hola, me interesa iniciar el proceso de adopción..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-white/30 outline-none"
              />
            </div>

            <button
              type="button"
              className="inline-flex px-5 py-3 rounded-xl bg-white text-black font-medium opacity-70 cursor-not-allowed"
            >
              Enviar solicitud próximamente
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
