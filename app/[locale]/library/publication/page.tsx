"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Search, Filter, ExternalLink, Calendar, User, BookOpen, TrendingUp } from "lucide-react"

interface Publication {
  id: string
  authors: string[]
  title: string
  journal?: string
  publisher?: string
  year: number
  volume?: string
  pages?: string
  doi?: string
  issn?: string
  type: "Journal" | "Conference" | "Book Chapter" | "Report"
  category?: string
}

// Sample publications data based on the reference structure
const publicationsData: Publication[] = [
  // 2025
  {
    id: "1",
    authors: ["Yarragunta Y.", "D. Francis", "R. Fonseca", "N. Nelli"],
    title: "Long-term trends in OMI-retrieved NO2 and SO2 concentrations over the Arabian Peninsula",
    journal: "Urban Climate",
    year: 2025,
    volume: "Volume 61",
    pages: "102422",
    doi: "https://doi.org/10.1016/j.uclim.2025.102422",
    issn: "2212-0955",
    type: "Journal",
    category: "Environmental Science"
  },
  {
    id: "2",
    authors: ["Wille, J.D.", "Favier, V.", "Gorodetskaya, I.V.", "Francis, D.", "et al."],
    title: "Atmospheric rivers in Antarctica",
    journal: "Nature Reviews Earth & Environment",
    year: 2025,
    volume: "6",
    pages: "178–192",
    doi: "https://doi.org/10.1038/s43017-024-00638-7",
    type: "Journal",
    category: "Climate Science"
  },
  {
    id: "3",
    authors: ["Yarragunta, Y.", "Francis, D.", "Fonseca, R.", "Nelli, N."],
    title: "Evaluation of the WRF-Chem performance for the air pollutants over the United Arab Emirates",
    journal: "Atmospheric Chemistry and Physics",
    year: 2025,
    volume: "25",
    pages: "1685–1709",
    doi: "https://doi.org/10.5194/acp-25-1685-2025",
    type: "Journal",
    category: "Atmospheric Science"
  },
  {
    id: "4",
    authors: ["Fonseca, R.", "Francis, D.", "Nelli, N.", "Yarragunta, Y.", "Paparella, F.", "Pauluis, O.M."],
    title: "Summertime secondary convection and interaction with sea-breeze circulations",
    journal: "Quarterly Journal of the Royal Meteorological Society",
    year: 2025,
    volume: "151",
    pages: "e4907",
    doi: "https://doi.org/10.1002/qj.4907",
    type: "Journal",
    category: "Meteorology"
  },
  // 2024
  {
    id: "5",
    authors: ["Fonseca, R.", "Francis, D."],
    title: "Satellite derived trends and variability of CO2 concentrations in the Middle East during 2014–2023",
    journal: "Frontiers in Environmental Science",
    year: 2024,
    volume: "11",
    pages: "1289142",
    doi: "https://doi.org/10.3389/fenvs.2023.1289142",
    type: "Journal",
    category: "Environmental Science"
  },
  {
    id: "6",
    authors: ["Francis, D.", "Fonseca, R."],
    title: "Recent and projected changes in climate patterns in the Middle East and North Africa (MENA) region",
    journal: "Scientific Reports",
    year: 2024,
    volume: "14",
    pages: "10279",
    doi: "https://doi.org/10.1038/s41598-024-60976-w",
    type: "Journal",
    category: "Climate Science"
  },
  {
    id: "7",
    authors: ["Francis, D.", "Fonseca, R.", "Bozkurt, D.", "Nelli, N.", "Guan, B."],
    title: "Atmospheric river rapids and their role in the extreme rainfall event of April 2023 in the Middle East",
    journal: "Geophysical Research Letters",
    year: 2024,
    volume: "51",
    pages: "e2024GL109446",
    doi: "https://doi.org/10.1029/2024GL109446",
    type: "Journal",
    category: "Atmospheric Science"
  },
  {
    id: "8",
    authors: ["Francis, D.", "Fonseca, R.", "Nelli, N.", "Yarragunta, Y."],
    title: "Unusually low dust activity in North Africa in June 2023: Causes, impacts and future projections",
    journal: "Atmospheric Research",
    year: 2024,
    volume: "309",
    pages: "107594",
    doi: "https://doi.org/10.1016/j.atmosres.2024.107594",
    type: "Journal",
    category: "Atmospheric Science"
  },
  {
    id: "9",
    authors: ["Ahmed, M.", "Hassan, K.", "Mohamed, S."],
    title: "Advanced Reservoir Characterization Techniques in Petroleum Engineering",
    journal: "Journal of Petroleum Science and Engineering",
    year: 2024,
    volume: "215",
    pages: "110567",
    doi: "https://doi.org/10.1016/j.petrol.2024.110567",
    type: "Journal",
    category: "Petroleum Engineering"
  },
  {
    id: "10",
    authors: ["Ibrahim, F.", "Ali, O.", "Mahmoud, R."],
    title: "Sustainable Energy Solutions for the Petroleum Industry",
    journal: "Energy & Environmental Science",
    year: 2024,
    volume: "17",
    pages: "2345-2367",
    doi: "https://doi.org/10.1039/d4ee01234a",
    type: "Journal",
    category: "Energy"
  },
  // 2023
  {
    id: "11",
    authors: ["Soliman, T.", "Farid, Y.", "El-Din, N."],
    title: "Well Completion and Production Optimization Strategies",
    journal: "SPE Journal",
    year: 2023,
    volume: "28",
    pages: "3456-3478",
    doi: "https://doi.org/10.2118/123456-pa",
    type: "Journal",
    category: "Petroleum Engineering"
  },
  {
    id: "12",
    authors: ["Mohamed, R.", "Hassan, A.", "Mostafa, K."],
    title: "Petroleum Economics and Management in the MENA Region",
    journal: "Energy Policy",
    year: 2023,
    volume: "182",
    pages: "113456",
    doi: "https://doi.org/10.1016/j.enpol.2023.113456",
    type: "Journal",
    category: "Economics"
  },
  {
    id: "13",
    authors: ["Ali, M.", "Sara, A.", "Omar, K."],
    title: "Drilling Technology Innovations in Deep Water Operations",
    journal: "Journal of Natural Gas Science and Engineering",
    year: 2023,
    volume: "115",
    pages: "104567",
    doi: "https://doi.org/10.1016/j.jngse.2023.104567",
    type: "Journal",
    category: "Engineering"
  },
  // 2022
  {
    id: "14",
    authors: ["Fatima, I.", "Khaled, M."],
    title: "Advanced Reservoir Characterization",
    journal: "Geophysics",
    year: 2022,
    volume: "87",
    pages: "B123-B145",
    doi: "https://doi.org/10.1190/geo2021-0456.1",
    type: "Journal",
    category: "Geology"
  },
  {
    id: "15",
    authors: ["Nour, E.", "Yasmine, F."],
    title: "Petroleum Refining Processes and Optimization",
    journal: "Chemical Engineering Science",
    year: 2022,
    volume: "258",
    pages: "117890",
    doi: "https://doi.org/10.1016/j.ces.2022.117890",
    type: "Journal",
    category: "Chemistry"
  }
]

