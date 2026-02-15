import { NextResponse } from "next/server";
import { createClient } from "@/app/backend/utils/supabase/client";
import { encodeUserId } from "@/app/utils/hashid";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_validar_usuario", {
    p_mail: email,
    p_password: password,
  });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Correo o contraseña incorrectos" },
      { status: 401 }
    );
  }

  // Supabase RPC devuelve un array
  const user = data[0];

  const uid = user.id_usuario;
  const sig = encodeUserId(uid);
  let profile = {
    nombre: user.nombre ?? "",
    apellido: user.apellido ?? "",
    mail: user.mail ?? user.email ?? "",
  };

  const { data: perfil, error: perfilError } = await supabase
    .from("usuario")
    .select("nombre, apellido, mail")
    .eq("id_usuario", uid)
    .maybeSingle();

  if (!perfilError && perfil) {
    profile = {
      nombre: perfil.nombre ?? profile.nombre,
      apellido: perfil.apellido ?? profile.apellido,
      mail: perfil.mail ?? profile.mail,
    };
  }

  return NextResponse.json({
    success: true,
    usuario: {
      uid,
      sig,
      nombre: profile.nombre,
      apellido: profile.apellido,
      mail: profile.mail
    }
  });
}
