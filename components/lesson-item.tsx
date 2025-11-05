"use client"

import { PlayCircle, FileText, HelpCircle, Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Lesson } from "@/lib/data"

interface LessonItemProps {
  lesson: Lesson
  courseId: string
  sectionId: string
  isEnrolled: boolean
}

export function LessonItem({ lesson, courseId, sectionId, isEnrolled }: LessonItemProps) {
  const { isLessonComplete } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const isComplete = isLessonComplete(courseId, lesson.id)
  const isLocked = !isEnrolled && !lesson.isPreview

  const getLessonIcon = () => {
    if (lesson.type === "video") return <PlayCircle className="h-5 w-5" />
    if (lesson.type === "article") return <FileText className="h-5 w-5" />
    if (lesson.type === "quiz") return <HelpCircle className="h-5 w-5" />
    return null
  }

  const handleLessonClick = () => {
    if (isLocked) {
      toast({
        title: "Enrollment Required",
        description: "Please enroll in this course to access all lessons.",
        variant: "destructive",
      })
      return
    }

    router.push(`/courses/${courseId}/lesson/${lesson.id}`)
  }

  return (
    <Button
      variant="ghost"
      className="w-full justify-between h-auto py-3 px-4 hover:bg-muted/50"
      onClick={handleLessonClick}
      disabled={isLocked && !lesson.isPreview}
    >
      <div className="flex items-center gap-3 flex-1 text-left">
        <div className={`flex-shrink-0 ${isLocked ? "text-muted-foreground" : "text-primary"}`}>
          {isComplete ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : getLessonIcon()}
        </div>
        <div className="flex-1">
          <p className={`font-medium ${isLocked ? "text-muted-foreground" : ""}`}>
            {lesson.title}
            {lesson.isPreview && <span className="ml-2 text-xs text-primary">(Preview)</span>}
          </p>
          <p className="text-xs text-muted-foreground capitalize">{lesson.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">{lesson.duration}</span>
        {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
      </div>
    </Button>
  )
}
