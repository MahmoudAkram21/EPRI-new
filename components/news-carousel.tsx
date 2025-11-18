"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import type { NewsPost } from "@/lib/data"

interface NewsCarouselProps {
  news: NewsPost[]
}

export function NewsCarousel({ news }: NewsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })] as any,
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

  return (
    <div className="relative">
      {/* News Cards Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6">
          {news.map((item) => (
            <div key={item.id} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-0.75rem)] lg:flex-[0_0_calc(33.333%-1rem)] min-w-0">
              <Link href={`/news/${item.id}`}>
                <div className="group relative h-72 md:h-80 lg:h-96 overflow-hidden rounded-xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 mx-2">
                  {/* Image */}
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Dark Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm p-5 md:p-6">
                    <h3 className="text-white text-sm md:text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-relaxed">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows - Centered at Bottom */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="w-12 h-12 rounded-full bg-primary/20 hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed text-primary flex items-center justify-center transition-all hover:scale-110 shadow-md hover:shadow-lg"
          aria-label="Previous news"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="w-12 h-12 rounded-full bg-primary/20 hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed text-primary flex items-center justify-center transition-all hover:scale-110 shadow-md hover:shadow-lg"
          aria-label="Next news"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

