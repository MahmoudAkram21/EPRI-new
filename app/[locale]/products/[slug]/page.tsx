import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ArrowLeft, Package, MapPin, Phone, Mail, Star, ShoppingCart, CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProductWishlistButton } from "@/components/product-wishlist-button"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  short_description?: string | null
  image?: string | null
  images?: string[]
  price?: number | null
  original_price?: number | null
  category?: string | null
  tags?: string[]
  specifications?: any
  features?: string[]
  sizes?: string[]
  stock_quantity?: number | null
  sku?: string | null
  rating_average?: number
  rating_count?: number
  review_count?: number
  is_featured?: boolean
  is_available?: boolean
  service_center?: {
    id: string
    name: string
    slug: string
    type: string
    image?: string | null
    banner_image?: string | null
    location?: string | null
    contact_phone?: string | null
    contact_email?: string | null
  }
}

type ProductResponse = {
  product: Product
}

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as ProductResponse
    if (!data.product) {
      return null
    }

    return data.product
  } catch (error) {
    console.error("Failed to fetch product", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProduct(slug)
  if (!product) {
    return {
      title: "Product | EPRI",
      description: "Product details from EPRI."
    }
  }

  return {
    title: `${product.name} | EPRI Products`,
    description: product.short_description || product.description || `Explore ${product.name} from EPRI.`
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await fetchProduct(slug)

  if (!product) {
    notFound()
  }

  const serviceCenter = product.service_center
  const productImages = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : product.image 
      ? [product.image] 
      : []

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-white px-6 py-12 shadow-xl dark:border-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Button
          asChild
          variant="outline"
          className="mb-6 rounded-full border-slate-300 bg-white/80 backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/5 dark:border-slate-600 dark:bg-slate-800/80"
        >
          <Link href="/products" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              {productImages.length > 0 ? (
                <img
                  src={productImages[0]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-24 w-24 text-slate-400" />
                </div>
              )}
              {product.is_featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="rounded-full border-white/30 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.slice(1, 5).map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 2}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {product.category && (
                  <Badge variant="outline" className="rounded-full">
                    {product.category}
                  </Badge>
                )}
                {product.is_available !== false && (
                  <Badge className="rounded-full bg-green-500 text-white">
                    <CheckCircle className="mr-1.5 h-3 w-3" />
                    Available
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                {product.name}
              </h1>

              {product.short_description && (
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  {product.short_description}
                </p>
              )}

              {/* Rating */}
              {product.rating_average && product.rating_average > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating_average || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-slate-300 text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {product.rating_average.toFixed(1)} ({product.review_count || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="space-y-2">
                {product.original_price && product.price && product.original_price > product.price && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-slate-400 line-through">
                      {product.original_price.toLocaleString()} EGP
                    </span>
                    <Badge className="bg-red-500 text-white">
                      Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                    </Badge>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">
                    {product.price ? `${product.price.toLocaleString()} EGP` : "Contact for Pricing"}
                  </span>
                </div>
              </div>

              {/* SKU and Stock */}
              <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                {product.sku && (
                  <div>
                    <span className="font-medium">SKU:</span> {product.sku}
                  </div>
                )}
                {product.stock_quantity !== null && product.stock_quantity !== undefined && (
                  <div>
                    <span className="font-medium">Stock:</span> {product.stock_quantity} units
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button size="lg" className="flex-1 rounded-full bg-primary font-semibold shadow-lg shadow-primary/30">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Contact for Purchase
                </Button>
                <ProductWishlistButton productId={product.id} productName={product.name} />
              </div>
            </div>

            {/* Service Center/Unit Info */}
            {serviceCenter && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/5 to-white dark:from-primary/10 dark:via-primary/10 dark:to-slate-900">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
                      Available at {serviceCenter.type === "center" ? "Service Center" : "Unit"}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {serviceCenter.image && (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                          <img
                            src={serviceCenter.image}
                            alt={serviceCenter.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="mb-2 font-semibold text-lg text-slate-900 dark:text-slate-100">
                          {serviceCenter.name}
                        </h4>
                        {serviceCenter.location && (
                          <div className="mb-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="h-4 w-4" />
                            {serviceCenter.location}
                          </div>
                        )}
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="mt-2 rounded-full"
                        >
                          <Link href={`/service-centers/${serviceCenter.slug}`}>
                            View {serviceCenter.type === "center" ? "Center" : "Unit"} Details
                            <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    {(serviceCenter.contact_phone || serviceCenter.contact_email) && (
                      <div className="flex flex-wrap gap-3 border-t border-primary/20 pt-4">
                        {serviceCenter.contact_phone && (
                          <a
                            href={`tel:${serviceCenter.contact_phone}`}
                            className="flex items-center gap-2 rounded-full border border-primary/30 bg-white px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary/50 hover:bg-primary/5 dark:bg-slate-800"
                          >
                            <Phone className="h-4 w-4" />
                            {serviceCenter.contact_phone}
                          </a>
                        )}
                        {serviceCenter.contact_email && (
                          <a
                            href={`mailto:${serviceCenter.contact_email}`}
                            className="flex items-center gap-2 rounded-full border border-primary/30 bg-white px-4 py-2 text-sm font-medium text-primary transition-all hover:border-primary/50 hover:bg-primary/5 dark:bg-slate-800"
                          >
                            <Mail className="h-4 w-4" />
                            {serviceCenter.contact_email}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Section>

      {/* Product Details Tabs */}
      <Section>
        <div className="mx-auto max-w-7xl">
          <Tabs defaultValue="description" className="space-y-6">
            <TabsList className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50/90 via-white to-slate-50/90 p-1.5 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
              <TabsTrigger value="description" className="rounded-xl">
                Description
              </TabsTrigger>
              {product.features && product.features.length > 0 && (
                <TabsTrigger value="features" className="rounded-xl">
                  Features
                </TabsTrigger>
              )}
              {product.specifications && (
                <TabsTrigger value="specifications" className="rounded-xl">
                  Specifications
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card className="border-none bg-gradient-to-br from-white via-white to-slate-50/50 shadow-xl ring-1 ring-slate-200/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
                <CardContent className="p-8">
                  {product.description ? (
                    <div
                      className="prose prose-slate max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <p className="text-slate-600 dark:text-slate-300">
                      {product.short_description || "No detailed description available."}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {product.features && product.features.length > 0 && (
              <TabsContent value="features" className="mt-6">
                <Card className="border-none bg-gradient-to-br from-white via-white to-slate-50/50 shadow-xl ring-1 ring-slate-200/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
                  <CardContent className="p-8">
                    <ul className="grid gap-4 md:grid-cols-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                          <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {product.specifications && (
              <TabsContent value="specifications" className="mt-6">
                <Card className="border-none bg-gradient-to-br from-white via-white to-slate-50/50 shadow-xl ring-1 ring-slate-200/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
                  <CardContent className="p-8">
                    {typeof product.specifications === "object" ? (
                      <dl className="grid gap-4 md:grid-cols-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="border-b border-slate-200 pb-3 dark:border-slate-700">
                            <dt className="font-semibold text-slate-900 dark:text-slate-100">
                              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </dt>
                            <dd className="mt-1 text-slate-600 dark:text-slate-400">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <div
                        className="prose prose-slate max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: String(product.specifications) }}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </Section>
    </PageContainer>
  )
}

