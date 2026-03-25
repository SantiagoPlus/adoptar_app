import Link from "next/link";
import { getCurrentUsuario } from "@/lib/server/auth";
import UserMenu from "@/components/app/user-menu";

export default async function PrivateNavbar() {
  const { usuario } = await getCurrentUsuario();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-semibold text-white">
          Adopta App
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/publicaciones"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Publicaciones
          </Link>

          <Link
            href="/solicitudes"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Solicitudes
          </Link>

          <UserMenu
            nombre={usuario.nombre}
            apellido={usuario.apellido}
            email={usuario.email}
            fotoPerfil={usuario.foto_perfil}
          />
        </nav>
      </div>
    </header>
  );
}
