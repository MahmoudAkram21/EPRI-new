"use client"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { Zap, Rocket, TrendingUp } from "lucide-react"

export default function TechnologyInnovationSupportTISCPage() {
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
            <Zap className="h-3.5 w-3.5" />
            Technology Innovation Support
          </div>
          
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Technology Innovation Support TISC
          </h1>
          
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl mb-8">
            Supporting technology innovation and providing resources for research and development initiatives.
          </p>
        </div>
      </Section>

      {/* Content Section */}
      <Section>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Technology Innovation Support Center</CardTitle>
              <CardDescription>
                TISC provides comprehensive support for technology innovation and R&D activities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Content for Technology Innovation Support TISC page...
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </PageContainer>
  )
}

