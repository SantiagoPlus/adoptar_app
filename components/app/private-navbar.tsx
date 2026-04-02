import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getChatInbox } from "@/lib/server/chat";
import UserMenu from "@/components/app/user-menu";
import ChatNavButton from "@/components/app/chat-nav-button";

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
  let conversationIds: string[] = [];

  try {
    const inbox = await getChatInbox();
    unreadTotal = inbox.reduce(
      (acc, item) => acc + Number(item.unread_count ?? 0),
      0,
    );
    conversationIds = inbox.map((item) => item.id_conversation);
  } catch {
    unreadTotal = 0;
    conversationIds = [];
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
          <ChatNavButton
            initialUnreadTotal={unreadTotal}
            initialConversationIds={conversationIds}
          />

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
