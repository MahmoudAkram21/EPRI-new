"use client"

import Link from "next/link"
import type { NewsPost } from "@/lib/data"
import { useLocale } from "next-intl"
import { getTranslation } from "@/lib/utils"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NewsCarouselProps {
  news: NewsPost[]
}

export function NewsCarousel({ news }: NewsCarouselProps) {
  const locale = useLocale()

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })] as any
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 md:gap-6 py-2">
          {news.map((item) => {
            const title = getTranslation(item.title, locale as "en" | "ar")
            return (
              <div
                key={item.id}
                className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_calc(33.333%-1rem)] lg:flex-[0_0_calc(33.333%-1rem)] pl-4"
              >
                <Link 
                  href={`/news/${item.id}`}
                  className="group block"
                >
                  <div className="relative h-[240px] md:h-[280px] lg:h-[320px] overflow-hidden rounded-lg cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                    {/* Image - Full background */}
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Dark Gradient Overlay at bottom for text readability - stronger gradient */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>
                    
                    {/* Title overlaid on gradient at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 lg:p-6">
                      <h3 className="text-white text-sm md:text-base lg:text-lg font-semibold line-clamp-3 leading-relaxed group-hover:text-primary-foreground transition-colors">
                        {title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      {news.length > 3 && (
        <>
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors"
            aria-label="Previous news"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors"
            aria-label="Next news"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
    </div>
  )
}

