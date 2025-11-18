import { notFound } from "next/navigation"
import { Metadata } from "next"
import { MapPin, Phone, Mail, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ServiceCenterTabs } from "@/components/service-center-tabs"
import type { ServiceCenter } from "@/types/service-center"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api"

type ServiceCenterResponse = {
  center: ServiceCenter
}

async function fetchServiceCenter(slug: string): Promise<ServiceCenter | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/service-centers/${slug}`, {
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      return null
    }

    const data = (await response.json()) as ServiceCenterResponse
    if (!data.center) {
      return null
    }

    return {
      equipments: [],
      products: [],
      services: [],
      metrics: {},
      ...data.center,
      equipments: Array.isArray(data.center.equipments) ? data.center.equipments : [],
      products: Array.isArray(data.center.products) ? data.center.products : [],
      services: Array.isArray(data.center.services) ? data.center.services : [],
      metrics: typeof data.center.metrics === "object" && data.center.metrics !== null ? data.center.metrics : undefined
    }
  } catch (error) {
    console.error("Failed to fetch service center", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const center = await fetchServiceCenter(params.slug)
  if (!center) {
    return {
      title: "Service Center | EPRI",
      description: "Detailed insights into EPRI service centers."
    }
  }

  return {
    title: `${center.name} | EPRI Service Centers`,
    description: center.headline || center.description || "Explore EPRI center capabilities."
  }
}

export default async function ServiceCenterDetailPage({ params }: { params: { slug: string } }) {
  const center = await fetchServiceCenter(params.slug)

  if (!center) {
    notFound()
  }

  return (
    <PageContainer>
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={center.banner_image || center.image || "/petroleum-lab-testing.jpg"}
            alt={center.name}
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-800/85" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8">
          <Button
            asChild
            variant="outline"
            className="w-fit rounded-full border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
          >
            <Link href="/service-centers" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to centers
            </Link>
          </Button>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
            Service Center
          </Badge>
              {center.is_featured && (
                <Badge className="rounded-full border-emerald-400/50 bg-emerald-500/20 px-4 py-1.5 text-xs font-semibold text-emerald-100 backdrop-blur-sm">
                  <Sparkles className="mr-1.5 h-3 w-3" />
                  Flagship
                </Badge>
              )}
              {center.location && (
                <Badge className="inline-flex items-center gap-2 rounded-full border-white/30 bg-white/10 px-4 py-1.5 text-xs backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5" />
                  {center.location}
                </Badge>
              )}
            </div>
            
            <div className="space-y-4">
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                {center.name}
              </h1>
              {center.headline && (
                <p className="max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
                  {center.headline}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {(center.contact_phone || center.contact_email) && (
            <div className="flex flex-wrap gap-3">
              {center.contact_phone && (
                <a
                  href={`tel:${center.contact_phone}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
                >
                  <Phone className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {center.contact_phone}
                </a>
              )}
              {center.contact_email && (
                <a
                  href={`mailto:${center.contact_email}`}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
                >
                  <Mail className="h-4 w-4 transition-transform group-hover:scale-110" />
                  {center.contact_email}
                </a>
              )}
            </div>
          )}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-8">
              {center.description && (
                <div className="group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-white to-slate-50/50 p-8 shadow-xl ring-1 ring-slate-200/50 transition-all hover:shadow-2xl dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:ring-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-slate-100">
                        Center Overview
                      </h2>
                    </div>
                    <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {center.description}
                    </p>
                  </div>
                </div>
              )}

              <ServiceCenterTabs center={center} />
            </div>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* Key Metrics Card */}
          <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-white via-slate-50/80 to-white p-6 shadow-xl ring-1 ring-slate-200/50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 dark:ring-slate-800">
            <div className="mb-6 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Key Metrics</h3>
            </div>
            <div className="grid gap-4">
              {center.work_volume?.totalIncomeRate !== undefined && (
                <MetricBadge
                  label="Total Income Rate"
                  value={`${center.work_volume.totalIncomeRate.toLocaleString()} ${center.work_volume.currency ?? "EGP"}`}
                />
              )}
              {center.company_activity?.totalProjects !== undefined && (
                <MetricBadge label="Active Projects" value={`${center.company_activity.totalProjects}+`} />
              )}
              {center.services.length > 0 && (
                <MetricBadge label="Specialized Services" value={`${center.services.length}`} />
              )}
              {center.equipments.length > 0 && (
                <MetricBadge label="Core Equipment" value={`${center.equipments.length}`} />
              )}
            </div>
          </div>

          {/* Collaboration Card */}
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-white p-6 shadow-lg ring-1 ring-primary/10 dark:border-primary/30 dark:from-primary/20 dark:via-primary/10 dark:to-slate-900">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-primary/90">Collaborate</h3>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              Engage with EPRI experts to design a bespoke research or testing programme aligned with your objectives.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild className="rounded-full bg-primary font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40">
                <Link href="/contact">Start A Collaboration</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-primary/40 font-medium text-primary transition-all hover:border-primary/60 hover:bg-primary/10"
              >
                <Link href="/services">Explore Complementary Services</Link>
              </Button>
            </div>
          </div>
        </aside>
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}

function MetricBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/50 p-4 shadow-sm ring-1 ring-slate-200/30 transition-all hover:border-primary/30 hover:shadow-md hover:ring-primary/20 dark:border-slate-700 dark:from-slate-900/80 dark:to-slate-950 dark:ring-slate-800">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10 flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</span>
      </div>
    </div>
  )
}


