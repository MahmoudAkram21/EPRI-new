"use client"

import { useUser } from "@/contexts/user-context"
import { courses } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Clock, Star } from "lucide-react"

export default function MyCoursesPage() {
  const { enrolledCourses } = useUser()

  const enrolledCoursesData = courses.filter((course) => enrolledCourses.includes(course.id))

  if (enrolledCoursesData.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold text-xl mb-2">No Enrolled Courses Yet</h3>
          <p className="text-muted-foreground mb-6">Start your learning journey by enrolling in a course</p>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          You are enrolled in {enrolledCoursesData.length} {enrolledCoursesData.length === 1 ? "course" : "courses"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCoursesData.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow flex flex-col">
            <Link href={`/courses/${course.id}`}>
              <img
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </Link>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <Link href={`/courses/${course.id}`}>
                <CardTitle className="text-xl hover:text-primary transition-colors">{course.title}</CardTitle>
              </Link>
              <p className="text-sm text-muted-foreground">{course.subtitle}</p>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.lessons} lessons
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {course.rating}
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">0%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>

              <Button className="w-full mt-4" asChild>
                <Link href={`/courses/${course.id}`}>Continue Learning</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
