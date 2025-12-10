"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { useLocale } from "next-intl"
import { Microscope, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import type { ServiceCenter, ServiceCenterEquipment } from "@/types/service-center"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

type TranslationObject = { en: string; ar: string } | string

// Helper function to extract translation value
function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || ''
  }
  return ''
}

export function ScientificEquipmentSection() {
  const locale = useLocale()
  const [centers, setCenters] = useState<ServiceCenter[]>([])
  const [loading, setLoading] = useState(true)
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await apiClient.getServiceCenters()
        const parsed = (response.centers ?? []).map((center: any) => ({
          equipments: [],
          products: [],
          services: [],
          ...center,
          name: getTranslation(center.name, locale),
          headline: center.headline ? getTranslation(center.headline, locale) : undefined,
          description: center.description ? getTranslation(center.description, locale) : undefined,
          equipments: Array.isArray(center.equipments) 
            ? center.equipments.map((eq: any) => ({
                ...eq,
                name: getTranslation(eq.name, locale),
                description: eq.description ? getTranslation(eq.description, locale) : undefined,
              }))
            : [],
          products: Array.isArray(center.products) ? center.products : [],
          services: Array.isArray(center.services) ? center.services : []
        }))
        setCenters(parsed)
      } catch (error) {
        console.error("Failed to load service centers:", error)
        setCenters([])
      } finally {
        setLoading(false)
      }
    }

    fetchCenters()
  }, [])

  // Extract all equipment from all centers
  const allEquipment = useMemo(() => {
    const equipment: Array<ServiceCenterEquipment & { centerName: string; centerSlug: string }> = []
    
    centers.forEach((center) => {
      if (Array.isArray(center.equipments) && center.equipments.length > 0) {
        center.equipments.forEach((eq) => {
          equipment.push({
            ...eq,
            centerName: center.name,
            centerSlug: center.slug,
          })
        })
      }
    })
    
    return equipment
  }, [centers])


  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center">Loading equipment...</div>
      </div>
    )
  }

  if (allEquipment.length === 0) {
    return null
  }

  return (
    <div className="relative w-full bg-slate-50 dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Microscope className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-slate-100">
                Scientific Equipment
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {allEquipment.length} Equipment Available
              </p>
            </div>
          </div>
        </div>

        {/* Equipment Grid Container with Navigation */}
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6 py-2">
              {allEquipment.map((equipment) => (
                <div
                  key={equipment.id || equipment.name}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(33.333%-1rem)] pl-4"
                >
                  <Link 
                    href={`/service-centers/${equipment.centerSlug}#equipment`}
                  >
                    <Card className="group h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={equipment.image || "/placeholder.svg"}
                    alt={typeof equipment.name === 'string' ? equipment.name : getTranslation(equipment.name, locale)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {/* Center Badge */}
                    <Badge variant="secondary" className="text-xs">
                      {equipment.centerName}
                    </Badge>

                    {/* Equipment Name */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-2">
                      {typeof equipment.name === 'string' ? equipment.name : getTranslation(equipment.name, locale)}
                    </h3>

                    {/* Description */}
                    {(equipment.description || equipment.details) && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                        {typeof (equipment.description || equipment.details) === 'string' 
                          ? (equipment.description || equipment.details)
                          : getTranslation(equipment.description || equipment.details, locale)}
                      </p>
                    )}

                    {/* Specifications Preview */}
                    {equipment.specifications && 
                     typeof equipment.specifications === 'object' && 
                     Array.isArray(equipment.specifications) && 
                     equipment.specifications.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Key Specifications:
                        </p>
                        <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                          {(equipment.specifications as string[]).slice(0, 2).map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span className="line-clamp-1">{spec}</span>
                            </li>
                          ))}
                          {(equipment.specifications as string[]).length > 2 && (
                            <li className="text-primary text-xs font-medium">
                              +{(equipment.specifications as string[]).length - 2} more
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* View Details Button */}
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors"
            aria-label="Previous equipment"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors"
            aria-label="Next equipment"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* View All Link */}
        {allEquipment.length > 3 && (
          <div className="text-center mt-8">
            <Link href="/equipments">
              <Button variant="outline" className="bg-transparent">
                View All Equipment
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

