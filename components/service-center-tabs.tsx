'use client'

import { useMemo, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Beaker,
  BarChart3,
  Compass,
  FlaskConical,
  Layers,
  PackageSearch,
  Sparkles,
  Wrench
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ServiceCenter } from '@/types/service-center'

interface ServiceCenterTabsProps {
  center: ServiceCenter
  className?: string
}

const pieColors = ['#2563eb', '#0ea5e9', '#f97316', '#22c55e', '#a855f7', '#ec4899']

export function ServiceCenterTabs({ center, className }: ServiceCenterTabsProps) {
  const pathname = usePathname()
  
  const filteredTabs = useMemo(() => {
    const tabs = [
      {
        value: 'equipment',
        label: 'Equipment List',
        icon: Wrench,
        hash: 'equipment',
        hidden: !Array.isArray(center.equipments) || center.equipments.length === 0
      },
      {
        value: 'products',
        label: 'Products',
        icon: PackageSearch,
        hash: 'products',
        hidden: !Array.isArray(center.products) || center.products.length === 0
      },
      {
        value: 'methodology',
        label: 'Lab Methodology',
        icon: Beaker,
        hash: 'lab-methodology',
        hidden: !center.lab_methodology
      },
      {
        value: 'analytics',
        label: 'Work Volume & Activity',
        icon: BarChart3,
        hash: 'work-volume',
        hidden: !center.work_volume && !center.company_activity
      },
      {
        value: 'future',
        label: 'Future Prospective',
        icon: Sparkles,
        hash: 'future-prospects',
        hidden: !center.future_prospective
      },
      {
        value: 'services',
        label: 'Services',
        icon: Layers,
        hash: 'services',
        hidden: !Array.isArray(center.services) || center.services.length === 0
      }
    ]

    const visibleTabs = tabs.filter(tab => !tab.hidden)
    return visibleTabs.length > 0 ? visibleTabs : tabs.filter(tab => tab.value === 'equipment')
  }, [center])

  // Initialize active tab state
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        // We'll set this properly in useEffect after filteredTabs is computed
        return 'equipment' // temporary default
      }
    }
    return 'equipment'
  })

  // Handle hash-based navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        // Find tab that matches the hash
        const matchingTab = filteredTabs.find(tab => tab.hash === hash)
        if (matchingTab) {
          setActiveTab(matchingTab.value)
        }
      } else {
        // Default to first tab if no hash
        setActiveTab(filteredTabs[0]?.value ?? 'equipment')
      }
    }

    // Set initial tab from hash
    handleHashChange()
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [filteredTabs])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const tab = filteredTabs.find(t => t.value === value)
    if (tab) {
      // Update URL hash without scrolling
      window.history.replaceState(null, '', `${pathname}#${tab.hash}`)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className={cn('space-y-6', className)}>
      <TabsList className="mx-auto flex flex-wrap justify-center gap-2 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50/90 via-white to-slate-50/90 p-1.5 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm dark:border-slate-800 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
        {filteredTabs.map(tab => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="group flex-auto rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 hover:text-primary dark:text-slate-300 dark:data-[state=active]:bg-gradient-to-br dark:data-[state=active]:from-primary dark:data-[state=active]:to-primary/90 dark:data-[state=active]:text-white sm:flex-initial"
          >
            <tab.icon className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {filteredTabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value}>
          <motion.div
            id={tab.hash}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
              {tab.value === 'equipment' && (
                <Card className="border-none bg-gradient-to-br from-white via-white to-slate-50/50 shadow-xl ring-1 ring-slate-200/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FlaskConical className="h-5 w-5" />
                      </div>
                      Precision Equipment Portfolio
                    </CardTitle>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      Specialized instrumentation enabling world-class testing, calibration, and analytical workflows.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {center.equipments?.map((equipment, equipmentIndex) => {
                        const equipmentDetails = equipment.details ?? equipment.description ?? undefined;
                        return (
                          <motion.div
                            key={`${equipment.name}-${equipmentIndex}`}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ delay: equipmentIndex * 0.06 }}
                            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/50 p-5 shadow-sm ring-1 ring-slate-200/30 transition-all hover:border-primary/30 hover:shadow-md hover:ring-primary/20 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-950 dark:ring-slate-800"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            <div className="relative z-10 flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                                <Compass className="h-5 w-5 transition-transform group-hover:scale-110" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-slate-900 dark:text-slate-100">{equipment.name}</p>
                                {equipmentDetails && (
                                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                    {equipmentDetails}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {tab.value === 'products' && (
                <Card className="border-none bg-gradient-to-br from-white via-slate-50/80 to-white shadow-xl ring-1 ring-slate-200/70 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <PackageSearch className="h-5 w-5" />
                      </div>
                      Specialized Product Portfolio
                    </CardTitle>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      Certified deliverables and reference materials supporting industrial and research applications.
                    </p>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    {center.products?.map((product, productIndex) => (
                      <motion.div
                        key={`${product.name}-${productIndex}`}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ delay: productIndex * 0.08 }}
                        className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-white to-primary/5 p-5 shadow-sm ring-1 ring-primary/10 transition-all hover:border-primary/40 hover:shadow-md hover:ring-primary/30 dark:border-primary/30 dark:from-slate-900/80 dark:to-slate-950 dark:ring-primary/20"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative z-10">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</h4>
                          {product.description && (
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                              {product.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {tab.value === 'methodology' && (
                <Card className="border-none bg-gradient-to-br from-white via-white to-slate-50/50 shadow-xl ring-1 ring-slate-200/70 backdrop-blur-xl dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Beaker className="h-5 w-5" />
                      </div>
                      Accredited Laboratory Methodology
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-slate-600 dark:text-slate-300">
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-base leading-relaxed"
                    >
                      {center.lab_methodology}
                    </motion.p>

                    {center.metrics && (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {Object.entries(center.metrics).map(([key, value], metricIndex) => (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + metricIndex * 0.05 }}
                            className="rounded-2xl border border-slate-200/60 bg-slate-50/70 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/60"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                              {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}
                            </p>
                            <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{`${value}`}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {tab.value === 'analytics' && (
                <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
                  <Card className="border-none bg-linear-to-br from-primary/10 via-white to-white shadow-lg ring-1 ring-primary/10 dark:from-primary/10 dark:via-slate-900 dark:to-slate-900 dark:ring-primary/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        Total Income Rate (LE)/Year
                      </CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Tracking revenue expansion and workload throughput for the center.
                      </p>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                      {center.work_volume?.dataPoints && center.work_volume.dataPoints.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={center.work_volume.dataPoints}
                            margin={{ top: 10, right: 24, bottom: 0, left: 0 }}
                          >
                            <defs>
                              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
                            <XAxis dataKey="label" stroke="#475569" />
                            <YAxis stroke="#475569" />
                            <Tooltip
                              cursor={{ strokeDasharray: '3 3' }}
                              contentStyle={{ borderRadius: 12, border: '1px solid #cbd5f5', backgroundColor: '#fff' }}
                            />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke="#2563eb"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#incomeGradient)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <EmptyState message="Work volume analytics are being prepared." />
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-white/90 shadow-lg ring-1 ring-slate-200/80 dark:bg-slate-900/80 dark:ring-slate-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Layers className="h-5 w-5 text-primary" />
                        Company Activity Mix
                      </CardTitle>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Distribution of key programs and engagements managed by the center.
                      </p>
                    </CardHeader>
                    <CardContent className="flex h-[320px] flex-col items-center justify-center gap-4">
                      {center.company_activity?.activityMix && center.company_activity.activityMix.length > 0 ? (
                        <>
                          <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={center.company_activity.activityMix}
                                  dataKey="value"
                                  nameKey="label"
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={50}
                                  outerRadius={80}
                                  paddingAngle={5}
                                >
                                  {center.company_activity.activityMix.map((slice, sliceIndex) => (
                                    <Cell
                                      key={slice.label}
                                      fill={pieColors[sliceIndex % pieColors.length]}
                                      stroke="transparent"
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  formatter={(value: number) => [`${value}%`, 'Contribution']}
                                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            {center.company_activity.activityMix.map((slice, sliceIndex) => (
                              <span
                                key={`${slice.label}-${sliceIndex}`}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 px-3 py-1 dark:border-slate-700/80"
                              >
                                <span
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: pieColors[sliceIndex % pieColors.length] }}
                                />
                                {slice.label}
                              </span>
                            ))}
                          </div>
                          {center.company_activity.totalProjects !== undefined && (
                            <Badge variant="outline" className="text-xs font-semibold">
                              {center.company_activity.totalProjects}+ projects delivered
                            </Badge>
                          )}
                        </>
                      ) : (
                        <EmptyState message="Activity analytics are being curated." />
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {tab.value === 'future' && (
                <Card className="border-none bg-gradient-to-br from-white via-slate-50/80 to-white shadow-xl ring-1 ring-slate-200/70 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:ring-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      Future Prospective
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="text-base leading-relaxed text-slate-600 dark:text-slate-300"
                    >
                      {center.future_prospective}
                    </motion.p>
                  </CardContent>
                </Card>
              )}

              {tab.value === 'services' && (
                <div className="grid gap-4 md:grid-cols-2">
                  {center.services?.map((service, serviceIndex) => (
                    <motion.div
                      key={`${service.name}-${serviceIndex}`}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ delay: serviceIndex * 0.08 }}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/50 p-5 shadow-sm ring-1 ring-slate-200/30 transition-all hover:border-primary/40 hover:shadow-md hover:ring-primary/20 dark:border-slate-800 dark:from-slate-900/80 dark:to-slate-950 dark:ring-slate-800"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="relative z-10 flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                          <Layers className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">{service.name}</h4>
                          {service.summary && (
                            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                              {service.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>
        ))}
    </Tabs>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400">
      <Layers className="mb-3 h-6 w-6 text-slate-400 dark:text-slate-500" />
      <p>{message}</p>
    </div>
  )
}

