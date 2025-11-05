"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DynamicCurriculumSection } from "./dynamic-curriculum-section"
import { ReviewList } from "./review-list"
import { InstructorProfile } from "./instructor-profile"
import { CheckCircle2, Globe, MapPin, Monitor, Users2, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DynamicCourse {
  id: string
  title: string
  subtitle?: string
  description: string
  category: string
  price: number
  is_free: boolean
  duration_hours: number
  duration_weeks: number
  level: string
  language: string
  max_students: number
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
  instructor_name?: string
  lessons?: Array<{
    id: string
    title: string
    description?: string
    duration: number
    order_index: number
    is_free: boolean
    is_preview: boolean
  }>
}

interface DynamicInstructor {
  id: string
  name: string
  bio: string
  picture: string
  expertise: string
  courses: number
}

interface DynamicCourseTabsProps {
  course: DynamicCourse
  instructor: DynamicInstructor | undefined
  isEnrolled: boolean
}

export function DynamicCourseTabs({ course, instructor, isEnrolled }: DynamicCourseTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="curriculum">
          Curriculum
          {course.lessons && course.lessons.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {course.lessons.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="instructor">Instructor</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-8">
        {/* About */}
        <div>
          <h2 className="font-serif text-3xl font-bold mb-4">About This Course</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed text-lg">
              {course.description}
            </p>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Course Information */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Course Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Level</span>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Duration</span>
                <span>{course.duration_hours}h ({course.duration_weeks} weeks)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Language</span>
                <span>{course.language}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Max Students</span>
                <span>{course.max_students}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Price</span>
                <span className="font-semibold">
                  {course.is_free ? 'Free' : `$${course.price}`}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">Delivery Details</h3>
            <div className="space-y-3">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {course.delivery_type === 'ONLINE' && <Monitor className="h-4 w-4 text-blue-500" />}
                  {course.delivery_type === 'OFFLINE' && <MapPin className="h-4 w-4 text-green-500" />}
                  {course.delivery_type === 'HYBRID' && <Users2 className="h-4 w-4 text-purple-500" />}
                  <span className="font-medium">{course.delivery_type}</span>
                </div>
                
                {course.delivery_type === 'ONLINE' && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      <span>Platform: {course.platform || 'Online Learning Platform'}</span>
                    </div>
                  </div>
                )}
                
                {course.delivery_type === 'OFFLINE' && course.meeting_location && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{course.meeting_location}</span>
                    </div>
                    {course.room_number && (
                      <div>Room: {course.room_number}</div>
                    )}
                    {course.building && (
                      <div>Building: {course.building}</div>
                    )}
                  </div>
                )}
                
                {course.delivery_type === 'HYBRID' && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-3 w-3" />
                      <span>Online: {course.platform || 'Learning Platform'}</span>
                    </div>
                    {course.meeting_location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>On-campus: {course.meeting_location}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {course.schedule_info && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{course.schedule_info}</span>
                  </div>
                )}
                
                {course.start_date && course.end_date && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(course.start_date).toLocaleDateString()} - {new Date(course.end_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Learn */}
        {course.objectives && course.objectives.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-bold mb-4">What You'll Learn</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {course.objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        {course.requirements && course.requirements.length > 0 && (
          <div>
            <h2 className="font-serif text-3xl font-bold mb-4">Requirements</h2>
            <div className="space-y-2">
              {course.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <span className="text-primary font-semibold mt-0.5">•</span>
                  <span className="text-muted-foreground">{requirement}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="curriculum">
        <DynamicCurriculumSection
          lessons={course.lessons || []}
          courseId={course.id}
          courseTitle={course.title}
          isEnrolled={isEnrolled}
          totalDuration={course.duration_hours}
        />
      </TabsContent>

      <TabsContent value="instructor">
        <InstructorProfile instructor={instructor} />
      </TabsContent>

      <TabsContent value="reviews">
        <ReviewList courseId={course.id} isEnrolled={isEnrolled} />
      </TabsContent>
    </Tabs>
  )
}