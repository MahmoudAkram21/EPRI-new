"use client"

import { useState, useMemo, useEffect } from "react"
import { useLocale } from 'next-intl'
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Search, BookOpen, Star, MapPin, Monitor, Users2, Calendar, Clock, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"
import { EnrollButton } from "@/components/enroll-button"
import { WishlistButton } from "@/components/wishlist-button"
import { useUser } from "@/contexts/user-context"

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

interface Course {
  id: string
  title: string | TranslationObject
  subtitle?: string | TranslationObject
  description: string | TranslationObject
  image?: string
  instructor_name?: string | TranslationObject
  category: string | TranslationObject
  price: number
  is_free: boolean
  duration_hours: number
  duration_weeks: number
  level: string | TranslationObject
  language: string | TranslationObject
  max_students: number
  is_published: boolean
  is_featured: boolean
  delivery_type: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  meeting_location?: string | TranslationObject
  room_number?: string | TranslationObject
  building?: string | TranslationObject
  address?: string | TranslationObject
  zoom_link?: string
  meeting_id?: string
  meeting_passcode?: string
  platform?: string
  start_date?: string
  end_date?: string
  schedule_info?: string | TranslationObject
  time_zone: string
  objectives?: string[]
  requirements?: string[]
  rating_average: number
  rating_count: number
  enrollment_count: number
  created_at: string
  updated_at: string
}

