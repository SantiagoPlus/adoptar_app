"use client";

import Link from "next/link";
import { User, FileText, HeartHandshake } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
  nombre?: string | null;
  apellido?: string | null;
  email?: string | null;
  fotoPerfil?: string | null;
};

export default function UserMenu({
  nombre,
  apellido,
  email,
  fotoPerfil,
}: UserMenuProps) {
  const nombreCompleto = [nombre, apellido].filter(Boolean).join(" ").trim();

  const iniciales =
    nombreCompleto
      .split(" ")
      .map((parte) => parte[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "US";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
          aria-label="Abrir menú de usuario"
        >
          {fotoPerfil ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fotoPerfil}
              alt={nombreCompleto || "Usuario"}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-white/80">
              {iniciales}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 border-white/10 bg-black text-white"
      >
        <DropdownMenuLabel className="px-3 py-3">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">
              {nombreCompleto || "Usuario"}
            </span>
            <span className="text-xs text-white/60">
              {email || "Sin correo"}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/10" />

        <DropdownMenuItem
          asChild
          className="cursor-pointer text-white focus:bg-white/10 focus:text-white"
        >
          <Link href="/perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Mi perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer text-white focus:bg-white/10 focus:text-white"
        >
          <Link href="/publicaciones" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Publicaciones
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="cursor-pointer text-white focus:bg-white/10 focus:text-white"
        >
          <Link href="/solicitudes" className="flex items-center gap-2">
            <HeartHandshake className="h-4 w-4" />
            Mis solicitudes
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        <div className="px-2 py-2">
          <LogoutButton variant="menu" />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
