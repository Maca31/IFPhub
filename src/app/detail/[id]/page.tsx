import Sidebar from "@/app/frontend/components/sidebar-noticias";
import { createClient } from "@/app/backend/utils/supabase/client";
import { Baskervville } from "next/font/google";
import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/app/frontend/components/ui/breadcrumb";

import { Separator } from "@/app/frontend/components/ui/separator";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";

const baskervville = Baskervville({
  weight: "700",
  subsets: ["latin"],
});

export default async function DetailPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<any>;
}) {
  const { id } = await props.params;
  const search = await props.searchParams;

  const uid = search?.uid;
  const sig = search?.sig;

  const supabase = createClient();

  const { data, error } = await supabase.rpc("fn_get_noticia_por_id", {
    p_id: Number(id),
  });

  if (error) {
    console.error(error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error cargando noticia</h2>
          <p className="text-muted">Por favor, intenta de nuevo más tarde</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-muted">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            No se ha encontrado la noticia
          </h2>
          <a
            href={`/noticias?uid=${uid}&sig=${sig}`}
            className="inline-flex items-center gap-2 mt-4 text-accent hover:text-accent/80 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a noticias
          </a>
        </div>
      </div>
    );
  }

  const noticia = data[0];

  const imagen =
    noticia.imagen && noticia.imagen.trim() !== ""
      ? noticia.imagen
      : "/imagenes/default_image.webp";

  const descripcion = noticia.descripcion ?? "";
  const descriptionParts = descripcion.split(/\n\s*\n/);

  let firstParagraph = descriptionParts[0] ?? "";
  let secondParagraph = "";
  let thirdParagraph = "";

  if (descriptionParts.length >= 3) {
    secondParagraph = descriptionParts[1] ?? "";
    thirdParagraph = descriptionParts.slice(2).join("\n\n");
  } else if (descriptionParts.length === 2) {
    secondParagraph = descriptionParts[1] ?? "";
  } else {
    const sentences = descripcion.split(". ").filter(Boolean);
    if (sentences.length >= 3) {
      firstParagraph = `${sentences[0]}.`;
      secondParagraph = `${sentences[1]}.`;
      thirdParagraph = sentences.slice(2).join(". ");
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <SidebarProvider>
      {uid && sig && <AppSidebar uid={uid} sig={sig} />}
      
      <SidebarInset>
        {/* HEADER MEJORADO */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#eef3f6] bg-white/80 backdrop-blur-sm sticky top-0 z-10 transition-all">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1 hover:bg-gray-100 transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-6" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href={`/noticias?uid=${uid}&sig=${sig}`}
                    className="hover:text-accent transition-colors"
                  >
                    Noticias
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold max-w-[200px] sm:max-w-[400px] truncate">
                    {noticia.titulo}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Acciones del header */}
            <div className="ml-auto flex items-center gap-2">
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="bg-gradient-to-b from-[#fafbfc] to-white min-h-screen px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* ARTÍCULO PRINCIPAL */}
            <article className="bg-card rounded-[14px] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              {/* Imagen destacada con overlay */}
              <div className="relative h-[400px] md:h-[500px] overflow-hidden group">
                <img
                  src={imagen}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Badge de categoría flotante */}
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-4 py-2 rounded-lg shadow-lg text-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                      <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                    </svg>
                    Noticia
                  </span>
                </div>
              </div>

              {/* Contenido del artículo */}
              <div className="p-8 md:p-10">
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-[#eef3f6]">
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={noticia.fecha_hora}>
                      {formatDate(noticia.fecha_hora)}
                    </time>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Lectura de 3 min</span>
                  </div>
                </div>

                {/* Título principal */}
                <h1
                  className={`${baskervville.className} mb-8 text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 hover:text-accent transition-colors`}
                >
                  {noticia.titulo}
                </h1>

                {/* Contenido del artículo */}
                <div className="prose prose-lg max-w-none">
                  {/* Primera letra destacada (Drop cap) */}
                  <p className="text-gray-700 leading-relaxed text-lg first-letter:text-6xl first-letter:font-bold first-letter:text-accent first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:mt-1">
                    {firstParagraph}
                  </p>

                  {secondParagraph && (
                    <p className="mt-6 text-gray-700 leading-relaxed text-lg">
                      {secondParagraph}
                    </p>
                  )}

                  {thirdParagraph && (
                    <div className="mt-6 text-gray-700 leading-relaxed text-lg">
                      {thirdParagraph.split("\n\n").map((para, idx) => (
                        <p key={idx} className={idx > 0 ? "mt-6" : ""}>
                          {para}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cita destacada (si quieres añadir) */}
                <div className="my-10 pl-6 border-l-4 border-accent bg-accent/5 p-6 rounded-r-lg">
                  <blockquote className="text-xl font-medium italic text-gray-800">
                    "Mantente informado con las últimas noticias del campus"
                  </blockquote>
                </div>

                {/* Tags */}
                <div className="mt-10 pt-8 border-t border-[#eef3f6]">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-muted">Etiquetas:</span>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer">
                        Campus
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer">
                        Eventos
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-pointer">
                        Actualidad
                      </span>
                    </div>
                  </div>
                </div>
                

                {/* Footer del artículo */}
                <footer className="mt-12 pt-8 text-center text-sm text-muted border-t border-[#eef3f6]">
                  <p className="flex items-center justify-center gap-2">
                    <span>© 2025 Portal Noticias — FProject</span>
                    <span className="text-accent">•</span>
                    <span className="hover:text-accent transition-colors cursor-pointer">
                      Contacto
                    </span>
                  </p>
                </footer>
              </div>
            </article>

            {/* SIDEBAR */}
            <aside className="lg:sticky lg:top-20 lg:self-start">
              <Sidebar uid={uid} sig={sig} />
            </aside>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}