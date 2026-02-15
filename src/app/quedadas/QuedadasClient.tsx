"use client";

import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar";
import { Hero_quedadas } from "@/app/frontend/components/hero-quedadas";
import { EventCard } from "@/app/frontend/components/event-card";
import { CategoriesCarousel } from "@/app/frontend/components/categories-carousel";
import { HowItWorks } from "@/app/frontend/components/how-it-works";
import { Testimonials } from "@/app/frontend/components/testimonials";
import { EventDetailsModal } from "@/app/frontend/components/event-details-modal";
import { Footer } from "@/app/frontend/components/footer";
import { StatsSection } from "@/app/frontend/components/stats-section";
import { NewsletterSection } from "@/app/frontend/components/newsletter-section";
import { Button } from "@/app/frontend/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type Event = {
  id_quedada: number;
  title: string;
  description: string;
  image: string;
  participants: number;
  date: string;
  time: string;
  category: string;
  address: string;
  visualizaciones: number;
};

export default function Page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [uid, setUid] = useState<string | null>(null);
  const [sig, setSig] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUid(params.get("uid"));
    setSig(params.get("sig"));
  }, []);

  useEffect(() => {
    const storedUid = sessionStorage.getItem("uid");
    const storedSig = sessionStorage.getItem("sig");

    if (!storedUid || !storedSig) return;

    setUid(storedUid);
    setSig(storedSig);

    const urlUid = searchParams.get("uid");
    const urlSig = searchParams.get("sig");

    // 🔁 Si no están en la URL, los añadimos
    if (!urlUid || !urlSig) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("uid", storedUid);
      params.set("sig", storedSig);

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, []);

  useEffect(() => {
    const fetchQuedadas = async () => {
      try {
        const res = await fetch("/api/quedadas");
        if (!res.ok) throw new Error("Error al cargar quedadas");

        const data = await res.json();
        console.log(data);

        const formatted: Event[] = data.map((q: any) => ({
          id_quedada: q.id_quedada,
          title: q.titulo,
          description: q.descripcion,
          image: q.imagen_url,
          participants: q.participants ?? 0,
          visualizaciones: q.visualizaciones ?? 0,
          date: new Date(q.fecha).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: q.hora.slice(0, 5),
          category: q.categoria,
          address: q.direccion,
        }));

        setEvents(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuedadas();
  }, []);

  const addEvent = (newEvent: Omit<Event, "id_quedada">) => {
    setEvents((prev) => [
      {
        ...newEvent,
        id_quedada: Date.now(),
      },
      ...prev,
    ]);
  };

  if (!uid || !sig) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Cargando quedadas...</p>
      </div>
    );
  }

  const handleEventClick = async (event: any, index: number) => {
    try {
      fetch("/api/quedadas/visualizacion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_quedada: event.id_quedada }),
      });
    } catch (err) {
      console.error(err);
    }

    setSelectedEvent({ ...event, index });
    setModalOpen(true);
  };

  const handleRegister = () => {
    if (!selectedEvent) return;

    const index = selectedEvent.index;
    if (!registeredEvents.includes(index)) {
      setRegisteredEvents((prev) => [...prev, index]);
      setEvents((prev) =>
        prev.map((e, i) =>
          i === index ? { ...e, participants: e.participants + 1 } : e
        )
      );

      // 🔥 actualizar también el evento del modal
      setSelectedEvent((prev: any) =>
        prev ? { ...prev, participants: prev.participants + 1 } : prev
      );
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory = selectedCategory
      ? event.category === selectedCategory
      : true;

    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const now = new Date();
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const eventsToShow =
    !selectedCategory && !searchQuery
      ? filteredEvents
          .filter((event) => {
            const eventDate = new Date(`${event.date} ${event.time}`);
            return eventDate >= now && eventDate <= oneMonthFromNow;
          })
          .sort((a, b) => {
            if (b.participants !== a.participants) {
              return b.participants - a.participants; // 1️⃣ prioridad
            }
            return b.visualizaciones - a.visualizaciones; // 2️⃣ desempate
          })
          .slice(0, 6)
      : filteredEvents;

  const idUsuario = Number(uid);

  return (
    <SidebarProvider>
      {uid && sig && <AppSidebar uid={uid} sig={sig} />}
      <SidebarInset>
        <div className="absolute top-4 left-4 z-50">
          <SidebarTrigger className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20" />
        </div>
        <div className="flex flex-1 flex-col gap-4 pt-0 min-h-screen">
          {!selectedCategory && !searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Hero_quedadas onCreateEvent={addEvent} />
            </motion.div>
          )}

          <div className="-mt-4">
            <CategoriesCarousel
              onSelectCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          </div>

          {(selectedCategory || searchQuery) && (
            <div className="p-4">
              <Button
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery("");
                }}
                variant="ghost"
                className="flex items-center gap-2 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a inicio
              </Button>
            </div>
          )}

          <div className="p-5 mt-6 container mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-10 text-left font-['Libre_Baskerville']"
            >
              <span
                className="text-[#D65A7E] mr-2 [text-shadow:0_0_0_#2b2b2b]"
              >
                ★
              </span>
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : selectedCategory
                ? `Quedadas de ${selectedCategory}`
                : "Top planes para este mes"}
            </motion.h1>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {eventsToShow.map((event, index) => {
                  const originalIndex = events.findIndex((e) => e === event);
                  return (
                    <EventCard
                      key={event.id_quedada}
                      {...event}
                      onClick={() =>
                        handleEventClick(event, originalIndex)
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">
                  No se encontraron eventos.
                </p>
              </div>
            )}
          </div>

          {!selectedCategory && !searchQuery && (
            <>
              <StatsSection />
              <HowItWorks />
              <Testimonials />
              <NewsletterSection />
            </>
          )}
        </div>

        <EventDetailsModal
          event={selectedEvent}
          open={modalOpen}
          onOpenChange={setModalOpen}
          isRegistered={
            selectedEvent
              ? registeredEvents.includes(selectedEvent.index)
              : false
          }
          onRegister={handleRegister}
          id_usuario={idUsuario} 
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
