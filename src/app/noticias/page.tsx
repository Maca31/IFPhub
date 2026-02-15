// ifphub\src\app\noticias\page.tsx

import Hero from '@/app/frontend/components/hero'
import Sidebar from '@/app/frontend/components/sidebar-noticias'
import Link from "next/link"

import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/frontend/components/ui/breadcrumb";

import { Separator } from "@/app/frontend/components/ui/separator";
import AuthGuard from "@/app/frontend/components/AuthGuard";

async function getNoticias() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/noticias`, {
    cache: "no-store",
  });

  return await res.json();
}

export default async function Page(props: { searchParams: Promise<any> }) {
  const search = await props.searchParams;

  const uid = search?.uid;
  const sig = search?.sig;

  const noticias = await getNoticias();
  const noticiasArray = Array.isArray(noticias) ? noticias : noticias?.data ?? [];

  const shuffle = <T,>(arr: T[]) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  
  const randomNoticias = shuffle(noticiasArray).slice(0, 8);

  const getPicsum = (seed: string | number, w: number, h: number) =>
    `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${w}/${h}`;

  return (
    <SidebarProvider>
      <AuthGuard>
        {uid && sig && <AppSidebar uid={uid} sig={sig} />}

        <SidebarInset>
          {/* HEADER CON ANIMACIÓN */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#eef3f6] bg-white/80 backdrop-blur-sm sticky top-0 z-10 transition-all">
            <div className="flex items-center gap-2 px-4 w-full">
              <SidebarTrigger className="-ml-1 hover:bg-gray-100 transition-colors" />

              <Separator orientation="vertical" className="mr-2 h-6" />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold">Noticias</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Indicador de scroll */}
              <div className="ml-auto text-xs text-muted hidden sm:block">
                {noticiasArray.length} artículos disponibles
              </div>
            </div>
          </header>

          {/* CONTENIDO */}
          <main className="px-4 py-6 bg-gradient-to-b from-[#fafbfc] to-white min-h-screen">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <section className="space-y-8">
                {/* Hero con sombra mejorada */}
                <div className="bg-card rounded-[14px] p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <Hero />
                </div>

                {/* POPULAR con mejoras visuales */}
                <section className="bg-card rounded-[14px] p-8 shadow-sm">
                  <div className="border-l-4 border-accent pl-3 mb-6">
                    <h3 className="text-accent uppercase tracking-widest text-sm font-libre flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Popular
                    </h3>
                  </div>

                  <div className="grid gap-4">
                    {randomNoticias.slice(0, 3).map((n: any, idx: number) => (
                      <Link key={n.id_noticia} href={`/detail/${n.id_noticia}?uid=${uid}&sig=${sig}`}>
                        <article 
                          className="group flex gap-4 items-center p-4 rounded-lg bg-white border border-[#eef3f6] hover:border-accent/30 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <div className="relative overflow-hidden rounded-md flex-shrink-0">
                            <img
                              src={getPicsum(n.id_noticia, 110, 72)}
                              alt={n.titulo}
                              className="w-[110px] h-[72px] object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[15px] font-semibold group-hover:text-accent transition-colors line-clamp-2">{n.titulo}</h4>
                            <p className="text-sm text-muted mt-1 line-clamp-2">{n.descripcion.slice(0, 70)}...</p>
                          </div>
                          <svg className="w-5 h-5 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* EXTRA CARDS con grid responsive mejorado */}
                <section>
                  <div className="border-l-4 border-accent pl-3 mb-6">
                    <h3 className="text-accent uppercase tracking-widest text-sm font-libre">
                      Más noticias
                    </h3>
                  </div>
                  
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {randomNoticias.slice(0, 4).map((n: any, idx: number) => (
                      <Link key={n.id_noticia} href={`/detail/${n.id_noticia}?uid=${uid}&sig=${sig}`}>
                        <div 
                          className="group bg-white rounded-xl p-0 border border-[#eef3f6] hover:border-accent/30 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-2"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <div className="relative overflow-hidden h-[160px]">
                            <img
                              src={getPicsum(n.id_noticia, 640, 360)}
                              alt={n.titulo}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              loading="lazy"
                              decoding="async"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-base group-hover:text-accent transition-colors line-clamp-2 mb-2">{n.titulo}</h4>
                            <p className="text-sm text-muted line-clamp-2">{n.descripcion.slice(0, 100)}...</p>
                            <div className="mt-3 flex items-center text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="font-medium">Leer más</span>
                              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                <footer className="mt-8 text-center text-sm text-muted border-t pt-6 pb-4">
                  <p className="flex items-center justify-center gap-2">
                    <span>© 2025 Portal Noticias — FProject</span>
                    <span className="text-accent">•</span>
                    <span className="hover:text-accent transition-colors cursor-pointer">Términos</span>
                    <span className="text-accent">•</span>
                    <span className="hover:text-accent transition-colors cursor-pointer">Privacidad</span>
                  </p>
                </footer>
              </section>

              <aside className="lg:sticky lg:top-20 lg:self-start">
                <Sidebar uid={uid} sig={sig} />
              </aside>
            </div>
          </main>
        </SidebarInset>
      </AuthGuard>
    </SidebarProvider>
  );
}