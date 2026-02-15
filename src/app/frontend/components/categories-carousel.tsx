import * as React from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/app/frontend/components/ui/carousel"
import { cn } from "@/lib/utils"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"

interface CategoriesCarouselProps {
    onSelectCategory: (category: string) => void;
    selectedCategory: string | null;
}

export function CategoriesCarousel({ onSelectCategory, selectedCategory }: CategoriesCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const categories = [
        "Deportes",
        "Educación",
        "Ocio",
        "Idiomas",
        "Tecnología",
        "Arte",
        "Música",
        "Cocina"
    ]

    useGSAP(() => {
        gsap.from(".category-item", {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        })
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full bg-transparent py-8 border-y border-[#123d58]">
            <div className="max-w-5xl mx-auto px-12 relative">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {categories.map((category, index) => (
                            <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/5 category-item">
                                <div className="flex items-center justify-center h-full">
                                    <button
                                        onClick={() => onSelectCategory(category)}
                                        className={cn(
                                            "text-xl font-bold transition-all duration-300 px-4 py-2 rounded-full",
                                            selectedCategory === category
                                                ? "bg-white text-[#123d58] scale-110 shadow-lg"
                                                : "text-[#123d58] hover:text-[#123d58] hover:bg-[#123d58]/10"
                                        )}
                                    >
                                        {category}
                                    </button>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-[#123d58]/10 border border-[#123d58]/30 hover:bg-[#123d58]/20 text-[#123d58] hover:text-[#123d58] -left-10" />
                    <CarouselNext className="bg-[#123d58]/10 border border-[#123d58]/30 hover:bg-[#123d58]/20 text-[#123d58] hover:text-[#123d58] -right-10" />
                </Carousel>
            </div>
        </div>
    )
}
