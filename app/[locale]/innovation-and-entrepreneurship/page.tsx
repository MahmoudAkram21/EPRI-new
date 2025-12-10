"use client"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Lightbulb, 
  Rocket, 
  Target, 
  Users, 
  TrendingUp,
  Award,
  Briefcase,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Building2,
  Handshake
} from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { useTranslations } from "next-intl"

export default function InnovationAndEntrepreneurshipPage() {
  const t = useTranslations()
  const initiatives = [
    {
      title: "Startup Incubation",
      description: "Supporting early-stage startups with mentorship, resources, and access to industry networks",
      icon: Rocket,
      color: "from-blue-500 to-cyan-600"
    },
    {
      title: "Innovation Labs",
      description: "State-of-the-art facilities for research, prototyping, and product development",
      icon: Lightbulb,
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Entrepreneurship Training",
      description: "Comprehensive programs to develop business skills and entrepreneurial mindset",
      icon: GraduationCap,
      color: "from-orange-500 to-red-600"
    },
    {
      title: "Industry Partnerships",
      description: "Connecting innovators with established companies and investors",
      icon: Handshake,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Technology Transfer",
      description: "Bridging the gap between research and commercialization",
      icon: Zap,
      color: "from-indigo-500 to-blue-600"
    },
    {
      title: "Market Access",
      description: "Helping entrepreneurs reach global markets and scale their businesses",
      icon: Globe,
      color: "from-teal-500 to-cyan-600"
    }
  ]

  const benefits = [
    {
      title: "Access to Expertise",
      description: "Connect with leading researchers, industry experts, and successful entrepreneurs"
    },
    {
      title: "Funding Opportunities",
      description: "Access to grants, seed funding, and investment networks"
    },
    {
      title: "Networking Events",
      description: "Regular workshops, pitch sessions, and networking opportunities"
    },
    {
      title: "Mentorship Programs",
      description: "One-on-one guidance from experienced mentors and advisors"
    },
    {
      title: "Research Facilities",
      description: "State-of-the-art laboratories and equipment for product development"
    },
    {
      title: "Market Validation",
      description: "Support in testing and validating your ideas with real market data"
    }
  ]

  const stats = [
    { label: "Startups Supported", value: "50+", icon: Rocket },
    { label: "Innovation Projects", value: "200+", icon: Lightbulb },
    { label: "Industry Partners", value: "30+", icon: Building2 },
    { label: "Success Rate", value: "75%", icon: TrendingUp }
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
        
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-pink-600/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/40 via-transparent to-purple-500/40"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              {t('nav.innovation.title')}
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              {t('nav.innovation.title')}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Fostering innovation, supporting entrepreneurs, and transforming ideas into successful businesses in the petroleum and energy sector.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white text-white hover:bg-white/20"
                asChild
              >
                <Link href="#initiatives">Explore Programs</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Overview Section */}
      <Section>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection animation="fade-up">
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                Our Mission
              </Badge>
              <h2 className="font-serif text-4xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-slate-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
                Empowering Innovators and Entrepreneurs
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                At EPRI, we believe that innovation and entrepreneurship are the driving forces behind sustainable growth 
                in the petroleum and energy sector. Our Innovation and Entrepreneurship program is designed to support 
                researchers, innovators, and entrepreneurs in transforming their ideas into viable businesses.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We provide comprehensive support including mentorship, access to research facilities, funding opportunities, 
                and connections to industry partners and investors. Our goal is to create an ecosystem where innovation 
                thrives and entrepreneurs succeed.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-sm">Innovation Labs</Badge>
                <Badge variant="outline" className="text-sm">Startup Incubation</Badge>
                <Badge variant="outline" className="text-sm">Mentorship</Badge>
                <Badge variant="outline" className="text-sm">Funding Support</Badge>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-up" delay={0.2}>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Lightbulb className="h-24 w-24 mx-auto mb-4 opacity-80" />
                  <p className="text-xl font-semibold">Transforming Ideas Into Reality</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Key Initiatives Section */}
      <Section id="initiatives" className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-slate-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
              Our Key Initiatives
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive programs and services designed to support innovation and entrepreneurship
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initiatives.map((initiative, index) => {
            const Icon = initiative.icon
            return (
              <AnimatedSection key={initiative.title} animation="fade-up" delay={index * 0.1}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border border-white/20 cursor-pointer overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900"></div>
                  <CardHeader className="relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${initiative.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors">
                      {initiative.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground leading-relaxed">
                      {initiative.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>

      {/* Benefits Section */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-slate-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
              Why Choose Our Program?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the advantages of joining our innovation and entrepreneurship ecosystem
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <AnimatedSection key={benefit.title} animation="fade-up" delay={index * 0.1}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-all duration-300">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-indigo-900/20 dark:to-purple-900/20">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Impact
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Numbers that reflect our commitment to innovation and entrepreneurship
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <AnimatedSection key={stat.label} animation="fade-up" delay={index * 0.1}>
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
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

      {/* Success Stories Section */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-slate-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real stories from innovators and entrepreneurs who transformed their ideas into successful businesses
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Energy Efficiency Solutions",
              description: "A startup that developed innovative solutions for reducing energy consumption in petroleum refineries, now serving major industry players.",
              icon: Zap
            },
            {
              title: "Environmental Technology",
              description: "An entrepreneur who created advanced water treatment technologies for the petroleum industry, expanding to international markets.",
              icon: Globe
            },
            {
              title: "Digital Transformation",
              description: "A tech startup that revolutionized data analytics for oil and gas operations, securing significant investment and partnerships.",
              icon: TrendingUp
            }
          ].map((story, index) => {
            const Icon = story.icon
            return (
              <AnimatedSection key={story.title} animation="fade-up" delay={index * 0.15}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {story.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <AnimatedSection animation="fade-up">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Idea?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join our innovation and entrepreneurship program and take your idea to the next level. 
              Get access to resources, mentorship, and opportunities that can help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                  Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white text-white hover:bg-white/20"
                asChild
              >
                <Link href="/about">Learn More About EPRI</Link>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageContainer>
  )
}

