import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, Award, Target, Globe, Lightbulb, Microscope, BookOpen } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"

export default function AboutOverviewPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('/modern-university-library-students-studying.jpg')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.4) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-cyan-600/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/40 via-transparent to-blue-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-blue-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-purple-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              About EPRI
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Egyptian Petroleum Research Institute
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Leading the way in petroleum research and innovation since our establishment. We are committed to advancing scientific knowledge and technological solutions for Egypt's energy sector.
            </p>
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="border border-white/20 backdrop-blur-sm bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-300/10 hover:from-blue-500/20 hover:to-blue-300/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif text-center bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground text-center leading-relaxed">
                  To conduct cutting-edge research in petroleum science and technology, providing innovative solutions that contribute to Egypt's energy security and economic development while maintaining the highest standards of scientific excellence and environmental responsibility.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="border border-white/20 backdrop-blur-sm bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-300/10 hover:from-purple-500/20 hover:to-purple-300/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-serif text-center bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent">
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground text-center leading-relaxed">
                  To be the leading petroleum research institute in the Middle East and Africa, recognized globally for our scientific contributions, technological innovations, and role in developing sustainable energy solutions for the future.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* Core Values */}
      <Section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide our research, operations, and commitment to excellence
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Pioneering new technologies and methodologies to advance petroleum science
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Maintaining the highest standards in all our research and educational activities
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Microscope className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Conducting honest, ethical, and transparent research with scientific rigor
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.4}>
            <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif">Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Working together with industry, academia, and government partners
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* Research Areas */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Key Research Areas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our multidisciplinary approach covers the full spectrum of petroleum science and technology
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Petroleum Geology",
              description: "Advanced geological studies including sedimentology, paleontology, and reservoir characterization",
              icon: <Building className="h-6 w-6" />,
              color: "from-blue-500 to-blue-600"
            },
            {
              title: "Geophysical Analysis",
              description: "Seismic interpretation, well logging, and subsurface imaging technologies",
              icon: <Globe className="h-6 w-6" />,
              color: "from-green-500 to-green-600"
            },
            {
              title: "Chemical Analysis",
              description: "Advanced analytical chemistry for petroleum products and environmental samples",
              icon: <Microscope className="h-6 w-6" />,
              color: "from-purple-500 to-purple-600"
            },
            {
              title: "Production Engineering",
              description: "Enhanced oil recovery, reservoir engineering, and production optimization",
              icon: <Target className="h-6 w-6" />,
              color: "from-orange-500 to-orange-600"
            },
            {
              title: "Environmental Studies",
              description: "Environmental impact assessment and sustainable petroleum practices",
              icon: <Lightbulb className="h-6 w-6" />,
              color: "from-cyan-500 to-cyan-600"
            },
            {
              title: "Technology Development",
              description: "Research and development of new technologies for petroleum exploration and production",
              icon: <BookOpen className="h-6 w-6" />,
              color: "from-pink-500 to-pink-600"
            }
          ].map((area, index) => (
            <AnimatedSection key={area.title} animation="fade-up" delay={index * 0.1}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 group border border-white/20">
                <CardHeader>
                  <div className={`w-12 h-12 bg-gradient-to-r ${area.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300`}>
                    {area.icon}
                  </div>
                  <CardTitle className="text-xl font-serif">{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <AnimatedSection animation="fade-up">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Partner with Us
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join us in advancing petroleum science and technology. Explore collaboration opportunities with our world-class research teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Contact Us
              </a>
              <a
                href="/services"
                className="inline-flex items-center px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-all duration-300 font-medium"
              >
                Our Services
              </a>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageContainer>
  )
}