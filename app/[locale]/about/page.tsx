"use client"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  BookOpen, 
  Users, 
  Award, 
  FileCheck, 
  Building2, 
  Handshake, 
  GraduationCap,
  ArrowRight,
  CheckCircle2
} from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { usePageContent } from "@/hooks/use-page-content"

export default function AboutPage() {
  const { title, subtitle, description, loading } = usePageContent({ 
    pageKey: 'about', 
    sectionKey: 'overview' 
  })
  const aboutSections = [
    {
      href: "/about/overview",
      label: "Overview",
      icon: BookOpen,
      description: "Learn about EPRI's mission, vision, and core values",
      color: "from-blue-500 to-blue-600"
    },
    {
      href: "/about/top-management",
      label: "Top Management",
      icon: Users,
      description: "Meet our leadership team and executive board",
      color: "from-purple-500 to-purple-600"
    },
    {
      href: "/about/iso-certificate",
      label: "Accreditation (ISO Certificates)",
      icon: FileCheck,
      description: "View our certifications and quality standards",
      color: "from-green-500 to-green-600"
    },
    {
      href: "/about/awards",
      label: "Awards",
      icon: Award,
      description: "Recognitions and achievements we've earned",
      color: "from-yellow-500 to-yellow-600"
    },
    {
      href: "/about/clients-partners",
      label: "Our Clients & Partners",
      icon: Handshake,
      description: "Our trusted partners and client network",
      color: "from-orange-500 to-orange-600"
    },
    {
      href: "/about/schools",
      label: "Schools",
      icon: GraduationCap,
      description: "Educational programs and academic divisions",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      href: "/about/protocols-agreements",
      label: "Protocols & Agreements",
      icon: Building2,
      description: "Partnership agreements and collaborative frameworks",
      color: "from-indigo-500 to-indigo-600"
    }
  ]

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
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-cyan-600/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/40 via-transparent to-blue-500/40"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              {subtitle || "About EPRI"}
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              {title || "About Us"}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              {description || "Discover the Egyptian Petroleum Research Institute - our history, leadership, achievements, and partnerships that drive excellence in petroleum research and education."}
            </p>
          </div>
        </div>
      </Section>

      {/* Navigation Cards */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Explore Our Organization
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Navigate through different aspects of EPRI to learn more about who we are and what we do
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aboutSections.map((section, index) => {
            const Icon = section.icon
            return (
              <AnimatedSection key={section.href} animation="fade-up" delay={index * 0.1}>
                <Link href={section.href}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group border border-white/20 cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900"></div>
                    <CardHeader className="relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors">
                        {section.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {section.description}
                      </p>
                      <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                        <span className="text-sm">Learn more</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>

      {/* Quick Stats */}
      <Section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              EPRI at a Glance
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Years of Excellence", value: "50+", icon: Award },
            { label: "Research Projects", value: "500+", icon: BookOpen },
            { label: "Partners", value: "100+", icon: Handshake },
            { label: "Awards & Recognition", value: "50+", icon: CheckCircle2 }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <AnimatedSection key={stat.label} animation="fade-up" delay={index * 0.1}>
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
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

