"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const uid = sessionStorage.getItem("uid");
    const sig = sessionStorage.getItem("sig");

    if (uid && sig) {
      router.replace(`/noticias?uid=${uid}&sig=${sig}`);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (isLogin) {
      // LOGIN
      const res = await fetch("/api/usuario/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMsg(result.error);
      } else {
        // Recibimos uid + sig del backend
        console.log("RESULTADO LOGIN:", result);

        const uid = result.usuario.uid;
        const sig = result.usuario.sig;
        const nombre = result.usuario.nombre ?? "";
        const apellido = result.usuario.apellido ?? "";
        const mail =
          result.usuario.mail ??
          result.usuario.email ??
          email ??
          "";
        const fullName = [nombre, apellido].filter(Boolean).join(" ").trim();

        if (fullName) {
          sessionStorage.setItem("ifphub_user_name", fullName);
        }

        if (mail) {
          sessionStorage.setItem("ifphub_user_email", mail);
        }

        sessionStorage.setItem("uid", uid);
        sessionStorage.setItem("sig", sig);

        window.location.href = `/noticias?uid=${uid}&sig=${sig}`;
      }
    } else {
      // REGISTRO
      const res = await fetch("/api/usuario/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
          fecha_nacimiento: null,
          id_curso: null,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrorMsg(result.error);
      } else {
        // Registro correcto → usuario debe iniciar sesión manualmente
        window.location.href = "/";
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-pink-100">
        
        {/* Header */}
        <h1 className="text-2xl font-semibold text-[#0E4A54] text-center mb-2">
          {isLogin ? "Bienvenido de nuevo" : "Crear cuenta"}
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? "Inicia sesión para continuar" : "Regístrate para acceder al portal"}
        </p>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* CAMPOS EXTRA SOLO PARA REGISTRO */}
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  placeholder="Introduce tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  required={!isLogin}
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
                  placeholder="Introduce tu apellido"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              placeholder="tuemail@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-pink-300 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-200 to-pink-300 text-[#0E4A54] font-semibold shadow-md hover:shadow-lg transition-all"
          >
            {loading
              ? "Cargando..."
              : isLogin
              ? "Iniciar sesión"
              : "Crear cuenta"}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <p className="text-center text-sm text-gray-600 mt-6">
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-500 font-medium hover:underline"
          >
            {isLogin ? "Crear cuenta" : "Iniciar sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
