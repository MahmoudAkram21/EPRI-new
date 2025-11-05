"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Share2 } from "lucide-react"
import { EnrollButton } from "./enroll-button"
import { WishlistButton } from "./wishlist-button"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import type { Course } from "@/lib/data"

interface CourseSidebarProps {
  course: Course
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  const { toast } = useToast()

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: course.title,
          text: course.subtitle,
          url: window.location.href,
        })
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Course link copied to clipboard!",
      })
    }
  }

  return (
    <Card className="sticky top-4">
      <img
        src={course.image || "/placeholder.svg"}
        alt={course.title}
        className="w-full -mt-6 h-48 object-cover rounded-t-lg"
      />
      <CardContent className="space-y-6">
        {/* Price */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{course.isFree ? "Free" : `$${course.price}`}</div>
          {!course.isFree && <p className="text-sm text-muted-foreground">One-time payment</p>}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <EnrollButton courseId={course.id} courseTitle={course.title} className="w-full" size="lg" />
          <WishlistButton courseId={course.id} courseTitle={course.title} className="w-full" />
        </div>

        <Separator />

        {/* Course Includes */}
        <div>
          <h3 className="font-semibold mb-3">This course includes:</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span>{course.duration} of content</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span>{course.lessons} lectures</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Lifetime access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Certificate of completion</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Access on mobile and desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span>Downloadable resources</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Share */}
        <Button variant="outline" className="w-full bg-transparent" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share this course
        </Button>
      </CardContent>
    </Card>
  )
}
