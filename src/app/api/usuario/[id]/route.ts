import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = createClient();

  const params = await context.params;
  const userId = Number(params.id);

  if (!Number.isFinite(userId)) {
    return NextResponse.json(
      { error: "ID de usuario inválido" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.rpc("get_usuario_by_id", {
    p_id_usuario: userId,
  });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener el usuario" },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const supabase = createClient();
  const { id } = await context.params;
  const userId = Number(id);

  if (!Number.isFinite(userId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();

    const { data, error } = await supabase.rpc("update_usuario_by_id", {
    p_id_usuario: userId,
    p_nombre: body.nombre ?? null,
    p_apellido: body.apellido ?? null,
    p_fecha_nacimiento: null, // 👈 AÑADIDO
    p_id_curso: null,         // 👈 AÑADIDO
    p_avatar: body.avatar ?? null,
    p_header: body.header ?? null,
    p_telefono: body.telefono ?? null,
    p_bio: body.bio ?? null,
    p_genero: body.genero ?? null,
    p_permite_notificaciones: body.permite_notificaciones ?? null,
    });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }

  if (data === false) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
