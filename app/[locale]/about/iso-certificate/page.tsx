import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, FileText, Shield, Award, Calendar, Users, Building } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import Image from "next/image"

export default function ISOCertificatePage() {
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
        
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 via-blue-600/80 to-emerald-600/90"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Quality Assurance
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent leading-tight">
              Accreditation (ISO Certificates)
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              EPRI's commitment to excellence through international quality management standards
            </p>
          </div>
        </div>
      </Section>

      {/* Quality Policy Section */}
      <Section>
        <AnimatedSection animation="fade-up">
          <Card className="border border-white/20">
            <CardHeader>
              <CardTitle className="text-3xl font-serif text-center bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 dark:from-slate-100 dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent mb-4">
                Quality Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                The Egyptian Petroleum Research Institute (EPRI) is committed to excellence in research, education, and service delivery. Our quality policy reflects our dedication to maintaining the highest international standards while serving the petroleum industry and scientific community.
              </p>
              
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-semibold text-foreground">Our Quality Objectives:</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Establish and implement a quality management system based on ISO 9001:2015 standards across all EPRI operations and services.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Ensure compliance with all applicable laws, regulations, and industry standards relevant to petroleum research and testing.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Meet and exceed the requirements and expectations of all stakeholders including researchers, industry partners, government agencies, and the scientific community.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Leverage advanced information technology and modern research equipment to enhance service quality and operational efficiency.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Establish measurable quality objectives and conduct regular reviews to ensure continuous improvement in all processes.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Provide necessary resources, define clear responsibilities, and ensure effective communication throughout the organization.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Develop staff competence through comprehensive training programs, workshops, and continuous professional development based on stakeholder needs and emerging technologies.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Continuously improve the effectiveness of the quality management system and provide opportunities for ongoing enhancement.</span>
                  </li>
                </ul>
              </div>

              <p className="text-muted-foreground leading-relaxed pt-4 border-t border-border/30">
                This policy and its associated procedures and instructions are fully applied to all EPRI operations and services. They are communicated to all staff, faculty members, stakeholders, and external suppliers, and made available to interested parties as appropriate. All EPRI employees are required to comply with this policy, as well as any external party assigned to work on behalf of the institute.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                This policy and quality objectives will be reviewed periodically during management review meetings of the quality management system to ensure their continued suitability and effectiveness.
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Section>

      {/* Quality Coordinator Section */}
      <Section className="bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-950">
        <AnimatedSection animation="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl font-bold mb-6 text-foreground">
              General Coordinator of Administrative Quality and Head of Quality Management Committee
            </h2>
            <div className="flex flex-col items-center gap-6">
              <Avatar className="h-40 w-40 border-4 border-white shadow-xl">
                <AvatarImage src="/placeholder.svg?height=200&width=200" alt="Quality Coordinator" />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  QC
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                  Prof. Dr. [Name]
                </h3>
                <p className="text-muted-foreground">
                  General Coordinator of Administrative Quality
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </Section>

      {/* ISO 45001:2018 Certificates */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 dark:from-slate-100 dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent">
              ISO and Quality Certificates for EPRI Administrations 45001:2018
            </h2>
            <p className="text-muted-foreground">
              Occupational Health and Safety Management Systems
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border border-white/20">
              <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="ISO 45001:2018 Registration Schedule"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-center text-muted-foreground">Registration Schedule - ISO 45001:2018</p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border border-white/20">
              <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="ISO 45001:2018 Registration Certificate"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-center text-muted-foreground">Registration Certificate - ISO 45001:2018</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* ISO 9001:2015 Certificates */}
      <Section className="bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 dark:from-slate-100 dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent">
              ISO and Quality Certificates for EPRI Administrations 9001:2015
            </h2>
            <p className="text-muted-foreground">
              Quality Management Systems
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { title: "Registration Schedule - ISO 9001:2015", delay: 0.1 },
            { title: "Registration Certificate - ISO 9001:2015", delay: 0.2 },
            { title: "Certificate - ISO 9001:2015", delay: 0.3 },
            { title: "Certificate - ISO 9001:2015", delay: 0.4 }
          ].map((cert, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={cert.delay}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border border-white/20">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt={cert.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-center text-muted-foreground">{cert.title}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* ISO 9001:2008 Certificates */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 dark:from-slate-100 dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent">
              ISO and Quality Certificates for EPRI Administrations 9001:2008
            </h2>
            <p className="text-muted-foreground">
              Quality Management Systems (Previous Version)
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border border-white/20">
              <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="ISO 9001:2008 Certificate"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-center text-muted-foreground">Certificate - ISO 9001:2008</p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border border-white/20">
              <div className="aspect-[4/3] relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="ISO 9001:2008 Certificate"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-center text-muted-foreground">Certificate - ISO 9001:2008</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* News Section */}
      <Section className="bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 dark:from-slate-100 dark:via-green-100 dark:to-emerald-100 bg-clip-text text-transparent">
              News About the Project
            </h2>
            <p className="text-muted-foreground">
              Latest updates on EPRI's ISO certification and quality management initiatives
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <Card className="border border-white/20">
            <CardContent className="p-8">
              <ul className="space-y-4">
                {[
                  "EPRI renews ISO 9001:2015 certification and obtains ISO 45001:2018 for Occupational Health and Safety",
                  "EPRI Director chairs annual management review meeting for integrated quality, safety, and occupational health system",
                  "EPRI successfully renews ISO 9001:2015 certification",
                  "Quality management systems recommend continuing ISO 9001:2015 certification for EPRI",
                  "EPRI becomes one of the first Egyptian research institutes to obtain ISO 9001:2015",
                  "EPRI leadership emphasizes commitment to quality administrative processes and stakeholder satisfaction",
                  "Eight EPRI departments prepared for ISO 9001:2015 certification",
                  "Workshop held to qualify EPRI facilities for ISO certification",
                  "Major celebration at EPRI on the occasion of obtaining ISO certification and honoring distinguished staff",
                  "ISO and Quality Certificates for EPRI Administrations",
                  "Fourteen EPRI administrations on track for ISO certification"
                ].map((news, index) => (
                  <li key={index} className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{news}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
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
