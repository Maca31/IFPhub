"use client";

import { useState } from "react";

type UploadResult = {
  ok: boolean;
  url?: string;
  error?: string;
};

export function useFileUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (
    endpoint: string,
    file: File,
    extraData?: Record<string, string | number | null>
  ): Promise<UploadResult> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (extraData) {
        Object.entries(extraData).forEach(([k, v]) => {
          if (v !== null && v !== undefined) {
            formData.append(k, String(v));
          }
        });
      }

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Error al subir archivo");
      }

      return { ok: true, url: data.url };
    } catch (err: any) {
      const msg = err.message ?? "Error al subir archivo";
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, error };
}
