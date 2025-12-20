"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProductWishlist } from "@/hooks/use-product-wishlist"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { LoginModal } from "@/components/login-modal"

interface ProductWishlistButtonProps {
  productId: string
  productName?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ProductWishlistButton({
  productId,
  productName,
  variant = "outline",
  size = "lg",
  className
}: ProductWishlistButtonProps) {
  const { isLoggedIn } = useUser()
  const { isInWishlist, toggleProduct } = useProductWishlist()
  const { toast } = useToast()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const inWishlist = isInWishlist(productId)

  const handleClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    toggleProduct(productId)
  }

  const handleLoginSuccess = () => {
    // After successful login, add to wishlist
    toggleProduct(productId)
    toast({
      title: "Added to Wishlist",
      description: productName ? `"${productName}" has been added to your wishlist` : "Product added to wishlist",
    })
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={cn(
          "rounded-full transition-all",
          inWishlist && "border-red-500 bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900",
          className
        )}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all",
            inWishlist ? "fill-red-500 text-red-500" : "fill-none"
          )}
        />
      </Button>
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </>
  )
}

