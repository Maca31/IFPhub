"use client"

import { Button } from "@/app/frontend/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/app/frontend/components/ui/dialog"
import { Input } from "@/app/frontend/components/ui/input"
import { Label } from "@/app/frontend/components/ui/label"
import { Textarea } from "@/app/frontend/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/frontend/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"

interface Event {
    title: string;
    description: string;
    image: string;
    participants: number;
    date: string;
    time: string;
    category: string;
    address: string;
}

interface CreateEventModalProps {
    children: React.ReactNode;
    onCreateEvent: (event: Event) => void;
}

export function CreateEventModal({ children, onCreateEvent }: CreateEventModalProps) {
    const [open, setOpen] = useState(false)
    const [category, setCategory] = useState("")

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        const newEvent: Event = {
            title: formData.get("title") as string,
            description: formData.get("description") as string || "Sin descripción",
            date: formData.get("date") as string,
            time: formData.get("time") as string,
            category: category,
            participants: 0,
            image: (formData.get("image") as string) || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
            address: (formData.get("address") as string) || "Ubicación por determinar"
        }

        onCreateEvent(newEvent)
        setOpen(false)
        toast.success("¡Quedada creada con éxito!", {
            description: `Tu evento "${newEvent.title}" ha sido publicado en ${newEvent.category}.`,
        })

        // Reset form
        e.currentTarget.reset()
        setCategory("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear Quedada</DialogTitle>
                    <DialogDescription>
                        Organiza un nuevo evento para la comunidad.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Título
                        </Label>
                        <Input id="title" name="title" placeholder="Ej: Partido de Fútbol" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Categoría
                        </Label>
                        <Select value={category} onValueChange={setCategory} required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Deportes">Deportes</SelectItem>
                                <SelectItem value="Educacion">Educacion</SelectItem>
                                <SelectItem value="Ocio">Ocio</SelectItem>
                                <SelectItem value="Idiomas">Idiomas</SelectItem>
                                <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                                <SelectItem value="Arte">Arte</SelectItem>
                                <SelectItem value="Música">Música</SelectItem>
                                <SelectItem value="Cocina">Cocina</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                            Dirección
                        </Label>
                        <Input
                            id="address"
                            name="address"
                            placeholder="Ej: Parque del Retiro, Madrid"
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">
                            Imagen
                        </Label>
                        <Input
                            id="image"
                            name="image"
                            type="url"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Fecha
                        </Label>
                        <Input id="date" name="date" type="date" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                            Hora
                        </Label>
                        <Input id="time" name="time" type="time" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Descripción
                        </Label>
                        <Textarea id="description" name="description" placeholder="Detalles del evento..." className="col-span-3" />
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-[#D65A7E] hover:bg-[#b54666] text-white" disabled={!category}>
                            Crear evento
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
