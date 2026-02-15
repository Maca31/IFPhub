"use client"

import * as React from "react"
import { Montserrat } from "next/font/google"
import { AppSidebar } from "@/app/frontend/compartir-proyectos/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/app/frontend/components/ui/breadcrumb"
import { Separator } from "@/app/frontend/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/app/frontend/components/ui/sidebar"
import Calendar01, { type TimeSlot } from "@/app/frontend/components/calendar-01"
import { useRouter, usePathname, useSearchParams } from "next/navigation" 

const montserrat = Montserrat({ subsets: ["latin"] })

type Cita = {
  id_cita: number
  dia_cita: string | null
  dia_creacion: string | null
  hora: string | null
  descripcion: string | null
  id_usuario: number | null
}

const TIME_SLOTS: TimeSlot[] = [
  { label: "08:00 - 09:00", start: "08:00", end: "09:00" },
  { label: "09:00 - 10:00", start: "09:00", end: "10:00" },
  { label: "10:00 - 11:00", start: "10:00", end: "11:00" },
  { label: "11:00 - 12:00", start: "11:00", end: "12:00" },
  { label: "12:00 - 13:00", start: "12:00", end: "13:00" },
  { label: "13:00 - 14:00", start: "13:00", end: "14:00" },
  { label: "14:00 - 15:00", start: "14:00", end: "15:00" },
]

const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const formatDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-")
  if (!year || !month || !day) return dateKey
  return `${day}/${month}/${year}`
}

const normalizeTime = (time: string | null) => (time ? time.slice(0, 5) : null)

const toDateTime = (dateKey: string, time: string | null) => {
  if (!dateKey || !time) return null
  const [year, month, day] = dateKey.split("-").map(Number)
  const [hours, minutes] = time.split(":").map(Number)
  if (!year || !month || !day || Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null
  }
  return new Date(year, month - 1, day, hours, minutes, 0, 0)
}

