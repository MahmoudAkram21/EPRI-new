"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api"
import type { ServiceCenter } from "@/types/service-center"

interface Product {
  id: string
  name: string
  description?: string
  centerName: string
  centerSlug: string
  centerType: string
  centerImage?: string | null
  price?: number
  originalPrice?: number
  rating?: number
  reviewCount?: number
  sizes?: string[]
  labels?: string[]
  badge?: string
}

const categories = [
  { id: "all", label: "Featured" },
  { id: "centers", label: "Centers" },
  { id: "units", label: "Units" },
  { id: "tico", label: "Tico" },
  { id: "e-club", label: "E-Club" },
]

export function ProductsSection() {
  const [centers, setCenters] = useState<ServiceCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")

  // Fetch products from service centers
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await apiClient.getServiceCenters()
        const parsed = (response.centers ?? []).map((center: any) => ({
          equipments: [],
          products: [],
          services: [],
          ...center,
          equipments: Array.isArray(center.equipments) ? center.equipments : [],
          products: Array.isArray(center.products) ? center.products : [],
          services: Array.isArray(center.services) ? center.services : []
        }))
        setCenters(parsed)
      } catch (error) {
        console.error("Failed to load service centers:", error)
        setCenters([])
      } finally {
        setLoading(false)
      }
    }

    fetchCenters()
  }, [])

  // Extract all products
  const allProducts = useMemo(() => {
    const products: Product[] = []
    
    centers.forEach((center) => {
      if (Array.isArray(center.products) && center.products.length > 0) {
        center.products.forEach((product, index) => {
          const originalPrice = product.price ? product.price * 1.3 : undefined
          const discount = product.price && originalPrice 
            ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
            : undefined
          
          products.push({
            id: `${center.id}-${index}`,
            name: product.name,
            description: product.description,
            centerName: center.name,
            centerSlug: center.slug,
            centerType: center.type || "center",
            centerImage: center.image || center.banner_image,
            price: product.price,
            originalPrice: originalPrice,
            rating: 4.8,
            reviewCount: Math.floor(Math.random() * 2000) + 100,
            sizes: ["Small", "Medium", "Large"],
            labels: discount ? [`Save ${discount}%`] : [],
            badge: center.type === "center" ? "Featured" : "New"
          })
        })
      }
    })
    
    return products
  }, [centers])

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") {
      return allProducts.slice(0, 4) // Show first 4 featured products
    } else if (activeCategory === "centers") {
      return allProducts.filter(p => p.centerType === "center").slice(0, 4)
    } else if (activeCategory === "units") {
      return allProducts.filter(p => p.centerType === "unit").slice(0, 4)
    } else if (activeCategory === "tico") {
      return allProducts.filter(p => 
        p.centerName.toLowerCase().includes("tico") ||
        p.name.toLowerCase().includes("tico")
      ).slice(0, 4)
    } else if (activeCategory === "e-club") {
      return allProducts.filter(p => 
        p.centerName.toLowerCase().includes("e-club") ||
        p.centerName.toLowerCase().includes("eclub") ||
        p.name.toLowerCase().includes("e-club") ||
        p.name.toLowerCase().includes("eclub")
      ).slice(0, 4)
    }
    return []
  }, [allProducts, activeCategory])

  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/service-centers/${product.centerSlug}#products`}>
            <div className="group relative bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.centerImage || "/placeholder.svg"}
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
                  {product.originalPrice && product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 line-through text-sm">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {product.price ? `From $${product.price.toLocaleString()}` : "Contact for pricing"}
                    </span>
                  </div>
                  {product.originalPrice && product.price && (
                    <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                      Save ${(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

