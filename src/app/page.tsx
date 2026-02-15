"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Definimos valores de invitado
    const uid = "guest";
    const sig = "guest";

    // Guardamos en sessionStorage para que el resto de la app lo reconozca
    sessionStorage.setItem("uid", uid);
    sessionStorage.setItem("sig", sig);
    sessionStorage.setItem("ifphub_user_name", "Invitado");
    sessionStorage.setItem("ifphub_user_email", "invitado@ifphub.com");

    // Redirigimos a noticias
    router.replace(`/noticias?uid=${uid}&sig=${sig}`);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4 font-montserrat">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-[#0E4A54] mb-2">Entrando al portal...</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-300 mx-auto"></div>
      </div>
    </div>
  );
}
