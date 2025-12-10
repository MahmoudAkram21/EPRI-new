"use client"

import { useState, useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Download, Calendar, BookOpen } from "lucide-react"
import { apiClient } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"

interface AnnualReport {
  id: string
  year: number
  title: string | { en: string; ar: string }
  description?: string | { en: string; ar: string }
  cover_image?: string
  pdf_url?: string
  is_published: boolean
  created_at: string
}

type TranslationObject = { en: string; ar: string } | string

function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || ''
  }
  return ''
}

export default function AnnualReportPage() {
  const locale = useLocale()
  const t = useTranslations()
  const [reports, setReports] = useState<AnnualReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        // TODO: Replace with actual API endpoint
        // const response = await apiClient.getAnnualReports()
        // setReports(response.reports || [])
        setReports([]) // Placeholder
      } catch (err) {
        console.error('Failed to fetch annual reports:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm mb-6">
            <FileText className="h-3.5 w-3.5" />
            {t('annualReport.title')}
          </div>
          
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            {t('annualReport.title')}
          </h1>
          
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl mb-8">
            {t('annualReport.description')}
          </p>
        </div>
      </Section>

      {/* Reports Grid */}
      <Section>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80 mb-2">
              {t('annualReport.reports')}
            </p>
            <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {t('annualReport.allReports')}
            </h2>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[400px] rounded-2xl" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <Card className="border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <FileText className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
              <p className="text-base text-slate-500 dark:text-slate-400">
                {t('annualReport.noReports')}
              </p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <Card key={report.id} className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm ring-1 ring-slate-200/30 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/20 dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800">
                  {/* Cover Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    {report.cover_image ? (
                      <Image
                        src={report.cover_image}
                        alt={getTranslation(report.title, locale)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FileText className="h-16 w-16 text-slate-400 dark:text-slate-600" />
                      </div>
                    )}
                    <Badge className="absolute top-3 right-3 rounded-full border-white/30 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary shadow-sm">
                      {report.year}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                      {getTranslation(report.title, locale)}
                    </CardTitle>
                    {report.description && (
                      <CardDescription className="line-clamp-3 mt-1">
                        {getTranslation(report.description, locale)}
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>{report.year}</span>
                    </div>
                  </CardContent>

                  <CardContent className="pt-0">
                    {report.pdf_url ? (
                      <Button className="w-full" size="sm" asChild>
                        <a href={report.pdf_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          {t('annualReport.download')}
                        </a>
                      </Button>
                    ) : (
                      <Button className="w-full" size="sm" variant="outline" disabled>
                        {t('annualReport.comingSoon')}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Section>
    </PageContainer>
  )
}

