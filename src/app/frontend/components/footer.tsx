import { Facebook, Instagram, Twitter, Linkedin, Heart } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white text-[#123d58] py-8 mt-auto border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center gap-6">

                {/* Navigation Links */}
                <nav className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm font-bold tracking-wide">
                    <a href="#" className="hover:text-[#D65A7E] transition-colors">Name / News</a>
                    <a href="#" className="hover:text-[#D65A7E] transition-colors">Proyectos</a>
                    <a href="#" className="hover:text-[#D65A7E] transition-colors">Secretaria</a>
                    <a href="#" className="hover:text-[#D65A7E] transition-colors">Reuniones</a>
                    <a href="#" className="hover:text-[#D65A7E] transition-colors">Quedadas</a>
                    <a href="#" className="hover:text-[#D65A7E] transition-colors">Incidencias</a>
                </nav>

                {/* Copyright */}
                <div className="text-xs text-gray-400 font-medium">
                    &copy; 2025  -- Portal Campus
                </div>
            </div>
        </footer>
    );
}
