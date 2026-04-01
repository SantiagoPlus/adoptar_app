import { NextRequest, NextResponse } from "next/server";
import {
  getConversationMessages,
  markConversationAsRead,
  sendChatMessage,
} from "@/lib/server/chat";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const messages = await getConversationMessages(id);
    await markConversationAsRead(id);

    return NextResponse.json(
      { ok: true, messages },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los mensajes.",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const bodyJson = await request.json();
    const body = String(bodyJson?.body ?? "").trim();

    if (!body) {
      return NextResponse.json(
        {
          ok: false,
          error: "El mensaje no puede estar vacío.",
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    await sendChatMessage(id, body);

    const messages = await getConversationMessages(id);
    await markConversationAsRead(id);

    return NextResponse.json(
      {
        ok: true,
        messages,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo enviar el mensaje.",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
