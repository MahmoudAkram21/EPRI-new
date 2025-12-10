"use client"

import { useProductWishlist } from "@/hooks/use-product-wishlist"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Package, Trash2, ArrowRight } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useEffect, useState } from "react"
import type { ServiceCenter } from "@/types/service-center"
import { Skeleton } from "@/components/ui/skeleton"

interface Product {
  id: string
  name: string
  description?: string
  centerName: string
  centerSlug: string
  centerType: string
  centerImage?: string | null
}

export default function ProductsWishlistPage() {
  const { wishlist, isLoading: wishlistLoading, removeFromWishlist } = useProductWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const centersRes = await apiClient.getServiceCenters()
        const allCenters: ServiceCenter[] = centersRes.centers || []
        
        const allProducts: Product[] = []
        
        allCenters.forEach((center) => {
          if (center.products && Array.isArray(center.products)) {
            center.products.forEach((product: any) => {
              allProducts.push({
                id: product.id || `${center.id}-${product.name}`,
                name: product.name || "Unnamed Product",
                description: product.description,
                centerName: center.name,
                centerSlug: center.slug,
                centerType: center.type || "center",
                centerImage: center.image,
              })
            })
          }
        })
        
        // Filter to only include products in wishlist
        const wishlistProducts = allProducts.filter((product) => wishlist.includes(product.id))
        setProducts(wishlistProducts)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!wishlistLoading) {
      loadProducts()
    }
  }, [wishlist, wishlistLoading])

  if (wishlistLoading || loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[400px] rounded-2xl" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold text-xl mb-2">Your Products Wishlist is Empty</h3>
          <p className="text-muted-foreground mb-6">Add products to your wishlist to save them for later</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          You have {products.length} {products.length === 1 ? "product" : "products"} in your wishlist
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm ring-1 ring-slate-200/30 transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/30 dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800"
          >
            <Link href={`/service-centers/${product.centerSlug}#products`} className="block">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                {product.centerImage ? (
                  <>
                    <img
                      src={product.centerImage}
                      alt={product.centerName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <Package className="h-20 w-20 text-primary/30 dark:text-primary/20" />
                  </div>
                )}

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3">
                  <Badge className="rounded-full border-white/30 bg-white/90 backdrop-blur-sm text-xs font-semibold text-slate-700 shadow-sm">
                    {product.centerType === "center" ? "Center" : "Unit"}
                  </Badge>
                </div>

                {/* Heart Button - Filled */}
                <div className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                </div>
              </div>

              {/* Product Info */}
              <CardContent className="p-5">
                <h3 className="mb-2 font-semibold text-lg text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {product.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {product.centerName}
                  </span>
                  <div className="flex items-center gap-1 text-primary opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">
                    <span className="text-xs font-semibold">View</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </CardContent>
            </Link>

            {/* Remove Button */}
            <div className="absolute bottom-5 right-5 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  removeFromWishlist(product.id, product.name)
                }}
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-red-50 hover:text-red-600 shadow-sm"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

