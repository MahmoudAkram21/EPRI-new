"use client"

import { useState } from "react"
import { projects, projectCategories } from "@/lib/data"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderOpen, TrendingUp, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All Projects")

  const filteredProjects =
    selectedCategory === "All Projects"
      ? projects
      : projects.filter((project) => project.category === selectedCategory)

  const statusIcons = {
    Planning: Clock,
    "In Progress": TrendingUp,
    Completed: CheckCircle2,
    "On Hold": Clock,
  }

  const statusColors = {
    Planning: "bg-blue-500/10 text-blue-500",
    "In Progress": "bg-yellow-500/10 text-yellow-500",
    Completed: "bg-green-500/10 text-green-500",
    "On Hold": "bg-gray-500/10 text-gray-500",
  }

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
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/85 via-red-600/75 to-pink-600/85"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/40 via-transparent to-orange-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-orange-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-red-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-pink-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fade-up">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <FolderOpen className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent leading-tight">
                Research Projects
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                Explore our ongoing and completed research projects advancing petroleum science and technology in Egypt.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{projects.length}</div>
                <div className="text-sm text-muted-foreground">Total Projects</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-500">
                  {projects.filter((p) => p.status === "Completed").length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-yellow-500">
                  {projects.filter((p) => p.status === "In Progress").length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-500">
                  {projects.filter((p) => p.status === "Planning").length}
                </div>
                <div className="text-sm text-muted-foreground">Planning</div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </Section>

      {/* Category Filter */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-4">Filter by Category</h2>
            <Tabs defaultValue="All Projects" className="w-full">
              <TabsList className="w-full flex-wrap h-auto justify-start gap-2">
                {projectCategories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    {category.name} ({category.count})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </AnimatedSection>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => {
            const StatusIcon = statusIcons[project.status]
            return (
              <AnimatedSection key={project.id} animation="fade-up" delay={index * 0.1}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={project.images[0] || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className={statusColors[project.status]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {project.status}
                      </Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary">{project.category}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-serif line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-semibold">Start:</span> {new Date(project.startDate).getFullYear()}
                      </div>
                      {project.endDate && (
                        <div>
                          <span className="font-semibold">End:</span> {new Date(project.endDate).getFullYear()}
                        </div>
                      )}
                    </div>
                    {project.staff && project.staff.length > 0 && (
                      <div className="text-sm">
                        <span className="font-semibold">Team:</span> {project.staff.length} member
                        {project.staff.length > 1 ? "s" : ""}
                      </div>
                    )}
                    <Link href={`/projects/${project.id}`}>
                      <Button className="w-full">View Project Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-br from-primary/5 to-accent/5">
        <AnimatedSection animation="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">Interested in Collaboration?</h2>
            <p className="text-muted-foreground mb-6">
              We welcome collaboration opportunities with industry partners, academic institutions, and research
              organizations.
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

