"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import type { Event } from "@/lib/data"

interface EventsCarouselHomeProps {
  events: Event[]
}

export function EventsCarouselHome({ events }: EventsCarouselHomeProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })] as any,
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  // Format date for badge (e.g., "16 NOV")
  const formatDateBadge = (date: string | Date) => {
    const d = new Date(date)
    const day = d.getDate()
    const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    return `${day} ${month}`
  }

  // Format date range (e.g., "Nov 16")
  const formatDateRange = (date: string | Date) => {
    const start = new Date(date)
    const startMonth = start.toLocaleDateString("en-US", { month: "short" })
    const startDay = start.getDate()
    return `${startMonth} ${startDay}`
  }

  const totalSlides = events.length
  const currentSlide = selectedIndex + 1

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {/* Left Side: Pagination and Navigation - Hidden on mobile, visible on md+ */}
        <div className="hidden md:flex flex-col items-center gap-4 pt-2 flex-shrink-0">
          {/* Pagination Indicator */}
          <div className="w-16 h-16 rounded-full bg-[#8B1538] text-white flex items-center justify-center text-sm font-semibold shadow-lg">
            {currentSlide}/{totalSlides}
          </div>

          {/* Navigation Arrows */}
          <div className="flex flex-col gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md ${
                canScrollPrev
                  ? "bg-[#8B1538] hover:bg-[#A01A42] text-white cursor-pointer"
                  : "bg-[#E8D5DC] text-[#8B1538]/50 cursor-not-allowed"
              }`}
              aria-label="Previous events"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md ${
                canScrollNext
                  ? "bg-[#8B1538] hover:bg-[#A01A42] text-white cursor-pointer"
                  : "bg-[#E8D5DC] text-[#8B1538]/50 cursor-not-allowed"
              }`}
              aria-label="Next events"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Right Side: Events Cards Carousel */}
        <div className="flex-1 w-full overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 md:gap-6">
            {events.map((event) => (
              <div key={event.id} className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-0.5rem)] md:flex-[0_0_calc(50%-0.75rem)] lg:flex-[0_0_calc(33.333%-1rem)] min-w-0">
                <Link href={`/events/${event.id}`}>
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
                        <div className="w-16 h-16 rounded-full bg-[#8B1538] hover:bg-[#A01A42] text-white flex flex-col items-center justify-center text-xs font-bold shadow-lg">
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
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation - Bottom centered, visible only on mobile */}
        <div className="md:hidden flex items-center justify-center gap-4 w-full pt-4">
          {/* Pagination Indicator */}
          <div className="w-12 h-12 rounded-full bg-[#8B1538] text-white flex items-center justify-center text-xs font-semibold shadow-lg">
            {currentSlide}/{totalSlides}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md ${
              canScrollPrev
                ? "bg-[#8B1538] hover:bg-[#A01A42] text-white cursor-pointer"
                : "bg-[#E8D5DC] text-[#8B1538]/50 cursor-not-allowed"
            }`}
            aria-label="Previous events"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-md ${
              canScrollNext
                ? "bg-[#8B1538] hover:bg-[#A01A42] text-white cursor-pointer"
                : "bg-[#E8D5DC] text-[#8B1538]/50 cursor-not-allowed"
            }`}
            aria-label="Next events"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

