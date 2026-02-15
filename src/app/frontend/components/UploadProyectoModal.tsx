"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Curso = {
  id_curso: number;
  nombre: string;
  grado: number | null;
};

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

const bodyFont = { fontFamily: '"Montserrat", system-ui, sans-serif' };
const titleFont = { fontFamily: '"Libre Baskerville", serif' };

const getPicsum = (seed: string | number, w = 800, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${w}/${h}`;

function pickFirstNonEmpty(...values: Array<string | null | undefined>): string | undefined {
  const found = values.find((v) => typeof v === "string" && v.trim() !== "");
  return found?.trim();
}

function getCursoSiglas(nombreCurso: string | null) {
  if (!nombreCurso) return "";
  const curso = nombreCurso.toLowerCase();
  if (curso.includes("multiplataforma")) return "DAM";
  if (curso.includes("web")) return "DAW";
  if (curso.includes("sistemas")) return "ASIX";
  return nombreCurso.toUpperCase();
}

interface UploadProyectoModalProps {
  open: boolean;
  onClose: () => void;
  cursos: Curso[];
  uid: string | null;
  onSuccess?: () => void;
}

export default function UploadProyectoModal({
  open,
  onClose,
  cursos,
  uid,
  onSuccess,
}: UploadProyectoModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const fallbackCoverSeedRef = useRef(Date.now());

  // Estados del formulario
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [visibilidad, setVisibilidad] = useState<"public" | "private">("public");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [showAllCourses, setShowAllCourses] = useState(false);

  const previewCoverSrc = useMemo(() => {
    if (coverFile) {
      return URL.createObjectURL(coverFile);
    }
    return getPicsum(`proyecto-new-${fallbackCoverSeedRef.current}`);
  }, [coverFile]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(t)) onClose();
    }
    if (open) {
      document.addEventListener("mousedown", onDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const randomCourses = useMemo(() => {
    const shuffled = [...cursos].sort(() => 0.5 - Math.random());
    return {
      visible: shuffled.slice(0, 3),
      rest: shuffled.slice(3),
    };
  }, [cursos]);

  const isValid =
    titulo.trim().length > 0 &&
    descripcion.trim().length > 0 &&
    selectedCurso !== null &&
    coverFile !== null;

  const missingFields = [];
  if (!titulo.trim()) missingFields.push("Título");
  if (!descripcion.trim()) missingFields.push("Descripción");
  if (!selectedCurso) missingFields.push("Curso");
  if (!coverFile) missingFields.push("Imagen de portada");
  const missingText = missingFields.join(", ");

  const handleSave = async () => {
    if (!isValid || !uid) {
      console.error("Validación fallida:", { isValid, uid });
      return;
    }

    try {
      const formData = new FormData();
      
      // ✅ Campos que espera el endpoint
      formData.append("titulo", titulo);
      formData.append("descripcion", descripcion);
      formData.append("id_curso", String(selectedCurso!.id_curso));
      formData.append("uid", uid); // ✅ uid, no id_usuario
      formData.append("visibilidad", visibilidad);
      formData.append("file", coverFile!); // ✅ file, no imagen

      console.log("📤 Enviando datos:", {
        titulo,
        descripcion,
        id_curso: selectedCurso!.id_curso,
        uid,
        visibilidad,
        file: coverFile!.name
      });

      const res = await fetch("/api/proyecto/upload", { // ✅ Ruta correcta
        method: "POST",
        body: formData,
      });

      const responseData = await res.json();
      console.log("📥 Respuesta del servidor:", responseData);

      if (!res.ok) {
        throw new Error(responseData.error || "Error al crear proyecto");
      }

      // Limpiar formulario
      setTitulo("");
      setDescripcion("");
      setSelectedCurso(null);
      setVisibilidad("public");
      setCoverFile(null);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("❌ Error completo:", err);
      alert(`No se pudo guardar el proyecto: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/30 p-4 sm:p-8">
      <div
        ref={panelRef}
        className="mx-auto flex w-full max-w-5xl flex-col rounded-xl border border-black/10 bg-white shadow-xl overflow-hidden"
        style={bodyFont}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-[#123d58]" style={titleFont}>
            Subir proyecto
          </h2>
          <button
            onClick={onClose}
            className="text-xl opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 pb-6 pt-6">
          {/* GRID PRINCIPAL */}
          <div className="grid gap-8 md:grid-cols-[1.4fr_1.1fr]">
            {/* COLUMNA IZQUIERDA */}
            <div className="flex flex-col gap-6">
              {/* TÍTULO */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[#123d58]" style={titleFont}>
                  Título
                </h3>
                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="h-11 w-full rounded-md border border-[#dbe2e8] bg-white px-4 text-sm text-[#123d58] placeholder:text-[#123d58]/50 focus:outline-none focus:ring-2 focus:ring-[#123d58]/15"
                  placeholder="Introduce un título..."
                />
              </div>

              {/* DESCRIPCIÓN */}
              <div>
                <h3 className="mb-2 text-lg font-semibold text-[#123d58]" style={titleFont}>
                  Descripción
                </h3>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="min-h-[120px] w-full rounded-md border border-[#dbe2e8] bg-white p-4 text-sm text-[#123d58] placeholder:text-[#123d58]/50 focus:outline-none focus:ring-2 focus:ring-[#123d58]/15"
                  placeholder="Describe el proyecto..."
                />
              </div>

              {/* CURSO + VISIBILIDAD */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* CURSO */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#123d58]" style={titleFont}>
                    Curso
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {randomCourses.visible.map((c) => {
                      const active = selectedCurso?.id_curso === c.id_curso;
                      return (
                        <button
                          key={c.id_curso}
                          type="button"
                          onClick={() => setSelectedCurso(c)}
                          className={`flex items-center justify-between gap-2 rounded-full border px-3 py-1 text-xs transition ${
                            active
                              ? "border-[#123d58] bg-[#123d58] text-white"
                              : "border-[#dbe2e8] bg-white text-[#123d58] hover:bg-[#f1f5f9]"
                          }`}
                        >
                          <span className="max-w-[120px] truncate">{c.nombre}</span>
                          {c.grado && (
                            <span className="text-[10px] opacity-70">{c.grado}º</span>
                          )}
                        </button>
                      );
                    })}

                    {randomCourses.rest.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllCourses((v) => !v)}
                        className="flex overflow-hidden items-center gap-2 rounded-full border border-dashed border-[#dbe2e8] px-3 py-1 text-xs text-[#123d58] hover:bg-[#f1f5f9]"
                      >
                        {selectedCurso && !randomCourses.visible.some(c => c.id_curso === selectedCurso.id_curso) ? (
                          <>
                            <span className="truncate max-w-[100px]">{selectedCurso.nombre}</span>
                            {selectedCurso.grado && (
                              <span className="text-[10px] opacity-60">{selectedCurso.grado}º</span>
                            )}
                          </>
                        ) : (
                          "Ver más"
                        )}
                      </button>
                    )}
                  </div>

                  {showAllCourses && (
                    <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-black/10 bg-white shadow-sm">
                      {randomCourses.rest.map((c) => (
                        <button
                          key={c.id_curso}
                          type="button"
                          onClick={() => {
                            setSelectedCurso(c);
                            setShowAllCourses(false);
                          }}
                          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-black/[.04]"
                        >
                          <span>
                            {c.nombre}
                            {c.grado && ` · ${c.grado}º`}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* VISIBILIDAD */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-[#123d58]" style={titleFont}>
                    Visibilidad
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setVisibilidad("public")}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        visibilidad === "public"
                          ? "border-[#123d58] bg-[#123d58] text-white"
                          : "border-[#dbe2e8] bg-white text-[#123d58] hover:bg-[#f1f5f9]"
                      }`}
                    >
                      Público
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisibilidad("private")}
                      className={`rounded-full border px-3 py-1 text-xs ${
                        visibilidad === "private"
                          ? "border-[#123d58] bg-[#123d58] text-white"
                          : "border-[#dbe2e8] bg-white text-[#123d58] hover:bg-[#f1f5f9]"
                      }`}
                    >
                      Privado
                    </button>
                  </div>
                </div>
              </div>

              {/* PORTADA */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-[#123d58]" style={titleFont}>
                  Imagen de portada
                </h3>

                <div className="mt-2">
                  <input
                    id="cover-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                        alert("❌ Solo se permiten imágenes (JPG, PNG, WEBP)");
                        e.target.value = "";
                        return;
                      }
                      setCoverFile(file);
                    }}
                  />

                  <label
                    htmlFor="cover-upload"
                    className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-[#dbe2e8] bg-[#f8fafc] px-4 py-3 text-sm font-medium text-[#123d58] transition hover:bg-[#eef2f5]"
                  >
                    {coverFile ? "Cambiar imagen" : "Subir imagen de portada"}
                  </label>

                  {coverFile && (
                    <p className="mt-1 text-[11px] text-[#123d58]/60">
                      Archivo seleccionado:{" "}
                      <span className="font-medium">{coverFile.name}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: PREVIEW */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-sm">
                <div className="aspect-[4/3] w-full overflow-hidden rounded-md border border-[#dbe2e8] bg-[#f8fafc]">
                  <img
                    src={previewCoverSrc}
                    alt="Portada preview"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#123d58]" style={titleFont}>
                    {titulo || "Ejemplo"}
                  </h3>
                  {selectedCurso && (
                    <span className="rounded-md bg-[#D65A7E] px-2 py-1 text-xs font-semibold text-white">
                      {selectedCurso.grado} {getCursoSiglas(selectedCurso.nombre)}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-[#123d58]/80">
                  {descripcion || "Descripción de ejemplo del proyecto que se mostrará."}
                </p>

                {visibilidad === "private" && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-[#123d58]/60">
                    <span>🔒</span>
                    <span>Privado</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BOTONES ABAJO */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="h-9 rounded-md border border-[#dbe2e8] bg-white px-5 text-sm text-[#123d58] hover:bg-[#f8fafc]"
            >
              Cancelar
            </button>
            <div className="relative group">
              <button
                onClick={() => {
                  if (!isValid) return;
                  handleSave();
                }}
                disabled={!isValid}
                className={`h-9 rounded-md border border-[#123d58]/20 px-6 text-sm font-medium text-white transition
                  ${
                    isValid
                      ? "bg-[#123d58] hover:bg-[#0f344b]"
                      : "bg-[#123d58]/40 cursor-not-allowed"
                  }
                `}
              >
                Subir proyecto
              </button>

              {!isValid && (
                <div className="pointer-events-none absolute bottom-full right-0 mb-2 w-max max-w-xs rounded-md bg-black px-3 py-2 text-xs text-white opacity-0 transition group-hover:opacity-100">
                  Falta completar: <span className="font-semibold">{missingText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}