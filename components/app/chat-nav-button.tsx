"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  initialUnreadTotal: number;
  initialConversationIds: string[];
};

type ConnectionStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "offline";

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

export default function ChatNavButton({
  initialUnreadTotal,
  initialConversationIds,
}: Props) {
  const [unreadTotal, setUnreadTotal] = useState(initialUnreadTotal);
  const [conversationIds, setConversationIds] = useState(initialConversationIds);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");

  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const channelsRef = useRef<any[]>([]);
  const fallbackIntervalRef = useRef<number | null>(null);

  async function refreshUnreadTotal() {
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

      if (!response.ok || !data?.ok || !Array.isArray(data.inbox)) {
        return;
      }

      const inbox = data.inbox as Array<{
        id_conversation: string;
        unread_count: number;
      }>;

      const total = inbox.reduce(
        (acc, item) => acc + Number(item.unread_count ?? 0),
        0,
      );

      setUnreadTotal(total);
      setConversationIds(inbox.map((item) => item.id_conversation));
    } catch {
      // silencioso por ahora
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
          await refreshUnreadTotal();
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
    fallbackIntervalRef.current = window.setInterval(() => {
      void refreshUnreadTotal();
    }, 30000);

    return () => {
      if (fallbackIntervalRef.current) {
        window.clearInterval(fallbackIntervalRef.current);
      }
    };
  }, []);

  return (
    <Link
      href="/chat"
      aria-label="Abrir chats"
      className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
      title={
        connectionStatus === "connected"
          ? "Chats conectados"
          : connectionStatus === "reconnecting"
            ? "Chats reconectando"
            : connectionStatus === "offline"
              ? "Chats con fallback activo"
              : "Chats conectando"
      }
    >
      <MessagesIcon />

      <span
        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border border-black ${
          connectionStatus === "connected"
            ? "bg-green-400"
            : connectionStatus === "reconnecting"
              ? "bg-yellow-400"
              : connectionStatus === "offline"
                ? "bg-red-400"
                : "bg-white/60"
        }`}
      />

      {unreadTotal > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold leading-none text-black">
          {unreadTotal > 99 ? "99+" : unreadTotal}
        </span>
      )}
    </Link>
  );
}
