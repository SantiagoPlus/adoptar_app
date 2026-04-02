"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFechaSeparador(value?: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function sameDay(a?: string | null, b?: string | null) {
  if (!a || !b) return false;

  const da = new Date(a);
  const db = new Date(b);

  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

async function parseJsonResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (!contentType.includes("application/json")) {
    throw new Error("La respuesta del servidor no fue JSON.");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("No se pudo interpretar la respuesta del servidor.");
  }
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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const channelRef = useRef<any>(null);

  const normalizedOtherName = useMemo(
    () => detail.other_user_nombre ?? "Usuario",
    [detail.other_user_nombre],
  );

  function scrollToBottom(behavior: ScrollBehavior = "smooth") {
    bottomRef.current?.scrollIntoView({ behavior });
  }

  function resizeTextarea() {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }

  async function refreshMessages() {
    try {
      const response = await fetch(
        `/api/chat/conversations/${conversationId}/messages`,
        {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const data = await parseJsonResponse(response);

      if (!response.ok || !data?.ok) return;

      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }
    } catch {
      // silencioso por ahora
    }
  }

  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages]);

  useEffect(() => {
    resizeTextarea();
  }, [body]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const topic = `chat:${conversationId}`;

    const channel = supabase.channel(topic, {
      config: {
        private: true,
        broadcast: {
          self: false,
        },
      },
    });

    channel
      .on("broadcast", { event: "message:new" }, async () => {
        await refreshMessages();
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [conversationId]);

  async function sendCurrentMessage() {
    const trimmed = body.trim();
    if (!trimmed || isSending || detail.estado !== "activa") return;

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
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ body: trimmed }),
        },
      );

      const data = await parseJsonResponse(response);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo enviar el mensaje.");
      }

      if (Array.isArray(data.messages)) {
        setMessages(data.messages);
      }

      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "message:new",
          payload: {
            conversationId,
            sentAt: Date.now(),
          },
        });
      }

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    } catch (err) {
      setMessages((prev) =>
        prev.filter(
          (message) => message.id_message !== optimisticMessage.id_message,
        ),
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendCurrentMessage();
  }

  async function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await sendCurrentMessage();
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-132px)] flex-1 flex-col gap-3 md:gap-4">
      <section className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold md:text-2xl">
              {normalizedOtherName}
            </h1>

            <p className="mt-1 truncate text-sm text-white/60">
              {detail.animal_nombre
                ? `Consulta por ${detail.animal_nombre}`
                : "Conversación"}
            </p>

            <p className="mt-2 text-xs text-white/45">
              Estado: {detail.estado}
            </p>
          </div>

          {detail.other_user_email && (
            <p className="hidden max-w-[220px] truncate text-sm text-white/45 md:block">
              {detail.other_user_email}
            </p>
          )}
        </div>
      </section>

      <section className="flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4 md:px-5 md:py-5">
            {messages.length === 0 ? (
              <p className="text-sm text-white/60">
                Todavía no hay mensajes en esta conversación.
              </p>
            ) : (
              messages.map((message, index) => {
                const isMine = message.id_sender === currentUser.id_usuario;
                const isSystem = message.message_type === "system";
                const prev = messages[index - 1];
                const showDateSeparator =
                  index === 0 || !sameDay(prev?.created_at, message.created_at);

                return (
                  <div key={message.id_message} className="space-y-3">
                    {showDateSeparator && (
                      <div className="flex justify-center">
                        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-white/45">
                          {formatFechaSeparador(message.created_at)}
                        </div>
                      </div>
                    )}

                    {isSystem ? (
                      <article className="flex justify-center">
                        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
                          {message.body}
                        </div>
                      </article>
                    ) : (
                      <article
                        className={`max-w-[90%] md:max-w-[78%] ${
                          isMine ? "ml-auto" : ""
                        }`}
                      >
                        <div
                          className={`rounded-3xl px-4 py-3 shadow-sm ${
                            isMine
                              ? "bg-white text-black"
                              : "bg-black/30 text-white"
                          }`}
                        >
                          <div className="mb-1.5 flex items-center justify-between gap-3">
                            <p
                              className={`truncate text-[11px] font-medium ${
                                isMine ? "text-black/65" : "text-white/55"
                              }`}
                            >
                              {message.sender_nombre ?? "Usuario"}
                            </p>

                            <p
                              className={`shrink-0 text-[11px] ${
                                isMine ? "text-black/50" : "text-white/35"
                              }`}
                            >
                              {formatHora(message.created_at)}
                            </p>
                          </div>

                          <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {message.body}
                          </p>
                        </div>
                      </article>
                    )}
                  </div>
                );
              })
            )}

            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 bg-black/90 p-3 md:p-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5">
                <textarea
                  ref={textareaRef}
                  id="body"
                  name="body"
                  rows={1}
                  placeholder={
                    detail.estado === "activa"
                      ? "Escribí tu mensaje..."
                      : "La conversación no está activa."
                  }
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending || detail.estado !== "activa"}
                  className="max-h-[180px] min-h-[28px] w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-white/40 disabled:opacity-70"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] text-white/45">
                  Enter para enviar · Shift + Enter para salto de línea
                </p>

                <button
                  type="submit"
                  disabled={
                    isSending || !body.trim() || detail.estado !== "activa"
                  }
                  className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {isSending ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
