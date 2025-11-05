"use client"

import { useUser } from "@/contexts/user-context"
import { courses } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Heart, Award, TrendingUp, Users, Calendar, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { enrolledCourses, wishlist, user, isLoading } = useUser()
  const router = useRouter()
  
  // Redirect if user is not verified (this is also checked in layout, but adding here for extra safety)
  useEffect(() => {
    if (!isLoading && user && !user.is_verified) {
      router.push("/pending-verification")
    }
  }, [user, isLoading, router])
  
  // Check if user is admin or instructor
  const isAdmin = user?.role === 'ADMIN'
  const isInstructor = user?.role === 'INSTRUCTOR'
  const canManageEvents = isAdmin || isInstructor

  const enrolledCoursesData = courses.filter((course) => enrolledCourses.includes(course.id))
  const wishlistData = courses.filter((course) => wishlist.includes(course.id))

  // Admin/Instructor stats
  const adminStats = [
    {
      title: "Total Users",
      value: "1,250",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Events",
      value: "12",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Event Registrations",
      value: "856",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Revenue",
      value: "$45,230",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  // Regular user stats
  const userStats = [
    {
      title: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Wishlist Items",
      value: wishlist.length,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Certificates Earned",
      value: 0,
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Learning Streak",
      value: "0 days",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const stats = canManageEvents ? adminStats : userStats

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">
            Welcome back, {user?.first_name}!
          </h1>
          <p className="text-muted-foreground">
            {canManageEvents ? 'Manage your events and users' : 'Continue your learning journey'}
          </p>
        </div>
        {canManageEvents && (
          <Badge variant="secondary" className="text-sm">
            {isAdmin ? 'Administrator' : 'Instructor'}
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-full", stat.bgColor)}>
                    <Icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Admin/Instructor Management Section */}
      {canManageEvents && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Event Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and manage events, workshops, and conferences
              </p>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/admin/events">Manage Events</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage user accounts, roles, and permissions
                </p>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/admin/users">View All Users</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Analytics & Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View detailed analytics and generate reports
              </p>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href="/admin/analytics">View Analytics</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/reports">Generate Reports</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Courses */}
      {enrolledCoursesData.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold">Continue Learning</h2>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/my-courses">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCoursesData.slice(0, 3).map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }} />
                    </div>
                    <p className="text-xs text-muted-foreground">0% complete</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {enrolledCoursesData.length === 0 && (
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
      )}

      {/* Wishlist Preview */}
      {wishlistData.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold">Your Wishlist</h2>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/wishlist">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistData.slice(0, 3).map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{course.isFree ? "Free" : `$${course.price}`}</span>
                      <span className="text-sm text-muted-foreground">{course.students.toLocaleString()} students</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
