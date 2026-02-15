import { Search, MousePointerClick, PartyPopper } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            icon: <Search className="w-12 h-12 text-[#D65A7E]" />,
            title: "1. Descubre qué se mueve",
            description: "Echa un vistazo a lo que están organizando tus compañeros de otras carreras."
        },
        {
            icon: <MousePointerClick className="w-12 h-12 text-[#D65A7E]" />,
            title: "2. Apúntate y participa",
            description: "Olvídate de grupos de WhatsApp interminables. Un click y cuentas con plaza."
        },
        {
            icon: <PartyPopper className="w-12 h-12 text-[#D65A7E]" />,
            title: "3. Haz vida de campus",
            description: "Amplía tu círculo, comparte aficiones y desconecta de los exámenes."
        }
    ];

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 text-[#123d58] font-serif">
                    Dinámica de las quedadas
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg hover:-translate-y-5 hover:shadow-xl/20 transition-all duration-300 ease-in">
                            <div className="mb-6 p-4 bg-[#F7D0D7]/20 rounded-full">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-[#1a1a1a] font-serif">{step.title}</h3>
                            <p className="text-gray-600 font-sans leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
