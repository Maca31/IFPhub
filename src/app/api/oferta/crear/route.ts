import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      titulo,
      descripcion,
      sueldo,
      fecha,
      uid, // ⬅️ viene del frontend
    } = body;

    if (!titulo || !descripcion || !sueldo || !uid) {
      return NextResponse.json(
        { message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { error } = await supabase.rpc("fn_insert_oferta", {
      p_titulo: titulo,
      p_descripcion: descripcion,
      p_sueldo: Number(sueldo),
      p_id_curso: 1,              // 🔒 FIJO DE MOMENTO
      p_id_usuario: Number(uid),  // 🔑 usuario real
      p_fecha_limite: fecha ?? null,
    });

    if (error) {
      console.error("❌ RPC error:", error);
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno" },
      { status: 500 }
    );
  }
}
