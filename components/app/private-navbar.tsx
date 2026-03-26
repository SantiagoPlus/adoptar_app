import Link from "next/link";
import { Bell } from "lucide-react";
import { getCurrentUsuario } from "@/lib/server/auth";
import UserMenu from "@/components/app/user-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function PrivateNavbar() {
  const { usuario } = await getCurrentUsuario();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-semibold tracking-tight text-white">
          Adopta App
        </Link>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Notificaciones"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-72 border-white/10 bg-black text-white"
            >
              <DropdownMenuLabel className="px-3 py-3 text-sm font-semibold">
                Notificaciones
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-white/10" />

              <div className="px-3 py-4 text-sm text-white/60">
                No tenés notificaciones por el momento.
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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
