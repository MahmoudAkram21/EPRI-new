"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ChevronUp, ChevronDown } from "lucide-react"
import { useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

interface Ad {
  id: string
  title: string
  description?: string
  image: string
  link?: string
  badge?: string
  type?: "sponsored" | "promotion" | "announcement"
}

// Sample ads data - in production, this would come from an API or CMS
const ads: Ad[] = [
  {
    id: "ad-1",
    title: "Join Our Research Program",
    description: "Explore cutting-edge petroleum research opportunities",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=600&fit=crop",
    link: "/research",
    badge: "New",
    type: "promotion"
  },
  {
    id: "ad-2",
    title: "Professional Development Courses",
    description: "Advance your career with our specialized training programs",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
    link: "/courses",
    badge: "Featured",
    type: "sponsored"
  },
  {
    id: "ad-3",
    title: "Industry Partnership Opportunities",
    description: "Collaborate with leading energy companies",
    image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=600&fit=crop",
    link: "/partnerships",
    type: "announcement"
  }
]

export function AdsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      axis: "y", // Vertical sliding
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })] as any
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const getBadgeColor = (type?: string) => {
    switch (type) {
      case "sponsored":
        return "bg-blue-500 text-white"
      case "promotion":
        return "bg-green-500 text-white"
      case "announcement":
        return "bg-purple-500 text-white"
      default:
        return "bg-primary text-white"
    }
  }

  return (
    <div className="h-[500px] w-full">
      <div className="sticky top-4 max-md:static">
        <div className="relative h-[450px] md:h-[450px]">
          {/* Navigation Arrows */}
          {ads.length > 3 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-1/2 -translate-x-1/2 top-2 z-10 h-8 w-8 rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors flex items-center justify-center"
                aria-label="Previous ad"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute left-1/2 -translate-x-1/2 bottom-2 z-10 h-8 w-8 rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors flex items-center justify-center"
                aria-label="Next ad"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Vertical Slider Container */}
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex flex-col h-full gap-3">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="flex-[0_0_calc((100%-1.5rem)/3)] min-h-0"
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-800 h-full">
                    {ad.link ? (
                      <Link href={ad.link} className="block h-full">
                        <div className="flex h-full">
                          {/* Image - Left Side */}
                          <div className="relative w-32 md:w-40 shrink-0 overflow-hidden">
                            <img
                              src={ad.image}
                              alt={ad.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Badge Overlay */}
                            {ad.badge && (
                              <div className="absolute top-2 right-2">
                                <Badge className={getBadgeColor(ad.type)}>
                                  {ad.badge}
                                </Badge>
                              </div>
                            )}
                          </div>

                          {/* Content - Right Side */}
                          <CardContent className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                            <div>
                              {/* Title */}
                              <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                {ad.title}
                              </h3>

                              {/* Description */}
                              {ad.description && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                                  {ad.description}
                                </p>
                              )}
                            </div>

                            {/* Link Indicator */}
                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                                <span>Learn More</span>
                                <ExternalLink className="h-3 w-3" />
                              </div>
                              {/* Ad Indicator */}
                              <Badge variant="outline" className="bg-white/90 dark:bg-slate-800 text-xs">
                                {ad.type === "sponsored" ? "Sponsored" : "Ad"}
                              </Badge>
                            </div>
                          </CardContent>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex h-full">
                        {/* Image - Left Side */}
                        <div className="relative w-32 md:w-40 shrink-0 overflow-hidden">
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                          {/* Badge Overlay */}
                          {ad.badge && (
                            <div className="absolute top-2 right-2">
                              <Badge className={getBadgeColor(ad.type)}>
                                {ad.badge}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Content - Right Side */}
                        <CardContent className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                          <div>
                            {/* Title */}
                            <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 mb-1 md:mb-2">
                              {ad.title}
                            </h3>

                            {/* Description */}
                            {ad.description && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                {ad.description}
                              </p>
                            )}
                          </div>

                          {/* Ad Indicator */}
                          <div className="mt-auto">
                            <Badge variant="outline" className="bg-white/90 dark:bg-slate-800 text-xs">
                              {ad.type === "sponsored" ? "Sponsored" : "Ad"}
                            </Badge>
                          </div>
                        </CardContent>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

