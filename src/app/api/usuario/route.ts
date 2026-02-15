import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_get_usuario");

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
