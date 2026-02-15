"use client"

import { Card, CardContent, CardHeader } from "@/app/frontend/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/frontend/components/ui/avatar";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Testimonials() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);

    const testimonials = [
        {
            name: "Ana García",
            role: "DAM 2",
            quote: "Gracias a la quedada de Java conocí a gente de 4º que me ayudó muchísimo con las prácticas.",
            avatar: "CR",
            color: "#D65A7E"
        },
        {
            name: "Carlos Ruiz",
            role: "Marketing y Publicidad 1",
            quote: "Los partidos de los viernes son sagrados. Es la mejor forma de conocer gente de otros grados.",
            avatar: "CR",
            color: "#123d58"
        },
        {
            name: "Lucía Méndez",
            role: "DJ y Eventos 3",
            quote: "Organizé un taller de fotografía improvisado y se apuntaron 15 personas. ¡Repetiremos seguro!",
            avatar: "LM",
            color: "#D65A7E"
        },
        {
            name: "Miguel Torres",
            role: "DAW 2",
            quote: "El hackathon fue increíble. Aprendí más en una noche que en todo el semestre.",
            avatar: "MT",
            color: "#123d58"
        },
        {
            name: "Sara Jiménez",
            role: "ASIS 1",
            quote: "Las quedadas de estudio me salvaron los exámenes. Ahora tenemos grupo fijo.",
            avatar: "SJ",
            color: "#D65A7E"
        },
        {
            name: "David López",
            role: "Marketing y Publicidad 2",
            quote: "Conocí a mi mejor amigo en una quedada de fútbol. Ahora organizamos eventos juntos.",
            avatar: "DL",
            color: "#123d58"
        }
    ];

    useGSAP(() => {
        // Animación de entrada para las cards
        gsap.from(cardsRef.current, {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });

        // Animación continua de flotación
        cardsRef.current.forEach((card, index) => {
            gsap.to(card, {
                y: -2.5,
                duration: 2 + (index * 0.2),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: index * 0.3
            });
        });

        // Efecto de hover con GSAP
        cardsRef.current.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-4 text-[#123d58] font-serif">
                    Experiencias de compañeros
                </h2>
                <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                    Descubre cómo las quedadas han transformado la experiencia universitaria de nuestros estudiantes
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                if (el) cardsRef.current[index] = el;
                            }}
                            className="testimonial-card"
                        >
                            <Card className="border-none shadow-lg h-full relative overflow-hidden group">
                                {/* Accent bar */}
                                <div
                                    className="absolute top-0 left-0 w-1 h-full transition-all duration-300 group-hover:w-2"
                                    style={{ backgroundColor: testimonial.color }}
                                />

                                <CardHeader className="flex flex-row items-center gap-4 pb-3 pl-6">
                                    <Avatar className="h-14 w-14 border-2 border-gray-100 shadow-sm">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.name}`} />
                                        <AvatarFallback className="font-bold" style={{ backgroundColor: `${testimonial.color}20`, color: testimonial.color }}>
                                            {testimonial.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-[#1a1a1a] font-serif text-lg">{testimonial.name}</h3>
                                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: testimonial.color }}>
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="pl-6 pr-4">
                                    <div className="relative">
                                        <span className="absolute -left-2 -top-2 text-4xl opacity-10 font-serif" style={{ color: testimonial.color }}>"</span>
                                        <p className="text-gray-700 italic font-sans leading-relaxed relative z-10">
                                            {testimonial.quote}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
