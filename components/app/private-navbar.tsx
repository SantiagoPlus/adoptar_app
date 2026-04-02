import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getChatInbox } from "@/lib/server/chat";
import UserMenu from "@/components/app/user-menu";

function MessagesIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 10h10" />
      <path d="M7 14h6" />
      <path d="M5 20l1.5-3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H11.5L5 20Z" />
    </svg>
  );
}

export default async function PrivateNavbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-white"
          >
            Adopta App
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ingresar
            </Link>
          </div>
        </div>
      </header>
    );
  }

  let usuario:
    | {
        nombre?: string | null;
        apellido?: string | null;
        email?: string | null;
        foto_perfil?: string | null;
      }
    | null = null;

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

  let unreadTotal = 0;

  try {
    const inbox = await getChatInbox();
    unreadTotal = inbox.reduce(
      (acc, item) => acc + Number(item.unread_count ?? 0),
      0,
    );
  } catch {
    unreadTotal = 0;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-white"
        >
          Adopta App
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            aria-label="Abrir chats"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <MessagesIcon />

            {unreadTotal > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold leading-none text-black">
                {unreadTotal > 99 ? "99+" : unreadTotal}
              </span>
            )}
          </Link>

          <UserMenu
            nombre={usuario?.nombre ?? null}
            apellido={usuario?.apellido ?? null}
            email={usuario?.email ?? user.email ?? null}
            fotoPerfil={usuario?.foto_perfil ?? null}
          />
        </div>
      </div>
    </header>
  );
}
