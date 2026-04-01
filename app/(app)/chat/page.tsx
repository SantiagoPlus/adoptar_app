import Link from "next/link";
import { getChatInbox } from "@/lib/server/chat";

function formatDate(value: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function ChatInboxSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="mb-3 h-5 w-48 animate-pulse rounded bg-white/10" />
          <div className="mb-2 h-4 w-64 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

async function ChatInboxContent() {
  const conversations = await getChatInbox();

  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="mb-2 text-white/80">Todavía no tenés conversaciones activas.</p>
        <p className="text-sm text-white/60">
          Los chats se habilitarán cuando exista una solicitud de adopción con contexto válido.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => {
        const title = conversation.other_user_nombre ?? "Usuario";
        const context =
          conversation.animal_nombre
            ? `Consulta por ${conversation.animal_nombre}`
            : "Conversación";
        const preview =
          conversation.last_message_body?.trim() || "Todavía no hay mensajes.";
        const timestamp = formatDate(
          conversation.last_message_created_at ?? conversation.updated_at,
        );

        return (
          <Link
            key={conversation.id_conversation}
            href={`/chat/${conversation.id_conversation}`}
            className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-3">
                  <h2 className="truncate text-lg font-semibold text-white">
                    {title}
                  </h2>

                  {conversation.unread_count > 0 && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-black">
                      {conversation.unread_count}
                    </span>
                  )}
                </div>

                <p className="mb-2 text-sm text-white/60">{context}</p>

                <p className="truncate text-sm text-white/80">{preview}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs text-white/50">{timestamp}</p>
                <p className="mt-2 text-xs text-white/40">
                  {conversation.estado === "activa"
                    ? "Activa"
                    : conversation.estado === "cerrada"
                      ? "Cerrada"
                      : "Bloqueada"}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default async function ChatPage() {
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
          <p className="mb-2 text-sm text-white/60">Mensajes</p>
          <h1 className="mb-3 text-3xl font-bold">Chat</h1>
          <p className="text-white/70">
            Acá vas a poder ver tus conversaciones activas dentro de la plataforma.
          </p>
        </header>

        <ChatInboxContent />
      </section>
    </main>
  );
}
