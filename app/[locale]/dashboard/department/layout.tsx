'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Building2, BookOpen, ShoppingCart, BarChart3 } from 'lucide-react'
import { useUser } from '@/contexts/user-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DepartmentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'DEPARTMENT_MANAGER') {
      router.push('/dashboard')
      return
    }
  }, [user, router])

  // Define tabs for department dashboard
  const departmentTabs = [
    { href: "/dashboard/department", label: "Overview", icon: BarChart3 },
    { href: "/dashboard/department/courses", label: "Courses", icon: BookOpen },
    { href: "/dashboard/department/orders", label: "Course Orders", icon: ShoppingCart },
  ]

  return (
    <div className="space-y-6">
      {/* Department Tabs Navigation */}
      <div className="border-b">
        <nav className="flex gap-6 overflow-x-auto">
          {departmentTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.href || 
              (tab.href === '/dashboard/department' && 
               pathname?.startsWith('/dashboard/department') && 
               !pathname.includes('/courses') && 
               !pathname.includes('/orders'))
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
  )
}

