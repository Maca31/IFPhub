"use client";

import { useState, useEffect } from "react";
import { LoginForm } from "@/app/frontend/components/login-form";
import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";

import { Button } from "@/app/frontend/components/ui/button";
import { Input } from "@/app/frontend/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/app/frontend/components/ui/dialog";
import { Baskervville, Montserrat } from "next/font/google";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface Oficio {
  id_oferta: number;
  titulo: string;
  descripcion: string;
  sueldo: number;
  usuario_nombre: string;
  curso_nombre: string;
  curso_grado: number;
}

type NuevaOfertaInput = {
  titulo: string;
  descripcion: string;
  sueldo: number;
  id_curso: number;
};

function getCursoSiglas(nombreCurso: string | null) {
  if (!nombreCurso) return "";

  const curso = nombreCurso.toLowerCase();

  if (curso.includes("multiplataforma")) return "DAM";
  if (curso.includes("web")) return "DAW";
  if (curso.includes("sistemas")) return "ASIX";

  return nombreCurso;
}

const baskervville = Baskervville({ weight: "400", subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

// Componente hijo
function AceptarDialog({
  titulo,
  nombre,
  mail,
}: {
  titulo: string;
  nombre?: string;
  mail?: string;
}) {
  const [nombreLocal, setNombreLocal] = useState("");
  const [emailLocal, setEmailLocal] = useState("");

  useEffect(() => {
    if (nombre) setNombreLocal(nombre);
    if (mail) setEmailLocal(mail);
  }, [nombre, mail]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-2 w-full bg-[#D46D85] hover:bg-[#D46D85] text-white cursor-pointer border border-[#124d58]/30 font-family: var(--font-montserrat);">
          Solicitar
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-title text-[#124d58]">
            Crear nueva oferta
          </DialogTitle>
          <DialogDescription>
            Rellena los datos para publicar una oferta
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre</label>
            <Input
              value={nombreLocal}
              readOnly
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={emailLocal}
              readOnly
            />
          </div>

          <DialogDescription>
            En breves recibirás un correo del ofertante.
          </DialogDescription>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">Cancelar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button className=" bg-[#D46D85] hover:bg-[#D46D85] cursor-pointer">Solicitar oferta</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function NuevaOfertaDialog({
  onSubmit,
  nombre,
  mail,
}: {
  onSubmit: (oficio: any) => void;
  nombre?: string;
  mail?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="border border-[#D65A7E]/70 bg-[#D65A7E]/30 text-white font-medium text-lg px-8 py-6 rounded-md backdrop-blur-sm transition-all hover:bg-[#D65A7E]/40 hover:border-[#D65A7E] hover:text-white/95 hover:scale-[1.01] cursor-pointer font-family: var(--font-montserrat);">
          Crear oferta
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>Crear nueva oferta</DialogTitle>
          </VisuallyHidden.Root>
        </DialogHeader>

        <div className="py-4">
          <LoginForm
            nombre={nombre}
            emailInicial={mail}
            onSubmit={(oficio) => {
              onSubmit(oficio);
              setOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function OfertasClient() {
  const [oficios, setOficios] = useState<Oficio[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [sig, setSig] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [mailUsuario, setMailUsuario] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<{
      id_usuario: number;
      nombre: string;
      mail: string;
    } | null>(null);
  
  useEffect(() => {
    const storedUid = sessionStorage.getItem("uid");
    const storedSig = sessionStorage.getItem("sig");

    if (!storedUid || !storedSig) return;

    setUid(storedUid);
    setSig(storedSig);

    async function fetchUsuario() {
      try {
        const res = await fetch(`/api/usuarios/${storedUid}`);
        if (!res.ok) throw new Error("Error al cargar usuario");
        const data = await res.json();
        console.log("Datos usuario:", data);
        setUsuario(data ?? null);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUsuario();
    fetchOfertas();
  }, []);

  const handleNuevaOferta = async (oficio: NuevaOfertaInput) => {
    try {
      const res = await fetch("/api/oferta", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(oficio),
      });

      if (!res.ok) {
      throw new Error("Error al crear la oferta");
      }

      // 🔁 refrescamos desde la API (fuente de verdad)
      await fetchOfertas();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/oferta");
      if (!res.ok) throw new Error("Error al cargar ofertas");
      const data: Oficio[] = await res.json();
      setOficios(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      {uid && sig && <AppSidebar uid={uid} sig={sig} />}
      <SidebarInset>
        <div className="absolute top-4 left-4 z-50">
          <SidebarTrigger className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20" />
        </div>

        <div className="relative flex items-center justify-center p-4 md:p-8 lg:p-16 min-h-[50vh]">

        <div className="absolute inset-0 z-0">
          <Image
            src="/imagenes/entrevista.png"
            alt="Entrevista Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-8 max-w-7xl w-full px-4">
          <div className="max-w-3xl w-full space-y-3 md:space-y-4 text-center">
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`${baskervville.className} text-4xl md:text-6xl font-normal text-white leading-tight drop-shadow-lg`}
            >
                Ofertas de trabajo
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-shrink-0"
          >
            <NuevaOfertaDialog
              onSubmit={handleNuevaOferta}
              nombre={usuario?.nombre}
              mail={usuario?.mail}
            />
          </motion.div>
          </div>
        </div>

        <div className="p-8 md:p-16">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
              {loading && (
                <p className="col-span-full text-center text-muted-foreground">
                Cargando ofertas...
                </p>
              )}
              {!loading && oficios.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground">
                No hay ofertas disponibles
                </p>
              )}
              {oficios.map((oficio) => (
                <div
                  key={oficio.id_oferta}
                  className="bg-white shadow rounded-xl overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(18,77,88,0.4)]"
                >
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground">
                    {getCursoSiglas(oficio.curso_nombre)}
                    {oficio.curso_grado && ` · ${oficio.curso_grado}º`}
                  </p>
                  <h3 className="font-semibold font-title line-clamp-2">{oficio.titulo}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {oficio.descripcion}
                  </p>
                  <p className="text-sm font-bold font-title text-[#124d58]">
                      {oficio.sueldo} €/h
                  </p>
                  <p className="text-xs text-muted-foreground">
                  </p>
                  <AceptarDialog
                    titulo={oficio.titulo}
                    nombre={usuario?.nombre}
                    mail={usuario?.mail}
                  />
                </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
