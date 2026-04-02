"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ChatInboxItem = {
  id_conversation: string;
  context_type: "adoption_request" | "provider_contact";
  estado: "activa" | "cerrada" | "bloqueada";
  updated_at: string;
  other_user_id: string | null;
  other_user_nombre: string | null;
  other_user_email: string | null;
  animal_id: string | null;
  animal_nombre: string | null;
  id_solicitud: string | null;
  last_message_id: string | null;
  last_message_body: string | null;
  last_message_type: "text" | "system" | null;
  last_message_created_at: string | null;
  unread_count: number;
};

type Props = {
  initialInbox: ChatInboxItem[];
};

function formatHora(value?: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
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

export default function ChatInboxClient({ initialInbox }: Props) {
  const [inbox, setInbox] = useState<ChatInboxItem[]>(initialInbox);
  const [error, setError] = useState<string | null>(null);

  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const channelsRef = useRef<any[]>([]);
  const fallbackIntervalRef = useRef<number | null>(null);

  const conversationIds = useMemo(
    () => inbox.map((item) => item.id_conversation),
    [inbox],
  );

  async function refreshInbox() {
    try {
      const response = await fetch("/api/chat/inbox", {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await parseJsonResponse(response);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo actualizar la bandeja.");
      }

      if (Array.isArray(data.inbox)) {
        setInbox(data.inbox);
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la bandeja de chats.",
      );
    }
  }

  useEffect(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }

    const supabase = supabaseRef.current;

    channelsRef.current.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];

    conversationIds.forEach((conversationId) => {
      const topic = `chat:${conversationId}`;

      const channel = supabase
        .channel(topic, {
          config: {
            private: true,
            broadcast: {
              self: false,
            },
          },
        })
        .on("broadcast", { event: "message:new" }, async () => {
          await refreshInbox();
        })
        .subscribe();

      channelsRef.current.push(channel);
    });

    return () => {
      channelsRef.current.forEach((channel) => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [conversationIds]);

  useEffect(() => {
    fallbackIntervalRef.current = window.setInterval(() => {
      void refreshInbox();
    }, 30000);

    return () => {
      if (fallbackIntervalRef.current) {
        window.clearInterval(fallbackIntervalRef.current);
      }
    };
  }, []);

  if (inbox.length === 0) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-2 text-white/80">Todavía no tenés conversaciones.</p>
          <p className="text-sm text-white/60">
            Los chats van a aparecer cuando una solicitud habilite una
            conversación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      )}

      {inbox.map((item) => (
        <Link
          key={item.id_conversation}
          href={`/chat/${item.id_conversation}`}
          className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
        >
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold">
                {item.other_user_nombre ?? "Usuario"}
              </h2>
              <p className="truncate text-sm text-white/60">
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
