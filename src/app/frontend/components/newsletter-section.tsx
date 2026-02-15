"use client"

import { Button } from "@/app/frontend/components/ui/button"
import { Input } from "@/app/frontend/components/ui/input"
import { Send } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function NewsletterSection() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.error("Por favor, ingresa tu correo electrónico", {
                description: "El campo de email no puede estar vacío"
            })
            return
        }

        if (!validateEmail(email)) {
            toast.error("Correo electrónico inválido", {
                description: "Por favor, ingresa un correo válido (ejemplo@dominio.com)"
            })
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch("/api/newsletter/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            if (!res.ok) throw new Error()

            toast.success("¡Suscripción exitosa! 🎉", {
                description: `Te hemos enviado un correo de confirmación a ${email}`
            })

            setEmail("")
        } catch {
            toast.error("Error al suscribirse", {
                description: "Inténtalo más tarde"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="py-20 bg-[#123d58] text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#D65A7E] blur-3xl" />
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    No te pierdas ninguna quedada
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                    Recibe las mejores actividades y eventos directamente en tu correo.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12 focus-visible:ring-white/30"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="bg-[#D65A7E] hover:bg-[#b54666] text-white font-bold h-12 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Enviando..." : "Suscribirse"} <Send className="ml-2 w-4 h-4" />
                    </Button>
                </form>

                <p className="text-xs text-gray-400 mt-4">
                    Respetamos tu privacidad. Date de baja cuando quieras.
                </p>
            </div>
        </section>
    )
}
