"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PlayCircle, Clock, FileText, Eye, Lock, CheckCircle2 } from "lucide-react"
import { LessonPlayerModal } from "./lesson-player-modal"

interface DynamicLesson {
  id: string
  title: string
  description?: string
  duration: number
  order_index: number
  is_free: boolean
  is_preview: boolean
}

interface DynamicCurriculumSectionProps {
  lessons: DynamicLesson[]
  courseId: string
  courseTitle: string
  isEnrolled: boolean
  totalDuration: number
}

export function DynamicCurriculumSection({ lessons, courseId, courseTitle, isEnrolled, totalDuration }: DynamicCurriculumSectionProps) {
  // Sort lessons by order_index
  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index)
  
  // Modal state
  const [selectedLesson, setSelectedLesson] = useState<DynamicLesson | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Calculate progress (mock for now)
  const completedLessons = 0
  const progress = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0

  const openLessonModal = (lesson: DynamicLesson) => {
    setSelectedLesson(lesson)
    setIsModalOpen(true)
  }

  const closeLessonModal = () => {
    setSelectedLesson(null)
    setIsModalOpen(false)
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getTotalLessonDuration = () => {
    return lessons.reduce((total, lesson) => total + lesson.duration, 0)
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No lessons available yet</p>
        <p>Course content will be available soon.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar (only show if enrolled) */}
      {isEnrolled && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Progress</h3>
                <span className="text-sm text-muted-foreground">
                  {completedLessons} of {lessons.length} lessons completed
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{progress.toFixed(0)}% complete</span>
                <span>{formatDuration(getTotalLessonDuration())} total</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Info */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold mb-2">Course Curriculum</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <PlayCircle className="h-4 w-4" />
              {lessons.length} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatDuration(getTotalLessonDuration())}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {lessons.filter(l => l.is_preview || l.is_free).length} free previews
            </span>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-3">
        {sortedLessons.map((lesson, index) => {
          const isAccessible = isEnrolled || lesson.is_free || lesson.is_preview
          const isCompleted = false // Mock completion status
          
          return (
            <Card 
              key={lesson.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                isAccessible 
                  ? 'hover:border-primary/50 cursor-pointer' 
                  : 'opacity-75 cursor-not-allowed'
              } ${isCompleted ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' : ''}`}
              onClick={() => isAccessible && openLessonModal(lesson)}
            >
              <CardContent className="px-4">
                <div className="flex items-center gap-4">
                  {/* Lesson Number/Status */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${
                    isCompleted 
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold text-sm">{index + 1}</span>
                    )}
                  </div>

                  {/* Lesson Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold mb-1 transition-colors ${
                          isAccessible ? 'text-foreground hover:text-primary' : 'text-muted-foreground'
                        }`}>
                          {lesson.title}
                        </h3>
                        {lesson.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {lesson.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(lesson.duration)}
                          </span>
                          {lesson.is_preview && (
                            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                              <Eye className="h-3 w-3 mr-1" />
                              Preview
                            </Badge>
                          )}
                          {lesson.is_free && (
                            <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                              Free
                            </Badge>
                          )}
                          {isAccessible && (
                            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                              <PlayCircle className="h-3 w-3 mr-1" />
                              Play
                            </Badge>
                          )}
                          {!isAccessible && (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        {isAccessible ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation()
                              openLessonModal(lesson)
                            }}
                          >
                            <PlayCircle className="h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center">
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Enrollment CTA */}
      {!isEnrolled && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="px-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Unlock Full Course Access</h3>
            <p className="text-muted-foreground mb-4">
              Enroll now to access all {lessons.length} lessons and start your learning journey.
            </p>
            <Button className="px-6">
              Enroll Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lesson Player Modal */}
      <LessonPlayerModal
        isOpen={isModalOpen}
        onClose={closeLessonModal}
        lesson={selectedLesson}
        courseTitle={courseTitle}
        isEnrolled={isEnrolled}
      />
    </div>
  )
}