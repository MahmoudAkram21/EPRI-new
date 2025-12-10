"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { projects, projectCategories } from "@/lib/data"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderOpen, TrendingUp, CheckCircle2, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LibraryProjectsPage() {
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
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/research-center-building.jpg"
            alt="Research projects background"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/40" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <Link href="/library">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Button
                variant="outline"
                className="mb-6 rounded-full border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20 hover:shadow-lg hover:shadow-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
              </Button>
            </motion.div>
          </Link>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
          >
            Research Projects
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
          >
            Research Projects
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.65, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-3xl text-base text-slate-200/85 sm:text-lg"
          >
            Explore ongoing and completed research projects advancing petroleum science and technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80"
          >
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {projects.length} Total Projects
            </Badge>
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {projects.filter((p) => p.status === "Completed").length} Completed
            </Badge>
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {projects.filter((p) => p.status === "In Progress").length} In Progress
            </Badge>
          </motion.div>
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

