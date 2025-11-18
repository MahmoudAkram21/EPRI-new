"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Event } from "@/lib/data"

interface EventsCarouselProps {
  events: Event[]
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(events.length / itemsPerPage)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }, [totalPages])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }, [totalPages])

  const currentEvents = events.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
  )

  // Format date for badge (e.g., "16 NOV")
  const formatDateBadge = (date: string | Date) => {
    const d = new Date(date)
    const day = d.getDate()
    const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    return `${day} ${month}`
  }

  // Format date range (e.g., "Nov 16 – Nov 17")
  const formatDateRange = (date: string | Date) => {
    const start = new Date(date)
    const startMonth = start.toLocaleDateString("en-US", { month: "short" })
    const startDay = start.getDate()
    
    // Check if event has an end date in description or if it's a multi-day event
    // For now, we'll just show the start date
    // You can extend this if events have an endDate property
    return `${startMonth} ${startDay}`
  }

  return (
    <div className="relative">
      {/* Pagination and Navigation Controls */}
      <div className="flex items-start gap-4 mb-6">
        {/* Pagination Badge */}
        <div className="flex flex-col gap-3">
          <Badge className="w-12 h-12 rounded-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center text-sm font-semibold">
            {currentIndex + 1}/{totalPages}
          </Badge>
          
          {/* Navigation Arrows */}
          <div className="flex flex-col gap-2">
            <button
              onClick={goToPrev}
              className="w-10 h-10 rounded-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center transition-all hover:scale-110"
              aria-label="Previous events"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center transition-all hover:scale-110"
              aria-label="Next events"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Events Cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-800 h-full">
                {/* Image with Date Badge Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Date Badge - Bottom Left */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-16 h-16 rounded-full bg-accent hover:bg-accent/90 text-white flex flex-col items-center justify-center text-xs font-bold shadow-lg">
                      <span className="text-[10px] leading-tight text-center">
                        {formatDateBadge(event.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>{formatDateRange(event.date)}</span>
                    </div>

                    {/* Time */}
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                    )}

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

