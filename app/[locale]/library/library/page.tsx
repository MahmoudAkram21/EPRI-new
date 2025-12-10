"use client"

import { useState, useEffect, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Search, Filter, Download, ExternalLink, Calendar, User, Tag, FileText, GraduationCap, Lock, Unlock, Image as ImageIcon, Play } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { useUser } from "@/contexts/user-context"
import Image from "next/image"

interface Book {
  id: string
  title: string | { en: string; ar: string }
  author: string | { en: string; ar: string }
  authors?: Array<string | { en: string; ar: string }>
  description: string | { en: string; ar: string }
  coverImage?: string
  category: string | { en: string; ar: string }
  year: number
  isbn?: string
  publisher?: string
  pages?: number
  language: string | { en: string; ar: string }
  downloadLink?: string
  externalLink?: string
  tags: Array<string | { en: string; ar: string }>
  featured?: boolean
  is_free?: boolean
  price?: number
}

interface Thesis {
  id: string
  title: string | { en: string; ar: string }
  author: string | { en: string; ar: string }
  supervisor?: string | { en: string; ar: string }
  description: string | { en: string; ar: string }
  abstract?: string | { en: string; ar: string }
  year: number
  degree_type: 'PHD' | 'MSC'
  department?: string | { en: string; ar: string }
  downloadLink?: string
  is_published: boolean
}

type TranslationObject = { en: string; ar: string } | string

function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || ''
  }
  return ''
}

