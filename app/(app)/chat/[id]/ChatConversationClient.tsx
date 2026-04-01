"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ConversationDetail = {
  id_conversation: string;
  context_type: "adoption_request" | "provider_contact";
  estado: "activa" | "cerrada" | "bloqueada";
  created_at: string;
  updated_at: string;
  id_solicitud: string | null;
  animal_id: string | null;
  animal_nombre: string | null;
  other_user_id: string | null;
  other_user_nombre: string | null;
  other_user_email: string | null;
  other_user_rol: "member" | "owner" | "provider" | null;
};

type ConversationMessage = {
  id_message: string;
  id_conversation: string;
  id_sender: string;
  sender_nombre: string | null;
  sender_email: string | null;
  body: string;
  message_type: "text" | "system";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type CurrentUser = {
  id_usuario: string;
  nombre: string;
  email: string;
};

type Props = {
  conversationId: string;
  currentUser: CurrentUser;
  detail: ConversationDetail;
  initialMessages: ConversationMessage[];
};

function formatHora(value?: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function ChatConversationClient({
  conversationId,
  currentUser,
  detail,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages);
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pollingRef = useRef<number | null>(null);

  const normalizedOtherName = useMemo(
    () => detail.other_user_nombre ?? "Usuario",
    [detail.other_user_nombre],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    async function refreshMessages() {
      try {
        const response = await fetch(
          `/api/chat/conversations/${conversationId}/messages`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) return;

        const data = await response.json();
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch {
        // silencioso por ahora
      }
    }

    pollingRef.current = window.setInterval(() => {
      void refreshMessages();
    }, 4000);

    return () => {
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
      }
    };
  }, [conversationId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = body.trim();
    if (!trimmed || isSending) return;

    setError(null);
    setIsSending(true);

    const optimisticMessage: ConversationMessage = {
      id_message: `temp-${Date.now()}`,
      id_conversation: conversationId,
      id_sender: currentUser.id_usuario,
      sender_nombre: currentUser.nombre,
      sender_email: currentUser.email,
      body: trimmed,
      message_type: "text",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setBody("");

    try {
      const response = await fetch(
        `/api/chat/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: trimmed }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "No se pudo enviar el mensaje.");
      }

      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch (err) {
      setMessages((prev) =>
        prev.filter((message) => message.id_message !== optimisticMessage.id_message),
      );
      setBody(trimmed);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo enviar el mensaje. Intentá nuevamente.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-[75vh] flex-1 flex-col gap-4">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-2xl font-bold">{normalizedOtherName}</h1>

            <p className="text-sm text-white/60">
              {detail.animal_nombre
                ? `Consulta por ${detail.animal_nombre}`
                : "Conversación"}
            </p>

            <p className="mt-2 text-xs text-white/50">Estado: {detail.estado}</p>
          </div>

          {detail.other_user_email && (
            <p className="text-sm text-white/50">{detail.other_user_email}</p>
          )}
        </div>
      </section>

      <section className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-6">
        {messages.length === 0 ? (
          <p className="text-sm text-white/60">
            Todavía no hay mensajes en esta conversación.
          </p>
        ) : (
          messages.map((message) => {
            const isMine = message.id_sender === currentUser.id_usuario;
            const isSystem = message.message_type === "system";

            if (isSystem) {
              return (
                <article key={message.id_message} className="flex justify-center">
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
                    {message.body}
                  </div>
                </article>
              );
            }

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

        <div ref={bottomRef} />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="body" className="block text-sm text-white/70">
            Escribir mensaje
          </label>

          <textarea
            id="body"
            name="body"
            rows={4}
            placeholder="Escribí tu mensaje..."
            value={body}
            onChange={(event) => setBody(event.target.value)}
            disabled={isSending}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none disabled:opacity-70"
          />

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSending || !body.trim()}
              className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
