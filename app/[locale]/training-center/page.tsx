"use client"

import { useState, useMemo, useEffect } from "react"
import { useLocale, useTranslations } from 'next-intl'
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import { Search, BookOpen, Star, MapPin, Monitor, Users2, Calendar, Clock, Loader2, GraduationCap, Play, Image as ImageIcon } from "lucide-react"
import { apiClient } from "@/lib/api"
import { EnrollButton } from "@/components/enroll-button"
import { WishlistButton } from "@/components/wishlist-button"
import { MultiCourseCheckout } from "@/components/multi-course-checkout"
import { useUser } from "@/contexts/user-context"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"

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

interface OverviewContent {
  title?: TranslationObject
  subtitle?: TranslationObject
  description?: TranslationObject
  content?: any
  images?: string[]
  video_url?: string
  video_type?: string
}

export default function TrainingCenterPage() {
  const locale = useLocale()
  const t = useTranslations()
  const [courses, setCourses] = useState<Course[]>([])
  const [overviewContent, setOverviewContent] = useState<OverviewContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [overviewLoading, setOverviewLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const { isEnrolled } = useUser()

  // Fetch overview content
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setOverviewLoading(true)
        const response = await apiClient.getPageContent('training-center', 'overview')
        if (response && response.contents && response.contents.length > 0) {
          // Get the first content item (or find by section_key)
          const overview = response.contents.find((c: any) => c.section_key === 'overview') || response.contents[0]
          if (overview) {
            setOverviewContent({
              title: overview.title,
              subtitle: overview.subtitle,
              description: overview.description,
              content: overview.content,
              images: Array.isArray(overview.images) ? overview.images : [],
              video_url: overview.content?.video_url,
              video_type: overview.content?.video_type || 'youtube'
            })
          }
        }
      } catch (err) {
        console.error('Failed to fetch overview:', err)
      } finally {
        setOverviewLoading(false)
      }
    }
    fetchOverview()
  }, [])

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getCourses({ is_published: true }) as any
        if (response.data && Array.isArray(response.data)) {
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
        } else {
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

  // Filter courses based on search and filters
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const titleStr = typeof course.title === 'string' ? course.title : getTranslation(course.title, locale)
      const descriptionStr = typeof course.description === 'string' ? course.description : getTranslation(course.description, locale)
      const categoryStr = typeof course.category === 'string' ? course.category : getTranslation(course.category, locale)
      const instructorStr = course.instructor_name ? (typeof course.instructor_name === 'string' ? course.instructor_name : getTranslation(course.instructor_name, locale)) : ''
      
      const matchesSearch = 
        searchQuery === "" || 
        titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        descriptionStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        categoryStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructorStr.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" || categoryStr.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      const levelStr = typeof course.level === 'string' ? course.level : getTranslation(course.level, locale)
      const matchesLevel = selectedLevel === "all" || levelStr === selectedLevel
      const matchesDeliveryType = selectedDeliveryType === "all" || course.delivery_type === selectedDeliveryType

      return matchesSearch && matchesCategory && matchesLevel && matchesDeliveryType
    })
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedDeliveryType, locale])

  // Separate courses by delivery type
  const onlineCourses = useMemo(() => {
    return filteredCourses.filter(course => course.delivery_type === 'ONLINE')
  }, [filteredCourses])

  const offlineCourses = useMemo(() => {
    return filteredCourses.filter(course => course.delivery_type === 'OFFLINE')
  }, [filteredCourses])

  const hybridCourses = useMemo(() => {
    return filteredCourses.filter(course => course.delivery_type === 'HYBRID')
  }, [filteredCourses])

  const featuredCourses = useMemo(() => {
    return filteredCourses.filter(course => course.is_featured).slice(0, 3)
  }, [filteredCourses])

  // Course selection handlers
  const toggleCourseSelection = (course: Course) => {
    setSelectedCourses(prev => {
      const isSelected = prev.some(c => c.id === course.id)
      if (isSelected) {
        return prev.filter(c => c.id !== course.id)
      } else {
        return [...prev, course]
      }
    })
  }

  const handleCheckoutSuccess = () => {
    setSelectedCourses([])
    setShowCheckout(false)
  }

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

      {/* Cart/Checkout Button */}
      {selectedCourses.length > 0 && (
        <Section>
          <div className="fixed bottom-6 right-6 z-40">
            <Button
              size="lg"
              className="rounded-full shadow-lg"
              onClick={() => setShowCheckout(true)}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {t('trainingCenter.checkout')} ({selectedCourses.length})
            </Button>
          </div>
        </Section>
      )}

      {/* Multi-Course Checkout Modal */}
      {showCheckout && (
        <MultiCourseCheckout
          courses={selectedCourses}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Tabs Section */}
      <Section>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm overflow-x-auto gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 shrink-0">
              <BookOpen className="h-4 w-4" />
              <span>{t('trainingCenter.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="online" className="flex items-center gap-2 shrink-0">
              <Monitor className="h-4 w-4" />
              <span>{t('trainingCenter.onlineCourses')}</span>
              {onlineCourses.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {onlineCourses.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="offline" className="flex items-center gap-2 shrink-0">
              <MapPin className="h-4 w-4" />
              <span>{t('trainingCenter.onSiteCourses')}</span>
              {offlineCourses.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {offlineCourses.length}
                </Badge>
              )}
            </TabsTrigger>
            {hybridCourses.length > 0 && (
              <TabsTrigger value="hybrid" className="flex items-center gap-2 shrink-0">
                <Calendar className="h-4 w-4" />
                <span>{t('trainingCenter.hybridCourses')}</span>
                <Badge variant="secondary" className="ml-1 text-xs">
                  {hybridCourses.length}
                </Badge>
              </TabsTrigger>
            )}
            <TabsTrigger value="all" className="flex items-center gap-2 shrink-0">
              <BookOpen className="h-4 w-4" />
              <span>{t('trainingCenter.allCourses')}</span>
              {filteredCourses.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filteredCourses.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {overviewLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            ) : (
              <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader>
                  {overviewContent?.title && (
                    <CardTitle className="text-2xl font-semibold">
                      {getTranslation(overviewContent.title, locale)}
                    </CardTitle>
                  )}
                  {overviewContent?.subtitle && (
                    <CardDescription className="text-lg mt-2">
                      {getTranslation(overviewContent.subtitle, locale)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {overviewContent?.description && (
                    <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {getTranslation(overviewContent.description, locale)}
                    </p>
                  )}

                  {/* Video or Images Section */}
                  {overviewContent?.video_url ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-900">
                      {overviewContent.video_type === 'youtube' ? (
                        <iframe
                          src={overviewContent.video_url}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={overviewContent.video_url}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  ) : overviewContent?.images && overviewContent.images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {overviewContent.images.map((imageUrl, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={`Overview image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {overviewContent?.content && (
                    <div className="prose dark:prose-invert max-w-none">
                      {typeof overviewContent.content === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: overviewContent.content }} />
                      ) : (
                        <pre className="whitespace-pre-wrap text-sm">
                          {JSON.stringify(overviewContent.content, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Featured Courses in Overview */}
            {featuredCourses.length > 0 && (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80 mb-2">Featured</p>
                  <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
                    {t('trainingCenter.recommendedPrograms')}
                  </h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {featuredCourses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course}
                      isSelected={selectedCourses.some(c => c.id === course.id)}
                      onToggleSelection={() => toggleCourseSelection(course)}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Online Courses Tab */}
          <TabsContent value="online" className="space-y-6">
            <CoursesList
              courses={onlineCourses}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              categories={categories}
              levels={levels}
              locale={locale}
              selectedCourses={selectedCourses}
              onToggleSelection={toggleCourseSelection}
            />
          </TabsContent>

          {/* Offline Courses Tab */}
          <TabsContent value="offline" className="space-y-6">
            <CoursesList
              courses={offlineCourses}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              categories={categories}
              levels={levels}
              locale={locale}
              selectedCourses={selectedCourses}
              onToggleSelection={toggleCourseSelection}
            />
          </TabsContent>

          {/* Hybrid Courses Tab */}
          {hybridCourses.length > 0 && (
            <TabsContent value="hybrid" className="space-y-6">
              <CoursesList
                courses={hybridCourses}
                loading={loading}
                error={error}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                categories={categories}
                levels={levels}
                locale={locale}
                selectedCourses={selectedCourses}
                onToggleSelection={toggleCourseSelection}
              />
            </TabsContent>
          )}

          {/* All Courses Tab */}
          <TabsContent value="all" className="space-y-6">
            <CoursesList
              courses={filteredCourses}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedLevel={selectedLevel}
              setSelectedLevel={setSelectedLevel}
              categories={categories}
              levels={levels}
              locale={locale}
              selectedCourses={selectedCourses}
              onToggleSelection={toggleCourseSelection}
            />
          </TabsContent>
        </Tabs>
      </Section>
    </PageContainer>
  )
}

// Courses List Component
function CoursesList({
  courses,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLevel,
  setSelectedLevel,
  categories,
  levels,
  locale,
  selectedCourses,
  onToggleSelection
}: {
  courses: Course[]
  loading: boolean
  error: string | null
  searchQuery: string
  setSearchQuery: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedLevel: string
  setSelectedLevel: (value: string) => void
  categories: Array<{ id: string; name: string; icon: any }>
  levels: string[]
  locale: string
  selectedCourses?: Course[]
  onToggleSelection?: (course: Course) => void
}) {
  return (
    <>
      {/* Search and Filters */}
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
          </div>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{courses.length}</span> training courses
        </div>
      </div>

      {/* Courses Grid */}
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
      ) : courses.length === 0 ? (
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
          {courses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
              isSelected={selectedCourses.some(c => c.id === course.id)}
              onToggleSelection={() => toggleCourseSelection(course)}
            />
          ))}
        </div>
      )}
    </>
  )
}

function CourseCard({ 
  course, 
  isSelected = false, 
  onToggleSelection 
}: { 
  course: Course
  isSelected?: boolean
  onToggleSelection?: () => void
}) {
  const locale = useLocale()
  const { isEnrolled } = useUser()
  const enrolled = isEnrolled(course.id)

  return (
    <Card className={`group relative overflow-hidden rounded-2xl border transition-all ${
      isSelected 
        ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-lg" 
        : "border-slate-200/70 bg-white shadow-sm ring-1 ring-slate-200/30 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/20"
    } dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800`}>
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-primary text-white">
            Selected
          </Badge>
        </div>
      )}
      <Link href={`/courses/${course.id}`}>
        {/* Course Image */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          {course.image ? (
            <img
              src={course.image}
              alt={typeof course.title === 'string' ? course.title : getTranslation(course.title, locale)}
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
              {typeof course.category === 'string' ? course.category : getTranslation(course.category, locale)}
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
            {typeof course.title === 'string' ? course.title : getTranslation(course.title, locale)}
          </CardTitle>
          {course.subtitle && (
            <CardDescription className="line-clamp-2 mt-1">
              {typeof course.subtitle === 'string' ? course.subtitle : getTranslation(course.subtitle, locale)}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            {course.instructor_name && (
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                <span>{typeof course.instructor_name === 'string' ? course.instructor_name : getTranslation(course.instructor_name, locale)}</span>
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
                {typeof course.level === 'string' ? course.level : getTranslation(course.level, locale)}
              </Badge>
              <span className="text-xs">•</span>
              <span className="text-xs">{typeof course.language === 'string' ? course.language : getTranslation(course.language, locale)}</span>
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
          <div className="flex items-center gap-2">
            {onToggleSelection && !enrolled && (
              <Button
                size="sm"
                variant={isSelected ? "default" : "outline"}
                className="rounded-full"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onToggleSelection()
                }}
              >
                {isSelected ? "Remove" : "Select"}
              </Button>
            )}
            {enrolled ? (
              <Badge className="rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                Enrolled
              </Badge>
            ) : (
              <Button size="sm" className="rounded-full" asChild>
                <Link href={`/courses/${course.id}`}>View Details</Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}

function getCategoryIcon(category: string) {
  return BookOpen
}
