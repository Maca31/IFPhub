"use client"

import { Button } from "@/app/frontend/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/frontend/components/ui/dialog"
import Image from "next/image"
import { Calendar, Clock, Users, Tag } from "lucide-react"
import { toast } from "sonner"

interface Event {
    id_quedada: number; // ✅ NECESARIO para la inscripción
    title: string;
    description: string;
    image: string;
    participants: number;
    date: string;
    time: string;
    category: string;
    address?: string;
}

interface EventDetailsModalProps {
    event: Event | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isRegistered: boolean;
    onRegister: () => void; // se mantiene
    id_usuario: number;     // ✅ NECESARIO
}

export function EventDetailsModal({
    event,
    open,
    onOpenChange,
    isRegistered,
    onRegister,
    id_usuario
}: EventDetailsModalProps) {
    if (!event) return null;

    const handleRegister = async () => {
        try {
            const res = await fetch("/api/quedadas/inscribirse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_quedada: event.id_quedada,
                    id_usuario: id_usuario,
                }),
            });

            if (!res.ok) throw new Error("Error al inscribirse");

            onRegister(); // 🔁 mantiene comportamiento actual del padre

            toast.success("¡Inscripción confirmada!", {
                description: `Te has apuntado a "${event.title}". ¡Nos vemos allí!`,
            });

        } catch (error) {
            toast.error("No se pudo completar la inscripción");
            console.error(error);
        }
    };

    const googleMapsUrl = event.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
        : "#";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-scroll scrollbar-hide p-0">
                {/* Event Image */}
                <div className="relative w-full h-[250px] overflow-hidden">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 600px) 100vw, 600px"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-6 right-6">
                        <DialogTitle className="text-2xl font-bold text-white mb-2">
                            {event.title}
                        </DialogTitle>
                        <span className="inline-flex items-center gap-1 bg-[#D65A7E] text-white px-3 py-1 rounded-full text-sm">
                            <Tag className="w-3 h-3" />
                            {event.category}
                        </span>
                    </div>
                </div>

                {/* Event Details */}
                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                            Descripción
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#123d58]/10 rounded-lg">
                                <Calendar className="w-5 h-5 text-[#123d58]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Fecha</p>
                                <p className="text-gray-900 font-medium">{event.date}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#123d58]/10 rounded-lg">
                                <Clock className="w-5 h-5 text-[#123d58]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Hora</p>
                                <p className="text-gray-900 font-medium">{event.time}</p>
                            </div>
                        </div>
                    </div>

                    {/* Location Section */}
                    {event.address && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">
                                Ubicación
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <p className="text-gray-900 font-medium mb-3 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-[#D65A7E] rounded-full" />
                                    {event.address}
                                </p>
                                <div className="aspect-video w-full rounded-md overflow-hidden bg-gray-200 mb-3 relative">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(event.address)}&output=embed`}
                                    ></iframe>
                                    <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-md" />
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full text-[#123d58] border-[#123d58] hover:bg-[#123d58]/5"
                                    onClick={() => window.open(googleMapsUrl, "_blank")}
                                >
                                    Cómo llegar (Google Maps)
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-green-600 uppercase font-semibold">Participantes</p>
                            <p className="text-green-900 font-bold text-lg">
                                {event.participants} personas inscritas
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="px-6 pb-6">
                    {isRegistered ? (
                        <Button
                            disabled
                            className="w-full bg-gray-400 hover:bg-gray-400 text-white cursor-not-allowed"
                        >
                            ✓ Ya estás apuntado
                        </Button>
                    ) : (
                        <Button
                            onClick={handleRegister}
                            className="w-full bg-[#D65A7E] hover:bg-[#b54666] text-white font-semibold text-lg py-6"
                        >
                            Apuntarse al evento
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
