"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LessonItem } from "./lesson-item"
import { Progress } from "@/components/ui/progress"
import { useUser } from "@/contexts/user-context"
import type { Course } from "@/lib/data"

interface CurriculumSectionProps {
  course: Course
  isEnrolled: boolean
}

export function CurriculumSection({ course, isEnrolled }: CurriculumSectionProps) {
  const { getCourseProgress } = useUser()

  if (!course.curriculum || course.curriculum.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Curriculum information coming soon.</p>
      </div>
    )
  }

  // Calculate total lessons
  const totalLessons = course.curriculum.reduce((acc, section) => acc + section.lessons.length, 0)
  const progress = getCourseProgress(course.id, totalLessons)
  const completedLessons = Math.round((progress / 100) * totalLessons)

  return (
    <div className="space-y-6">
      {/* Progress Bar (only show if enrolled) */}
      {isEnrolled && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Your Progress</span>
                <span className="text-muted-foreground">
                  {completedLessons} of {totalLessons} lessons completed
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">{progress}% complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Curriculum Sections */}
      <div>
        <h2 className="font-serif text-3xl font-bold mb-4">Course Curriculum</h2>
        <p className="text-muted-foreground mb-6">
          {totalLessons} lessons • {course.duration}
        </p>

        <Accordion type="multiple" defaultValue={[course.curriculum[0]?.id]} className="space-y-4">
          {course.curriculum.map((section, sectionIndex) => (
            <AccordionItem key={section.id} value={section.id} className="border rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-4 text-left">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex-shrink-0">
                    {sectionIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.lessons.length} lessons</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-2 mt-4">
                  {section.lessons.map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      courseId={course.id}
                      isEnrolled={isEnrolled}
                      sectionId={section.id}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
