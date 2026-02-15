import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function POST(req: Request) {
  const supabase = createClient();
  const { id_quedada, id_usuario } = await req.json();

  const { error } = await supabase.rpc("fn_inscribirse_quedada", {
    p_id_quedada: id_quedada,
    p_id_usuario: id_usuario,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
