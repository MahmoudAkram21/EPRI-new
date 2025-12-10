"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const PRODUCT_WISHLIST_KEY = "epri_product_wishlist"

export function useProductWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PRODUCT_WISHLIST_KEY)
      if (stored) {
        setWishlist(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading product wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(PRODUCT_WISHLIST_KEY, JSON.stringify(wishlist))
      } catch (error) {
        console.error("Error saving product wishlist:", error)
      }
    }
  }, [wishlist, isLoading])

  const toggleProduct = (productId: string) => {
    setWishlist((prev) => {
      const isInWishlist = prev.includes(productId)
      if (isInWishlist) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }

  const addToWishlist = (productId: string, productName?: string) => {
    if (!wishlist.includes(productId)) {
      toggleProduct(productId)
      toast({
        title: "Added to Wishlist",
        description: productName ? `"${productName}" has been added to your wishlist` : "Product added to wishlist",
      })
    }
  }

  const removeFromWishlist = (productId: string, productName?: string) => {
    if (wishlist.includes(productId)) {
      toggleProduct(productId)
      toast({
        title: "Removed from Wishlist",
        description: productName ? `"${productName}" has been removed from your wishlist` : "Product removed from wishlist",
      })
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId)
  }

  const clearWishlist = () => {
    setWishlist([])
    toast({
      title: "Wishlist Cleared",
      description: "All products have been removed from your wishlist",
    })
  }

  return {
    wishlist,
    isLoading,
    toggleProduct,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  }
}

