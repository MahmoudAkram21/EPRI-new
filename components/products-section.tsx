"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { useLocale } from "next-intl"
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api"
import { useProductWishlist } from "@/hooks/use-product-wishlist"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"
import { LoginModal } from "@/components/login-modal"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

type TranslationObject = { en: string; ar: string } | string

interface Product {
  id: string
  name: string
  slug?: string
  description?: string
  short_description?: string
  image?: string | null
  images?: string[]
  centerName?: string
  centerSlug?: string
  centerType?: string
  centerImage?: string | null
  price?: number | null
  original_price?: number | null
  rating?: number
  reviewCount?: number
  sizes?: string[] | any[]
  labels?: string[]
  badge?: string
  is_featured?: boolean
  service_center?: {
    id: string
    name: string
    slug: string
    type: string
    image?: string | null
  }
}

// Helper function to extract translation value
function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || ''
  }
  return ''
}

const categories = [
  { id: "all", label: "Featured" },
  { id: "centers", label: "Centers" },
  { id: "units", label: "Units" },
  { id: "tico", label: "Tico" },
  { id: "e-club", label: "E-Club" },
]

export function ProductsSection() {
  const locale = useLocale()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Fetch products directly from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.getProducts({
          published: true,
          limit: 50 // Fetch more products to have enough for filtering
        })
        
        console.log("Products API response:", response)
        
        const transformedProducts: Product[] = (response.products || []).map((product: any) => {
          const serviceCenter = product.service_center || {}
          const originalPrice = product.original_price 
            ? (typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price)
            : product.price 
              ? (typeof product.price === 'string' ? parseFloat(product.price) : product.price) * 1.3
              : undefined
          
          const currentPrice = product.price 
            ? (typeof product.price === 'string' ? parseFloat(product.price) : product.price)
            : undefined
          
          const discount = currentPrice && originalPrice 
            ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
            : undefined
          
          return {
            id: product.id,
            name: getTranslation(product.name, locale),
            slug: product.slug,
            description: product.description ? getTranslation(product.description, locale) : (product.short_description ? getTranslation(product.short_description, locale) : undefined),
            short_description: product.short_description ? getTranslation(product.short_description, locale) : undefined,
            image: product.image,
            images: Array.isArray(product.images) ? product.images : [],
            centerName: getTranslation(serviceCenter.name, locale) || "",
            centerSlug: serviceCenter.slug || "",
            centerType: serviceCenter.type || "center",
            centerImage: serviceCenter.image || null,
            price: currentPrice,
            original_price: originalPrice,
            rating: product.rating_average || 4.8,
            reviewCount: product.review_count || Math.floor(Math.random() * 2000) + 100,
            sizes: Array.isArray(product.sizes) ? product.sizes : [],
            labels: discount ? [`Save ${discount}%`] : [],
            badge: product.is_featured ? "Featured" : serviceCenter.type === "unit" ? "New" : undefined,
            is_featured: product.is_featured || false,
            service_center: {
              ...serviceCenter,
              name: getTranslation(serviceCenter.name, locale) || ""
            }
          }
        })
        
        console.log("Transformed products:", transformedProducts)
        setProducts(transformedProducts)
      } catch (error) {
        console.error("Failed to load products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [locale]) // Re-fetch when locale changes

  // Filter products by category
  const filteredProducts = useMemo(() => {
    let filtered: Product[] = []
    
    if (activeCategory === "all") {
      // Show featured products, or all products if none are featured
      const featuredProducts = products.filter((p: Product) => p.is_featured)
      filtered = featuredProducts.length > 0 ? featuredProducts : products
    } else if (activeCategory === "centers") {
      filtered = products.filter((p: Product) => p.centerType === "center")
    } else if (activeCategory === "units") {
      filtered = products.filter((p: Product) => p.centerType === "unit")
    } else if (activeCategory === "tico") {
      filtered = products.filter((p: Product) => 
        p.centerName?.toLowerCase().includes("tico") ||
        p.name?.toLowerCase().includes("tico")
      )
    } else if (activeCategory === "e-club") {
      filtered = products.filter((p: Product) => 
        p.centerName?.toLowerCase().includes("e-club") ||
        p.centerName?.toLowerCase().includes("eclub") ||
        p.name?.toLowerCase().includes("e-club") ||
        p.name?.toLowerCase().includes("eclub")
      )
    }
    
    return filtered
  }, [products, activeCategory])

  // Reset carousel when category changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
      emblaApi.scrollTo(0)
    }
  }, [activeCategory, emblaApi])

  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="relative space-y-8">
      {/* Category Navigation */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              activeCategory === category.id
                ? "bg-primary text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Products Slider */}
      {filteredProducts.length > 0 ? (
        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-6 py-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_25%] pl-4"
                >
                  <ProductCardWithWishlist product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {filteredProducts.length > 4 && (
            <>
              <button
                onClick={scrollPrev}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors"
                aria-label="Previous products"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={scrollNext}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-background border shadow-md hover:bg-primary hover:text-white cursor-pointer transition-colors"
                aria-label="Next products"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {products.length === 0 
              ? "No products available at the moment." 
              : `No products found in the "${categories.find(c => c.id === activeCategory)?.label || activeCategory}" category.`}
          </p>
        </div>
      )}
    </div>
  )
}

