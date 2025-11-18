"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUpRight, DownloadCloud, MapPin } from "lucide-react"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ServiceCenterCard } from "@/components/service-center-card"
import { apiClient } from "@/lib/api"
import type { ServiceCenter } from "@/types/service-center"

export default function ServiceCentersPage() {
  const [centers, setCenters] = useState<ServiceCenter[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const typeFilter = searchParams.get('type') // 'center' or 'unit'

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await apiClient.getServiceCenters()
        const parsed = (response.centers ?? []).map((center: any) => ({
          equipments: [],
          products: [],
          services: [],
          ...center,
          equipments: Array.isArray(center.equipments) ? center.equipments : [],
          products: Array.isArray(center.products) ? center.products : [],
          services: Array.isArray(center.services) ? center.services : []
        }))
        setCenters(parsed)
      } catch (error) {
        console.error("Failed to load service centers:", error)
        setCenters([])
      } finally {
        setLoading(false)
      }
    }

    fetchCenters()
  }, [])

  // Filter centers based on type query parameter
  const filteredCenters = typeFilter 
    ? centers.filter(center => (center.type || 'center') === typeFilter)
    : centers

  const featuredCenters = filteredCenters.filter(center => center.is_featured)

  return (
    <PageContainer>
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/petroleum-lab-testing.jpg"
            alt="Service centers background"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
          >
            Centers Of Excellence
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
          >
            Service Centers Driving Innovation Across Egypt’s Energy Landscape
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-3xl text-base text-slate-200/85 sm:text-lg"
          >
            Explore our accredited service centers delivering laboratory excellence, production optimization, and
            future-fuel innovations. Each center blends advanced instrumentation, expert teams, and high-impact programs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="group rounded-full bg-white text-slate-900 hover:bg-slate-100">
              <Link href="#centers-grid">
                Preview Service Centers
                <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-slate-900"
              asChild
            >
              <Link href="/contact">
                Request A Collaboration Brief
                <DownloadCloud className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-4 text-xs text-slate-200/80"
          >
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {loading ? "Loading centers..." : `${filteredCenters.length} Active ${typeFilter === 'center' ? 'centers' : typeFilter === 'unit' ? 'units' : 'centers & units'}`}
            </Badge>
            {featuredCenters.length > 0 && (
              <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
                {featuredCenters.length} Flagship programmes
              </Badge>
            )}
          </motion.div>
        </div>
      </Section>

      <Section id="centers-grid" className="space-y-12">
        {featuredCenters.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80">Featured</p>
                <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
                  Flagship Service Centers
                </h2>
              </div>
              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Flagship hubs delivering high-impact testing, analytics, and innovation programmes for regional
                partners. Each center is fully accredited and operated by domain-leading experts.
              </p>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {featuredCenters.map((center, index) => (
                <ServiceCenterCard key={center.id} center={center} index={index} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80">Centers Portfolio</p>
              <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
                Discover Specialized Capabilities
              </h2>
            </div>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Navigate through our service centers by domain. Each profile details equipment, methodology, performance
              analytics, and future roadmap to help you collaborate with confidence.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
                  key={index}
                  className="h-[340px] rounded-2xl border border-slate-200/60 dark:border-slate-800"
                />
              ))}
            </div>
          ) : filteredCenters.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <p className="mx-auto max-w-xl text-base text-slate-500 dark:text-slate-400">
                We are finalizing the service center portfolio. Please check back soon or contact our partnerships team
                for tailored information.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredCenters.map((center, index) => (
                <ServiceCenterCard key={center.id} center={center} index={index} />
              ))}
            </div>
          )}
        </div>

        {!loading && filteredCenters.length > 0 && (
          <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-white p-10 shadow-xl dark:border-slate-700 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80">
                  Partner With EPRI
                </p>
                <h3 className="mt-2 font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
                  Need a tailored service engagement?
                </h3>
                <p className="mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-400">
                  Our team can design a custom package combining laboratory testing, production optimization, and
                  innovation programs across multiple centers.
                </p>
              </div>
              <div className="flex flex-col gap-4 text-sm text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Nasr City • Smart Village • New Administrative Capital
                </span>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="rounded-full">
                    <Link href="/contact">Talk With Our Team</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href="/services">Browse Specialized Services</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Section>
    </PageContainer>
  )
}


