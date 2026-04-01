import { createClient } from "@/lib/supabase/server";

export type ChatInboxItem = {
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

export type ConversationMessage = {
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

export type ConversationDetail = {
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

async function requireAuth() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Usuario no autenticado");
  }

  return { supabase, authUser: data.user };
}

export async function getChatInbox(): Promise<ChatInboxItem[]> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase.rpc("get_chat_inbox");

  if (error) {
    throw new Error(`No se pudo cargar la bandeja de chats: ${error.message}`);
  }

  return (data ?? []).map((item: any) => ({
    ...item,
    unread_count: Number(item.unread_count ?? 0),
  })) as ChatInboxItem[];
}

export async function getConversationDetail(
  idConversation: string,
): Promise<ConversationDetail | null> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase.rpc("get_conversation_detail", {
    p_id_conversation: idConversation,
  });

  if (error) {
    throw new Error(`No se pudo cargar el detalle del chat: ${error.message}`);
  }

  const item = Array.isArray(data) ? data[0] : null;
  return (item ?? null) as ConversationDetail | null;
}

export async function getConversationMessages(
  idConversation: string,
): Promise<ConversationMessage[]> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase.rpc("get_conversation_messages", {
    p_id_conversation: idConversation,
  });

  if (error) {
    throw new Error(`No se pudieron cargar los mensajes: ${error.message}`);
  }

  return (data ?? []) as ConversationMessage[];
}

export async function getOrCreateAdoptionConversation(
  idSolicitud: string,
): Promise<string> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase.rpc(
    "get_or_create_adoption_conversation",
    {
      p_id_solicitud: idSolicitud,
    },
  );

  if (error) {
    throw new Error(
      `No se pudo crear o recuperar la conversación: ${error.message}`,
    );
  }

  if (!data) {
    throw new Error("La función no devolvió id_conversation");
  }

  return data as string;
}

export async function sendChatMessage(
  idConversation: string,
  body: string,
): Promise<string> {
  const { supabase } = await requireAuth();

  const { data, error } = await supabase.rpc("send_chat_message", {
    p_id_conversation: idConversation,
    p_body: body,
  });

  if (error) {
    throw new Error(`No se pudo enviar el mensaje: ${error.message}`);
  }

  if (!data) {
    throw new Error("La función no devolvió id_message");
  }

  return data as string;
}

export async function markConversationAsRead(
  idConversation: string,
): Promise<void> {
  const { supabase } = await requireAuth();

  const { error } = await supabase.rpc("mark_conversation_as_read", {
    p_id_conversation: idConversation,
  });

  if (error) {
    throw new Error(
      `No se pudo marcar la conversación como leída: ${error.message}`,
    );
  }
}
