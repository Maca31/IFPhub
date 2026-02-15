import { cn } from "@/lib/utils";
import { Button } from "@/app/frontend/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/app/frontend/components/ui/field";
import { Input } from "@/app/frontend/components/ui/input";
import { useState } from "react";
import { useEffect } from "react";

interface LoginFormProps {
  onSubmit: (oficio: {
    titulo: string;
    descripcion: string;
    curso: string;
    precio: string;
    fecha: string;
    email: string;
  }) => void;
  className?: string;
  nombre?: string;
  emailInicial?: string;
}

export function LoginForm({
  className,
  onSubmit,
  nombre,
  emailInicial,
}: LoginFormProps) {
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");
  const [curso, setCurso] = useState("");
  const [precio, setPrecio] = useState("");
  const [fecha, setFecha] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (emailInicial) {
      setEmail(emailInicial);
    }
  }, [emailInicial]);

  console.log("Email inicial:", emailInicial, nombre);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      titulo,
      descripcion: desc,
      curso,
      precio,
      fecha,
      email,
    });

    setTitulo("");
    setDesc("");
    setCurso("");
    setPrecio("");
    setFecha("");
    setEmail("");
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold px-4 font-title text-[#124d58]">Crea una oferta</h1>
            <FieldDescription>
              Completa los campos para la publicación de la oferta.
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="titulo">Título</FieldLabel>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              placeholder="Ayuda con una asignatura"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="desc">Descripción</FieldLabel>
            <Input
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              placeholder="Necesito ayuda con un trabajo..."
            />
          </Field>

          <div className="flex gap-2">
            <Field className="flex-1">
              <FieldLabel htmlFor="curso">Curso</FieldLabel>
              <Input
                id="curso"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                required
                placeholder="1ro SMX"
              />
            </Field>
            <Field className="flex-1">
              <FieldLabel htmlFor="precio">Salario/h</FieldLabel>
              <Input
                id="precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                placeholder="10"
              />
            </Field>
            <Field className="flex-1">
              <FieldLabel htmlFor="fecha">Fecha límite</FieldLabel>
              <Input
                id="fecha"
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Correo del ofertante</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              required
            />
          </Field>

          <Field>
            <Button className="submit bg-[#D46D85] hover:bg-[#D46D85] text-white cursor-pointer">Publicar oferta</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
