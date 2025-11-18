import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Handshake, Globe, Calendar, Building2, CheckCircle2 } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"

export default function ProtocolsAgreementsPage() {
  const agreements = [
    {
      title: "Memorandum of Understanding with Cairo University",
      type: "Academic Partnership",
      date: "2024",
      status: "Active",
      description: "Collaborative research and student exchange program focusing on petroleum engineering",
      category: "Academic",
      icon: FileText,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Research Collaboration Agreement with Shell Egypt",
      type: "Industry Partnership",
      date: "2023",
      status: "Active",
      description: "Joint research initiatives in enhanced oil recovery and sustainable energy solutions",
      category: "Industry",
      icon: Handshake,
      color: "from-green-500 to-green-600"
    },
    {
      title: "International Exchange Program with MIT",
      type: "International Partnership",
      date: "2023",
      status: "Active",
      description: "Faculty and student exchange program for advanced petroleum research",
      category: "International",
      icon: Globe,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Technology Transfer Agreement with BP",
      type: "Technology Partnership",
      date: "2022",
      status: "Active",
      description: "Sharing of advanced drilling and production technologies",
      category: "Technology",
      icon: Building2,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Environmental Research Protocol with Green Energy Initiative",
      type: "Environmental Partnership",
      date: "2024",
      status: "Active",
      description: "Collaborative research on environmental impact and sustainable practices",
      category: "Environmental",
      icon: CheckCircle2,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      title: "Training and Development Agreement with EGPC",
      type: "Government Partnership",
      date: "2023",
      status: "Active",
      description: "Professional development programs for petroleum industry personnel",
      category: "Government",
      icon: FileText,
      color: "from-indigo-500 to-indigo-600"
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
            const Icon = agreement.icon
            return (
              <AnimatedSection key={agreement.title} animation="fade-up" delay={index * 0.1}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border border-white/20 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900"></div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${agreement.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {agreement.date}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">
                      {agreement.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="w-fit">
                        {agreement.type}
                      </Badge>
                      <Badge variant="outline" className="w-fit">
                        {agreement.category}
                      </Badge>
                      <Badge className="bg-green-500 text-white">
                        {agreement.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-muted-foreground leading-relaxed">
                      {agreement.description}
                    </p>
                  </CardContent>
                </Card>
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

