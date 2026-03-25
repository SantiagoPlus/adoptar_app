import Link from "next/link";
import { Bell } from "lucide-react";
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

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notificaciones"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
          </button>

          <UserMenu
            nombre={usuario.nombre}
            apellido={usuario.apellido}
            email={usuario.email}
            fotoPerfil={usuario.foto_perfil}
          />
        </div>
      </div>
    </header>
  );
}
