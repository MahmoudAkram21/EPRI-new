'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Section } from "@/components/section"

const journalSubMenus = [
  { title: 'EgyJP & Editorial Board', href: '/library/journal/egyjp-editorial-board' },
  { title: 'Egyptian Journal Of Petroleum', href: '/library/journal/egyptian-journal-petroleum' },
]

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen">
      {/* Journal Navigation Table - shown on all journal pages */}
      <Section>
        <div className="mb-8">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                    Menu Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Sub Menus
                  </th>
                </tr>
              </thead>
              <tbody>
                {journalSubMenus.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <tr key={item.href}>
                      {index === 0 && (
                        <td
                          rowSpan={journalSubMenus.length}
                          className="border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 align-top"
                        >
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
                            EJB Journal
                          </div>
                        </td>
                      )}
                      <td
                        className={cn(
                          'px-4 py-2.5',
                          index < journalSubMenus.length - 1 && 'border-b border-slate-200 dark:border-slate-800',
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
                          {item.title}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
      
      {children}
    </div>
  )
}

