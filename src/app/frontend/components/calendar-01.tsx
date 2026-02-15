"use client"

import * as React from "react"
import { Calendar } from "@/app/frontend/components/ui/calendar"

export interface TimeSlot {
  label: string
  start: string
  end: string
}

interface Calendar01Props {
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export default function Calendar01({
  date,
  setDate,
}: Calendar01Props) {
  const handleSelect = (day: Date | undefined) => {
    if (!day) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const isWeekend = day.getDay() === 0 || day.getDay() === 6

    if (day < today || isWeekend) return

    setDate(day)
  }

  const calendarClass = "w-full"

  return (
    <div className="rounded-lg border border-[#dbe2e8] shadow-sm bg-white p-4 h-auto min-h-[21rem]">
      <Calendar
        mode="single"
        required={false}
        defaultMonth={date}
        selected={date}
        onSelect={handleSelect}
        className={calendarClass}
        disabled={(day) => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const isWeekend = day.getDay() === 0 || day.getDay() === 6
          return day < today || isWeekend
        }}
      />
    </div>
  )
}
