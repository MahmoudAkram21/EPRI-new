import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen, Users, Award, Microscope, Building2, MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import Link from "next/link"
import Image from "next/image"

export default function SchoolsPage() {
  const schools = [
    {
      id: 'petroleum-engineering',
      name: "School of Petroleum Engineering",
      slug: "petroleum-engineering",
      description: "Comprehensive programs in drilling, production, and reservoir engineering. Our school offers cutting-edge education and research opportunities in all aspects of petroleum engineering.",
      fullDescription: "The School of Petroleum Engineering at EPRI provides comprehensive education and research programs covering drilling operations, production optimization, reservoir characterization, and enhanced oil recovery techniques. Our curriculum combines theoretical knowledge with practical applications, preparing students for successful careers in the petroleum industry.",
      programs: [
        { level: "Bachelor's", name: "Petroleum Engineering", duration: "4 years" },
        { level: "Master's", name: "Reservoir Engineering", duration: "2 years" },
        { level: "Master's", name: "Drilling Engineering", duration: "2 years" },
        { level: "PhD", name: "Production Engineering", duration: "3-5 years" }
      ],
      students: 450,
      faculty: 25,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      location: "Main Campus, Building A",
      contact: {
        phone: "+(202) 22747847",
        email: "petroleum.eng@epri.edu.eg"
      },
      researchAreas: [
        "Reservoir Simulation",
        "Enhanced Oil Recovery",
        "Well Completion Design",
        "Production Optimization"
      ]
    },
    {
      id: 'geosciences',
      name: "School of Geosciences",
      slug: "geosciences",
      description: "Advanced studies in geology, geophysics, and earth sciences. Explore the subsurface and understand geological formations.",
      fullDescription: "The School of Geosciences focuses on advanced geological and geophysical studies essential for petroleum exploration and development. Our programs cover sedimentology, structural geology, seismic interpretation, and well logging technologies.",
      programs: [
        { level: "Bachelor's", name: "Geology", duration: "4 years" },
        { level: "Master's", name: "Geophysics", duration: "2 years" },
        { level: "Master's", name: "Petroleum Geology", duration: "2 years" },
        { level: "PhD", name: "Earth Sciences", duration: "3-5 years" }
      ],
      students: 320,
      faculty: 18,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      icon: Microscope,
      color: "from-green-500 to-green-600",
      location: "Main Campus, Building B",
      contact: {
        phone: "+(202) 22747848",
        email: "geosciences@epri.edu.eg"
      },
      researchAreas: [
        "Seismic Interpretation",
        "Reservoir Characterization",
        "Structural Geology",
        "Well Logging Analysis"
      ]
    },
    {
      id: 'chemical-engineering',
      name: "School of Chemical Engineering",
      slug: "chemical-engineering",
      description: "Focus on petrochemical processes and refining technologies. Learn the chemistry behind petroleum processing.",
      fullDescription: "The School of Chemical Engineering specializes in petrochemical processes, refining technologies, and process optimization. Our programs integrate chemical engineering principles with petroleum industry applications.",
      programs: [
        { level: "Bachelor's", name: "Chemical Engineering", duration: "4 years" },
        { level: "Master's", name: "Process Engineering", duration: "2 years" },
        { level: "Master's", name: "Petrochemical Engineering", duration: "2 years" },
        { level: "PhD", name: "Chemical Technology", duration: "3-5 years" }
      ],
      students: 380,
      faculty: 22,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      icon: BookOpen,
      color: "from-purple-500 to-purple-600",
      location: "Main Campus, Building C",
      contact: {
        phone: "+(202) 22747849",
        email: "chemical.eng@epri.edu.eg"
      },
      researchAreas: [
        "Refining Processes",
        "Catalysis",
        "Process Design",
        "Petrochemical Production"
      ]
    },
    {
      id: 'environmental-sciences',
      name: "School of Environmental Sciences",
      slug: "environmental-sciences",
      description: "Sustainable practices and environmental impact assessment. Address environmental challenges in the petroleum industry.",
      fullDescription: "The School of Environmental Sciences addresses environmental challenges in petroleum operations through sustainable practices, impact assessment, and pollution control technologies.",
      programs: [
        { level: "Bachelor's", name: "Environmental Science", duration: "4 years" },
        { level: "Master's", name: "Environmental Management", duration: "2 years" },
        { level: "Master's", name: "Environmental Engineering", duration: "2 years" },
        { level: "PhD", name: "Sustainability", duration: "3-5 years" }
      ],
      students: 280,
      faculty: 15,
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      icon: Award,
      color: "from-orange-500 to-orange-600",
      location: "Main Campus, Building D",
      contact: {
        phone: "+(202) 22747850",
        email: "environmental@epri.edu.eg"
      },
      researchAreas: [
        "Environmental Impact Assessment",
        "Waste Management",
        "Pollution Control",
        "Sustainable Practices"
      ]
    }
  ]

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1600&h=900&fit=crop')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.3) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/90 via-blue-600/80 to-indigo-600/90"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Academic Excellence
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent leading-tight">
              Schools
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Comprehensive educational programs across multiple disciplines in petroleum science and engineering
            </p>
          </div>
        </div>
      </Section>

      {/* Schools Grid */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-cyan-900 to-blue-900 dark:from-slate-100 dark:via-cyan-100 dark:to-blue-100 bg-clip-text text-transparent">
              Our Schools
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four specialized schools offering world-class education and research opportunities
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          {schools.map((school, index) => {
            const Icon = school.icon
            return (
              <AnimatedSection key={school.id} animation="fade-up" delay={index * 0.1}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border border-white/20 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900"></div>
                  
                  {/* School Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-serif text-2xl font-bold text-white mb-1">
                        {school.name}
                      </h3>
                    </div>
                  </div>

                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${school.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{school.students}</div>
                        <div className="text-sm text-muted-foreground">Students</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {school.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{school.faculty} Faculty</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{school.location}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">Programs Offered</h4>
                    <div className="space-y-2 mb-4">
                      {school.programs.map((program, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                          <div>
                            <Badge variant="outline" className="mr-2 text-xs">
                              {program.level}
                            </Badge>
                            <span className="text-sm font-medium">{program.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{program.duration}</span>
                        </div>
                      ))}
                    </div>

                    {/* Contact Information */}
                    <div className="pt-4 border-t border-border/30 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{school.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{school.contact.email}</span>
                      </div>
                    </div>

                    <Link 
                      href={`/about/schools/${school.slug}`}
                      className="mt-4 inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm group/link"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>

      {/* Research Areas Overview */}
      <Section className="bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-slate-900 dark:to-cyan-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-cyan-900 to-blue-900 dark:from-slate-100 dark:via-cyan-100 dark:to-blue-100 bg-clip-text text-transparent">
              Research Areas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Key research areas across all schools
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {schools.map((school, index) => {
            const Icon = school.icon
            return (
              <AnimatedSection key={school.id} animation="fade-up" delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group border border-white/20">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${school.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg font-serif mb-3">{school.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {school.researchAreas.map((area, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Award className="h-3 w-3 mt-1 flex-shrink-0 text-primary" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>

      {/* Statistics */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-cyan-900 to-blue-900 dark:from-slate-100 dark:via-cyan-100 dark:to-blue-100 bg-clip-text text-transparent">
              Academic Overview
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Schools", value: schools.length.toString(), icon: GraduationCap },
            { label: "Total Students", value: schools.reduce((sum, s) => sum + s.students, 0).toString(), icon: Users },
            { label: "Faculty Members", value: schools.reduce((sum, s) => sum + s.faculty, 0).toString(), icon: BookOpen },
            { label: "Programs Offered", value: schools.reduce((sum, s) => sum + s.programs.length, 0).toString(), icon: Award }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <AnimatedSection key={stat.label} animation="fade-up" delay={index * 0.1}>
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
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
