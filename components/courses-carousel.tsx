"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, BookOpen, Clock, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"

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

export function CoursesCarousel() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 3
  const totalSlides = Math.ceil(courses.length / itemsPerView)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.getCourses({ is_published: true }) as any
        let coursesData: Course[] = []
        
        // Handle different response formats
        if (response.data && Array.isArray(response.data)) {
          coursesData = response.data
        } else if (response.courses && Array.isArray(response.courses)) {
          coursesData = response.courses
        } else if (Array.isArray(response)) {
          coursesData = response
        }
        
        // Filter published courses and limit to 9
        const publishedCourses = coursesData
          .filter((course: Course) => course.is_published)
          .slice(0, 9)
        
        setCourses(publishedCourses)
      } catch (error) {
        console.error("Failed to load courses:", error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const currentCourses = courses.slice(
    currentIndex * itemsPerView,
    currentIndex * itemsPerView + itemsPerView
  )

  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center">Loading courses...</div>
      </div>
    )
  }

  if (courses.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      {courses.length > itemsPerView && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl text-primary flex items-center justify-center transition-all hover:scale-110 border border-slate-200 dark:border-slate-700"
            aria-label="Previous courses"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl text-primary flex items-center justify-center transition-all hover:scale-110 border border-slate-200 dark:border-slate-700"
            aria-label="Next courses"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentCourses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <div className="group bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>

                {/* Description */}
                {course.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3 flex-1">
                    {course.description}
                  </p>
                )}

                {/* Details */}
                <div className="space-y-2 mb-6">
                  {(course.lessons_count || (course.lessons && course.lessons.length > 0)) && (
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        STUDY {course.lessons_count || (course.lessons ? course.lessons.length : 0)} SUBJECTS
                      </span>
                    </div>
                  )}
                  {course.duration_weeks && (
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {course.duration_weeks} {course.duration_weeks === 1 ? 'MONTH' : 'MONTHS'} PART TIME
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold">6 INTAKES A YEAR</span>
                  </div>
                </div>

                {/* Button */}
                <Button 
                  className="w-full bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-slate-900 dark:text-slate-100 border-0 transition-all font-medium"
                  variant="outline"
                >
                  View course details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
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
    </div>
  )
}

