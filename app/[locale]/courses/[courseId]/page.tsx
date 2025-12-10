"use client"

import { useState, useEffect, use } from "react"
import { useLocale } from "next-intl"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { BookOpen, Clock, Users, Star, ArrowLeft, Monitor, MapPin, Users2, Calendar, Globe, Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { DynamicCourseTabs } from "@/components/dynamic-course-tabs"
import { CourseSidebar } from "@/components/course-sidebar"
import { apiClient } from "@/lib/api"

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
  room_number?: string
  building?: string
  address?: string
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
  lessons?: Array<{
    id: string
    title: string | TranslationObject
    description?: string | TranslationObject
    duration: number
    order_index: number
    is_free: boolean
    is_preview: boolean
  }>
}

export default function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const locale = useLocale()
  const resolvedParams = use(params)
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getCourse(resolvedParams.courseId)
        const courseData = response.course
        
        // Transform translation objects to strings
        const transformedCourse: Course = {
          ...courseData,
          title: getTranslation(courseData.title, locale),
          subtitle: courseData.subtitle ? getTranslation(courseData.subtitle, locale) : undefined,
          description: getTranslation(courseData.description, locale),
          category: getTranslation(courseData.category, locale),
          level: getTranslation(courseData.level, locale),
          language: getTranslation(courseData.language, locale),
          instructor_name: courseData.instructor_name ? getTranslation(courseData.instructor_name, locale) : undefined,
          meeting_location: courseData.meeting_location ? getTranslation(courseData.meeting_location, locale) : undefined,
          schedule_info: courseData.schedule_info ? getTranslation(courseData.schedule_info, locale) : undefined,
          // Transform lessons if they exist
          lessons: courseData.lessons?.map((lesson: any) => ({
            ...lesson,
            title: getTranslation(lesson.title, locale),
            description: lesson.description ? getTranslation(lesson.description, locale) : undefined,
          })) || courseData.lessons,
        }
        
        setCourse(transformedCourse)
      } catch (err) {
        console.error('Failed to fetch course:', err)
        setError('Failed to load course. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (resolvedParams.courseId) {
      fetchCourse()
    }
  }, [resolvedParams.courseId, locale])

  if (loading) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-4">
          <Skeleton className="h-6 w-32" />
        </div>
        
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
          <div className="relative z-10 py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-16 w-3/4 mb-4" />
                <Skeleton className="h-8 w-full mb-8" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-12 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </section>
        
        <Section>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </Section>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Course</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>
              <Loader2 className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button variant="outline" asChild>
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!course) {
    notFound()
  }

  return (
    <PageContainer>

      {/* Breadcrumb - Enhanced Design */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 group px-3 py-2 rounded-lg hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Courses</span>
          </Link>
        </div>
      </div>

      {/* Hero Section with Background */}
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url(${course.image || '/modern-university-library-students-studying.jpg'})`,
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
        
        <div className="relative z-10">
          <div className="max-w-5xl">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                  {course.category}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white hover:border-white/50 transition-colors">
                  {course.level}
                </Badge>
                <Badge 
                  className={`${
                    course.delivery_type === 'ONLINE' ? 'bg-blue-500/80 hover:bg-blue-500/90' :
                    course.delivery_type === 'OFFLINE' ? 'bg-green-500/80 hover:bg-green-500/90' :
                    'bg-purple-500/80 hover:bg-purple-500/90'
                  } text-white border-none transition-colors`}
                >
                  {course.delivery_type === 'ONLINE' && <Monitor className="h-3 w-3 mr-1" />}
                  {course.delivery_type === 'OFFLINE' && <MapPin className="h-3 w-3 mr-1" />}
                  {course.delivery_type === 'HYBRID' && <Users2 className="h-3 w-3 mr-1" />}
                  {course.delivery_type}
                </Badge>
                {course.is_featured && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none hover:from-yellow-500 hover:to-orange-500 transition-all">
                    ⭐ Featured Course
                  </Badge>
                )}
                {course.is_free && (
                  <Badge className="bg-green-500/80 text-white border-none hover:bg-green-500/90 transition-colors">
                    🆓 Free
                  </Badge>
                )}
              </div>
              
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
                {course.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed font-light">
                {course.subtitle || course.description}
              </p>

              {/* Course Stats - Enhanced with animations */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="p-1.5 bg-yellow-400/20 rounded-lg group-hover:bg-yellow-400/30 transition-colors">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div>
                    <div className="font-semibold">{course.rating_average.toFixed(1)}</div>
                    <div className="text-xs text-white/70">Rating ({course.rating_count})</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="p-1.5 bg-blue-400/20 rounded-lg group-hover:bg-blue-400/30 transition-colors">
                    <Users className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <div className="font-semibold">{course.enrollment_count.toLocaleString()}</div>
                    <div className="text-xs text-white/70">Students</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="p-1.5 bg-purple-400/20 rounded-lg group-hover:bg-purple-400/30 transition-colors">
                    <BookOpen className="h-4 w-4 text-purple-300" />
                  </div>
                  <div>
                    <div className="font-semibold">{course.lessons?.length || 0}</div>
                    <div className="text-xs text-white/70">Lessons</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                  <div className="p-1.5 bg-cyan-400/20 rounded-lg group-hover:bg-cyan-400/30 transition-colors">
                    <Clock className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div>
                    <div className="font-semibold">{course.duration_hours}h</div>
                    <div className="text-xs text-white/70">Duration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Course Content */}
      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <DynamicCourseTabs 
              course={course}
              instructor={{
                id: 'instructor-1',
                name: course.instructor_name || 'EPRI Faculty',
                bio: 'Experienced instructor at EPRI with expertise in petroleum research and engineering.',
                picture: '/placeholder.svg',
                expertise: course.category,
                courses: 1
              }}
              isEnrolled={false} 
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CourseSidebar 
                course={{
                  ...course,
                  // Map new properties to old format for compatibility
                  isFree: course.is_free,
                  instructor: course.instructor_name || 'EPRI Faculty',
                  instructorId: 'instructor-1',
                  duration: `${course.duration_hours}h`,
                  lessons: course.lessons?.length || 0,
                  price: course.price,
                  students: course.enrollment_count,
                  rating: course.rating_average,
                  deliveryType: course.delivery_type === 'ONLINE' ? 'Online' : 
                             course.delivery_type === 'OFFLINE' ? 'Offline' : 'Hybrid'
                } as any} 
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Call to Action Section */}
      <Section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ready to Start Learning?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students already enrolled in our courses and advance your career with expert-led instruction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {course.is_free ? 'Enroll for Free' : `Enroll Now - $${course.price}`}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg font-semibold border-2 hover:bg-gray-700 hover:border-gray-700 transition-all duration-300"
            >
              Add to Wishlist
            </Button>
          </div>
        </div>
      </Section>

    </PageContainer>
  )
}
