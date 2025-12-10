"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, FileText, Award, GraduationCap, BookMarked, Library, FileSearch, Users, TrendingUp } from "lucide-react"

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const librarySections = [
  {
    title: "Overview",
    description: "Comprehensive overview of our library resources and scientific achievements",
    icon: BookOpen,
    href: "/library/overview",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Books",
    description: "Browse our extensive collection of scientific books and publications",
    icon: BookMarked,
    href: "/library/books",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Projects",
    description: "Explore ongoing and completed research projects",
    icon: FileSearch,
    href: "/library/projects",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Publication",
    description: "Access our published research papers and articles",
    icon: FileText,
    href: "/library/publication",
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Patent",
    description: "View our registered patents and intellectual property",
    icon: Award,
    href: "/library/patent",
    color: "from-yellow-500 to-amber-500"
  },
  {
    title: "Citation",
    description: "Track citations and research impact metrics",
    icon: TrendingUp,
    href: "/library/citation",
    color: "from-indigo-500 to-purple-500"
  },
  {
    title: "Library",
    description: "Digital library resources and collections",
    icon: Library,
    href: "/library/library",
    color: "from-teal-500 to-cyan-500",
    subItems: [
      { title: "Journal", href: "/library/journal" },
      { title: "Theses (PHD)", href: "/library/theses-phd" },
      { title: "Theses (MSC)", href: "/library/theses-msc" }
    ]
  }
]

export default function LibraryPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              <Library className="h-3.5 w-3.5" />
              Library & Scientific Situation
            </div>
            
            <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Library & Scientific Situation
            </h1>
            
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl">
              Access our comprehensive collection of scientific resources, publications, research projects, patents, and academic theses. Explore decades of petroleum research and innovation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
              <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                Extensive Collection
              </Badge>
              <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Research Publications
              </Badge>
              <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
                <GraduationCap className="mr-1.5 h-3.5 w-3.5" />
                Academic Resources
              </Badge>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Library Sections Grid */}
      <Section>
        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80 mb-2">Explore Resources</p>
            <h2 className="font-serif text-3xl font-semibold text-slate-900 dark:text-slate-100">
              Library Sections
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {librarySections.map((section, index) => (
              <motion.div
                key={section.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm ring-1 ring-slate-200/30 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/20 dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800 h-full">
                  <Link href={section.href} className="block h-full">
                    <CardHeader>
                      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} text-white shadow-lg`}>
                        <section.icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                    {section.subItems && (
                      <CardContent>
                        <div className="space-y-2 pt-4 border-t border-slate-200/70 dark:border-slate-800">
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Sub-sections:
                          </p>
                          {section.subItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block text-sm text-slate-600 hover:text-primary transition-colors dark:text-slate-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              • {item.title}
                            </Link>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}