export default function CoursesPage() {
  const locale = useLocale()
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
          // Transform translation objects to strings
          const transformedCourses = response.data.map((course: any) => ({
            ...course,
            title: getTranslation(course.title, locale),
            subtitle: course.subtitle ? getTranslation(course.subtitle, locale) : undefined,
            description: getTranslation(course.description, locale),
            instructor_name: course.instructor_name ? getTranslation(course.instructor_name, locale) : undefined,
            category: getTranslation(course.category, locale),
            level: getTranslation(course.level, locale),
            language: getTranslation(course.language, locale),
            meeting_location: course.meeting_location ? getTranslation(course.meeting_location, locale) : undefined,
            room_number: course.room_number ? getTranslation(course.room_number, locale) : undefined,
            building: course.building ? getTranslation(course.building, locale) : undefined,
            address: course.address ? getTranslation(course.address, locale) : undefined,
            schedule_info: course.schedule_info ? getTranslation(course.schedule_info, locale) : undefined,
          }))
          setCourses(transformedCourses)
          console.log('Set courses:', transformedCourses.length)
        } else {
          console.error('Invalid response format:', response)
          setError('Invalid response format from server')
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        setError('Failed to load courses. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [locale])

  // Get unique categories and levels from courses data
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(courses.map(course => typeof course.category === 'string' ? course.category : getTranslation(course.category, locale)))]
    return uniqueCategories.map(category => ({
      id: category.toLowerCase().replace(/\s+/g, '-'),
      name: category,
      icon: getCategoryIcon(category)
    }))
  }, [courses, locale])

  const levels = useMemo(() => {
    return [...new Set(courses.map(course => typeof course.level === 'string' ? course.level : getTranslation(course.level, locale)))]
  }, [courses, locale])

  const filteredCourses = useMemo(() => {
    console.log('Filtering courses:', { 
      totalCourses: courses.length, 
      searchQuery, 
      selectedCategory, 
      selectedLevel, 
      selectedDeliveryType 
    })
    
    if (courses.length === 0) {
      console.log('No courses to filter')
      return []
    }
    
    const filtered = courses.filter((course) => {
      const titleStr = typeof course.title === 'string' ? course.title : getTranslation(course.title, locale)
      const subtitleStr = course.subtitle ? (typeof course.subtitle === 'string' ? course.subtitle : getTranslation(course.subtitle, locale)) : ''
      const descriptionStr = typeof course.description === 'string' ? course.description : getTranslation(course.description, locale)
      const categoryStr = typeof course.category === 'string' ? course.category : getTranslation(course.category, locale)
      const levelStr = typeof course.level === 'string' ? course.level : getTranslation(course.level, locale)
      
      const matchesSearch = !searchQuery || 
        titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subtitleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        descriptionStr.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || categoryStr === selectedCategory

      const matchesLevel = selectedLevel === "all" || levelStr === selectedLevel

      const matchesDeliveryType = selectedDeliveryType === "all" || course.delivery_type.toLowerCase() === selectedDeliveryType.toLowerCase()

      return matchesSearch && matchesCategory && matchesLevel && matchesDeliveryType
    })
    
    console.log('Filtered courses result:', filtered.length, 'First course:', filtered[0]?.title)
    return filtered
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedDeliveryType])

  // Helper function to get category icons
  function getCategoryIcon(category: string): string {
    const iconMap: { [key: string]: string } = {
      'Petroleum Engineering': '⚙️',
      'Geology & Geophysics': '🌍',
      'Environmental Studies': '🌱',
      'Reservoir Engineering': '🛢️',
      'Drilling Engineering': '⛏️',
      'Economics & Finance': '💰',
      'Production Engineering': '🏭'
    }
    return iconMap[category] || '📚'
  }

  return (
    <PageContainer>

      {/* Hero Section with Background */}
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('/modern-university-library-students-studying.jpg')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.6) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/85 via-purple-600/75 to-blue-600/85"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/40 via-transparent to-blue-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-blue-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-purple-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Explore Our Courses
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light mb-8">
              Discover world-class courses taught by leading experts in their fields
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Filters and Course List */}
      <Section>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Level</h3>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Delivery Type</h3>
              <Select value={selectedDeliveryType} onValueChange={setSelectedDeliveryType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="online">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Online
                    </div>
                  </SelectItem>
                  <SelectItem value="offline">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Offline
                    </div>
                  </SelectItem>
                  <SelectItem value="hybrid">
                    <div className="flex items-center gap-2">
                      <Users2 className="h-4 w-4" />
                      Hybrid
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedLevel("all")
                  setSelectedDeliveryType("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-muted-foreground">
                Showing {filteredCourses.length} {filteredCourses.length === 1 ? "course" : "courses"}
              </p>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-full overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive text-lg mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Loader2 className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No courses found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setSelectedLevel("all")
                    setSelectedDeliveryType("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="h-full hover:shadow-lg transition-shadow flex flex-col pt-0 overflow-hidden" >
                    <Link href={`/courses/${course.id}`}>
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={typeof course.title === 'string' ? course.title : getTranslation(course.title, locale)}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    </Link>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">{typeof course.category === 'string' ? course.category : getTranslation(course.category, locale)}</Badge>
                          <Badge variant="outline">{typeof course.level === 'string' ? course.level : getTranslation(course.level, locale)}</Badge>
                          <Badge 
                            variant={
                              course.delivery_type === 'ONLINE' ? 'default' : 
                              course.delivery_type === 'OFFLINE' ? 'destructive' : 'secondary'
                            }
                            className={`text-xs ${
                              course.delivery_type === 'ONLINE' ? 'bg-blue-500 hover:bg-blue-600' :
                              course.delivery_type === 'OFFLINE' ? 'bg-green-500 hover:bg-green-600' :
                              'bg-purple-500 hover:bg-purple-600'
                            }`}
                          >
                            {course.delivery_type === 'ONLINE' && <Monitor className="h-3 w-3 mr-1" />}
                            {course.delivery_type === 'OFFLINE' && <MapPin className="h-3 w-3 mr-1" />}
                            {course.delivery_type === 'HYBRID' && <Users2 className="h-3 w-3 mr-1" />}
                            {course.delivery_type}
                          </Badge>
                          {course.is_featured && (
                            <Badge variant="outline" className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none">
                              ⭐ Featured
                            </Badge>
                          )}
                        </div>
                        <WishlistButton
                          courseId={course.id}
                          courseTitle={typeof course.title === 'string' ? course.title : getTranslation(course.title, locale)}
                          variant="ghost"
                          size="icon"
                          showText={false}
                        />
                      </div>
                      <Link href={`/courses/${course.id}`}>
                        <CardTitle className="text-xl hover:text-primary transition-colors">{typeof course.title === 'string' ? course.title : getTranslation(course.title, locale)}</CardTitle>
                        <CardDescription>{course.subtitle ? (typeof course.subtitle === 'string' ? course.subtitle : getTranslation(course.subtitle, locale)) : ''}</CardDescription>
                      </Link>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {course.duration_weeks} weeks
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {course.rating_average.toFixed(1)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {course.duration_hours}h
                        </div>
                      </div>
                      
                      {/* Delivery Type Info */}
                      <div className="mb-3 p-2 rounded-lg bg-muted/50">
                        {course.delivery_type === 'ONLINE' && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Monitor className="h-3 w-3" />
                            <span>Online via {course.platform || 'Learning Platform'}</span>
                          </div>
                        )}
                        {course.delivery_type === 'OFFLINE' && course.meeting_location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{typeof course.meeting_location === 'string' ? course.meeting_location : getTranslation(course.meeting_location, locale)}</span>
                          </div>
                        )}
                        {course.delivery_type === 'HYBRID' && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users2 className="h-3 w-3" />
                            <span>Online & On-campus</span>
                          </div>
                        )}
                        {course.start_date && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3" />
                            <span>Starts {new Date(course.start_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-muted-foreground">By {course.instructor_name ? (typeof course.instructor_name === 'string' ? course.instructor_name : getTranslation(course.instructor_name, locale)) : 'EPRI Faculty'}</div>
                      {isEnrolled(course.id) && (
                        <Badge variant="default" className="mt-3">
                          Enrolled
                        </Badge>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="font-semibold text-lg">{course.is_free ? "Free" : `$${course.price}`}</div>
                        <div className="text-sm text-muted-foreground">{course.enrollment_count.toLocaleString()} students</div>
                      </div>
                      <EnrollButton courseId={course.id} courseTitle={typeof course.title === 'string' ? course.title : getTranslation(course.title, locale)} className="w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

    </PageContainer>
  )
}
