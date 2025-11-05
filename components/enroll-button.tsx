"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2 } from "lucide-react"

interface EnrollButtonProps {
  courseId: string
  courseTitle: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function EnrollButton({
  courseId,
  courseTitle,
  variant = "default",
  size = "default",
  className,
}: EnrollButtonProps) {
  const { isLoggedIn, isEnrolled, enrollInCourse } = useUser()
  const router = useRouter()
  const { toast } = useToast()

  const enrolled = isEnrolled(courseId)

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    if (!enrolled) {
      enrollInCourse(courseId)
      toast({
        title: "Enrolled Successfully!",
        description: `You've been enrolled in "${courseTitle}"`,
      })
    }
  }

  if (enrolled) {
    return (
      <Button variant="outline" size={size} className={className} disabled>
        <CheckCircle2 className="h-4 w-4 mr-2" />
        Enrolled
      </Button>
    )
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={handleEnroll}>
      Enroll Now
    </Button>
  )
}
