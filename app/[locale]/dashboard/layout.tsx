"use client"

import type React from "react"

import { PageContainer } from "@/components/page-container"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { BookOpen, Heart, User, Package, Building2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('dashboard')

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.push(`/${locale}/login`)
        return
      }
      
      // Check if user is verified
      if (user && !user.is_verified) {
        router.push(`/${locale}/pending-verification`)
        return
      }
    }
  }, [isLoggedIn, user, isLoading, router, locale])

  if (isLoading || !isLoggedIn || (user && !user.is_verified)) {
    return null
  }

  const isDepartmentManager = user?.role === 'DEPARTMENT_MANAGER'

  const tabs = [
    { href: `/${locale}/dashboard`, label: t('dashboard'), icon: User },
    ...(isDepartmentManager ? [{ href: `/${locale}/dashboard/department`, label: t('departmentDashboard'), icon: Building2 }] : []),
    { href: `/${locale}/dashboard/my-courses`, label: t('myCourses'), icon: BookOpen },
    { href: `/${locale}/dashboard/wishlist`, label: t('myWishlist'), icon: Heart },
    { href: `/${locale}/dashboard/products-wishlist`, label: t('productsWishlist'), icon: Package },
  ]

  return (
    <PageContainer>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">{t('myDashboard')}</h1>
          <p className="text-muted-foreground">{t('manageCoursesProgress')}</p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b mb-8">
          <nav className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-2 pb-4 border-b-2 transition-colors whitespace-nowrap",
                    isActive
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {children}
      </div>

    </PageContainer>
  )
}
