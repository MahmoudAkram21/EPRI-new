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
    <div className="h-full overflow-y-auto bg-white dark:bg-slate-800">
      <div className="p-2">
        {curriculum.map((section, sectionIndex) => {
          const isExpanded = expandedSections.includes(section.id)
          const completedLessons = section.lessons.filter((lesson) => isLessonComplete(courseId, lesson.id)).length
          const totalLessons = section.lessons.length
          const sectionProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

          return (
            <div key={section.id} className="mb-1">
              {/* Section Header - Udemy Style */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex-shrink-0 text-slate-500 dark:text-slate-400">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                      {sectionIndex + 1}. {section.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${sectionProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {completedLessons}/{totalLessons}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Lessons List - Udemy Style */}
              {isExpanded && (
                <div className="ml-6 space-y-0.5 border-l-2 border-slate-200 dark:border-slate-700 pl-2">
                  {section.lessons.map((lesson, lessonIndex) => {
                    const isComplete = isLessonComplete(courseId, lesson.id)
                    const isCurrent = lesson.id === currentLessonId
                    const canAccess = canAccessLesson(lesson)

                    const content = (
                      <div
                        className={cn(
                          "flex items-start gap-3 p-2.5 rounded transition-colors relative",
                          isCurrent && "bg-primary/10 dark:bg-primary/20 border-l-2 border-primary -ml-2 pl-4",
                          !isCurrent && canAccess && "hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer",
                          !canAccess && "opacity-60 cursor-not-allowed",
                        )}
                      >
                        {/* Lesson Number and Icon */}
                        <div className="flex-shrink-0 flex items-center gap-2 mt-0.5">
                          {isComplete ? (
                            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          ) : !canAccess ? (
                            <Lock className="h-4 w-4 text-slate-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                {lessonIndex + 1}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Lesson Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium leading-snug",
                              isCurrent && "text-primary font-semibold",
                              !isCurrent && canAccess && "text-slate-900 dark:text-slate-100",
                              !canAccess && "text-slate-500 dark:text-slate-400",
                            )}
                          >
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              {getLessonIcon(lesson.type)}
                              <span className="capitalize">{lesson.type}</span>
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">{lesson.duration}</span>
                            {lesson.isPreview && (
                              <>
                                <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
                                <span className="text-xs text-primary font-medium">Preview</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )

                    if (canAccess) {
                      return (
                        <Link 
                          key={lesson.id} 
                          href={`/courses/${courseId}/lesson/${lesson.id}`}
                          className="block"
                        >
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
