"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface LessonNavigationProps {
  courseId: string
  previousLessonId?: string
  nextLessonId?: string
}

export function LessonNavigation({ courseId, previousLessonId, nextLessonId }: LessonNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t">
      {previousLessonId ? (
        <Button variant="outline" asChild>
          <Link href={`/courses/${courseId}/lesson/${previousLessonId}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Link>
        </Button>
      ) : (
        <div />
      )}

      {nextLessonId ? (
        <Button asChild>
          <Link href={`/courses/${courseId}/lesson/${nextLessonId}`}>
            Next Lesson
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href={`/courses/${courseId}`}>Back to Course</Link>
        </Button>
      )}
    </div>
  )
}
