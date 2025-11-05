import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, FileText, Shield, Award, Calendar, Building, Users } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"

export default function ISOCertificatePage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-blue-600/80 to-emerald-600/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/40 via-transparent to-green-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-green-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-emerald-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-blue-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Quality Assurance
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent leading-tight">
              ISO Certification
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              EPRI maintains the highest international standards through our comprehensive ISO certification program, ensuring excellence in research, laboratory operations, and quality management.
            </p>
          </div>
        </div>
      </Section>

      {/* Current Certifications */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 dark:from-slate-100 dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent">
              Current ISO Certifications
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our commitment to quality is demonstrated through internationally recognized certifications
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="border border-white/20 backdrop-blur-sm bg-gradient-to-br from-green-500/10 via-green-400/5 to-green-300/10 hover:from-green-500/20 hover:to-green-300/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-center">ISO 9001:2015</CardTitle>
                <CardDescription className="text-center">Quality Management Systems</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Research Quality Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Process Documentation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Continuous Improvement</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Valid until: Dec 2026</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="border border-white/20 backdrop-blur-sm bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-blue-300/10 hover:from-blue-500/20 hover:to-blue-300/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-center">ISO/IEC 17025:2017</CardTitle>
                <CardDescription className="text-center">Testing & Calibration Laboratories</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Laboratory Competence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Testing Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Calibration Standards</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Valid until: Mar 2027</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <Card className="border border-white/20 backdrop-blur-sm bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-purple-300/10 hover:from-purple-500/20 hover:to-purple-300/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
              <CardHeader className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-serif text-center">ISO 14001:2015</CardTitle>
                <CardDescription className="text-center">Environmental Management</CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Environmental Compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Waste Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Sustainability Practices</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Valid until: Jun 2026</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* Certification Benefits */}
      <Section className="bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 dark:from-slate-100 dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent">
              Benefits of Our ISO Certification
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              How our commitment to international standards benefits our clients and research partners
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">Enhanced Credibility</h3>
                  <p className="text-muted-foreground">
                    International recognition of our quality management systems builds trust with clients and partners worldwide.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">Consistent Quality</h3>
                  <p className="text-muted-foreground">
                    Standardized processes ensure reliable, accurate, and repeatable results across all our services.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">Client Satisfaction</h3>
                  <p className="text-muted-foreground">
                    Structured approach to meeting client requirements and exceeding expectations in service delivery.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">Operational Excellence</h3>
                  <p className="text-muted-foreground">
                    Continuous improvement practices drive efficiency and innovation in all our operations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">Regulatory Compliance</h3>
                  <p className="text-muted-foreground">
                    Meeting international standards ensures compliance with global regulatory requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-2">Risk Management</h3>
                  <p className="text-muted-foreground">
                    Systematic identification and mitigation of risks in our research and testing processes.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Certificate Downloads */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 dark:from-slate-100 dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent">
              Certificate Documents
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Download official copies of our ISO certification documents
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">ISO 9001:2015 Certificate</h3>
                      <p className="text-sm text-muted-foreground">Quality Management Systems - PDF (2.3 MB)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">ISO/IEC 17025:2017 Certificate</h3>
                      <p className="text-sm text-muted-foreground">Testing & Calibration Laboratories - PDF (1.8 MB)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <Card className="hover:shadow-lg transition-all duration-300 group">
              <CardContent className="px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">ISO 14001:2015 Certificate</h3>
                      <p className="text-sm text-muted-foreground">Environmental Management - PDF (2.1 MB)</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <AnimatedSection animation="fade-up">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-green-600 to-emerald-600 bg-clip-text text-transparent">
              Quality You Can Trust
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Our ISO certifications demonstrate our unwavering commitment to excellence. Partner with us for reliable, world-class research and analytical services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-3">
                <a href="/contact">
                  Get in Touch
                </a>
              </Button>
              <Button variant="outline" asChild size="lg" className="px-8 py-3">
                <a href="/services">
                  Our Services
                </a>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageContainer>
  )
}