"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProductWishlist } from "@/hooks/use-product-wishlist"
import { cn } from "@/lib/utils"

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
  const { isInWishlist, toggleProduct } = useProductWishlist()
  const inWishlist = isInWishlist(productId)

  const handleClick = () => {
    toggleProduct(productId)
  }

  return (
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
  )
}

