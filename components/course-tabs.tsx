"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CurriculumSection } from "./curriculum-section"
import { ReviewList } from "./review-list"
import { InstructorProfile } from "./instructor-profile"
import { CheckCircle2 } from "lucide-react"
import type { Course, Instructor } from "@/lib/data"

interface CourseTabsProps {
  course: Course
  instructor: Instructor | undefined
  isEnrolled: boolean
}

export function CourseTabs({ course, instructor, isEnrolled }: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
        <TabsTrigger value="instructor">Instructor</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-8">
        {/* About */}
        <div>
          <h2 className="font-serif text-3xl font-bold mb-4">About This Course</h2>
          <p className="text-muted-foreground leading-relaxed">{course.description}</p>
        </div>

        {/* What You'll Learn */}
        <div>
          <h2 className="font-serif text-3xl font-bold mb-4">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {course.objectives?.map((objective, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{objective}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="font-serif text-3xl font-bold mb-4">Requirements</h2>
          <ul className="space-y-2 text-muted-foreground">
            {course.requirements?.map((requirement, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5">•</span>
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="curriculum">
        <CurriculumSection course={course} isEnrolled={isEnrolled} />
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
