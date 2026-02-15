import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await context.params;
    const idUsuario = Number(id);

    if (!Number.isFinite(idUsuario)) {
      return NextResponse.json(
        { error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    // 1️⃣ Leer FormData
    const formData = await req.formData();
    const tipo = formData.get("tipo") as "avatar" | "header";
    const file = formData.get("file") as File | null;

    if (!file || !tipo) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // 2️⃣ Subir imagen a Storage
    const extension = file.name.split(".").pop();
    const filePath = `${idUsuario}/${tipo}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("usuario")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json(
        { error: "Error subiendo la imagen" },
        { status: 500 }
      );
    }

    // 3️⃣ Obtener URL pública
    const { data: publicUrl } = supabase.storage
      .from("usuario")
      .getPublicUrl(filePath);

    // 4️⃣ Actualizar SOLO el campo correspondiente
    const updateData =
      tipo === "avatar"
        ? { avatar: publicUrl.publicUrl }
        : { header: publicUrl.publicUrl };

    const { error: updateError } = await supabase
      .from("usuario")
      .update(updateData)
      .eq("id_usuario", idUsuario);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json(
        { error: "Error actualizando la imagen" },
        { status: 500 }
      );
    }

    // ✅ OK
    return NextResponse.json({
      success: true,
      url: publicUrl.publicUrl,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
