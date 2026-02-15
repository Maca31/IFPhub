import { createClient } from "@/app/backend/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id_quedada } = await req.json();

    if (!id_quedada) {
      return NextResponse.json(
        { error: "id_quedada requerido" },
        { status: 400 }
      );
    }

    // 🔥 AQUÍ ESTÁ LA CLAVE
    const supabase = await createClient();

    await supabase.rpc("fn_incrementar_visualizacion_quedada", {
      p_id_quedada: id_quedada,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error incrementando visualización" },
      { status: 500 }
    );
  }
}
