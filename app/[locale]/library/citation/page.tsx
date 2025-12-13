"use client"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { ExternalLink, TrendingUp, BarChart3, Award } from "lucide-react"

const SCIVAL_URL = "https://id.elsevier.com/as/authorization.oauth2?platSite=SVE%2FSciVal&ui_locales=en-JS&scope=openid+profile+email+els_auth_info+els_analytics_info&response_type=code&redirect_uri=https%3A%2F%2Fwww.scival.com%2Fidp%2Fcode&prompt=login&client_id=SCIVAL"

export default function CitationPage() {
  const t = useTranslations()

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm mb-6">
            <TrendingUp className="h-3.5 w-3.5" />
            Research Impact
          </div>
          
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            {t('nav.citation.title')}
          </h1>
          
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl mb-8">
            {t('nav.citation.description')}
          </p>
        </div>
      </Section>

      {/* Main Content */}
      <Section>
        <div className="space-y-8">
          <Card className="border-slate-200/80 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-2xl">{t('nav.citation.title')}</CardTitle>
              <CardDescription className="text-base">
                {t('nav.citation.sciValDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-lg border border-blue-200/50 dark:border-slate-700">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    SciVal Platform
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    Access comprehensive citation metrics, research impact analysis, and collaboration insights through Elsevier's SciVal platform.
                  </p>
                </div>
                <Button
                  size="lg"
                  className="shrink-0"
                  asChild
                >
                  <a
                    href={SCIVAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    {t('nav.citation.linkToSciVal')}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <Award className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Citation Metrics</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Track citation counts, h-index, and other impact metrics
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <TrendingUp className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Research Impact</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Analyze research performance and impact trends
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <BarChart3 className="h-8 w-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Collaboration Insights</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Explore collaboration networks and partnerships
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageContainer>
  )
}

