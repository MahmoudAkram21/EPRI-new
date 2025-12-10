"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Microscope, FlaskConical } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DepartmentsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialSectionId = searchParams.get("sectionId") || undefined

  const [sections, setSections] = useState<Array<{ id: string; name: string }>>([])
  const [departments, setDepartments] = useState<Array<{ id: string; name: string; description?: string; image?: string; icon?: string; section_id?: string }>>([])
  const [selectedSection, setSelectedSection] = useState<string | undefined>(initialSectionId)
  const [query, setQuery] = useState("")

  useEffect(() => {
    const load = async () => {
      const [secRes, depRes] = await Promise.all([
        apiClient.getDepartmentSections(),
        apiClient.getDepartments(initialSectionId ? { sectionId: initialSectionId } : undefined),
      ])
      setSections(secRes.sections.map((s: any) => ({ id: s.id, name: s.name })))
      setDepartments(depRes.departments)
    }
    load().catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Refetch when section changes via UI
  useEffect(() => {
    const refetch = async () => {
      const res = await apiClient.getDepartments(selectedSection ? { sectionId: selectedSection } : undefined)
      setDepartments(res.departments)
    }
    refetch().catch(console.error)
  }, [selectedSection])

  // Keep URL in sync with selection
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    if (selectedSection) params.set("sectionId", selectedSection)
    else params.delete("sectionId")
    router.replace(`/departments${params.toString() ? `?${params.toString()}` : ""}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSection])

  const filteredDepartments = useMemo(() => {
    if (!query) return departments
    const q = query.toLowerCase()
    return departments.filter((d) => d.name.toLowerCase().includes(q) || (d.description || "").toLowerCase().includes(q))
  }, [departments, query])

  return (
    <PageContainer>
      {/* Hero Section with Background */}
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('/research-center-building.jpg')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.6) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/85 via-cyan-600/75 to-blue-600/85"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/40 via-transparent to-teal-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-green-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-cyan-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-teal-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fade-up">
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-teal-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
                Research Departments & Laboratories
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                Explore our state-of-the-art research facilities equipped with advanced technology and staffed by leading
                experts in petroleum research and analysis.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* Filters */}
      <Section>
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <select
              value={selectedSection || ""}
              onChange={(e) => setSelectedSection(e.target.value || undefined)}
              className="h-10 px-3 rounded-md border bg-background/80 backdrop-blur text-sm"
            >
              <option value="">All Sections</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search departments..."
              className="w-full h-10 px-3 rounded-md border bg-background/80 backdrop-blur text-sm"
            />
            <Button variant="secondary" onClick={() => setQuery("")}>Clear</Button>
          </div>
        </div>
      </Section>

      {/* Departments Grid */}
      <Section>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDepartments.map((department, index) => (
            <AnimatedSection key={department.id} animation="fade-up" delay={index * 0.1}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden -mt-6">
                  <Image
                    src={department.image || "/placeholder.svg"}
                    alt={department.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="text-4xl mb-2">{department.icon || "🏛️"}</div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-serif">{department.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{department.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Optional badges can be re-enabled once counts are API-backed */}
                  <div className="pt-2">
                    <Link href={`/departments/${department.id}`}>
                      <Button className="w-full">View Department</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primary/5 to-accent/5">
        <AnimatedSection animation="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Need Our Research Services?</h2>
            <p className="text-muted-foreground mb-6">
              Contact us to discuss your research needs and how our departments can support your projects.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageContainer>
  )
}
