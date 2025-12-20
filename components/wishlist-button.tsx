"use client"

import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoginModal } from "@/components/login-modal"

interface WishlistButtonProps {
  courseId: string
  courseTitle: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export function WishlistButton({
  courseId,
  courseTitle,
  variant = "outline",
  size = "default",
  className,
  showText = true,
}: WishlistButtonProps) {
  const { isLoggedIn, isInWishlist, toggleWishlist, isEnrolled } = useUser()
  const { toast } = useToast()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const inWishlist = isInWishlist(courseId)
  const enrolled = isEnrolled(courseId)

  // Don't show wishlist button if already enrolled
  if (enrolled) {
    return null
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    toggleWishlist(courseId)
    toast({
      title: inWishlist ? "Removed from Wishlist" : "Added to Wishlist",
      description: inWishlist
        ? `"${courseTitle}" has been removed from your wishlist`
        : `"${courseTitle}" has been added to your wishlist`,
    })
  }

  const handleLoginSuccess = () => {
    // After successful login, add to wishlist
    toggleWishlist(courseId)
    toast({
      title: "Added to Wishlist",
      description: `"${courseTitle}" has been added to your wishlist`,
    })
  }

  return (
    <>
      <Button variant={variant} size={size} className={cn("bg-transparent", className)} onClick={handleToggleWishlist}>
        <Heart className={cn("h-4 w-4", showText && "mr-2", inWishlist && "fill-red-500 text-red-500")} />
        {showText && (inWishlist ? "Remove from Wishlist" : "Add to Wishlist")}
      </Button>
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </>
  )
}
