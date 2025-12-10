"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Search, Filter, Download, ExternalLink, Calendar, User, Tag } from "lucide-react"
import Link from "next/link"

interface Book {
  id: string
  title: string
  author: string
  authors?: string[]
  description: string
  coverImage?: string
  category: string
  year: number
  isbn?: string
  publisher?: string
  pages?: number
  language: string
  downloadLink?: string
  externalLink?: string
  tags: string[]
  featured?: boolean
}

// Sample books data - in production, this would come from an API
const booksData: Book[] = [
  {
    id: "1",
    title: "Petroleum Engineering Fundamentals",
    author: "Dr. Ahmed Hassan",
    authors: ["Dr. Ahmed Hassan", "Dr. Mohamed Ali"],
    description: "Comprehensive guide to petroleum engineering principles, covering exploration, drilling, production, and reservoir management.",
    coverImage: undefined, // Placeholder - image not available
    category: "Engineering",
    year: 2023,
    isbn: "978-0-123456-78-9",
    publisher: "EPRI Publications",
    pages: 450,
    language: "English",
    downloadLink: "/books/petroleum-engineering-fundamentals.pdf",
    tags: ["Petroleum", "Engineering", "Fundamentals"],
    featured: true
  },
  {
    id: "2",
    title: "Advanced Reservoir Characterization",
    author: "Dr. Fatima Ibrahim",
    description: "In-depth analysis of reservoir characterization techniques, including seismic interpretation and well logging.",
    coverImage: undefined,
    category: "Geology",
    year: 2022,
    isbn: "978-0-123456-79-6",
    publisher: "EPRI Publications",
    pages: 380,
    language: "English",
    downloadLink: "/books/advanced-reservoir-characterization.pdf",
    tags: ["Reservoir", "Geology", "Characterization"]
  },
  {
    id: "3",
    title: "Sustainable Energy Solutions",
    author: "Dr. Omar Mahmoud",
    authors: ["Dr. Omar Mahmoud", "Dr. Sara Ahmed"],
    description: "Exploring renewable energy alternatives and sustainable practices in the petroleum industry.",
    coverImage: undefined,
    category: "Energy",
    year: 2024,
    isbn: "978-0-123456-80-2",
    publisher: "EPRI Publications",
    pages: 320,
    language: "English",
    tags: ["Sustainability", "Energy", "Renewable"],
    featured: true
  },
  {
    id: "4",
    title: "Drilling Technology and Operations",
    author: "Dr. Khaled Mostafa",
    description: "Modern drilling techniques, equipment, and operational best practices for oil and gas exploration.",
    coverImage: undefined,
    category: "Engineering",
    year: 2023,
    isbn: "978-0-123456-81-9",
    publisher: "EPRI Publications",
    pages: 520,
    language: "English",
    downloadLink: "/books/drilling-technology-operations.pdf",
    tags: ["Drilling", "Technology", "Operations"]
  },
  {
    id: "5",
    title: "Petroleum Refining Processes",
    author: "Dr. Nour El-Din",
    description: "Comprehensive overview of petroleum refining processes, from crude oil to finished products.",
    coverImage: undefined,
    category: "Chemistry",
    year: 2022,
    isbn: "978-0-123456-82-6",
    publisher: "EPRI Publications",
    pages: 410,
    language: "English",
    tags: ["Refining", "Chemistry", "Processes"]
  },
  {
    id: "6",
    title: "Environmental Impact Assessment in Oil & Gas",
    author: "Dr. Yasmine Farid",
    description: "Methods and frameworks for assessing and mitigating environmental impacts in petroleum operations.",
    coverImage: undefined,
    category: "Environmental",
    year: 2024,
    isbn: "978-0-123456-83-3",
    publisher: "EPRI Publications",
    pages: 290,
    language: "English",
    downloadLink: "/books/environmental-impact-assessment.pdf",
    tags: ["Environment", "Assessment", "Impact"],
    featured: true
  },
  {
    id: "7",
    title: "Well Completion and Production",
    author: "Dr. Tarek Soliman",
    description: "Technical guide to well completion design, production optimization, and maintenance strategies.",
    coverImage: undefined,
    category: "Engineering",
    year: 2023,
    isbn: "978-0-123456-84-0",
    publisher: "EPRI Publications",
    pages: 360,
    language: "English",
    tags: ["Well Completion", "Production", "Optimization"]
  },
  {
    id: "8",
    title: "Petroleum Economics and Management",
    author: "Dr. Rania Mohamed",
    description: "Economic analysis, project evaluation, and management strategies for petroleum operations.",
    coverImage: undefined,
    category: "Economics",
    year: 2022,
    isbn: "978-0-123456-85-7",
    publisher: "EPRI Publications",
    pages: 340,
    language: "English",
    downloadLink: "/books/petroleum-economics-management.pdf",
    tags: ["Economics", "Management", "Finance"]
  }
]