const publicationTypes = ["All Types", "Journal", "Conference", "Book Chapter", "Report"]
const categories = [
  "All Categories",
  "Petroleum Engineering",
  "Geology",
  "Chemistry",
  "Energy",
  "Environmental Science",
  "Climate Science",
  "Atmospheric Science",
  "Meteorology",
  "Economics"
]

export default function PublicationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("All Years")
  const [selectedType, setSelectedType] = useState("All Types")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  // Get unique years from publications (sorted descending)
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(publicationsData.map(pub => pub.year))).sort((a, b) => b - a)
    return ["All Years", ...years.map(y => y.toString())]
  }, [])

  // Filter publications
  const filteredPublications = useMemo(() => {
    return publicationsData.filter(pub => {
      const matchesSearch = searchQuery === "" ||
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.category?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesYear = selectedYear === "All Years" || pub.year.toString() === selectedYear
      const matchesType = selectedType === "All Types" || pub.type === selectedType
      const matchesCategory = selectedCategory === "All Categories" || pub.category === selectedCategory

      return matchesSearch && matchesYear && matchesType && matchesCategory
    })
  }, [searchQuery, selectedYear, selectedType, selectedCategory])

  // Group publications by year
  const publicationsByYear = useMemo(() => {
    const grouped: Record<number, Publication[]> = {}
    filteredPublications.forEach(pub => {
      if (!grouped[pub.year]) {
        grouped[pub.year] = []
      }
      grouped[pub.year].push(pub)
    })
    // Sort years in descending order
    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => b - a)
      .reduce((acc, year) => {
        acc[year] = grouped[year]
        return acc
      }, {} as Record<number, Publication[]>)
  }, [filteredPublications])

  const totalPublications = filteredPublications.length
  const totalYears = Object.keys(publicationsByYear).length

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="absolute inset-0 opacity-40">
          <img
            src="/publications-research.jpg"
            alt="Publications background"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-slate-900/40" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em]"
          >
            Research Publications
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
          >
            Publications
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-3xl text-base text-slate-200/85 sm:text-lg"
          >
            Access our published research papers, articles, and scientific publications covering petroleum engineering, geology, chemistry, and energy sciences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80"
          >
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {publicationsData.length} Total Publications
            </Badge>
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {availableYears.length - 1} Years
            </Badge>
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {categories.length - 1} Categories
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="mt-8"
          >
            <Button
              size="lg"
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur"
              asChild
            >
              <a
                href="https://www.scopus.com/pages/organization/60015541"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                View All Publications on Scopus
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* Search and Filters */}
      <Section>
        <AnimatedSection animation="fade-up">
          <Card className="border-slate-200/80 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search publications by title, author, journal, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800">
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800">
                      <FileText className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {publicationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedYear("All Years")
                      setSelectedType("All Types")
                      setSelectedCategory("All Categories")
                    }}
                    className="w-full border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Section>

      {/* Results Count */}
      {filteredPublications.length > 0 && (
        <Section>
          <AnimatedSection animation="fade-up">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing <span className="font-semibold">{totalPublications}</span> publication{totalPublications !== 1 ? "s" : ""} across{" "}
                <span className="font-semibold">{totalYears}</span> year{totalYears !== 1 ? "s" : ""}
              </p>
            </div>
          </AnimatedSection>
        </Section>
      )}

      {/* Publications by Year */}
      {filteredPublications.length === 0 ? (
        <Section>
          <AnimatedSection animation="fade-up">
            <Card className="border-slate-200/80 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50">
              <CardContent className="p-12 text-center">
                <FileText className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No publications found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search or filter criteria.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </Section>
      ) : (
        Object.entries(publicationsByYear).map(([year, publications]) => (
          <Section key={year}>
            <AnimatedSection animation="fade-up">
              <div className="space-y-6">
                {/* Year Header */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {year}
                    </h2>
                    <Badge variant="outline" className="text-sm">
                      {publications.length} {publications.length === 1 ? "publication" : "publications"}
                    </Badge>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />
                  </div>
                </div>

                {/* Publications List */}
                <div className="space-y-4">
                  {publications.map((pub, index) => (
                    <motion.div
                      key={pub.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                    >
                      <Card className="border-slate-200/80 bg-white/50 backdrop-blur-sm transition-all hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600">
                        <CardContent className="p-6">
                          <div className="space-y-3">
                            {/* Authors */}
                            <div className="flex items-start gap-2">
                              <User className="mt-1 h-4 w-4 flex-shrink-0 text-slate-400" />
                              <p className="text-sm text-slate-700 dark:text-slate-300">
                                {pub.authors.map((author, idx) => (
                                  <span key={idx}>
                                    {author}
                                    {idx < pub.authors.length - 1 && ", "}
                                  </span>
                                ))}
                              </p>
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                              {pub.title}
                            </h3>

                            {/* Journal/Publisher Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              {pub.journal && (
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4" />
                                  <span className="italic">{pub.journal}</span>
                                </div>
                              )}
                              {pub.publisher && (
                                <div className="flex items-center gap-2">
                                  <span>{pub.publisher}</span>
                                </div>
                              )}
                              {pub.volume && (
                                <span>{pub.volume}</span>
                              )}
                              {pub.pages && (
                                <span>({pub.pages})</span>
                              )}
                              {pub.issn && (
                                <span className="text-xs">ISSN: {pub.issn}</span>
                              )}
                            </div>

                            {/* Badges and Actions */}
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              <Badge variant="outline" className="text-xs">
                                {pub.type}
                              </Badge>
                              {pub.category && (
                                <Badge variant="outline" className="text-xs">
                                  {pub.category}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                {pub.year}
                              </Badge>
                              {pub.doi && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2 text-xs text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                  asChild
                                >
                                  <a href={pub.doi} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" />
                                    DOI
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </Section>
        ))
      )}
    </PageContainer>
  )
}
