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

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "offline";

function formatHora(value?: string | null) {
  if (!value) return "";

  return new Date(value).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function getEstadoLabel(estado: ChatInboxItem["estado"]) {
  const labels: Record<ChatInboxItem["estado"], string> = {
    activa: "Activa",
    cerrada: "Cerrada",
    bloqueada: "Bloqueada",
  };

  return labels[estado] ?? estado;
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

function InboxConnectionBadge({
  status,
  lastSyncAt,
}: {
  status: ConnectionStatus;
  lastSyncAt: string | null;
}) {
  const config: Record<
    ConnectionStatus,
    { label: string; className: string; dot: string }
  > = {
    connecting: {
      label: "Sincronizando",
      className: "border-white/10 bg-white/5 text-white/60",
      dot: "bg-white/50",
    },
    connected: {
      label: "Conectado",
      className: "border-green-500/20 bg-green-500/10 text-green-200",
      dot: "bg-green-400",
    },
    reconnecting: {
      label: "Sincronizando",
      className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-200",
      dot: "bg-yellow-400",
    },
    offline: {
      label: "Actualización periódica",
      className: "border-white/10 bg-white/5 text-white/60",
      dot: "bg-white/50",
    },
  };

  const item = config[status];

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] ${item.className}`}
      >
        <span className={`h-2 w-2 rounded-full ${item.dot}`} />
        {item.label}
      </span>

      {lastSyncAt && (
        <span className="text-[11px] text-white/40">
          Última actualización {formatHora(lastSyncAt)}
        </span>
      )}
    </div>
  );
}

export default function ChatInboxClient({ initialInbox }: Props) {
  const [inbox, setInbox] = useState<ChatInboxItem[]>(initialInbox);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(
    initialInbox.length > 0 ? new Date().toISOString() : null,
  );
  const [search, setSearch] = useState("");

  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const channelsRef = useRef<any[]>([]);
  const fallbackIntervalRef = useRef<number | null>(null);

  const conversationIds = useMemo(
    () => inbox.map((item) => item.id_conversation),
    [inbox],
  );

  const normalizedSearch = search.trim().toLowerCase();

  const filteredInbox = useMemo(() => {
    if (!normalizedSearch) return inbox;

    return inbox.filter((item) => {
      const userName = (item.other_user_nombre ?? "").toLowerCase();
      const animalName = (item.animal_nombre ?? "").toLowerCase();
      const preview = (item.last_message_body ?? "").toLowerCase();

      return (
        userName.includes(normalizedSearch) ||
        animalName.includes(normalizedSearch) ||
        preview.includes(normalizedSearch)
      );
    });
  }, [inbox, normalizedSearch]);

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
        throw new Error(data?.error ?? "No se pudo actualizar la lista.");
      }

      if (Array.isArray(data.inbox)) {
        setInbox(data.inbox);
        setError(null);
        setLastSyncAt(new Date().toISOString());
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la lista de chats.",
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

    if (conversationIds.length === 0) {
      setConnectionStatus("offline");
      return;
    }

    setConnectionStatus("connecting");

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
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            setConnectionStatus("connected");
          } else if (
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT" ||
            status === "CLOSED"
          ) {
            setConnectionStatus("offline");
          } else {
            setConnectionStatus("reconnecting");
          }
        });

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
    fallbackIntervalRef.current = window.setInterval(async () => {
      await refreshInbox();
    }, 30000);

    return () => {
      if (fallbackIntervalRef.current) {
        window.clearInterval(fallbackIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <InboxConnectionBadge status={connectionStatus} lastSyncAt={lastSyncAt} />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-3 md:p-4">
        <div className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2.5">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por persona, animal o mensaje..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      )}

      {inbox.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <p className="mb-2 text-white/80">Todavía no tenés chats activos.</p>
          <p className="text-sm text-white/60">
            Las conversaciones van a aparecer cuando una solicitud habilite el
            contacto entre las partes.
          </p>
        </div>
      ) : filteredInbox.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <p className="mb-2 text-white/80">
            No encontramos chats con esa búsqueda.
          </p>
          <p className="text-sm text-white/60">
            Probá con otro nombre, el animal o una palabra del último mensaje.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInbox.map((item) => {
            const isUnread = item.unread_count > 0;
            const title = item.other_user_nombre ?? "Usuario";
            const subtitle = item.animal_nombre
              ? `Consulta por ${item.animal_nombre}`
              : "Conversación";
            const preview =
              item.last_message_type === "system"
                ? "Actualización del sistema"
                : item.last_message_body ?? "Sin mensajes todavía.";
            const ts = item.last_message_created_at ?? item.updated_at;

            return (
              <Link
                key={item.id_conversation}
                href={`/chat/${item.id_conversation}`}
                className={`block rounded-2xl border p-4 transition md:p-5 ${
                  isUnread
                    ? "border-white/20 bg-white/10 hover:bg-white/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/30 text-sm font-semibold text-white/85">
                    {title.trim().charAt(0).toUpperCase() || "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2
                            className={`truncate text-base md:text-lg ${
                              isUnread
                                ? "font-bold text-white"
                                : "font-semibold text-white"
                            }`}
                          >
                            {title}
                          </h2>

                          {isUnread && (
                            <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-white" />
                          )}
                        </div>

                        <p className="truncate text-sm text-white/60">
                          {subtitle}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[11px] text-white/45 md:text-xs">
                          {formatHora(ts)}
                        </p>

                        {item.unread_count > 0 && (
                          <span className="mt-2 inline-flex min-w-6 items-center justify-center rounded-full bg-white px-2 py-1 text-[11px] font-semibold leading-none text-black">
                            {item.unread_count > 99 ? "99+" : item.unread_count}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] ${
                          item.estado === "activa"
                            ? "border-green-500/20 bg-green-500/10 text-green-200"
                            : item.estado === "cerrada"
                              ? "border-white/10 bg-white/5 text-white/55"
                              : "border-red-500/20 bg-red-500/10 text-red-200"
                        }`}
                      >
                        {getEstadoLabel(item.estado)}
                      </span>

                      {item.context_type === "adoption_request" && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/55">
                          Adopción
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-3 line-clamp-2 text-sm leading-6 ${
                        isUnread ? "text-white/90" : "text-white/70"
                      }`}
                    >
                      {preview}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
