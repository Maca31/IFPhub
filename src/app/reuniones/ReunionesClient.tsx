"use client";

import { useEffect, useState, useRef } from "react";
import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import { Board } from "@/app/frontend/reuniones/board";
import { Hero_reuniones } from "@/app/frontend/components/hero-reuniones";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/frontend/components/ui/breadcrumb";

import { Separator } from "@/app/frontend/components/ui/separator";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Page() {
  const [uid, setUid] = useState<string | null>(null);
  const [sig, setSig] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const boardRef = useRef<{ openCreate: () => void }>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUid(params.get("uid"));
    setSig(params.get("sig"));
  }, []);

  useEffect(() => {
    const storedUid = sessionStorage.getItem("uid");
    const storedSig = sessionStorage.getItem("sig");

    if (!storedUid || !storedSig) return;

    setUid(storedUid);
    setSig(storedSig);

    const urlUid = searchParams.get("uid");
    const urlSig = searchParams.get("sig");

    // 🔁 Si no están en la URL, los añadimos
    if (!urlUid || !urlSig) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("uid", storedUid);
      params.set("sig", storedSig);

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, []);

  if (!uid || !sig) return null;

  return (
    <SidebarProvider>
      {uid && sig && <AppSidebar uid={uid} sig={sig} />}

      <SidebarInset>
        <Hero_reuniones
          onCreate={() => boardRef.current?.openCreate()}
        />
        <header className="flex h-10 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <div className="absolute top-4 left-4 z-50">
              <SidebarTrigger className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20" />
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col">
          <Board ref={boardRef} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
