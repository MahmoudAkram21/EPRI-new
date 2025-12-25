'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, ArrowUpRight } from 'lucide-react'

import { Section } from '@/components/section'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ServiceCenterCard } from '@/components/service-center-card'
import { apiClient } from '@/lib/api'
import type { ServiceCenter } from '@/types/service-center'

export function HomeServiceCentersPreview() {
  const [centers, setCenters] = useState<ServiceCenter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedCenters = async () => {
      try {
        const response = await apiClient.getServiceCenters({ featured: true })
        const parsed = (response.centers ?? []).map((center: any) => ({
          ...center,
          equipments: Array.isArray(center.equipments) ? center.equipments : [],
          products: Array.isArray(center.products) ? center.products : [],
          services: Array.isArray(center.services) ? center.services : []
        }))
        setCenters(parsed.slice(0, 3))
      } catch (error) {
        console.error('Failed to load featured service centers:', error)
        setCenters([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCenters()
  }, [])

  return (
    <Section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-white shadow-2xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="absolute inset-y-0 left-0 h-full w-1/2 bg-[url('/spectrophotometer-equipment.jpg')] bg-cover bg-center opacity-10 mix-blend-luminosity dark:opacity-20" />
      <div className="relative space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-primary"
            >
              Service Centers
              <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.05, duration: 0.55 }}
              className="mt-3 font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100 md:text-4xl"
            >
              Accredited hubs empowering industry breakthroughs
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.1, duration: 0.55 }}
              className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-400"
            >
              Explore how our flagship centers combine advanced instrumentation, expert teams, and future-focused
              programs to accelerate your research and operational goals.
            </motion.p>
          </div>

          <Button asChild className="group w-full rounded-full md:w-auto">
            <Link href="/service-centers">
              View all centers
              <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
                key={index}
                className="h-[320px] rounded-2xl border border-slate-200/60 dark:border-slate-800"
              />
            ))}
          </div>
        ) : centers.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 p-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
            <Building2 className="h-8 w-8 text-slate-400 dark:text-slate-500" />
            <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
              Our team is finalizing the featured center showcase. Discover the full portfolio or reach out to tailor a
              collaborative program.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {centers.map((center, index) => (
              <ServiceCenterCard key={center.id} center={center} index={index} />
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}


