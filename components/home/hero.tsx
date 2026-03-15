import Link from "next/link";

export function HomeHero() {
  return (
    <div className="max-w-3xl mb-12">
      <p className="text-sm text-white/60 mb-3">
        Plataforma de adopción y gestión de mascotas
      </p>

      <h1 className="text-5xl font-bold leading-tight mb-4">
        Encontrá un compañero y promové adopciones responsables
      </h1>

      <p className="text-white/70 text-lg">
        Explorá animales en adopción, conectá con publicadores y construí una
        experiencia más ordenada para adoptar, publicar y gestionar la
        información de tus mascotas.
      </p>

      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          href="/auth/login"
          className="px-5 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 transition"
        >
          Comenzar
        </Link>

        <a
          href="#animales"
          className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
        >
          Ver animales
        </a>
      </div>
    </div>
  );
}
