import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Handshake, Globe, Briefcase, Users, Award } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import Image from "next/image"

export default function ClientsPartnersPage() {
  const partners = [
    {
      name: "Egyptian General Petroleum Corporation",
      type: "Government",
      description: "Strategic partnership in petroleum research and development",
      logo: "/placeholder.svg?height=100&width=200",
      category: "Industry Partner"
    },
    {
      name: "Shell Egypt",
      type: "International",
      description: "Collaborative research projects and technology transfer",
      logo: "/placeholder.svg?height=100&width=200",
      category: "International Partner"
    },
    {
      name: "Cairo University",
      type: "Academic",
      description: "Joint academic programs and research initiatives",
      logo: "/placeholder.svg?height=100&width=200",
      category: "Academic Partner"
    },
    {
      name: "BP Egypt",
      type: "International",
      description: "Energy research and environmental studies collaboration",
      logo: "/placeholder.svg?height=100&width=200",
      category: "Industry Partner"
    },
    {
      name: "Alexandria University",
      type: "Academic",
      description: "Shared research facilities and student exchange programs",
      logo: "/placeholder.svg?height=100&width=200",
      category: "Academic Partner"
    },
    {
      name: "Eni Egypt",
      type: "International",
      description: "Technology innovation and sustainable energy solutions",
      logo: "/placeholder.svg?height=100&width=200",
      category: "Industry Partner"
    }
  ]

  const clientCategories = [
    { name: "Government Agencies", count: 15, icon: Building2, color: "from-blue-500 to-blue-600" },
    { name: "International Companies", count: 25, icon: Globe, color: "from-green-500 to-green-600" },
    { name: "Academic Institutions", count: 20, icon: Briefcase, color: "from-purple-500 to-purple-600" },
    { name: "Research Organizations", count: 12, icon: Users, color: "from-orange-500 to-orange-600" }
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
        
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-red-600/80 to-pink-600/90"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Partnerships
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-pink-200 bg-clip-text text-transparent leading-tight">
              Our Clients & Partners
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Building strong relationships with industry leaders, academic institutions, and government agencies to advance petroleum research and innovation
            </p>
          </div>
        </div>
      </Section>

      {/* Partner Categories */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 dark:from-slate-100 dark:via-orange-100 dark:to-red-100 bg-clip-text text-transparent">
              Partner Network
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our diverse network of partners spans across government, industry, and academia
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {clientCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <AnimatedSection key={category.name} animation="fade-up" delay={index * 0.1}>
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{category.count}</div>
                    <CardTitle className="text-lg font-serif text-muted-foreground">
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>

      {/* Partners Grid */}
      <Section className="bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-900 dark:to-orange-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 dark:from-slate-100 dark:via-orange-100 dark:to-red-100 bg-clip-text text-transparent">
              Featured Partners
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Some of our key partners and collaborators
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
            <AnimatedSection key={partner.name} animation="fade-up" delay={index * 0.1}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 group border border-white/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900"></div>
                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-center mb-4 h-24 bg-white dark:bg-slate-800 rounded-lg p-4 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={partner.logo || "/placeholder.svg"}
                      alt={partner.name}
                      width={200}
                      height={100}
                      className="object-contain max-h-20"
                    />
                  </div>
                  <CardTitle className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">
                    {partner.name}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit mb-2">
                    {partner.type}
                  </Badge>
                  <Badge variant="outline" className="w-fit ml-2">
                    {partner.category}
                  </Badge>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-muted-foreground leading-relaxed">
                    {partner.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Partnership Benefits */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 dark:from-slate-100 dark:via-orange-100 dark:to-red-100 bg-clip-text text-transparent">
              Why Partner With Us
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Cutting-Edge Research",
              description: "Access to state-of-the-art facilities and innovative research methodologies",
              icon: Handshake,
              color: "from-blue-500 to-blue-600"
            },
            {
              title: "Expert Team",
              description: "Collaborate with leading researchers and industry experts",
              icon: Users,
              color: "from-green-500 to-green-600"
            },
            {
              title: "Global Network",
              description: "Connect with our extensive international partner network",
              icon: Globe,
              color: "from-purple-500 to-purple-600"
            }
          ].map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <AnimatedSection key={benefit.title} animation="fade-up" delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-serif">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>
    </PageContainer>
  )
}

