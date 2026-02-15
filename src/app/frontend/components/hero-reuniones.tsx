"use client";

import Image from "next/image";
import { Button } from "@/app/frontend/components/ui/button";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface HeroReunionesProps {
  onCreate?: () => void;
}

export function Hero_reuniones({ onCreate }: HeroReunionesProps) {
  return (
    <div className="relative w-full h-[420px] overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=2070&auto=format&fit=crop"
          alt="Reuniones"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-normal text-white leading-tight drop-shadow-lg font-['Libre_Baskerville']"
        >
          Aprende y colabora en comunidad
        </motion.h1>

        {onCreate && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              size="lg"
              onClick={onCreate}
              className="flex items-center gap-2 border border-[#D65A7E]/70 bg-[#D65A7E]/30 text-white text-lg px-8 py-6 rounded-md backdrop-blur-sm transition-all hover:bg-[#D65A7E]/40 hover:scale-[1.02]"
            >
              Subir video
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
