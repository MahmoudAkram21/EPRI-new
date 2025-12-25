"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const EQUIPMENT_WISHLIST_KEY = "epri_equipment_wishlist"

export function useEquipmentWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(EQUIPMENT_WISHLIST_KEY)
      if (stored) {
        setWishlist(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading equipment wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(EQUIPMENT_WISHLIST_KEY, JSON.stringify(wishlist))
      } catch (error) {
        console.error("Error saving equipment wishlist:", error)
      }
    }
  }, [wishlist, isLoading])

  const toggleEquipment = (equipmentId: string) => {
    setWishlist((prev) => {
      const isInWishlist = prev.includes(equipmentId)
      if (isInWishlist) {
        return prev.filter((id) => id !== equipmentId)
      } else {
        return [...prev, equipmentId]
      }
    })
  }

  const addToWishlist = (equipmentId: string, equipmentName?: string) => {
    if (!wishlist.includes(equipmentId)) {
      toggleEquipment(equipmentId)
      toast({
        title: "Added to Wishlist",
        description: equipmentName ? `"${equipmentName}" has been added to your wishlist` : "Equipment added to wishlist",
      })
    }
  }

  const removeFromWishlist = (equipmentId: string, equipmentName?: string) => {
    if (wishlist.includes(equipmentId)) {
      toggleEquipment(equipmentId)
      toast({
        title: "Removed from Wishlist",
        description: equipmentName ? `"${equipmentName}" has been removed from your wishlist` : "Equipment removed from wishlist",
      })
    }
  }

  const isInWishlist = (equipmentId: string) => {
    return wishlist.includes(equipmentId)
  }

  const clearWishlist = () => {
    setWishlist([])
    toast({
      title: "Wishlist Cleared",
      description: "All equipment has been removed from your wishlist",
    })
  }

  return {
    wishlist,
    isLoading,
    toggleEquipment,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  }
}


