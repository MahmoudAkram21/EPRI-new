"use client"

import { useEffect, useState, useMemo } from "react"
import { useLocale } from 'next-intl'
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Package, ArrowRight, Filter, Heart } from "lucide-react"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api"
import type { ServiceCenter } from "@/types/service-center"
import { useProductWishlist } from "@/hooks/use-product-wishlist"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/hooks/use-toast"
import { LoginModal } from "@/components/login-modal"

type TranslationObject = { en: string; ar: string } | string

// Helper function to extract translation value
function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || ''
  }
  return ''
}

interface Product {
  id: string
  name: string
  description?: string
  centerName: string
  centerSlug: string
  centerType: string
  centerImage?: string | null
}

export default function ProductsPage() {
  const locale = useLocale()
  const [centers, setCenters] = useState<ServiceCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "centers"

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await apiClient.getServiceCenters()
        const parsed = (response.centers ?? []).map((center: any) => ({
          ...center,
          name: getTranslation(center.name, locale),
          headline: center.headline ? getTranslation(center.headline, locale) : undefined,
          description: center.description ? getTranslation(center.description, locale) : undefined,
          equipments: Array.isArray(center.equipments) ? center.equipments.map((eq: any) => ({
            ...eq,
            name: getTranslation(eq.name, locale),
            description: eq.description ? getTranslation(eq.description, locale) : undefined,
          })) : [],
          products: Array.isArray(center.products) ? center.products.map((prod: any) => ({
            ...prod,
            name: getTranslation(prod.name, locale),
            description: prod.description ? getTranslation(prod.description, locale) : undefined,
            short_description: prod.short_description ? getTranslation(prod.short_description, locale) : undefined,
          })) : [],
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
  }, [locale])

  // Extract all products from centers/units
  const allProducts = useMemo(() => {
    const products: Product[] = []
    
    centers.forEach((center) => {
      if (Array.isArray(center.products) && center.products.length > 0) {
        center.products.forEach((product, index) => {
          products.push({
            id: `${center.id}-${index}`,
            name: product.name,
            description: product.description,
            centerName: center.name,
            centerSlug: center.slug,
            centerType: center.type || "center",
            centerImage: center.image || center.banner_image
          })
        })
      }
    })
    
    return products
  }, [centers])

  // Filter products by tab and search
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      let matchesTab = false
      
      if (activeTab === "centers") {
        matchesTab = product.centerType === "center"
      } else if (activeTab === "units") {
        matchesTab = product.centerType === "unit"
      } else if (activeTab === "tico") {
        // Filter for Tico products (by center name containing "tico" or similar)
        matchesTab = product.centerName.toLowerCase().includes("tico") ||
                     product.name.toLowerCase().includes("tico")
      } else if (activeTab === "e-club") {
        // Filter for E-Club products (by center name containing "e-club" or similar)
        matchesTab = product.centerName.toLowerCase().includes("e-club") ||
                     product.centerName.toLowerCase().includes("eclub") ||
                     product.name.toLowerCase().includes("e-club") ||
                     product.name.toLowerCase().includes("eclub")
      }
      
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.centerName.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesTab && matchesSearch
    })
    
    return filtered
  }, [allProducts, activeTab, searchQuery])

  const centersProducts = useMemo(() => 
    allProducts.filter(p => p.centerType === "center" && 
      (searchQuery === "" || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.centerName.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [allProducts, searchQuery]
  )
  
  const unitsProducts = useMemo(() => 
    allProducts.filter(p => p.centerType === "unit" && 
      (searchQuery === "" || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.centerName.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [allProducts, searchQuery]
  )

  const ticoProducts = useMemo(() => 
    filteredProducts.filter(p => activeTab === "tico"),
    [filteredProducts, activeTab]
  )

  const eclubProducts = useMemo(() => 
    filteredProducts.filter(p => activeTab === "e-club"),
    [filteredProducts, activeTab]
  )

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              <Package className="h-3.5 w-3.5" />
              Products Portfolio
            </div>
            
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Specialized Products & Solutions
            </h1>
            
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
              Discover certified products, reference materials, and innovative solutions from our service centers and specialized units.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                {allProducts.length} Total Products
              </Badge>
              <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                {centers.filter(c => (c.type || 'center') === 'center').length} Centers
              </Badge>
              <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                {centers.filter(c => c.type === 'unit').length} Units
              </Badge>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Products Section with Tabs */}
      <Section className="space-y-8">
        {/* Search and Filter */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            />
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredProducts.length}</span> products
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} className="space-y-8">
          <TabsList className="mx-auto flex w-fit flex-wrap rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50/90 via-white to-slate-50/90 p-1.5 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
            <TabsTrigger
              value="centers"
              asChild
              className="group rounded-xl px-6 py-2.5 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 hover:text-primary dark:text-slate-300"
            >
              <Link href="/products?tab=centers">
                Centers
                {centersProducts.length > 0 && (
                  <Badge className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {centersProducts.length}
                  </Badge>
                )}
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="units"
              asChild
              className="group rounded-xl px-6 py-2.5 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 hover:text-primary dark:text-slate-300"
            >
              <Link href="/products?tab=units">
                Units
                {unitsProducts.length > 0 && (
                  <Badge className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {unitsProducts.length}
                  </Badge>
                )}
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="tico"
              asChild
              className="group rounded-xl px-6 py-2.5 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 hover:text-primary dark:text-slate-300"
            >
              <Link href="/products?tab=tico">
                Tico
                {ticoProducts.length > 0 && (
                  <Badge className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {ticoProducts.length}
                  </Badge>
                )}
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="e-club"
              asChild
              className="group rounded-xl px-6 py-2.5 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 hover:text-primary dark:text-slate-300"
            >
              <Link href="/products?tab=e-club">
                E-Club
                {eclubProducts.length > 0 && (
                  <Badge className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                    {eclubProducts.length}
                  </Badge>
                )}
              </Link>
            </TabsTrigger>
          </TabsList>

          {/* Centers Products */}
          <TabsContent value="centers" className="space-y-6">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[400px] rounded-2xl border border-slate-200/60 dark:border-slate-800"
                  />
                ))}
              </div>
            ) : centersProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <Package className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
                  {searchQuery 
                    ? `No products found matching "${searchQuery}" in centers.`
                    : "No products available from centers at this time."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {centersProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Units Products */}
          <TabsContent value="units" className="space-y-6">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[400px] rounded-2xl border border-slate-200/60 dark:border-slate-800"
                  />
                ))}
              </div>
            ) : unitsProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <Package className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
                  {searchQuery 
                    ? `No products found matching "${searchQuery}" in units.`
                    : "No products available from units at this time."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {unitsProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tico Products */}
          <TabsContent value="tico" className="space-y-6">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[400px] rounded-2xl border border-slate-200/60 dark:border-slate-800"
                  />
                ))}
              </div>
            ) : ticoProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <Package className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
                  {searchQuery 
                    ? `No products found matching "${searchQuery}" in Tico.`
                    : "No Tico products available at this time."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {ticoProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* E-Club Products */}
          <TabsContent value="e-club" className="space-y-6">
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-[400px] rounded-2xl border border-slate-200/60 dark:border-slate-800"
                  />
                ))}
              </div>
            ) : eclubProducts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <Package className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                <p className="mt-4 text-base text-slate-500 dark:text-slate-400">
                  {searchQuery 
                    ? `No products found matching "${searchQuery}" in E-Club.`
                    : "No E-Club products available at this time."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {eclubProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Section>
    </PageContainer>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
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
        <div className="relative p-5">
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
        </div>
      </Link>
    </motion.div>
  )
}