export default function ELibraryPage() {
  const locale = useLocale()
  const t = useTranslations()
  const { user, isLoggedIn } = useUser()
  const [activeTab, setActiveTab] = useState("overview")
  const [books, setBooks] = useState<Book[]>([])
  const [phdTheses, setPhdTheses] = useState<Thesis[]>([])
  const [mscTheses, setMscTheses] = useState<Thesis[]>([])
  const [overviewContent, setOverviewContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  // Check if user is institute member (for free book access)
  const isInstituteMember = useMemo(() => {
    return isLoggedIn && user?.role && ['STUDENT', 'RESEARCHER', 'INSTRUCTOR', 'DEPARTMENT_MANAGER', 'ADMIN'].includes(user.role)
  }, [isLoggedIn, user])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch overview content
        try {
          const overviewRes = await apiClient.getPageContent('e-library', 'overview')
          if (overviewRes?.contents?.[0]) {
            setOverviewContent(overviewRes.contents[0])
          }
        } catch (err) {
          console.error('Failed to fetch overview:', err)
        }

        // Fetch books, theses, etc. from API
        // For now using placeholder - replace with actual API calls
        // const booksRes = await apiClient.getBooks()
        // const phdRes = await apiClient.getTheses({ type: 'PHD' })
        // const mscRes = await apiClient.getTheses({ type: 'MSC' })
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const titleStr = getTranslation(book.title, locale)
      const authorStr = getTranslation(book.author, locale)
      const descStr = getTranslation(book.description, locale)
      const categoryStr = getTranslation(book.category, locale)

      const matchesSearch = searchQuery === "" ||
        titleStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        authorStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        descStr.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "all" ||
        categoryStr.toLowerCase().replace(/\s+/g, '-') === selectedCategory

      const matchesYear = selectedYear === "all" || book.year.toString() === selectedYear

      return matchesSearch && matchesCategory && matchesYear
    })
  }, [books, searchQuery, selectedCategory, selectedYear, locale])

  // Get unique categories and years
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(books.map(book => getTranslation(book.category, locale)))]
    return uniqueCategories.map(cat => ({
      id: cat.toLowerCase().replace(/\s+/g, '-'),
      name: cat
    }))
  }, [books, locale])

  const years = useMemo(() => {
    return [...new Set(books.map(book => book.year))].sort((a, b) => b - a)
  }, [books])

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-20 text-white shadow-2xl dark:border-slate-700">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm mb-6">
            <BookOpen className="h-3.5 w-3.5" />
            E-Library
          </div>
          
          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl mb-6">
            {t('eLibrary.title')}
          </h1>
          
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/90 sm:text-xl mb-8">
            {t('eLibrary.description')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
            <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              {books.length} {t('eLibrary.books')}
            </Badge>
            <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              {phdTheses.length + mscTheses.length} {t('eLibrary.theses')}
            </Badge>
            <Badge className="rounded-full border-white/30 bg-white/10 px-4 py-1.5 backdrop-blur-sm">
              {t('eLibrary.digitalResources')}
            </Badge>
          </div>
        </div>
      </Section>

      {/* Tabs Section */}
      <Section>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm overflow-x-auto gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-2 shrink-0">
              <BookOpen className="h-4 w-4" />
              <span>{t('eLibrary.overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="books" className="flex items-center gap-2 shrink-0">
              <FileText className="h-4 w-4" />
              <span>{t('eLibrary.books')}</span>
              {books.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {books.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="theses-phd" className="flex items-center gap-2 shrink-0">
              <GraduationCap className="h-4 w-4" />
              <span>{t('eLibrary.thesesPhd')}</span>
              {phdTheses.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {phdTheses.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="theses-msc" className="flex items-center gap-2 shrink-0">
              <GraduationCap className="h-4 w-4" />
              <span>{t('eLibrary.thesesMsc')}</span>
              {mscTheses.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {mscTheses.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            ) : (
              <Card className="border border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
                <CardHeader>
                  {overviewContent?.title && (
                    <CardTitle className="text-2xl font-semibold">
                      {getTranslation(overviewContent.title, locale)}
                    </CardTitle>
                  )}
                  {overviewContent?.subtitle && (
                    <CardDescription className="text-lg mt-2">
                      {getTranslation(overviewContent.subtitle, locale)}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {overviewContent?.description && (
                    <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      {getTranslation(overviewContent.description, locale)}
                    </p>
                  )}

                  {/* Video or Images Section */}
                  {overviewContent?.content?.video_url ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-slate-900">
                      {overviewContent.content.video_type === 'youtube' ? (
                        <iframe
                          src={overviewContent.content.video_url}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video
                          src={overviewContent.content.video_url}
                          controls
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  ) : overviewContent?.images && Array.isArray(overviewContent.images) && overviewContent.images.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {overviewContent.images.map((imageUrl: string, index: number) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={`Overview image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{books.length}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t('eLibrary.books')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{phdTheses.length}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t('eLibrary.thesesPhd')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{mscTheses.length}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t('eLibrary.thesesMsc')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{books.filter(b => b.is_free || isInstituteMember).length}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t('eLibrary.freeAccess')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Books Tab */}
          <TabsContent value="books" className="space-y-6">
            <BooksSection
              books={filteredBooks}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              categories={categories}
              years={years}
              locale={locale}
              isInstituteMember={isInstituteMember}
            />
          </TabsContent>

          {/* Theses PHD Tab */}
          <TabsContent value="theses-phd" className="space-y-6">
            <ThesesSection
              theses={phdTheses}
              loading={loading}
              type="PHD"
              locale={locale}
              t={t}
            />
          </TabsContent>

          {/* Theses MSC Tab */}
          <TabsContent value="theses-msc" className="space-y-6">
            <ThesesSection
              theses={mscTheses}
              loading={loading}
              type="MSC"
              locale={locale}
              t={t}
            />
          </TabsContent>
        </Tabs>
      </Section>
    </PageContainer>
  )
}

// Books Section Component
function BooksSection({
  books,
  loading,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedYear,
  setSelectedYear,
  categories,
  years,
  locale,
  isInstituteMember
}: {
  books: Book[]
  loading: boolean
  searchQuery: string
  setSearchQuery: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  selectedYear: string
  setSelectedYear: (value: string) => void
  categories: Array<{ id: string; name: string }>
  years: number[]
  locale: string
  isInstituteMember: boolean
}) {
  return (
    <>
      {/* Search and Filters */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-slate-200/70 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px] rounded-full">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{books.length}</span> books
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[500px] rounded-2xl" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
          <p className="text-base text-slate-500 dark:text-slate-400">
            No books found.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} locale={locale} isInstituteMember={isInstituteMember} />
          ))}
        </div>
      )}
    </>
  )
}

// Book Card Component
function BookCard({ book, locale, isInstituteMember }: { book: Book; locale: string; isInstituteMember: boolean }) {
  const isFree = book.is_free || isInstituteMember
  const canAccess = isFree || (book.price && book.price === 0)

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm ring-1 ring-slate-200/30 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/20 dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800">
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={getTranslation(book.title, locale)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <BookOpen className="h-16 w-16 text-slate-400 dark:text-slate-600" />
          </div>
        )}
        {book.featured && (
          <Badge className="absolute top-3 right-3 rounded-full border-white/30 bg-white/90 backdrop-blur-sm text-xs font-semibold text-primary shadow-sm">
            Featured
          </Badge>
        )}
        {isFree && (
          <Badge className="absolute top-3 left-3 rounded-full border-emerald-400/50 bg-emerald-500/20 text-xs font-semibold text-emerald-100 backdrop-blur-sm">
            {isInstituteMember ? 'Free for Members' : 'Free'}
          </Badge>
        )}
        {!canAccess && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock className="h-12 w-12 text-white" />
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
          {getTranslation(book.title, locale)}
        </CardTitle>
        <CardDescription className="line-clamp-2 mt-1">
          {getTranslation(book.author, locale)}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span>{getTranslation(book.category, locale)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{book.year}</span>
          </div>
          {book.pages && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{book.pages} pages</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between gap-3">
          {canAccess ? (
            <Button className="w-full" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {book.downloadLink ? 'Download' : 'View'}
            </Button>
          ) : (
            <div className="w-full">
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {book.price ? `$${book.price}` : 'Paid Access'}
              </div>
              <Button className="w-full" size="sm" variant="outline">
                Purchase Access
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Theses Section Component
function ThesesSection({
  theses,
  loading,
  type,
  locale,
  t
}: {
  theses: Thesis[]
  loading: boolean
  type: 'PHD' | 'MSC'
  locale: string
  t: any
}) {
  return (
    <>
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[400px] rounded-2xl" />
          ))}
        </div>
      ) : theses.length === 0 ? (
        <Card className="border border-dashed border-slate-200 bg-slate-50/60 p-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
          <GraduationCap className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500 mb-4" />
          <p className="text-base text-slate-500 dark:text-slate-400">
            No {type === 'PHD' ? 'PhD' : 'MSc'} theses available at this time.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {theses.map((thesis) => (
            <ThesisCard key={thesis.id} thesis={thesis} locale={locale} />
          ))}
        </div>
      )}
    </>
  )
}

// Thesis Card Component
function ThesisCard({ thesis, locale }: { thesis: Thesis; locale: string }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm ring-1 ring-slate-200/30 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:ring-primary/20 dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {thesis.degree_type}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{thesis.year}</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
          {getTranslation(thesis.title, locale)}
        </CardTitle>
        <CardDescription className="mt-2">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{getTranslation(thesis.author, locale)}</span>
          </div>
          {thesis.supervisor && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">Supervisor: {getTranslation(thesis.supervisor, locale)}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
          {thesis.abstract ? getTranslation(thesis.abstract, locale) : getTranslation(thesis.description, locale)}
        </p>
      </CardContent>

      <CardContent className="pt-0">
        <Button className="w-full" size="sm" variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}
