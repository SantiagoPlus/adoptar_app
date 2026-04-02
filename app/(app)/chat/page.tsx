import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getChatInbox } from "@/lib/server/chat";
import { createClient } from "@/lib/supabase/server";
import ChatInboxClient from "./ChatInboxClient";

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

async function ChatInboxContent() {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/auth/login?next=/chat");
  }

  const inbox = await getChatInbox();

  return <ChatInboxClient initialInbox={inbox} />;
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
            Acá vas a ver las conversaciones activas vinculadas a tus procesos
            dentro de la plataforma.
          </p>
        </header>

        <Suspense fallback={<ChatInboxSkeleton />}>
          <ChatInboxContent />
        </Suspense>
      </section>
    </main>
  );
}
