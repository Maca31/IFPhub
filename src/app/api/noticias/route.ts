import { NextResponse } from "next/server";
import { createClient } from "../../backend/utils/supabase/client"; 

export async function GET() {
  const supabase = createClient();

  // Llamada a tu función de PostgreSQL en Supabase
  const { data, error } = await supabase.rpc("fn_get_noticia");

  if (error) {
    console.error("Error al obtener noticias:", error);
    return NextResponse.json({ error: "Error al obtener noticias" }, { status: 500 });
  }

  return NextResponse.json(data);
}
