"use client"

import { useUser } from "@/contexts/user-context"
import { courses } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Heart, Award, TrendingUp, Users, Calendar, Settings, BarChart3, Microscope, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api"
import { useProductWishlist } from "@/hooks/use-product-wishlist"
import { useEquipmentWishlist } from "@/hooks/use-equipment-wishlist"
import { Tabs as TabsComponent, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"


export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const { enrolledCourses, wishlist, user, isLoading, isLoggedIn } = useUser()
  const router = useRouter()
  const { wishlist: productWishlist } = useProductWishlist()
  const { wishlist: equipmentWishlist } = useEquipmentWishlist()

  const [products, setProducts] = useState<any[]>([])
  const [equipments, setEquipments] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingEquipments, setLoadingEquipments] = useState(false)

  // Redirect if user is not verified (this is also checked in layout, but adding here for extra safety)
  useEffect(() => {
    if (!isLoading && user && !user.is_verified) {
      router.push(`/${locale}/pending-verification`)
    }
  }, [user, isLoading, router, locale])

  // Fetch products and equipments for wishlist display
  useEffect(() => {
    if (isLoggedIn) {
      // Fetch products
      if (productWishlist.length > 0) {
        setLoadingProducts(true)
        apiClient.getProducts({ limit: 100 })
          .then((response) => {
            const allProducts = response.products || []
            const favoriteProducts = allProducts.filter((p: any) => productWishlist.includes(p.id))
            setProducts(favoriteProducts)
          })
          .catch((error) => {
            console.error('Error fetching products:', error)
          })
          .finally(() => {
            setLoadingProducts(false)
          })
      }

      // Fetch equipments
      if (equipmentWishlist.length > 0) {
        setLoadingEquipments(true)
        apiClient.getServiceCenters()
          .then((response) => {
            const allEquipments: any[] = []
            response.centers?.forEach((center: any) => {
              if (Array.isArray(center.equipments)) {
                center.equipments.forEach((eq: any) => {
                  if (equipmentWishlist.includes(eq.id || String(eq.name))) {
                    allEquipments.push({
                      ...eq,
                      centerName: center.name,
                      centerSlug: center.slug,
                    })
                  }
                })
              }
            })
            setEquipments(allEquipments)
          })
          .catch((error) => {
            console.error('Error fetching equipments:', error)
          })
          .finally(() => {
            setLoadingEquipments(false)
          })
      }
    }
  }, [isLoggedIn, productWishlist, equipmentWishlist])

  const [loading, setLoading] = useState(true);

  // Role checks
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isDepartmentManager = user?.role === 'DEPARTMENT_MANAGER';
  const isInstructor = user?.role === 'INSTRUCTOR'
  const canManageEvents = isAdmin || isInstructor

  const enrolledCoursesData = courses.filter((course) => enrolledCourses.includes(course.id))
  const wishlistCoursesData = courses.filter((course) => wishlist.includes(course.id))

  // Calculate total wishlist items
  const totalWishlistItems = wishlistCoursesData.length + productWishlist.length + equipmentWishlist.length

  // Admin/Instructor stats
  const adminStats = [
    {
      title: t('totalUsers'),
      value: "1,250",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t('activeEvents'),
      value: "12",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t('eventRegistrations'),
      value: "856",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: t('revenue'),
      value: "$45,230",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  // Regular user stats
  const userStats = [
    {
      title: t('enrolledCourses'),
      value: enrolledCourses.length,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t('wishlistItems'),
      value: totalWishlistItems,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: t('certificatesEarned'),
      value: 0,
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: t('learningStreak'),
      value: `0 ${t('days')}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const stats = canManageEvents ? adminStats : userStats

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">
            {t('welcomeBack', { name: user?.first_name || '' })}
          </h1>
          <p className="text-muted-foreground">
            {canManageEvents ? t('manageEventsUsers') : t('continueLearning')}
          </p>
        </div>
        {canManageEvents && (
          <Badge variant="secondary" className="text-sm">
            {isAdmin ? t('administrator') : t('instructor')}
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-full", stat.bgColor)}>
                    <Icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Admin/Instructor Management Section */}
      {canManageEvents && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {t('eventManagement')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('eventManagementDescription')}
              </p>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href={`/${locale}/admin/events`}>{t('manageEventsButton')}</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/${locale}/admin`}>{t('adminDashboard')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  {t('userManagement')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('userManagementDescription')}
                </p>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href={`/${locale}/admin/users`}>{t('viewAllUsers')}</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/${locale}/admin`}>{t('adminDashboard')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                {t('analyticsReports')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('analyticsReportsDescription')}
              </p>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link href={`/${locale}/admin/analytics`}>{t('viewAnalytics')}</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/${locale}/admin/reports`}>{t('generateReports')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Courses */}
      {enrolledCoursesData.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold">{t('continueLearning')}</h2>
            <Button variant="ghost" asChild>
              <Link href={`/${locale}/dashboard/my-courses`}>{t('viewAll')}</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCoursesData.slice(0, 3).map((course) => (
              <Link key={course.id} href={`/${locale}/courses/${course.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "0%" }} />
                    </div>
                    <p className="text-xs text-muted-foreground">0% {t('complete')}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {enrolledCoursesData.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold text-xl mb-2">{t('noEnrolledCourses')}</h3>
            <p className="text-muted-foreground mb-6">{t('startLearningJourney')}</p>
            <Button asChild>
              <Link href={`/${locale}/courses`}>{t('browseCourses')}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Favorites/Wishlist Preview */}
      {totalWishlistItems > 0 && isLoggedIn && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold">{t('yourWishlist')}</h2>
          </div>
          <TabsComponent defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Courses ({wishlistCoursesData.length})
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Products ({productWishlist.length})
              </TabsTrigger>
              <TabsTrigger value="equipments" className="flex items-center gap-2">
                <Microscope className="h-4 w-4" />
                Equipment ({equipmentWishlist.length})
              </TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="mt-6">
              {wishlistCoursesData.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistCoursesData.slice(0, 6).map((course) => (
                    <Link key={course.id} href={`/${locale}/courses/${course.id}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{course.isFree ? t('free') : `$${course.price}`}</span>
                            <span className="text-sm text-muted-foreground">{course.students.toLocaleString()} {t('students')}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold text-xl mb-2">No favorite courses</h3>
                    <p className="text-muted-foreground mb-6">Start adding courses to your wishlist</p>
                    <Button asChild>
                      <Link href={`/${locale}/courses`}>Browse Courses</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="mt-6">
              {products.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice(0, 6).map((product: any) => (
                    <Link key={product.id} href={`/${locale}/products/${product.slug || product.id}`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          {product.short_description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{product.short_description}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">
                              {product.price ? `$${product.price}` : 'Price on request'}
                            </span>
                            {product.centerName && (
                              <span className="text-sm text-muted-foreground">{product.centerName}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold text-xl mb-2">No favorite products</h3>
                    <p className="text-muted-foreground mb-6">Start adding products to your wishlist</p>
                    <Button asChild>
                      <Link href={`/${locale}/products`}>Browse Products</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Equipments Tab */}
            <TabsContent value="equipments" className="mt-6">
              {equipments.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {equipments.slice(0, 6).map((equipment: any) => (
                    <Link key={equipment.id || equipment.name} href={`/${locale}/service-centers/${equipment.centerSlug}#equipment`}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <img
                          src={equipment.image || "/placeholder.svg"}
                          alt={equipment.name || 'Equipment'}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">{equipment.name || 'Equipment'}</CardTitle>
                          {equipment.centerName && (
                            <p className="text-sm text-muted-foreground">{equipment.centerName}</p>
                          )}
                        </CardHeader>
                        <CardContent>
                          {equipment.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {equipment.description}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Microscope className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold text-xl mb-2">No favorite equipment</h3>
                    <p className="text-muted-foreground mb-6">Start adding equipment to your wishlist</p>
                    <Button asChild>
                      <Link href={`/${locale}/equipments`}>Browse Equipment</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </TabsComponent>
        </div>
      )}
    </div>
  )
}

