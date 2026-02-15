import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function POST(req: Request) {
  const supabase = createClient();
  const formData = await req.formData();

  const id_proyecto = Number(formData.get("id_proyecto"));
  const id_usuario = Number(formData.get("id_usuario"));
  const texto = String(formData.get("texto"));

  const uid = formData.get("uid")?.toString() ?? "";
  const sig = formData.get("sig")?.toString() ?? "";

  // 🔥 Validación: usuario no identificado
  if (!id_usuario || id_usuario === 0) {
    return NextResponse.json(
      { error: "Debes iniciar sesión para comentar." },
      { status: 401 }
    );
  }

  const { data, error } = await supabase.rpc("fn_insertar_comentario", {
    p_usuario_id: id_usuario,
    p_texto: texto,
    p_entity_type: "proyecto",
    p_entity_id: id_proyecto,
  });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al insertar comentario" },
      { status: 500 }
    );
  }

  // 🔥 Volvemos a la página del proyecto manteniendo el login
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    return NextResponse.redirect(
    `${baseUrl}/proyecto/${id_proyecto}?uid=${uid}&sig=${sig}`
    );

}
