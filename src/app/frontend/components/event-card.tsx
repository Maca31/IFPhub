"use client"

import { Card } from "@/app/frontend/components/ui/card";
import Image from "next/image";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/app/frontend/components/ui/badge";

interface EventCardProps {
    title: string;
    description: string;
    image: string;
    participants: number;
    date: string;
    time: string;
    category: string;
    onClick?: () => void;
}

export function EventCard({ title, description, image, participants, date, time, category, onClick }: EventCardProps) {
    console.log(title, participants)
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className="w-full max-w-[400px]"
        >
            <Card
                onClick={onClick}
                className="border border-[#123d58] bg-[#123d58] overflow-hidden shadow-xl group cursor-pointer h-full flex flex-col relative p-0"
            >
                {/* Image */}
                <div className="w-full h-[220px] overflow-hidden relative">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#123d58] to-transparent opacity-60" />
                    <Badge className="absolute top-4 right-4 bg-[#D65A7E] hover:bg-[#b54666] text-white border-none shadow-lg">
                        {category}
                    </Badge>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-[#D65A7E] transition-colors">
                        {title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">
                        {description}
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#D65A7E]" />
                                <span>{date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#D65A7E]" />
                                <span>{time}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-[#1a6b7a]">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Users className="w-4 h-4 text-[#D65A7E]" />
                                <span>{participants} asistentes</span>
                            </div>
                            <div className="flex items-center gap-1 text-[#D65A7E] text-sm font-medium group-hover:translate-x-1 transition-transform">
                                Ver detalles <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