function ProductCardWithWishlist({ product }: { product: Product }) {
  const { isLoggedIn } = useUser()
  const { isInWishlist, toggleProduct } = useProductWishlist()
  const { toast } = useToast()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const inWishlist = isInWishlist(product.id)

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    
    toggleProduct(product.id)
  }

  const handleLoginSuccess = () => {
    toggleProduct(product.id)
    toast({
      title: "Added to Wishlist",
      description: `"${product.name}" has been added to your wishlist`,
    })
  }

  const productImage = product.image || (product.images && product.images.length > 0 ? product.images[0] : null) || product.centerImage || "/placeholder.svg"
  const productLink = product.slug 
    ? `/products/${product.slug}` 
    : product.centerSlug 
      ? `/service-centers/${product.centerSlug}#products`
      : "#"

  return (
    <Link href={productLink}>
      <div className="group relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Labels/Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.labels && product.labels.length > 0 && (
              <Badge className="bg-orange-500 text-white text-xs font-semibold px-2 py-1">
                {product.labels[0]}
              </Badge>
            )}
            {product.badge && (
              <Badge 
                className={cn(
                  "text-white text-xs font-semibold px-2 py-1",
                  product.badge === "Featured" ? "bg-slate-700" :
                  product.badge === "New" ? "bg-yellow-500" :
                  product.badge === "Most awarded" ? "bg-slate-700" :
                  "bg-green-500"
                )}
              >
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Heart Button */}
          <button
            onClick={handleHeartClick}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all shadow-sm hover:shadow-md group/heart"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                inWishlist
                  ? "fill-red-500 text-red-500"
                  : "text-slate-600 group-hover/heart:text-red-500"
              }`}
            />
          </button>
          <LoginModal 
            open={showLoginModal} 
            onOpenChange={setShowLoginModal}
            onSuccess={handleLoginSuccess}
          />
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating!) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "fill-slate-300 text-slate-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {product.rating} ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Details */}
          {product.sizes && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {product.sizes[0]}, {product.sizes.length} Sizes
            </p>
          )}

          {/* Pricing */}
          <div className="space-y-1">
            {product.original_price && product.price && (
              <div className="flex items-center gap-2">
                <span className="text-slate-400 line-through text-sm">
                  {product.original_price.toLocaleString()} EGP
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {product.price ? `${product.price.toLocaleString()} EGP` : "Contact for pricing"}
              </span>
            </div>
            {product.original_price && product.price && (
              <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                Save {(product.original_price - product.price).toLocaleString()} EGP
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

