"use client"

import { useState, useMemo, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Search, BookOpen, Star, MapPin, Monitor, Users2, Calendar, Clock, Loader2, GraduationCap } from "lucide-react"
import { apiClient } from "@/lib/api"
import { EnrollButton } from "@/components/enroll-button"
import { WishlistButton } from "@/components/wishlist-button"
import { useUser } from "@/contexts/user-context"

interface Course {
  id: string
  title: string
  subtitle?: string
  description: string
  image?: string
  instructor_name?: string
  category: string
  price: number
  is_free: boolean
  duration_hours: number
  duration_weeks: number
  level: string
  language: string
  max_students: number
  is_published: boolean
  is_featured: boolean
  delivery_type: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  meeting_location?: string
  room_number?: string
  building?: string
  address?: string
  zoom_link?: string
  meeting_id?: string
  meeting_passcode?: string
  platform?: string
  start_date?: string
  end_date?: string
  schedule_info?: string
  time_zone: string
  objectives?: string[]
  requirements?: string[]
  rating_average: number
  rating_count: number
  enrollment_count: number
  created_at: string
  updated_at: string
}

export default function TrainingCenterPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("all")
  const { isEnrolled } = useUser()

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getCourses({ is_published: true }) as any
        console.log('API Response:', response)
        console.log('Courses data:', response.data)
        if (response.data && Array.isArray(response.data)) {
          setCourses(response.data)
          console.log('Set courses:', response.data.length)
        } else {
          console.error('Invalid response format:', response)
          setError('Invalid response format from server')
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        setError('Failed to load training courses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Get unique categories and levels from courses data
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(courses.map(course => course.category))]
    return uniqueCategories.map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      icon: getCategoryIcon(category)
    }))
  }, [courses])

  const levels = useMemo(() => {
    return [...new Set(courses.map(course => course.level))]
  }, [courses])

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = 
        searchQuery === "" || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor_name?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || course.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
      const matchesDeliveryType = selectedDeliveryType === "all" || course.delivery_type === selectedDeliveryType

      return matchesSearch && matchesCategory && matchesLevel && matchesDeliveryType
    })
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedDeliveryType])

  const featuredCourses = useMemo(() => {
    return filteredCourses.filter(course => course.is_featured).slice(0, 3)
  }, [filteredCourses])

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm mb-6">
            <GraduationCap className="h-3.5 w-3.5" />
            Training Center
          </div>
          
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Internal Training & E-Learning Courses
          </h1>
          
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl mb-8">
            Enhance your professional skills with our comprehensive training programs. Access expert-led courses, hands-on workshops, and e-learning modules designed for industry professionals.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
            <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              {courses.length} Training Courses
            </Badge>
            <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              {categories.length} Categories
            </Badge>
            <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              Online & Offline
            </Badge>
          </div>
        </div>
      </Section>

      {/* Search and Filters */}
      <Section>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search training courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] rounded-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px] rounded-full">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDeliveryType} onValueChange={setSelectedDeliveryType}>
                <SelectTrigger className="w-[180px] rounded-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredCourses.length}</span> training courses
          </div>
        </div>
      </Section>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <Section>
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80 mb-2">Featured</p>
              <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
                Recommended Training Programs
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* All Courses */}
      <Section>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80 mb-2">All Courses</p>
            <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
              Browse Training Courses
            </h2>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[400px] rounded-2xl border border-slate-200/60 dark:border-slate-800"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <p className="text-base text-slate-500 dark:text-slate-400">{error}</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <BookOpen className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
              <p className="text-base text-slate-500 dark:text-slate-400">
                {searchQuery 
                  ? `No training courses found matching "${searchQuery}".`
                  : "No training courses available at this time."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </Section>
    </PageContainer>
  )
}

function CourseCard({ course }: { course: Course }) {
  const { isEnrolled } = useUser()
  const enrolled = isEnrolled(course.id)

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm ring-1 ring-slate-200/30 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/20 dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800">
      <Link href={`/courses/${course.id}`}>
        {/* Course Image */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          {course.image ? (
            <img
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-16 w-16 text-slate-400 dark:text-slate-600" />
            </div>
          )}
          {course.is_featured && (
            <Badge className="absolute top-3 right-3 rounded-full border-white/30 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary shadow-sm">
              Featured
            </Badge>
          )}
          {course.is_free && (
            <Badge className="absolute top-3 left-3 rounded-full border-emerald-400/50 bg-emerald-500/20 text-xs font-semibold text-emerald-100 backdrop-blur-sm">
              Free
            </Badge>
          )}
        </div>

        {/* Course Info */}
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {course.category}
            </Badge>
            {course.rating_average > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{course.rating_average.toFixed(1)}</span>
                <span className="text-slate-400">({course.rating_count})</span>
              </div>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
          {course.subtitle && (
            <CardDescription className="line-clamp-2 mt-1">
              {course.subtitle}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            {course.instructor_name && (
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                <span>{course.instructor_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{course.duration_hours} hours • {course.duration_weeks} weeks</span>
            </div>
            <div className="flex items-center gap-2">
              {course.delivery_type === 'ONLINE' ? (
                <Monitor className="h-4 w-4" />
              ) : course.delivery_type === 'OFFLINE' ? (
                <MapPin className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              <span>
                {course.delivery_type === 'ONLINE' ? 'Online' : 
                 course.delivery_type === 'OFFLINE' ? 'Offline' : 'Hybrid'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {course.level}
              </Badge>
              <span className="text-xs">•</span>
              <span className="text-xs">{course.language}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {course.is_free ? (
              <span className="text-lg font-bold text-primary">Free</span>
            ) : (
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </span>
            )}
          </div>
          {enrolled ? (
            <Badge className="rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
              Enrolled
            </Badge>
          ) : (
            <Button size="sm" className="rounded-full">
              View Details
            </Button>
          )}
        </CardFooter>
      </Link>
    </Card>
  )
}

function getCategoryIcon(category: string) {
  return BookOpen
}

