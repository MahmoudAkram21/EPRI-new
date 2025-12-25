"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEquipmentWishlist } from "@/hooks/use-equipment-wishlist"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { LoginModal } from "@/components/login-modal"

interface EquipmentWishlistButtonProps {
  equipmentId: string
  equipmentName?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showText?: boolean
}

export function EquipmentWishlistButton({
  equipmentId,
  equipmentName,
  variant = "outline",
  size = "lg",
  className,
  showText = false,
}: EquipmentWishlistButtonProps) {
  const { isLoggedIn } = useUser()
  const { isInWishlist, toggleEquipment } = useEquipmentWishlist()
  const { toast } = useToast()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const inWishlist = isInWishlist(equipmentId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    toggleEquipment(equipmentId)
    toast({
      title: inWishlist ? "Removed from Wishlist" : "Added to Wishlist",
      description: inWishlist
        ? equipmentName
          ? `"${equipmentName}" has been removed from your wishlist`
          : "Equipment removed from wishlist"
        : equipmentName
        ? `"${equipmentName}" has been added to your wishlist`
        : "Equipment added to wishlist",
    })
  }

  const handleLoginSuccess = () => {
    // After successful login, add to wishlist
    toggleEquipment(equipmentId)
    toast({
      title: "Added to Wishlist",
      description: equipmentName ? `"${equipmentName}" has been added to your wishlist` : "Equipment added to wishlist",
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
        {showText && (
          <span className="ml-2">{inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
        )}
      </Button>
      <LoginModal 
        open={showLoginModal} 
        onOpenChange={setShowLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </>
  )
}


