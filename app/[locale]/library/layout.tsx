'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const libraryNavItems = [
  { title: 'Overview', href: '/library/overview' },
  { title: 'Books', href: '/library/books' },
  { title: 'Journal', href: '/library/journal' },
  { title: 'Theses (PHD)', href: '/library/theses-phd' },
  { title: 'Theses (MSC)', href: '/library/theses-msc' },
]

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
              <table className="w-full border-collapse">
                <tbody>
                  {libraryNavItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <tr key={item.href}>
                        {index === 0 && (
                          <td
                            rowSpan={libraryNavItems.length}
                            className="border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 align-top"
                          >
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
                              Library
                            </div>
                          </td>
                        )}
                        <td
                          className={cn(
                            'px-4 py-2.5',
                            index < libraryNavItems.length - 1 && 'border-b border-slate-200 dark:border-slate-800',
                            isActive && 'bg-blue-100 dark:bg-blue-950/50'
                          )}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              'block text-sm text-slate-900 dark:text-slate-100 hover:text-primary transition-colors',
                              isActive && 'text-primary font-semibold'
                            )}
                          >
                            {index < 4 ? '• ' : ''}
                            {item.title}
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}

