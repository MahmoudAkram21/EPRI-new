"use client"

import { useUser } from "@/contexts/user-context"
import { courses } from "@/lib/data"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, BookOpen, Star, Trash2 } from "lucide-react"
import { EnrollButton } from "@/components/enroll-button"
import { useToast } from "@/hooks/use-toast"

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useUser()
  const { toast } = useToast()

  const wishlistData = courses.filter((course) => wishlist.includes(course.id))

  const handleRemove = (courseId: string, courseTitle: string) => {
    toggleWishlist(courseId)
    toast({
      title: "Removed from Wishlist",
      description: `"${courseTitle}" has been removed from your wishlist`,
    })
  }

  if (wishlistData.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold text-xl mb-2">Your Wishlist is Empty</h3>
          <p className="text-muted-foreground mb-6">Add courses to your wishlist to save them for later</p>
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
          You have {wishlistData.length} {wishlistData.length === 1 ? "course" : "courses"} in your wishlist
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistData.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow flex flex-col">
            <Link href={`/courses/${course.id}`}>
              <img
                src={course.image || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </Link>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(course.id, course.title)}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              <Link href={`/courses/${course.id}`}>
                <CardTitle className="text-xl hover:text-primary transition-colors">{course.title}</CardTitle>
              </Link>
              <p className="text-sm text-muted-foreground">{course.subtitle}</p>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.lessons} lessons
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">By {course.instructor}</div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="flex items-center justify-between w-full">
                <div className="font-semibold text-lg">{course.isFree ? "Free" : `$${course.price}`}</div>
                <div className="text-sm text-muted-foreground">{course.students.toLocaleString()} students</div>
              </div>
              <EnrollButton courseId={course.id} courseTitle={course.title} className="w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
