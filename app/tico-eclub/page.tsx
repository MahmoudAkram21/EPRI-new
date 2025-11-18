'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ticoEclubSubMenus = [
  { title: '(Tico "tab") in products page', href: '/products?tab=tico' },
  { title: '(E-Club "tab") in products page', href: '/products?tab=e-club' },
]

export default function TicoEClubPage() {
  return (
    <div className="min-h-screen">
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700 mb-8">
        <div className="relative z-10 mx-auto max-w-6xl">
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Tico & E-Club
          </h1>
          <p className="text-lg leading-relaxed text-white/90 sm:text-xl max-w-3xl">
            Access Tico and E-Club products and services.
          </p>
        </div>
      </Section>

      <Section>
        <div className="space-y-8">
          {/* Tico & E-Club Navigation Table */}
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
                {ticoEclubSubMenus.map((item, index) => {
                  return (
                    <tr key={item.href}>
                      {index === 0 && (
                        <td
                          rowSpan={ticoEclubSubMenus.length}
                          className="border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-4 py-3 align-top"
                        >
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
                            Tico & E-Club
                          </div>
                        </td>
                      )}
                      <td
                        className={cn(
                          'px-4 py-2.5',
                          index < ticoEclubSubMenus.length - 1 && 'border-b border-slate-200 dark:border-slate-800'
                        )}
                      >
                        <Link
                          href={item.href}
                          className="block text-sm text-slate-900 dark:text-slate-100 hover:text-primary transition-colors"
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

          <Card>
            <CardHeader>
              <CardTitle>Tico & E-Club</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Content for Tico & E-Club page...
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  )
}

