import { use } from "react"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Building2, CheckCircle2, FileText, Handshake, Globe } from "lucide-react"
import { notFound } from "next/navigation"
import Image from "next/image"
import type { Agreement } from "../page"

// This should match the agreements from the main page
// In production, this would come from a database or API
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
    ],
    content: `This Memorandum of Understanding (MoU) establishes a comprehensive framework for collaboration between the Egyptian Petroleum Research Institute (EPRI) and Cairo University. The agreement focuses on advancing petroleum engineering research, fostering academic excellence, and creating opportunities for knowledge exchange.

The partnership encompasses multiple areas of collaboration, including joint research initiatives, student and faculty exchange programs, and shared access to state-of-the-art laboratory facilities. This strategic alliance aims to leverage the strengths of both institutions to address critical challenges in the petroleum industry.

Through this agreement, EPRI and Cairo University will work together on cutting-edge research projects that contribute to the advancement of petroleum science and technology. The collaboration also includes opportunities for joint publications, conferences, and workshops that benefit both academic communities.`
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
    ],
    content: `The Research Collaboration Agreement between EPRI and Shell Egypt represents a significant milestone in industry-academia collaboration. This partnership focuses on developing innovative solutions for enhanced oil recovery and advancing sustainable energy practices in the petroleum sector.

The agreement facilitates joint research projects that combine EPRI's academic expertise with Shell's industry knowledge and resources. Together, we are working on breakthrough technologies that improve oil recovery rates while minimizing environmental impact.

Key areas of collaboration include advanced drilling techniques, reservoir management, and the development of sustainable energy solutions. The partnership also includes knowledge transfer programs, technical workshops, and joint publications that contribute to the broader petroleum industry.`
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
    ],
    content: `The International Exchange Program with MIT establishes a prestigious partnership that enables faculty and students from both institutions to engage in advanced petroleum research. This program creates opportunities for cross-cultural learning, knowledge exchange, and collaborative innovation.

Through this agreement, EPRI researchers and students gain access to MIT's world-class facilities and expertise, while MIT participants benefit from EPRI's specialized knowledge in petroleum science and regional industry insights.

The program includes structured exchange periods, joint research projects, and collaborative publications. Participants engage in cutting-edge research that addresses global energy challenges while building lasting professional relationships across continents.`
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
    ],
    content: `The Technology Transfer Agreement with BP facilitates the sharing of advanced drilling and production technologies between EPRI and one of the world's leading energy companies. This partnership enables EPRI to access cutting-edge industry technologies while contributing academic research insights to BP's operations.

The agreement covers multiple aspects of technology transfer, including access to proprietary technologies, joint development of new solutions, and comprehensive training programs for EPRI staff and researchers.

Key focus areas include advanced drilling techniques, production optimization methods, and innovative approaches to reservoir management. The partnership also includes technical support, knowledge sharing sessions, and collaborative research initiatives that benefit both organizations.`
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
    ],
    content: `The Environmental Research Protocol with Green Energy Initiative represents EPRI's commitment to sustainable practices and environmental stewardship. This partnership focuses on developing innovative solutions that minimize the environmental impact of petroleum operations while advancing renewable energy integration.

Through collaborative research, EPRI and the Green Energy Initiative are working on comprehensive environmental impact assessments, developing sustainable operational practices, and exploring ways to reduce carbon footprints across the petroleum industry.

The protocol includes joint research projects, environmental monitoring programs, and the development of best practices for sustainable petroleum operations. Together, we are creating a roadmap for a more environmentally responsible energy sector.`
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
    ],
    content: `The Training and Development Agreement with EGPC establishes a comprehensive framework for professional development programs designed to enhance the skills and knowledge of petroleum industry personnel. This ongoing partnership reflects EPRI's commitment to workforce development and industry capacity building.

The agreement encompasses a wide range of training initiatives, including technical workshops, certification programs, and specialized courses tailored to the needs of EGPC personnel. These programs are designed to keep industry professionals updated with the latest developments in petroleum science and technology.

Through this partnership, EPRI provides expert instruction, access to state-of-the-art facilities, and comprehensive training materials. The programs are regularly updated to reflect industry best practices and emerging technologies, ensuring that participants receive relevant and practical knowledge.`
  }
]

export default function AgreementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const agreement = agreements.find((a) => a.id === resolvedParams.id)

  if (!agreement) {
    notFound()
  }

  const relatedAgreements = agreements
    .filter((a) => a.id !== agreement.id && a.category === agreement.category)
    .slice(0, 3)

  const categories = Array.from(new Set(agreements.map((a) => a.category)))

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/about/protocols-agreements"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Protocols & Agreements
        </Link>
      </div>

      {/* Article Header */}
      <section className="container mx-auto px-4 mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{agreement.category}</Badge>
            <Badge variant="outline">{agreement.type}</Badge>
            <Badge className="bg-green-500 text-white">{agreement.status}</Badge>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-balance">
            {agreement.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {new Date(agreement.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            {agreement.partner && (
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <span>{agreement.partner}</span>
              </div>
            )}
            {agreement.duration && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Duration: {agreement.duration}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container mx-auto px-4 mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
            <Image
              src={agreement.image || "/placeholder.svg"}
              alt={agreement.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Article Content */}
      <Section>
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <article className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                {agreement.description}
              </p>

              {agreement.content && (
                <p className="leading-relaxed mb-6">{agreement.content}</p>
              )}

              {agreement.objectives && agreement.objectives.length > 0 && (
                <>
                  <h2 className="font-serif text-2xl font-bold mt-8 mb-4">Key Objectives</h2>
                  <ul className="space-y-2 mb-6">
                    {agreement.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h2 className="font-serif text-2xl font-bold mt-8 mb-4">Partnership Benefits</h2>
              <p className="leading-relaxed mb-6">
                This partnership creates significant value for both parties and the broader petroleum
                industry. Through collaborative research, knowledge exchange, and shared resources,
                we are advancing the field of petroleum science and technology while addressing
                critical industry challenges.
              </p>

              <p className="leading-relaxed mb-6">
                The agreement facilitates ongoing collaboration, regular review meetings, and
                continuous improvement of partnership activities. Both parties are committed to
                maintaining the highest standards of research excellence and ensuring that the
                partnership delivers tangible benefits to all stakeholders.
              </p>
            </article>

            <Separator className="my-8" />

            {/* Share */}
            <div className="flex items-center gap-4">
              <span className="font-semibold">Share this agreement:</span>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="bg-transparent">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="bg-transparent">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="bg-transparent">
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="bg-transparent">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Agreements */}
            {relatedAgreements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Related Agreements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedAgreements.map((relatedAgreement) => (
                    <Link
                      key={relatedAgreement.id}
                      href={`/about/protocols-agreements/${relatedAgreement.id}`}
                      className="block group"
                    >
                      <div className="space-y-2">
                        <div className="relative w-full h-32 rounded-lg overflow-hidden">
                          <Image
                            src={relatedAgreement.image || "/placeholder.svg"}
                            alt={relatedAgreement.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {relatedAgreement.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(relatedAgreement.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      {relatedAgreement.id !== relatedAgreements[relatedAgreements.length - 1].id && (
                        <Separator className="mt-4" />
                      )}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge key={category} variant="secondary">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle>Interested in Partnership?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary-foreground/90 mb-4">
                  Learn more about our partnership opportunities and collaboration frameworks
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}

