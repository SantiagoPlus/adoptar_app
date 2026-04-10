import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUsuario } from "@/lib/server/auth";
import {
  getConversationDetail,
  getConversationMessages,
  markConversationAsRead,
} from "@/lib/server/chat";
import ChatConversationClient from "./ChatConversationClient";

type Params = Promise<{ id: string }>;

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
              index % 2 === 0
                ? "ml-auto bg-white text-black"
                : "bg-black/30 text-white"
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

async function ChatDetailContent({ params }: { params: Params }) {
  const { id } = await params;

  const { usuario } = await getCurrentUsuario({
    loginNext: `/chat/${id}`,
    notFoundRedirect: `/chat?error=usuario_no_encontrado`,
  });

  const detail = await getConversationDetail(id);

  if (!detail) {
    notFound();
  }

  const messages = await getConversationMessages(id);
  await markConversationAsRead(id);

  return (
    <ChatConversationClient
      conversationId={id}
      currentUser={{
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre ?? "Usuario",
        email: usuario.email ?? "",
      }}
      detail={detail}
      initialMessages={messages}
    />
  );
}

export default function ChatConversationPage({
  params,
}: {
  params: Params;
}) {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
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
          <ChatDetailContent params={params} />
        </Suspense>
      </section>
    </main>
  );
}
