"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"
import { Microscope, ChevronLeft, ChevronRight, Info, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import type { ServiceCenter, ServiceCenterEquipment } from "@/types/service-center"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils"
import { EquipmentWishlistButton } from "@/components/equipment-wishlist-button"

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

const filterCategories = [
  { id: "all", label: "All" },
  { id: "departments", label: "Departments" },
  { id: "centers", label: "Centers" },
  { id: "units", label: "Units" },
]

export function ScientificEquipmentSection() {
  const locale = useLocale()
  const t = useTranslations()
  const [centers, setCenters] = useState<ServiceCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")
  
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
  }, [locale])

  // Extract all equipment from all centers with center type
  const allEquipment = useMemo(() => {
    const equipment: Array<ServiceCenterEquipment & { centerName: string; centerSlug: string; centerType?: string }> = []
    
    centers.forEach((center) => {
      if (Array.isArray(center.equipments) && center.equipments.length > 0) {
        center.equipments.forEach((eq) => {
          equipment.push({
            ...eq,
            centerName: center.name,
            centerSlug: center.slug,
            centerType: center.type,
          })
        })
      }
    })
    
    return equipment
  }, [centers])

  // Filter equipment based on selected filter
  const filteredEquipment = useMemo(() => {
    if (selectedFilter === "all") {
      return allEquipment
    } else if (selectedFilter === "centers") {
      return allEquipment.filter((eq) => eq.centerType === "center")
    } else if (selectedFilter === "units") {
      return allEquipment.filter((eq) => eq.centerType === "unit")
    } else if (selectedFilter === "departments") {
      // Departments are centers that don't have type "center" or "unit"
      return allEquipment.filter((eq) => !eq.centerType || (eq.centerType !== "center" && eq.centerType !== "unit"))
    }
    return allEquipment
  }, [allEquipment, selectedFilter])

  // Reset carousel when filter changes
  useEffect(() => {
    // Only reset carousel if it's initialized and we have items to show
    if (!emblaApi || filteredEquipment.length === 0) {
      return
    }
    
    // Use a small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      if (emblaApi && typeof emblaApi.reInit === 'function') {
        try {
          emblaApi.reInit()
          if (typeof emblaApi.scrollTo === 'function') {
            emblaApi.scrollTo(0)
          }
        } catch (error) {
          // Silently handle errors - carousel might not be ready
          console.warn('Carousel reset error:', error)
        }
      }
    }, 10)
    
    return () => clearTimeout(timer)
  }, [selectedFilter, emblaApi, filteredEquipment.length])


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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Microscope className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-slate-100">
                  Scientific Equipment
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {filteredEquipment.length} {selectedFilter === 'all' ? 'Equipment Available' : `${filterCategories.find(c => c.id === selectedFilter)?.label} Equipment`}
                </p>
              </div>
            </div>
            <Link
              href="/equipments"
              className="hidden md:flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium text-base"
            >
              {t('home.sections.seeMore')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-4">
          {filterCategories.map((category) => {
            const count = category.id === "all" 
              ? allEquipment.length 
              : category.id === "centers"
              ? allEquipment.filter((eq) => eq.centerType === "center").length
              : category.id === "units"
              ? allEquipment.filter((eq) => eq.centerType === "unit").length
              : allEquipment.filter((eq) => !eq.centerType || (eq.centerType !== "center" && eq.centerType !== "unit")).length

            return (
              <button
                key={category.id}
                onClick={() => setSelectedFilter(category.id)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  selectedFilter === category.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
              >
                {category.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Equipment Grid Container with Navigation */}
        <div className="relative">
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No {selectedFilter === 'all' ? '' : filterCategories.find(c => c.id === selectedFilter)?.label.toLowerCase()} equipment available at this time.
            </div>
          ) : (
            <>
              <div ref={emblaRef} className="overflow-hidden">
                <div className="flex gap-6 py-2">
                  {filteredEquipment.map((equipment) => (
                <div
                  key={equipment.id || equipment.name}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(33.333%-1rem)] pl-4"
                >
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                {/* Image */}
                <Link href={`/service-centers/${equipment.centerSlug}#equipment`}>
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={equipment.image || "/placeholder.svg"}
                      alt={typeof equipment.name === 'string' ? equipment.name : getTranslation(equipment.name, locale)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </Link>
                {/* Wishlist Button */}
                <div className="absolute top-2 right-2 z-10">
                  <EquipmentWishlistButton
                    equipmentId={equipment.id || String(equipment.name)}
                    equipmentName={typeof equipment.name === 'string' ? equipment.name : getTranslation(equipment.name, locale)}
                    variant="ghost"
                    size="icon"
                    className="bg-white/90 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900"
                  />
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <Link href={`/service-centers/${equipment.centerSlug}#equipment`}>
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
                  </Link>
                </CardContent>
                    </Card>
                </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Navigation Arrows */}
          {filteredEquipment.length > 3 && (
            <>
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
            </>
          )}
        </div>

        {/* View All Link - Mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/equipments"
            className="inline-flex items-center gap-1 text-foreground/80 hover:text-primary transition-colors font-medium text-base"
          >
            {t('home.sections.seeMore')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

