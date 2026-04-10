import { NextResponse } from "next/server";
import { getChatInbox } from "@/lib/server/chat";

export async function GET() {
  try {
    const inbox = await getChatInbox();

    return NextResponse.json(
      { ok: true, inbox },
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
            : "No se pudo cargar la bandeja de chats.",
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
