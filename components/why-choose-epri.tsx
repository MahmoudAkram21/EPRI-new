"use client"

import { useState, useEffect } from "react"
import { Section } from "@/components/section"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedSection } from "@/components/animated-section"
import { apiClient } from "@/lib/api"
import { useLocale } from "next-intl"
import { 
  Award, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Shield, 
  FileCheck,
  Sparkles,
  Target,
  Zap
} from "lucide-react"
import Image from "next/image"

// Helper function to extract localized value
function getLocalizedValue(value: any, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || value.ar || ''
  }
  return ''
}

interface ISOCertificate {
  id: string
  title: string
  description?: string
  image_url: string
  certificate_type: string
  issued_date?: string
  expiry_date?: string
  issuer?: string
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Users,
  TrendingUp,
  Shield,
  Target,
  Zap,
  CheckCircle2,
  FileCheck,
  Sparkles,
}

export function WhyChooseEPRI() {
  const locale = useLocale()
  const [certificates, setCertificates] = useState<ISOCertificate[]>([])
  const [homeContent, setHomeContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certificatesResponse, homeContentResponse] = await Promise.all([
          apiClient.getISOCertificates(),
          apiClient.get('/home-content/why_choose').catch(() => ({ content: null }))
        ])
        
        setCertificates(certificatesResponse.certificates || [])
        setHomeContent(homeContentResponse.content)
      } catch (error) {
        console.error('Error fetching data:', error)
        setCertificates([])
        setHomeContent(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Default features if not in database
  const defaultFeatures = [
    {
      icon: "Award",
      title: { en: "ISO Certified Excellence", ar: "التميز المعتمد من ISO" },
      description: { en: "Internationally recognized quality management systems ensuring the highest standards", ar: "أنظمة إدارة الجودة المعترف بها دولياً التي تضمن أعلى المعايير" },
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: "Users",
      title: { en: "Expert Team", ar: "فريق خبير" },
      description: { en: "Leading researchers and industry professionals with decades of experience", ar: "باحثون رائدون ومهنيون في الصناعة مع عقود من الخبرة" },
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "TrendingUp",
      title: { en: "Cutting-Edge Research", ar: "بحث متطور" },
      description: { en: "Advanced technology and innovative solutions for the petroleum industry", ar: "تقنيات متقدمة وحلول مبتكرة لصناعة البترول" },
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "Shield",
      title: { en: "Trusted & Reliable", ar: "موثوق وموثوق به" },
      description: { en: "Proven track record with industry partners and government agencies", ar: "سجل حافل مع شركاء الصناعة والوكالات الحكومية" },
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "Target",
      title: { en: "Focused Excellence", ar: "التميز المركز" },
      description: { en: "Specialized expertise in petroleum research, analysis, and development", ar: "خبرة متخصصة في البحث والتحليل والتطوير البترولي" },
      color: "from-red-500 to-rose-500"
    },
    {
      icon: "Zap",
      title: { en: "Innovation Driven", ar: "مدفوع بالابتكار" },
      description: { en: "Continuous improvement and adoption of latest technologies and methodologies", ar: "التحسين المستمر واعتماد أحدث التقنيات والمنهجيات" },
      color: "from-indigo-500 to-violet-500"
    }
  ]

  const features = homeContent?.content?.features || defaultFeatures
  const sectionTitle = getLocalizedValue(homeContent?.title, locale) || "Why Choose EPRI?"
  const sectionSubtitle = getLocalizedValue(homeContent?.subtitle, locale) || "Excellence in petroleum research backed by international certifications and decades of expertise"
  const sectionDescription = getLocalizedValue(homeContent?.description, locale) || "EPRI maintains ISO 9001:2015 and ISO 45001:2018 certifications"

  return (
    <Section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              {sectionTitle}
            </Badge>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              {sectionTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {sectionSubtitle}
            </p>
          </div>
        </AnimatedSection>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature: any, index: number) => {
            const Icon = iconMap[feature.icon] || Award
            const title = getLocalizedValue(feature.title, locale)
            const description = getLocalizedValue(feature.description, locale)
            return (
              <AnimatedSection key={index} animation="fade-up" delay={index * 0.1}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border border-white/20 hover:border-primary/30">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color || 'from-blue-500 to-cyan-500'} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-center mb-3 text-foreground">
                      {title}
                    </h3>
                    <p className="text-muted-foreground text-center text-sm leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>

        {/* ISO Certificates Section */}
        {!loading && certificates.length > 0 && (
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <FileCheck className="h-6 w-6 text-primary" />
                <h3 className="font-serif text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ISO Certifications
                </h3>
              </div>
              <p className="text-muted-foreground">
                {sectionDescription}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {certificates.slice(0, 4).map((cert, index) => (
                <AnimatedSection key={cert.id} animation="fade-up" delay={index * 0.1}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border border-white/20 hover:border-primary/30">
                    <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                      <Image
                        src={cert.image_url || "/placeholder.svg"}
                        alt={cert.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold text-center mb-2 text-foreground">
                        {cert.title}
                      </h4>
                      {cert.certificate_type && (
                        <p className="text-xs text-center text-muted-foreground">
                          {cert.certificate_type}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            {certificates.length > 4 && (
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  And {certificates.length - 4} more certifications
                </p>
              </div>
            )}
          </AnimatedSection>
        )}

        {/* Fallback if no certificates from API */}
        {!loading && certificates.length === 0 && (
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <FileCheck className="h-6 w-6 text-primary" />
                <h3 className="font-serif text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  ISO Certifications
                </h3>
              </div>
              <p className="text-muted-foreground">
                EPRI maintains ISO 9001:2015 and ISO 45001:2018 certifications
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { title: "ISO 9001:2015", type: "Quality Management" },
                { title: "ISO 45001:2018", type: "Occupational Health & Safety" },
                { title: "ISO 17025", type: "Laboratory Competence" },
                { title: "Accredited", type: "International Standards" }
              ].map((cert, index) => (
                <AnimatedSection key={index} animation="fade-up" delay={index * 0.1}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border border-white/20 hover:border-primary/30">
                    <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                      <div className="text-center p-4">
                        <Award className="h-12 w-12 mx-auto mb-2 text-primary/50" />
                        <p className="text-xs text-muted-foreground">{cert.title}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold text-center mb-2 text-foreground">
                        {cert.title}
                      </h4>
                      <p className="text-xs text-center text-muted-foreground">
                        {cert.type}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </Section>
  )
}










