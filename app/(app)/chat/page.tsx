import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getChatInbox } from "@/lib/server/chat";
import { createClient } from "@/lib/supabase/server";

function ChatInboxSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="mb-3 h-5 w-40 animate-pulse rounded bg-white/10" />
          <div className="mb-2 h-4 w-56 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function formatHora(value?: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

async function ChatInboxContent() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login?next=/chat");
  }

  const inbox = await getChatInbox();

  if (inbox.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="mb-2 text-white/80">Todavía no tenés conversaciones.</p>
        <p className="text-sm text-white/60">
          Los chats van a aparecer cuando una solicitud habilite una conversación.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {inbox.map((item) => (
        <Link
          key={item.id_conversation}
          href={`/chat/${item.id_conversation}`}
          className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                {item.other_user_nombre ?? "Usuario"}
              </h2>
              <p className="text-sm text-white/60">
                {item.animal_nombre
                  ? `Consulta por ${item.animal_nombre}`
                  : "Conversación"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-white/50">
                {formatHora(item.last_message_created_at ?? item.updated_at)}
              </p>

              {item.unread_count > 0 && (
                <span className="mt-2 inline-flex min-w-6 items-center justify-center rounded-full bg-white px-2 py-1 text-xs font-medium text-black">
                  {item.unread_count}
                </span>
              )}
            </div>
          </div>

          <p className="line-clamp-2 text-sm text-white/75">
            {item.last_message_body ?? "Sin mensajes todavía."}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Link
            href="/perfil"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a mi cuenta
          </Link>
        </div>

        <header className="mb-8">
          <p className="mb-2 text-sm text-white/60">Mensajería</p>
          <h1 className="mb-3 text-3xl font-bold">Chats</h1>
          <p className="text-white/70">
            Acá vas a ver las conversaciones activas vinculadas a tus procesos dentro
            de la plataforma.
          </p>
        </header>

        <Suspense fallback={<ChatInboxSkeleton />}>
          <ChatInboxContent />
        </Suspense>
      </section>
    </main>
  );
}
