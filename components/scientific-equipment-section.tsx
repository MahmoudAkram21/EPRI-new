"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Microscope, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import type { ServiceCenter, ServiceCenterEquipment } from "@/types/service-center"

export function ScientificEquipmentSection() {
  const [centers, setCenters] = useState<ServiceCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 3

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await apiClient.getServiceCenters()
        const parsed = (response.centers ?? []).map((center: any) => ({
          equipments: [],
          products: [],
          services: [],
          ...center,
          equipments: Array.isArray(center.equipments) ? center.equipments : [],
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

  const totalSlides = Math.ceil(allEquipment.length / itemsPerView)
  const currentEquipment = allEquipment.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  )

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

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

        {/* Navigation Arrows */}
        {allEquipment.length > itemsPerView && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl text-primary flex items-center justify-center transition-all hover:scale-110 border border-slate-200 dark:border-slate-700"
              aria-label="Previous equipment"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl text-primary flex items-center justify-center transition-all hover:scale-110 border border-slate-200 dark:border-slate-700"
              aria-label="Next equipment"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentEquipment.map((equipment) => (
            <Link 
              key={equipment.id || equipment.name} 
              href={`/service-centers/${equipment.centerSlug}#equipment`}
            >
              <Card className="group h-full hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={equipment.image || "/placeholder.svg"}
                    alt={equipment.name}
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
                      {equipment.name}
                    </h3>

                    {/* Description */}
                    {(equipment.description || equipment.details) && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                        {equipment.description || equipment.details}
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
          ))}
        </div>

        {/* Pagination Dots */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-slate-300 dark:bg-slate-600 w-2 hover:bg-slate-400 dark:hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        {allEquipment.length > itemsPerView && (
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

