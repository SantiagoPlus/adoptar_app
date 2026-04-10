import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import UserMenu from "@/components/app/user-menu";

export async function HomeNavbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let usuario:
    | {
        nombre?: string | null;
        apellido?: string | null;
        email?: string | null;
        foto_perfil?: string | null;
      }
    | null = null;

  if (user) {
    const { data } = await supabase
      .from("usuarios")
      .select("nombre, apellido, email, foto_perfil")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    usuario = data ?? {
      nombre: user.user_metadata?.nombre ?? null,
      apellido: user.user_metadata?.apellido ?? null,
      email: user.email ?? null,
      foto_perfil: null,
    };
  }

  return (
    <nav className="border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-semibold tracking-tight text-white">
          Adopta App
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <UserMenu
              nombre={usuario?.nombre ?? null}
              apellido={usuario?.apellido ?? null}
              email={usuario?.email ?? user.email ?? null}
              fotoPerfil={usuario?.foto_perfil ?? null}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ingresar
            </Link>

            <Link
              href="/auth/login"
              aria-label="Ingresar o crear cuenta"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <span className="text-sm font-semibold">•</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