export default function Page() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [citas, setCitas] = React.useState<Cita[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
  const [appointmentTitle, setAppointmentTitle] = React.useState("")
  const [appointmentDesc, setAppointmentDesc] = React.useState("")
  const [appointmentError, setAppointmentError] = React.useState<string | null>(
    null
  )
  const [isSaving, setIsSaving] = React.useState(false)
  const [cancelingId, setCancelingId] = React.useState<number | null>(null)
  const [cancelError, setCancelError] = React.useState<string | null>(null)
  const [now, setNow] = React.useState(() => new Date())
  const searchParams = useSearchParams()
  const uid = searchParams.get("uid")
  const sig = searchParams.get("sig")
  const idUsuario = React.useMemo(() => {
    if (!uid) return null
    const parsed = Number(uid)
    return Number.isFinite(parsed) ? parsed : null
  }, [uid])
  const router = useRouter()
  const pathname = usePathname()

  const loadCitas = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/cita")
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error ?? "Error al cargar citas.")
        setIsLoading(false)
        return
      }
      const data = await response.json()
      setCitas(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError("Error al cargar citas.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    const storedUid = sessionStorage.getItem("uid")
    const storedSig = sessionStorage.getItem("sig")

    if (!storedUid || !storedSig) return

    const urlUid = searchParams.get("uid")
    const urlSig = searchParams.get("sig")

    // 🔁 Añadir o corregir params en la URL
    if (urlUid !== storedUid || urlSig !== storedSig) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("uid", storedUid)
      params.set("sig", storedSig)

      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [pathname, router, searchParams])

  React.useEffect(() => {
    loadCitas()
  }, [loadCitas])

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    setSelectedTime(null)
    setAppointmentTitle("")
    setAppointmentDesc("")
    setAppointmentError(null)
  }, [date])

  const selectedDate = date ?? new Date()
  const selectedDateKey = React.useMemo(
    () => toDateKey(selectedDate),
    [selectedDate]
  )

  const citasForDay = React.useMemo(() => {
    return citas
      .filter((cita) => cita.dia_cita === selectedDateKey)
      .sort((a, b) => {
        const timeA = normalizeTime(a.hora) ?? ""
        const timeB = normalizeTime(b.hora) ?? ""
        return timeA.localeCompare(timeB)
      })
  }, [citas, selectedDateKey])

  const citasForUser = React.useMemo(() => {
    if (!idUsuario) return []
    return citas
      .filter((cita) => cita.id_usuario === idUsuario)
      .sort((a, b) => {
        const dateKeyA = a.dia_cita ?? selectedDateKey
        const dateKeyB = b.dia_cita ?? selectedDateKey
        const dateTimeA = toDateTime(dateKeyA, normalizeTime(a.hora))
        const dateTimeB = toDateTime(dateKeyB, normalizeTime(b.hora))
        if (!dateTimeA || !dateTimeB) {
          return `${dateKeyA}${normalizeTime(a.hora) ?? ""}`.localeCompare(
            `${dateKeyB}${normalizeTime(b.hora) ?? ""}`
          )
        }
        return dateTimeA.getTime() - dateTimeB.getTime()
      })
  }, [citas, idUsuario, selectedDateKey])

  const occupiedSlots = React.useMemo(() => {
    return citasForDay
      .map((cita) => normalizeTime(cita.hora))
      .filter((time): time is string => Boolean(time))
  }, [citasForDay])
  const occupiedSet = React.useMemo(
    () => new Set(occupiedSlots),
    [occupiedSlots]
  )

  const isSlotInPast = React.useCallback(
    (day: Date, time: string) => {
      const [hours, minutes] = time.split(":").map(Number)
      const slotDate = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        hours,
        minutes,
        0,
        0
      )
      return slotDate.getTime() < now.getTime()
    },
    [now]
  )

  const handleCreateAppointment = React.useCallback(
    async (payload: { date: Date; time: string; description: string }) => {
      const hora = payload.time.length === 5 ? `${payload.time}:00` : payload.time
      const response = await fetch("/api/cita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dia_cita: toDateKey(payload.date),
          hora,
          descripcion: payload.description,
          id_usuario: idUsuario,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        return { ok: false, error: data?.error ?? "Error al guardar la cita." }
      }

      await loadCitas()
      return { ok: true }
    },
    [idUsuario, loadCitas]
  )

  const handleSelectHour = React.useCallback(
    (time: string, available: boolean) => {
      if (!available || isSlotInPast(selectedDate, time)) return
      setSelectedTime(time)
      setAppointmentError(null)
    },
    [isSlotInPast, selectedDate]
  )

  const handleSaveAppointment = React.useCallback(async () => {
    if (!selectedTime) return

    const trimmedTitle = appointmentTitle.trim()
    const trimmedDesc = appointmentDesc.trim()

    if (!trimmedTitle && !trimmedDesc) {
      setAppointmentError("Introduce un titulo o una descripcion.")
      return
    }

    const description =
      trimmedTitle && trimmedDesc
        ? `${trimmedTitle} - ${trimmedDesc}`
        : trimmedTitle || trimmedDesc

    setIsSaving(true)
    setAppointmentError(null)
    const result = await handleCreateAppointment({
      date: selectedDate,
      time: selectedTime,
      description,
    })
    setIsSaving(false)

    if (!result.ok) {
      setAppointmentError(result.error ?? "Error al guardar la cita.")
      return
    }

    setSelectedTime(null)
    setAppointmentTitle("")
    setAppointmentDesc("")
  }, [
    appointmentDesc,
    appointmentTitle,
    handleCreateAppointment,
    selectedDate,
    selectedTime,
  ])

  const handleCancelAppointment = React.useCallback(
    async (id_cita: number) => {
      setCancelError(null)
      setCancelingId(id_cita)
      try {
        const response = await fetch("/api/cita", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_cita }),
        })

        if (!response.ok) {
          const data = await response.json().catch(() => null)
          setCancelError(data?.error ?? "Error al cancelar la cita.")
          return
        }

        await loadCitas()
      } catch (err) {
        console.error(err)
        setCancelError("Error al cancelar la cita.")
      } finally {
        setCancelingId(null)
      }
    },
    [loadCitas]
  )

  return (
    <SidebarProvider>
      {uid && sig && <AppSidebar uid={uid} sig={sig} />}

      <SidebarInset>
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Panel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Citas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="h-[calc(100vh-5rem)] p-4 md:p-6 overflow-auto lg:overflow-hidden">
          {/* CONTENEDOR PRINCIPAL */}
          <div className="bg-white rounded-xl shadow-sm px-4 pb-4 pt-1 md:px-10 md:pb-10 md:pt-3 flex flex-col h-auto lg:h-full lg:overflow-hidden">
            {/* CONTENEDOR CON FONDO OSCURO */}
            <div className="rounded-xl p-4 md:p-6 lg:p-10 w-full flex flex-col h-full">
              {/* TITULO */}
              <div className="mb-6 md:mb-8 lg:mb-10 mt-2">
                <h1 className="px-4 md:px-6 lg:px-0 mb-4 text-left text-3xl md:text-4xl lg:text-5xl font-semibold font-['Libre_Baskerville'] text-[#123d58]">
                  Citas de Secretaría
                </h1>
                <div className="mt-3 mb-4 h-px w-[calc(100%+4rem)] bg-[#123d58]/25 -ml-8 md:w-[calc(100%+8rem)] md:-ml-16 lg:w-[calc(100%+10rem)] lg:-ml-20" />
              </div>

              {/* CONTENIDO RESPONSIVE - GRID */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr_1fr] gap-4 md:gap-6 lg:gap-4 items-start lg:items-stretch">
                {/* CALENDARIO */}
                <div className="order-2 lg:order-1 relative z-30 flex justify-center lg:justify-start">
                  <div className="w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[420px] h-auto min-h-[320px] sm:min-h-[380px] md:min-h-[500px] lg:min-h-[500px]">
                    <Calendar01 date={date} setDate={setDate} />
                  </div>
                </div>

                {/* HORAS DISPONIBLES */}
                <div className="order-3 lg:order-2 relative z-20 text-[#123d58]">
                  <div className="bg-white rounded-xl border border-input shadow-lg px-4 pb-4 pt-0 h-[250px] sm:h-[310px] md:h-[430px] lg:h-[430px] overflow-y-auto scrollbar-hide">
                    <div className="sticky top-0 z-10 -mx-4 mb-3 flex items-center justify-between border-b border-[#123d58]/40 bg-white px-4 py-3">
                      <h2 className="font-semibold text-base md:text-lg">
                        Horas para {formatDateKey(selectedDateKey)}
                      </h2>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {TIME_SLOTS.map((slot, index) => {
                        const isOccupied = occupiedSet.has(slot.start)
                        const isPast = isSlotInPast(selectedDate, slot.start)
                        const isAvailable = !isOccupied && !isPast
                            const statusLabel = isOccupied
                              ? " (Ocupado)"
                              : isPast
                                ? " (No disponible)"
                                : " (Disponible)"

                        return (
                          <li
                            key={index}
                            className={`p-2 rounded transition-colors ${
                              isAvailable
                                ? "bg-[#6fd1a8]/55 hover:bg-[#6fd1a8]/70 text-[#0f3f47] cursor-pointer border border-[#5fbf95]"
                                : isOccupied
                                  ? "bg-[#F7D0D7] text-[#7A2E43] cursor-not-allowed border border-black/20"
                                  : "bg-black/5 text-[#123d58]/40 cursor-not-allowed border border-black/5"
                            }`}
                            onClick={() =>
                              handleSelectHour(slot.start, isAvailable)
                            }
                          >
                            {slot.label}
                            {statusLabel}
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                </div>

                {/* REGISTRO DE CITAS */}
                <div className="order-1 lg:order-3 relative z-10 h-[250px] sm:h-[310px] md:h-[430px] lg:h-[430px]">
                  <div className="bg-white rounded-xl border border-input shadow-sm px-4 md:px-6 pb-4 md:pb-6 pt-0 h-full overflow-y-auto">
                    <h2
                      className={`${montserrat.className} sticky top-0 z-10 -mx-4 md:-mx-6 mb-4 md:mb-6 px-4 md:px-6 py-3 text-base md:text-lg font-semibold text-[#123d58] bg-white border-b border-[#123d58]/40`}
                    >
                      Registro de citas
                    </h2>

                    <div className="flex flex-col gap-3 md:gap-4">
                      {isLoading && (
                        <p className="text-[#123d58]/70 text-sm">
                          Cargando citas...
                        </p>
                      )}
                      {!isLoading && error && (
                        <p className="text-red-600 text-sm">{error}</p>
                      )}
                      {!isLoading && !error && citasForUser.length === 0 && (
                        <p className="text-[#123d58]/70 text-sm">
                          No tienes citas registradas.
                        </p>
                      )}
                      {!isLoading && !error && cancelError && (
                        <p className="text-red-600 text-sm">{cancelError}</p>
                      )}
                      {!isLoading &&
                        !error &&
                        citasForUser.map((cita) => {
                          const timeValue = normalizeTime(cita.hora)
                          const dateKey = cita.dia_cita ?? selectedDateKey
                          const formattedDate = formatDateKey(dateKey)
                          const dateTime = toDateTime(dateKey, timeValue)
                          const isPast =
                            dateTime && dateTime.getTime() < now.getTime()
                          const status = isPast ? "Realizada" : "Pendiente"

                          return (
                            <div
                              key={cita.id_cita}
                              className="p-3 md:p-4 bg-white rounded-lg border border-black/10 shadow-sm hover:bg-black/5 transition-colors duration-200"
                            >
                              <p className="font-semibold text-[#123d58] text-sm md:text-base">
                                {formattedDate}
                                {timeValue ? ` - ${timeValue}` : ""}
                              </p>
                              <p className="text-sm text-[#123d58]/70">
                                Estado:{" "}
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                                    isPast
                                      ? "bg-[#123d58]/10 text-[#123d58]"
                                      : "bg-[#F7D0D7] text-[#7A2E43]"
                                  }`}
                                >
                                  {status}
                                </span>
                              </p>
                              {!isPast && (
                                <button
                                  onClick={() =>
                                    handleCancelAppointment(cita.id_cita)
                                  }
                                  disabled={cancelingId === cita.id_cita}
                                  className="mt-3 w-full rounded-md border border-[#123d58]/30 bg-white px-3 py-2 text-xs font-semibold text-[#123d58] transition-colors hover:bg-[#123d58]/10 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                  {cancelingId === cita.id_cita
                                    ? "Cancelando..."
                                    : "Cancelar cita"}
                                </button>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ESPACIO ADICIONAL PARA DISPOSITIVOS MOVILES */}
              <div className="mt-6 lg:hidden"></div>
            </div>
          </div>
        </main>
        {selectedTime && (
          <>
            <div className="fixed inset-0 z-[90] bg-black/40" />
            <div className="fixed left-1/2 top-1/2 z-[100] w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl border border-black/20 shadow-lg p-4 text-[#123d58]">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-semibold text-lg text-[#123d58]">
                  Nueva cita - {formatDateKey(selectedDateKey)} {selectedTime}
                </h2>
                <button
                  onClick={() => setSelectedTime(null)}
                  className="text-2xl leading-none text-[#123d58]/70 hover:text-[#123d58]"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                placeholder="Título de la cita"
                className="w-full p-2 border border-black/20 rounded mb-2 bg-white text-[#123d58] placeholder:text-[#123d58]/50"
                value={appointmentTitle}
                onChange={(e) => setAppointmentTitle(e.target.value)}
              />
              <textarea
                placeholder="Descripción"
                className="w-full p-2 border border-black/20 rounded mb-2 bg-white text-[#123d58] placeholder:text-[#123d58]/50"
                value={appointmentDesc}
                onChange={(e) => setAppointmentDesc(e.target.value)}
              />
              {appointmentError && (
                <p className="text-sm text-red-600 mb-2">
                  {appointmentError}
                </p>
              )}
              <button
                className="w-full px-4 py-2 bg-[#123d58] text-white border border-[#123d58] rounded hover:bg-[#123d58]/90 mb-2 disabled:opacity-70"
                onClick={handleSaveAppointment}
                disabled={isSaving}
              >
                {isSaving ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
