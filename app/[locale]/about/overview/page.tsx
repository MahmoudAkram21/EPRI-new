"use client"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, Award, Target, Globe, Lightbulb, Microscope, BookOpen, Calendar, MapPin, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { useCallback } from "react"
import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"

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
              A leading research institution dedicated to advancing petroleum science, technology, and innovation in Egypt and the Middle East region.
            </p>
          </div>
        </div>
      </Section>

      {/* Introduction Section */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="max-w-4xl mx-auto">
            <Card className="border border-white/20 backdrop-blur-sm bg-gradient-to-br from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-800/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl font-serif text-center bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The Egyptian Petroleum Research Institute (EPRI) is a premier research institution established to serve as a center of excellence in petroleum research, development, and innovation. Our institute plays a crucial role in advancing scientific knowledge and technological solutions for Egypt's petroleum industry.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  EPRI is committed to conducting cutting-edge research in various fields of petroleum science and engineering, including exploration, production, refining, and environmental sustainability. We work closely with industry partners, government agencies, and academic institutions to address the challenges facing the petroleum sector and contribute to Egypt's energy security and economic development.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Through our comprehensive research programs, state-of-the-art laboratories, and highly qualified research teams, we strive to develop innovative solutions that enhance the efficiency, safety, and sustainability of petroleum operations while maintaining the highest standards of scientific excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </Section>

      {/* Image Slider Section */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl font-bold mb-2 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                Our Institute
              </h2>
              <p className="text-muted-foreground">
                Explore our facilities and research environment
              </p>
            </div>
            <ImageSlider />
          </div>
        </AnimatedSection>
      </Section>

      {/* Mission & Vision */}
      <Section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
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

      {/* Objectives Section */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Our Objectives
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Key goals that guide our research and development activities
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Research Excellence",
              description: "Conduct high-quality research in petroleum science and engineering to address industry challenges and contribute to scientific knowledge",
              icon: Microscope,
              color: "from-blue-500 to-blue-600"
            },
            {
              title: "Technology Development",
              description: "Develop innovative technologies and solutions to improve petroleum exploration, production, and processing efficiency",
              icon: Lightbulb,
              color: "from-green-500 to-green-600"
            },
            {
              title: "Industry Collaboration",
              description: "Foster strong partnerships with petroleum companies and industry stakeholders to ensure research relevance and impact",
              icon: Building,
              color: "from-purple-500 to-purple-600"
            },
            {
              title: "Education & Training",
              description: "Provide advanced education and professional training programs to develop skilled professionals for the petroleum industry",
              icon: BookOpen,
              color: "from-orange-500 to-orange-600"
            },
            {
              title: "Environmental Sustainability",
              description: "Promote sustainable practices and develop solutions for environmental protection in petroleum operations",
              icon: Globe,
              color: "from-cyan-500 to-cyan-600"
            },
            {
              title: "Knowledge Transfer",
              description: "Disseminate research findings and transfer knowledge to industry, academia, and the broader scientific community",
              icon: Users,
              color: "from-pink-500 to-pink-600"
            }
          ].map((objective, index) => {
            const Icon = objective.icon
            return (
              <AnimatedSection key={objective.title} animation="fade-up" delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group border border-white/20">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-r ${objective.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-serif">{objective.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {objective.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
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

      {/* Contact Information */}
      <Section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Contact Information
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get in touch with us for inquiries, collaborations, or more information
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg font-serif mb-2">Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Nasr City, Cairo, Egypt
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg font-serif mb-2">Phone</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  +(202) 22747847
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg font-serif mb-2">Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  info@epri.edu.eg
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
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

// Image Slider Component
function ImageSlider() {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })] as any
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  // Sample images - in production, these would come from an API or CMS
  const images = [
    {
      id: 1,
      src: "/modern-university-library-students-studying.jpg",
      alt: "EPRI Research Facilities",
      title: "Research Facilities"
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=600&fit=crop",
      alt: "Laboratory Equipment",
      title: "State-of-the-Art Laboratories"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
      alt: "Research Team",
      title: "Expert Research Teams"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop",
      alt: "Petroleum Research",
      title: "Petroleum Research & Development"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=600&fit=crop",
      alt: "Scientific Equipment",
      title: "Advanced Scientific Equipment"
    }
  ]

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden rounded-lg">
        <div className="flex gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_100%] lg:flex-[0_0_100%]"
            >
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg group">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                    {image.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-background/90 border shadow-lg hover:bg-primary hover:text-white cursor-pointer transition-colors backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={scrollNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-background/90 border shadow-lg hover:bg-primary hover:text-white cursor-pointer transition-colors backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-primary ring-2 ring-primary ring-offset-2 w-8'
                  : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
