"use client";

import { Button } from "@/app/frontend/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/frontend/components/ui/dialog";
import { Check } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

type Dialog01Props = {
  trigger: ReactNode;
  // ✅ callback opcional para que el padre resetee/cierre el modal grande antes de navegar
  onBackToDashboard?: () => void;
  // ✅ ruta configurable (por defecto /proyectos)
  to?: string;
};

export default function Dialog01({ trigger, onBackToDashboard, to = "/proyectos" }: Dialog01Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-sm flex flex-col items-center">
        <div className="flex justify-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
        </div>

        <DialogHeader className="text-center gap-0">
          <DialogTitle className="text-center">
            Tu archivo se ha cargado correctamente
          </DialogTitle>
          <DialogDescription className="mt-2 text-center mx-auto sm:max-w-[90%]">
            Puedes encontrarlo en tu perfil o en la categoria marcada
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center w-full">
          <DialogClose asChild>
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                // ✅ 1) reset/cierra modal grande si aplica
                onBackToDashboard?.();
                // ✅ 2) navega al dashboard/proyectos
                router.push(to);
                // ✅ DialogClose cierra este dialog automáticamente
              }}
            >
              Vuelve al dashboard
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
