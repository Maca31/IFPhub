import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function POST(req: Request) {
  const supabase = createClient();

  const {
    nombre,
    apellido,
    email,
    password,
    fecha_nacimiento,
    id_curso
  } = await req.json();

  const { data, error } = await supabase.rpc("fn_registrar_usuario", {
    p_nombre: nombre,
    p_apellido: apellido,
    p_mail: email,
    p_password: password,
    p_fecha_nacimiento: fecha_nacimiento,
    p_id_curso: id_curso,
  });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Error al registrar usuario" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    usuario: data[0],
  });
}
