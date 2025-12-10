"use client"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Handshake, Globe, Calendar, Building2, CheckCircle2, ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { useTranslations } from "next-intl"

export interface Agreement {
  id: string
  title: string
  type: string
  date: string
  status: string
  description: string
  category: string
  image: string
  icon: typeof FileText
  color: string
  content?: string
  partner?: string
  duration?: string
  objectives?: string[]
}

export default function ProtocolsAgreementsPage() {
  const t = useTranslations()
  
  const agreements: Agreement[] = [
    {
      id: "1",
      title: "Memorandum of Understanding with Cairo University",
      type: "Academic Partnership",
      date: "2024-01-15",
      status: "Active",
      description: "Collaborative research and student exchange program focusing on petroleum engineering",
      category: "Academic",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      partner: "Cairo University",
      duration: "5 years",
      objectives: [
        "Joint research projects in petroleum engineering",
        "Student and faculty exchange programs",
        "Shared laboratory facilities",
        "Collaborative publications"
      ]
    },
    {
      id: "2",
      title: "Research Collaboration Agreement with Shell Egypt",
      type: "Industry Partnership",
      date: "2023-06-20",
      status: "Active",
      description: "Joint research initiatives in enhanced oil recovery and sustainable energy solutions",
      category: "Industry",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      icon: Handshake,
      color: "from-green-500 to-green-600",
      partner: "Shell Egypt",
      duration: "3 years",
      objectives: [
        "Enhanced oil recovery research",
        "Sustainable energy solutions",
        "Technology development",
        "Industry best practices sharing"
      ]
    },
    {
      id: "3",
      title: "International Exchange Program with MIT",
      type: "International Partnership",
      date: "2023-09-10",
      status: "Active",
      description: "Faculty and student exchange program for advanced petroleum research",
      category: "International",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
      icon: Globe,
      color: "from-purple-500 to-purple-600",
      partner: "Massachusetts Institute of Technology",
      duration: "4 years",
      objectives: [
        "Faculty exchange programs",
        "Student research opportunities",
        "Joint publications",
        "Technology transfer"
      ]
    },
    {
      id: "4",
      title: "Technology Transfer Agreement with BP",
      type: "Technology Partnership",
      date: "2022-11-05",
      status: "Active",
      description: "Sharing of advanced drilling and production technologies",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      icon: Building2,
      color: "from-orange-500 to-orange-600",
      partner: "BP",
      duration: "3 years",
      objectives: [
        "Advanced drilling technologies",
        "Production optimization",
        "Training programs",
        "Technical support"
      ]
    },
    {
      id: "5",
      title: "Environmental Research Protocol with Green Energy Initiative",
      type: "Environmental Partnership",
      date: "2024-03-12",
      status: "Active",
      description: "Collaborative research on environmental impact and sustainable practices",
      category: "Environmental",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop",
      icon: CheckCircle2,
      color: "from-cyan-500 to-cyan-600",
      partner: "Green Energy Initiative",
      duration: "5 years",
      objectives: [
        "Environmental impact assessment",
        "Sustainable practices research",
        "Carbon footprint reduction",
        "Renewable energy integration"
      ]
    },
    {
      id: "6",
      title: "Training and Development Agreement with EGPC",
      type: "Government Partnership",
      date: "2023-04-18",
      status: "Active",
      description: "Professional development programs for petroleum industry personnel",
      category: "Government",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
      icon: FileText,
      color: "from-indigo-500 to-indigo-600",
      partner: "Egyptian General Petroleum Corporation",
      duration: "Ongoing",
      objectives: [
        "Professional training programs",
        "Skill development workshops",
        "Certification courses",
        "Knowledge transfer"
      ]
    }
  ]

  const categories = Array.from(new Set(agreements.map(a => a.category)))

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('/modern-university-library-students-studying.jpg')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.4) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-blue-600/80 to-purple-600/90"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Partnerships & Collaboration
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Protocols & Agreements
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Formal partnerships and collaborative frameworks that strengthen our research capabilities and expand our global reach
            </p>
          </div>
        </div>
      </Section>

      {/* Agreements Grid */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-slate-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
              Active Agreements
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our current partnerships and collaborative agreements
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agreements.map((agreement, index) => {
            return (
              <AnimatedSection key={agreement.id} animation="fade-up" delay={index * 0.1}>
                <Link href={`/about/protocols-agreements/${agreement.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer">
                    {/* Image */}
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={agreement.image || "/placeholder.svg"}
                        alt={agreement.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-500 text-white">
                          {agreement.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader>
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(agreement.date).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <CardTitle className="text-xl font-serif line-clamp-2 group-hover:text-primary transition-colors mb-3">
                        {agreement.title}
                      </CardTitle>
                      
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {agreement.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {agreement.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Description */}
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {agreement.description}
                      </p>
                      
                      {/* More Button */}
                      <Button 
                        variant="default" 
                        className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:bg-green-700"
                      >
                        <span className="mr-2">{t('common.more')}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>

      {/* Statistics */}
      <Section className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-slate-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
              Partnership Overview
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Agreements", value: agreements.length.toString(), icon: FileText },
            { label: "Partnership Categories", value: categories.length.toString(), icon: Handshake },
            { label: "International Partners", value: agreements.filter(a => a.category === "International").length.toString(), icon: Globe },
            { label: "Industry Partners", value: agreements.filter(a => a.category === "Industry").length.toString(), icon: Building2 }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <AnimatedSection key={stat.label} animation="fade-up" delay={index * 0.1}>
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <CardTitle className="text-lg font-serif text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>
    </PageContainer>
  )
}

