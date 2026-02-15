"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const storedUid = sessionStorage.getItem("uid");
    const storedSig = sessionStorage.getItem("sig");

    // 🚫 No logeado → fuera
    if (!storedUid || !storedSig) {
      router.replace("/");
      return;
    }

    const urlUid = searchParams.get("uid");
    const urlSig = searchParams.get("sig");

    // 🔁 Añadir / corregir params en la URL
    if (urlUid !== storedUid || urlSig !== storedSig) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("uid", storedUid);
      params.set("sig", storedSig);

      router.replace(`${pathname}?${params.toString()}`);
      return; // ⛔ esperamos al siguiente render
    }

    // ✅ Todo OK
    setChecked(true);
  }, [router, pathname, searchParams]);

  // ⛔ No renderiza nada hasta validar
  if (!checked) return null;

  return <>{children}</>;
}
