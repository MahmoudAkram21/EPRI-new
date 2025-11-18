'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Phone, Mail } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ServiceCenter } from '@/types/service-center'

interface ServiceCenterCardProps {
  center: ServiceCenter
  index?: number
  className?: string
}

export function ServiceCenterCard({ center, index = 0, className }: ServiceCenterCardProps) {
  const metrics = [
    center.work_volume?.totalIncomeRate !== undefined && center.work_volume?.currency
      ? {
          label: 'Total Income Rate',
          value: `${center.work_volume.totalIncomeRate} ${center.work_volume.currency}`
        }
      : null,
    center.company_activity?.totalProjects !== undefined
      ? {
          label: 'Active Programs',
          value: `${center.company_activity.totalProjects}+`
        }
      : null,
    Array.isArray(center.services) && center.services.length > 0
      ? {
          label: 'Specialized Services',
          value: `${center.services.length}`
        }
      : null
  ].filter(Boolean) as Array<{ label: string; value: string }>

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: 'easeOut' }}
    >
      <Link href={`/service-centers/${center.slug}`} className="block">
        <Card
          className={cn(
            'overflow-hidden border border-slate-200/70 bg-slate-50/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/50',
            className
          )}
        >
          <div className="relative aspect-4/3 overflow-hidden">
            <img
              src={center.image || center.banner_image || '/placeholder.svg'}
              alt={center.name}
              className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex flex-wrap items-center gap-2 text-sm text-white/80">
                {center.is_featured && <Badge className="bg-white/15 backdrop-blur-sm">Flagship Center</Badge>}
                {center.location && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                    <MapPin className="h-3.5 w-3.5" />
                    {center.location}
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-serif text-2xl font-semibold">{center.name}</h3>
              {center.headline && <p className="mt-1 text-sm text-white/80">{center.headline}</p>}
            </div>
          </div>

          <CardContent className="space-y-5 p-6">
            {center.description && (
              <p className="text-sm text-slate-600 line-clamp-3 dark:text-slate-300">{center.description}</p>
            )}

            {metrics.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {metrics.map((metric, metricIndex) => (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.1 + metricIndex * 0.06 }}
                    className="rounded-xl border border-slate-200/60 bg-white/60 px-4 py-3 text-center shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50"
                  >
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {metric.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{metric.value}</p>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              {center.contact_phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {center.contact_phone}
                </span>
              )}
              {center.contact_email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {center.contact_email}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-sm font-medium text-primary">
              <span className="inline-flex items-center gap-1">
                Explore capabilities
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Tap to view details
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

