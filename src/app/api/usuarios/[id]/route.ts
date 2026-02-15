import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const supabase = createClient();

  const { data, error } = await supabase.rpc(
    "get_usuario_basico_by_id",
    {
      p_id_usuario: Number(id),
    }
  );

  if (error) {
    console.error("❌ RPC error:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data?.[0] ?? null);
}
