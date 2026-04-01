import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getConversationDetail,
  getConversationMessages,
  markConversationAsRead,
  sendChatMessage,
} from "@/lib/server/chat";
import { createClient } from "@/lib/supabase/server";

type Params = Promise<{ id: string }>;

async function enviarMensaje(formData: FormData) {
  "use server";

  const idConversation = String(formData.get("id_conversation") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!idConversation) {
    redirect("/chat");
  }

  if (!body) {
    redirect(`/chat/${idConversation}?error=mensaje_vacio`);
  }

  try {
    await sendChatMessage(idConversation, body);
  } catch {
    redirect(`/chat/${idConversation}?error=envio_fallido`);
  }

  redirect(`/chat/${idConversation}`);
}

function ChatDetailSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-3 h-7 w-48 animate-pulse rounded bg-white/10" />
        <div className="mb-2 h-4 w-40 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
      </section>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-2xl p-4 ${
              index % 2 === 0 ? "ml-auto bg-white text-black" : "bg-black/30 text-white"
            }`}
          >
            <div className="mb-2 h-4 w-28 animate-pulse rounded bg-black/10" />
            <div className="h-4 w-48 animate-pulse rounded bg-black/10" />
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="h-24 animate-pulse rounded-xl bg-white/10" />
      </section>
    </div>
  );
}

function FeedbackBanner({ error }: { error?: string }) {
  if (!error) return null;

  const messages: Record<string, string> = {
    mensaje_vacio: "No podés enviar un mensaje vacío.",
    envio_fallido: "No se pudo enviar el mensaje. Intentá nuevamente.",
  };

  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
      {messages[error] ?? "Ocurrió un error inesperado."}
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

async function ChatDetailContent({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect(`/auth/login?next=/chat/${id}`);
  }

  const detail = await getConversationDetail(id);

  if (!detail) {
    notFound();
  }

  const messages = await getConversationMessages(id);
  await markConversationAsRead(id);

  return (
    <div className="space-y-6">
      <FeedbackBanner error={error} />

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-2xl font-bold">
              {detail.other_user_nombre ?? "Usuario"}
            </h1>

            <p className="text-sm text-white/60">
              {detail.animal_nombre
                ? `Consulta por ${detail.animal_nombre}`
                : "Conversación"}
            </p>

            <p className="mt-2 text-xs text-white/50">
              Estado: {detail.estado}
            </p>
          </div>

          {detail.other_user_email && (
            <p className="text-sm text-white/50">{detail.other_user_email}</p>
          )}
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6">
        {messages.length === 0 ? (
          <p className="text-sm text-white/60">Todavía no hay mensajes en esta conversación.</p>
        ) : (
          messages.map((message) => {
            const isMine = message.sender_email === authData.user.email;

            return (
              <article
                key={message.id_message}
                className={`max-w-[85%] rounded-2xl p-4 ${
                  isMine
                    ? "ml-auto bg-white text-black"
                    : "bg-black/30 text-white"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p
                    className={`text-xs font-medium ${
                      isMine ? "text-black/70" : "text-white/60"
                    }`}
                  >
                    {message.sender_nombre ?? "Usuario"}
                  </p>

                  <p
                    className={`text-xs ${
                      isMine ? "text-black/60" : "text-white/40"
                    }`}
                  >
                    {formatHora(message.created_at)}
                  </p>
                </div>

                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                  {message.body}
                </p>
              </article>
            );
          })
        )}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <form action={enviarMensaje} className="space-y-3">
          <input type="hidden" name="id_conversation" value={id} />

          <label htmlFor="body" className="block text-sm text-white/70">
            Escribir mensaje
          </label>

          <textarea
            id="body"
            name="body"
            rows={4}
            placeholder="Escribí tu mensaje..."
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
            >
              Enviar
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function ChatConversationPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link
            href="/chat"
            className="text-sm text-white/60 transition hover:text-white"
          >
            ← Volver a chats
          </Link>

          <Link
            href="/perfil"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Mi cuenta
          </Link>
        </div>

        <Suspense fallback={<ChatDetailSkeleton />}>
          <ChatDetailContent params={params} searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  );
}
