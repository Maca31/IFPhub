"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function StatsSection() {
    const containerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const stats = gsap.utils.toArray<HTMLElement>(".stat-number")

        stats.forEach((stat) => {
            const targetValue = parseInt(stat.getAttribute("data-value") || "0")

            gsap.fromTo(stat,
                { innerText: 0 },
                {
                    innerText: targetValue,
                    duration: 2,
                    ease: "power2.out",
                    snap: { innerText: 1 },
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            )
        })
    }, { scope: containerRef })

    const stats = [
        { label: "Estudiantes Activos", value: 1250, suffix: "+" },
        { label: "Quedadas Realizadas", value: 450, suffix: "+" },
        { label: "Comunidades", value: 25, suffix: "" },
        { label: "Horas Compartidas", value: 5000, suffix: "+" },
    ]

    return (
        <section ref={containerRef} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center p-4">
                            <div className="text-4xl md:text-5xl font-bold text-[#123d58] mb-2 flex items-baseline">
                                <span className="stat-number" data-value={stat.value}>0</span>
                                <span>{stat.suffix}</span>
                            </div>
                            <p className="text-gray-600 font-medium uppercase tracking-wider text-sm">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
