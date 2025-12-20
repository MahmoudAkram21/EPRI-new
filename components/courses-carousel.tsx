"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { useLocale } from "next-intl"
import { ChevronLeft, ChevronRight, BookOpen, Clock, Calendar, ArrowRight, Monitor, MapPin, Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { useTranslations } from "next-intl"

type TranslationObject = { en: string; ar: string } | string

interface Course {
  id: string
  title: string
  subtitle?: string
  description?: string
  image?: string
  category: string
  duration_weeks?: number
  duration_hours?: number
  level: string
  is_featured?: boolean
  is_published?: boolean
  delivery_type?: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  lessons_count?: number
  lessons?: any[]
}

// Helper function to extract translation value
function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || ''
  }
  return ''
}

export function CoursesCarousel() {
  const locale = useLocale()
  const t = useTranslations('trainingCenter')
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'ONLINE' | 'OFFLINE' | 'HYBRID'>('all')

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
    const fetchCourses = async () => {
      try {
        const response = await apiClient.getCourses({ is_published: true }) as any
        let coursesData: any[] = []
        
        // Handle different response formats
        if (response.data && Array.isArray(response.data)) {
          coursesData = response.data
        } else if (response.courses && Array.isArray(response.courses)) {
          coursesData = response.courses
        } else if (Array.isArray(response)) {
          coursesData = response
        }
        
        // Transform translation objects to strings and filter published courses
        const publishedCourses: Course[] = coursesData
          .filter((course: any) => course.is_published)
          .slice(0, 9)
          .map((course: any) => ({
            ...course,
            title: getTranslation(course.title, locale),
            subtitle: course.subtitle ? getTranslation(course.subtitle, locale) : undefined,
            description: course.description ? getTranslation(course.description, locale) : undefined,
          }))
        
        setAllCourses(publishedCourses)
      } catch (error) {
        console.error("Failed to load courses:", error)
        setAllCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [locale])

  // Filter courses by delivery type
  const courses = useMemo(() => {
    if (selectedFilter === 'all') {
      return allCourses
    }
    return allCourses.filter(course => course.delivery_type === selectedFilter)
  }, [allCourses, selectedFilter])

  // Reset carousel when courses change
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
    }
  }, [courses, emblaApi])

  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center">Loading courses...</div>
      </div>
    )
  }

  if (allCourses.length === 0) {
    return null
  }

  const filterTabs = [
    { id: 'all' as const, label: 'All Courses', icon: null, count: allCourses.length },
    { id: 'ONLINE' as const, label: 'Virtual/Online', icon: Monitor, count: allCourses.filter(c => c.delivery_type === 'ONLINE').length },
    { id: 'OFFLINE' as const, label: 'Physical', icon: MapPin, count: allCourses.filter(c => c.delivery_type === 'OFFLINE').length },
    { id: 'HYBRID' as const, label: 'Hybrid', icon: Users2, count: allCourses.filter(c => c.delivery_type === 'HYBRID').length },
  ]

  return (
    <div className="relative space-y-8">
      {/* Filter Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {filterTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2",
                selectedFilter === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  selectedFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-muted"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No {selectedFilter === 'all' ? '' : selectedFilter.toLowerCase()} courses available at this time.
        </div>
      ) : (
        <>
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6 py-2">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(33.333%-1rem)] pl-4"
                >
                  <Link href={`/courses/${course.id}`}>
                    <div className="group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      {/* Image - Larger at top */}
                      <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Title - Bold dark blue */}
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>

                        {/* Description */}
                        {course.description && (
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                            {course.description}
                          </p>
                        )}

                        {/* Details with icons */}
                        <div className="space-y-3 mb-6">
                          {(course.lessons_count || (course.lessons && course.lessons.length > 0)) && (
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="font-semibold uppercase">
                                STUDY {course.lessons_count || (course.lessons ? course.lessons.length : 0)} SUBJECTS
                              </span>
                            </div>
                          )}
                          {course.duration_weeks && (
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="font-semibold uppercase">
                                {course.duration_weeks} {course.duration_weeks === 1 ? 'MONTH' : 'MONTHS'} PART TIME
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="font-semibold uppercase">6 INTAKES A YEAR</span>
                          </div>
                        </div>

                        {/* Button - Light green with white arrow */}
                        <Button 
                          className="w-full bg-green-500 hover:bg-green-600 text-white border-0 transition-all font-medium shadow-sm hover:shadow-md"
                          variant="default"
                        >
                          View course details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {courses.length > 3 && (
            <>
              <button
                onClick={scrollPrev}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors"
                aria-label="Previous courses"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={scrollNext}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors"
                aria-label="Next courses"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </>
      )}
    </div>
  )
}

