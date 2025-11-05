"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, PlayCircle, FileText, HelpCircle, Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CurriculumSection, Lesson } from "@/lib/data"
import { useUser } from "@/contexts/user-context"
import Link from "next/link"

interface CurriculumSidebarProps {
  courseId: string
  curriculum: CurriculumSection[]
  currentLessonId: string
  isEnrolled: boolean
}

export function CurriculumSidebar({ courseId, curriculum, currentLessonId, isEnrolled }: CurriculumSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(curriculum.map((section) => section.id))
  const { isLessonComplete } = useUser()

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const getLessonIcon = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <HelpCircle className="h-4 w-4" />
    }
  }

  const canAccessLesson = (lesson: Lesson) => {
    return isEnrolled || lesson.isPreview
  }

  return (
    <div className="h-full overflow-y-auto bg-background border-r">
      <div className="sticky top-0 bg-background border-b p-4 z-10">
        <h2 className="font-semibold text-lg">Course Content</h2>
      </div>

      <div className="p-2">
        {curriculum.map((section) => {
          const isExpanded = expandedSections.includes(section.id)
          const completedLessons = section.lessons.filter((lesson) => isLessonComplete(courseId, lesson.id)).length
          const totalLessons = section.lessons.length

          return (
            <div key={section.id} className="mb-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  <span className="font-medium text-sm">{section.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {completedLessons}/{totalLessons}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-2 mt-1 space-y-1">
                  {section.lessons.map((lesson) => {
                    const isComplete = isLessonComplete(courseId, lesson.id)
                    const isCurrent = lesson.id === currentLessonId
                    const canAccess = canAccessLesson(lesson)

                    const content = (
                      <div
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-colors",
                          isCurrent && "bg-primary/10 border border-primary",
                          !isCurrent && canAccess && "hover:bg-muted cursor-pointer",
                          !canAccess && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="flex-shrink-0 text-muted-foreground">{getLessonIcon(lesson.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-medium truncate", isCurrent && "text-primary")}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {isComplete ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : !canAccess ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : null}
                        </div>
                      </div>
                    )

                    if (canAccess) {
                      return (
                        <Link key={lesson.id} href={`/courses/${courseId}/lesson/${lesson.id}`}>
                          {content}
                        </Link>
                      )
                    }

                    return <div key={lesson.id}>{content}</div>
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