const bookCategories = [
  "All Categories",
  "Engineering",
  "Geology",
  "Chemistry",
  "Energy",
  "Environmental",
  "Economics"
]

const languages = ["All Languages", "English", "Arabic", "French"]

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLanguage, setSelectedLanguage] = useState("All Languages")
  const [selectedYear, setSelectedYear] = useState<string>("All Years")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Get unique years from books
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(booksData.map(book => book.year))).sort((a, b) => b - a)
    return ["All Years", ...years.map(y => y.toString())]
  }, [])

  // Filter books
  const filteredBooks = useMemo(() => {
    return booksData.filter(book => {
      const matchesSearch = searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All Categories" || book.category === selectedCategory
      const matchesLanguage = selectedLanguage === "All Languages" || book.language === selectedLanguage
      const matchesYear = selectedYear === "All Years" || book.year.toString() === selectedYear

      return matchesSearch && matchesCategory && matchesLanguage && matchesYear
    })
  }, [searchQuery, selectedCategory, selectedLanguage, selectedYear])

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredBooks.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredBooks, currentPage])

  const featuredBooks = booksData.filter(book => book.featured)

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="absolute inset-0 opacity-40">
          {/* Background image removed to prevent 404 */}
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
            Digital Library
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
            className="font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl"
          >
            Books Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-3xl text-base text-slate-200/85 sm:text-lg"
          >
            Browse our extensive collection of scientific books and publications covering petroleum engineering, geology, chemistry, and energy sciences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-white/80"
          >
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {booksData.length} Total Books
            </Badge>
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {bookCategories.length - 1} Categories
            </Badge>
            <Badge variant="outline" className="border-white/40 bg-white/10 text-white backdrop-blur">
              {featuredBooks.length} Featured
            </Badge>
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
                    placeholder="Search books by title, author, or keywords..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10 h-12 border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Select value={selectedCategory} onValueChange={(value) => { setSelectedCategory(value); setCurrentPage(1) }}>
                    <SelectTrigger className="border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLanguage} onValueChange={(value) => { setSelectedLanguage(value); setCurrentPage(1) }}>
                    <SelectTrigger className="border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedYear} onValueChange={(value) => { setSelectedYear(value); setCurrentPage(1) }}>
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

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("All Categories")
                      setSelectedLanguage("All Languages")
                      setSelectedYear("All Years")
                      setCurrentPage(1)
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
      {filteredBooks.length > 0 && (
        <Section>
          <AnimatedSection animation="fade-up">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing <span className="font-semibold">{paginatedBooks.length}</span> of{" "}
                <span className="font-semibold">{filteredBooks.length}</span> books
              </p>
            </div>
          </AnimatedSection>
        </Section>
      )}

      {/* Books Grid */}
      <Section>
        {filteredBooks.length === 0 ? (
          <AnimatedSection animation="fade-up">
            <Card className="border-slate-200/80 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/50">
              <CardContent className="p-12 text-center">
                <BookOpen className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  No books found
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search or filter criteria.
                </p>
              </CardContent>
            </Card>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedBooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Card className="group h-full border-slate-200/80 bg-white/50 backdrop-blur-sm transition-all hover:border-slate-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600">
                  <CardHeader className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg bg-slate-100 dark:bg-slate-800">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <BookOpen className="h-16 w-16 text-slate-400" />
                        </div>
                      )}
                      {book.featured && (
                        <Badge className="absolute right-2 top-2 bg-emerald-500 text-white">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {book.title}
                        </CardTitle>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <User className="h-4 w-4" />
                          <span className="line-clamp-1">{book.author}</span>
                        </div>
                      </div>

                      <CardDescription className="line-clamp-2 text-sm">
                        {book.description}
                      </CardDescription>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">
                          {book.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {book.year}
                        </Badge>
                        {book.language && (
                          <Badge variant="outline" className="text-xs">
                            {book.language}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        {book.downloadLink && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            asChild
                          >
                            <Link href={book.downloadLink}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Link>
                          </Button>
                        )}
                        {book.externalLink && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            asChild
                          >
                            <a href={book.externalLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View
                            </a>
                          </Button>
                        )}
                        {!book.downloadLink && !book.externalLink && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            disabled
                          >
                            <BookOpen className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Section>

      {/* Pagination */}
      {totalPages > 1 && (
        <Section>
          <AnimatedSection animation="fade-up">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </AnimatedSection>
        </Section>
      )}
    </PageContainer>
  )
}
