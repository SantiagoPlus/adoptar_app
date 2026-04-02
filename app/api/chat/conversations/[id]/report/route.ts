import { NextRequest, NextResponse } from "next/server";
import { submitChatReport } from "@/lib/server/chat";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  try {
    const bodyJson = await request.json();
    const motivo = String(bodyJson?.motivo ?? "").trim();
    const detalle = String(bodyJson?.detalle ?? "").trim();

    if (!motivo) {
      return NextResponse.json(
        {
          ok: false,
          error: "Debés indicar un motivo.",
        },
        { status: 400 },
      );
    }

    const idReport = await submitChatReport(id, motivo, detalle);

    return NextResponse.json({
      ok: true,
      id_report: idReport,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "No se pudo reportar la conversación.",
      },
      { status: 500 },
    );
  }
}
