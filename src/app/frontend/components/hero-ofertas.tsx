"use client";

import Image from "next/image";
import { Button } from "@/app/frontend/components/ui/button";
import { CreateEventModal } from "@/app/frontend/components/create-event-modal";
import { motion } from "framer-motion";

interface Event {
    title: string;
    description: string;
    image: string;
    participants: number;
    date: string;
    time: string;
    category: string;
}

interface HeroProps {
    onCreateEvent: (event: any) => void;
}

export function Hero_ofertas({ onCreateEvent }: HeroProps) {
    return (
        <div className="relative w-full h-[500px] overflow-hidden flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                    alt="Hero Background"
                    fill
                    sizes="100vw"
                    className="object-cover brightness-50"
                    priority
                />
                {/* Neon lines overlay - simplified for now with CSS gradients or we could use SVG */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-8">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg"
                >
                    Conecta con tus compañeros <br />
                    más allá de las clases.
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <CreateEventModal onCreateEvent={onCreateEvent}>
                        <Button
                            size="lg"
                            className="bg-[#D65A7E] hover:bg-[#b54666] text-white font-bold text-lg px-8 py-6 rounded-md shadow-[0_0_15px_rgba(214,90,126,0.5)] transition-all hover:scale-105"
                        >
                            Crear quedada
                        </Button>
                    </CreateEventModal>
                </motion.div>
            </div>
        </div>
    );
}
