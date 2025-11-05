"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { courses } from "@/lib/data"
import { useUser } from "@/contexts/user-context"
import { CurriculumSidebar } from "@/components/lesson-player/curriculum-sidebar"
import { VideoPlayer } from "@/components/lesson-player/video-player"
import { ArticleContent } from "@/components/lesson-player/article-content"
import { QuizPlayer } from "@/components/lesson-player/quiz-player"
import { NotesPanel } from "@/components/lesson-player/notes-panel"
import { ResourcesList } from "@/components/lesson-player/resources-list"
import { LessonNavigation } from "@/components/lesson-player/lesson-navigation"
import { ProgressBar } from "@/components/lesson-player/progress-bar"
import { LessonOverview } from "@/components/lesson-player/lesson-overview"
import { QADiscussion } from "@/components/lesson-player/qa-discussion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CheckCircle2, Menu, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function LessonPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string
  const { isLoggedIn, isEnrolled, markLessonComplete, isLessonComplete, getCourseProgress } = useUser()
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const course = courses.find((c) => c.id === courseId)
  const enrolled = isEnrolled(courseId)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/courses/${courseId}/lesson/${lessonId}`)
    }
  }, [isLoggedIn, courseId, lessonId, router])

  if (!course || !course.curriculum) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found</p>
      </div>
    )
  }

  // Find current lesson
  let currentLesson = null
  let currentSection = null
  let lessonIndex = -1
  const allLessons: any[] = []

  for (const section of course.curriculum) {
    for (const lesson of section.lessons) {
      allLessons.push({ ...lesson, sectionId: section.id })
      if (lesson.id === lessonId) {
        currentLesson = lesson
        currentSection = section
        lessonIndex = allLessons.length - 1
      }
    }
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Lesson not found</p>
      </div>
    )
  }

  // Check if user can access this lesson
  const canAccess = enrolled || currentLesson.isPreview

  if (!canAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Enrollment Required</h2>
          <p className="text-muted-foreground mb-6">You need to enroll in this course to access this lesson.</p>
          <Button onClick={() => router.push(`/courses/${courseId}`)}>Go to Course Page</Button>
        </Card>
      </div>
    )
  }

  const previousLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null
  const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null

  const totalLessons = allLessons.length
  const progress = getCourseProgress(courseId, totalLessons)
  const isComplete = isLessonComplete(courseId, lessonId)

  const handleMarkComplete = () => {
    markLessonComplete(courseId, lessonId)
    toast({
      title: "Lesson completed!",
      description: "Your progress has been saved.",
    })
  }

  // Mock lesson content (in real app, this would come from API)
  const getLessonContent = () => {
    if (currentLesson.type === "video") {
      return {
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description:
          "In this comprehensive video lesson, you'll learn the fundamental concepts and practical applications. We'll explore real-world examples and best practices to help you master this topic.",
        objectives: [
          "Understand the core principles and theoretical foundations",
          "Apply concepts to real-world scenarios and use cases",
          "Identify common pitfalls and learn how to avoid them",
          "Master advanced techniques for optimal results",
        ],
        resources: [
          { name: "Lesson Slides", url: "#", type: "pdf" as const },
          { name: "Code Examples", url: "#", type: "document" as const },
        ],
      }
    } else if (currentLesson.type === "article") {
      return {
        articleContent: `
          <h2>Understanding ${currentLesson.title}</h2>
          <p>This is a comprehensive guide to ${currentLesson.title}. In this lesson, we'll explore the key concepts and practical applications.</p>
          <h3>Key Concepts</h3>
          <ul>
            <li>Fundamental principles and theory</li>
            <li>Real-world applications and use cases</li>
            <li>Best practices and common pitfalls</li>
            <li>Advanced techniques and optimization</li>
          </ul>
          <h3>Practical Examples</h3>
          <p>Let's dive into some practical examples to solidify your understanding...</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        `,
        description: "A detailed article covering the essential concepts and practical applications of this topic.",
        objectives: [
          "Grasp the fundamental concepts through detailed explanations",
          "Review practical examples and case studies",
          "Learn best practices from industry experts",
        ],
        resources: [{ name: "Reading Material", url: "#", type: "pdf" as const }],
      }
    } else {
      return {
        description: "Test your knowledge with this interactive quiz covering the key concepts from this section.",
        objectives: ["Assess your understanding of the material", "Identify areas for further review"],
        quiz: {
          questions: [
            {
              id: "q1",
              question: "What is the main concept covered in this section?",
              type: "multiple-choice" as const,
              options: ["Basic fundamentals", "Advanced techniques", "Practical applications", "All of the above"],
              correctAnswer: 3,
              explanation:
                "This section covers all aspects: fundamentals, advanced techniques, and practical applications.",
            },
            {
              id: "q2",
              question: "Is hands-on practice important for mastering this topic?",
              type: "true-false" as const,
              options: ["True", "False"],
              correctAnswer: 0,
              explanation: "Hands-on practice is essential for truly understanding and mastering any technical topic.",
            },
          ],
        },
      }
    }
  }

  const lessonContent = getLessonContent()

  return (
    <div className="min-h-screen flex flex-col">
      <ProgressBar progress={progress} courseTitle={course.title} />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (30% width) */}
        <aside className="hidden lg:block lg:w-[30%] flex-shrink-0 border-r">
          <CurriculumSidebar
            courseId={courseId}
            curriculum={course.curriculum}
            currentLessonId={lessonId}
            isEnrolled={enrolled}
          />
        </aside>

        {/* Tablet/Mobile Drawer */}
        <div className="lg:hidden">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="fixed top-20 left-4 z-40 bg-background shadow-lg">
                <Menu className="h-4 w-4 mr-2" />
                Curriculum
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <AnimatePresence>
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="h-full"
                >
                  <CurriculumSidebar
                    courseId={courseId}
                    curriculum={course.curriculum}
                    currentLessonId={lessonId}
                    isEnrolled={enrolled}
                  />
                </motion.div>
              </AnimatePresence>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main content (70% width on desktop) */}
        <main className="flex-1 overflow-y-auto bg-muted/30 lg:w-[70%]">
          <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl">
            {/* Video Player with 16:9 aspect ratio */}
            <div className="mb-6">
              {currentLesson.type === "video" && lessonContent.videoUrl && (
                <VideoPlayer url={lessonContent.videoUrl} onEnded={() => !isComplete && handleMarkComplete()} />
              )}

              {currentLesson.type === "article" && lessonContent.articleContent && (
                <ArticleContent content={lessonContent.articleContent} />
              )}

              {currentLesson.type === "quiz" && lessonContent.quiz && (
                <QuizPlayer quiz={lessonContent.quiz} onComplete={handleMarkComplete} />
              )}
            </div>

            {/* Lesson Title and Meta */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">{currentLesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{currentLesson.type.charAt(0).toUpperCase() + currentLesson.type.slice(1)}</span>
                <span>•</span>
                <span>{currentLesson.duration}</span>
                {isComplete && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Completed
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Mark complete button */}
            {currentLesson.type !== "quiz" && !isComplete && (
              <div className="mb-6">
                <Button onClick={handleMarkComplete} size="lg" className="w-full sm:w-auto">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Mark as Complete
                </Button>
              </div>
            )}

            <Tabs defaultValue="overview" className="mb-20 lg:mb-8">
              <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                <TabsTrigger value="overview" className="flex-shrink-0">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex-shrink-0">
                  Resources
                </TabsTrigger>
                <TabsTrigger value="qa" className="flex-shrink-0">
                  Q&A
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex-shrink-0">
                  Notes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <LessonOverview
                  title={currentLesson.title}
                  description={lessonContent.description || ""}
                  duration={currentLesson.duration}
                  objectives={lessonContent.objectives}
                />
              </TabsContent>
              <TabsContent value="resources" className="mt-6">
                <ResourcesList resources={lessonContent.resources || []} />
              </TabsContent>
              <TabsContent value="qa" className="mt-6">
                <QADiscussion courseId={courseId} lessonId={lessonId} />
              </TabsContent>
              <TabsContent value="notes" className="mt-6">
                <NotesPanel courseId={courseId} lessonId={lessonId} />
              </TabsContent>
            </Tabs>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <LessonNavigation
                courseId={courseId}
                previousLessonId={previousLesson?.id}
                nextLessonId={nextLesson?.id}
              />
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-30">
        <div className="flex items-center justify-between gap-4">
          {previousLesson ? (
            <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
              <Link href={`/courses/${courseId}/lesson/${previousLesson.id}`}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Link>
            </Button>
          ) : (
            <div className="flex-1" />
          )}

          {nextLesson ? (
            <Button size="sm" asChild className="flex-1">
              <Link href={`/courses/${courseId}/lesson/${nextLesson.id}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          ) : (
            <Button size="sm" asChild className="flex-1">
              <Link href={`/courses/${courseId}`}>Finish</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
