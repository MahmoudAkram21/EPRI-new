import { apiClient } from "@/lib/api"
import { notFound } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Award,
  Microscope,
  FlaskConical,
  Users,
  ExternalLink,
  MapPin,
  Calendar,
  Building,
  Globe,
  FileText,
  Settings,
  Target,
  Beaker,
  UserCheck,
  Clock,
  Home,
  PhoneCall
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Helper function to convert text to slug format
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Helper function to extract text from localized JSON
function extractText(value: any, locale: string = 'en'): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    return value[locale] || value.en || value.ar || ''
  }
  return ''
}

async function getLaboratory(laboratoryId: string, locale: string = 'en') {
  try {
    // First, try to fetch by ID (in case it's a valid UUID)
    const response = await apiClient.get(`/laboratories/${laboratoryId}`)
    console.log("Laboratory response:", response)
    // Backend returns { laboratory: {...} }
    return response?.laboratory || response
  } catch (error: any) {
    // If 404 and the ID doesn't look like a UUID, try to find by slug/name
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(laboratoryId)
    const is404 = error?.message?.includes('404') || 
                  error?.message?.includes('not found') ||
                  error?.message?.includes('Not Found')
    
    if (!isUUID && is404) {
      try {
        console.log("ID lookup failed, trying to find by slug:", laboratoryId)
        // Fetch all laboratories and find one matching the slug
        const allLabsResponse = await apiClient.getLaboratories()
        const laboratories = allLabsResponse.laboratories || []
        
        // Try to find a laboratory whose name (when slugified) matches the parameter
        const matchingLab = laboratories.find((lab: any) => {
          const labName = extractText(lab.name, locale)
          const labSlug = toSlug(labName)
          return labSlug === laboratoryId || lab.id === laboratoryId
        })
        
        if (matchingLab) {
          console.log("Found laboratory by slug:", matchingLab.id)
          return matchingLab
        }
      } catch (searchError) {
        console.warn("Failed to search laboratories by slug:", searchError)
      }
    }
    
    console.warn("Failed to fetch laboratory:", error)
    return null
  }
}

async function getLaboratoryStaff(laboratoryId: string) {
  try {
    const response = await apiClient.get(`/laboratories/${laboratoryId}/staff`)
    return response.data.staff || []
  } catch (error) {
    console.warn("Failed to fetch laboratory staff:", error)
    return []
  }
}

export default async function LaboratoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ laboratoryId: string; locale: string }>
  searchParams?: Promise<{ tab?: string }>
}) {
  const { laboratoryId, locale } = await params
  const searchParamsResolved = await searchParams

  const laboratory = await getLaboratory(laboratoryId, locale)

  if (!laboratory) {
    notFound()
  }

  const initialTab = ["overview", "head", "facilities", "research", "staff", "contact"].includes(searchParamsResolved?.tab || "")
    ? (searchParamsResolved!.tab as "overview" | "head" | "facilities" | "research" | "staff" | "contact")
    : "overview"

  // Helper function to extract localized text from JSON fields
  const getLocalizedText = (field: any, defaultValue: string = ''): string => {
    if (!field) return defaultValue
    if (typeof field === 'string') return field
    if (typeof field === 'object') {
      return field[locale] || field.en || field.ar || defaultValue
    }
    return defaultValue
  }

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Laboratory background image with overlay */}
        {laboratory.image && (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 dark:opacity-10"
              style={{ backgroundImage: `url('${laboratory.image}')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/95 to-slate-50/90 dark:from-slate-900/90 dark:via-slate-800/95 dark:to-slate-900/90"></div>
          </div>
        )}

        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Floating animated orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/30 to-transparent dark:from-blue-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-100/40 to-transparent dark:from-emerald-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-bl from-purple-50/20 to-transparent dark:from-purple-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>

          {/* Floating particles */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-40 left-1/2 w-1 h-1 bg-slate-400/50 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute top-40 right-1/2 w-2.5 h-2.5 bg-purple-300/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        </div>

        <div className="relative flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Content Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
                <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                  Research Laboratory
                </Badge>
                {laboratory.is_featured && (
                  <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
                    Featured Lab
                  </Badge>
                )}
              </div>

              <AnimatedSection animation="fade-up">
                <div className="text-6xl mb-4 filter drop-shadow-lg">🧪</div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-800 dark:from-slate-100 dark:via-blue-200 dark:to-emerald-200 bg-clip-text text-transparent leading-tight">
                  {getLocalizedText(laboratory.name, 'Laboratory')}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light max-w-3xl">
                  {getLocalizedText(laboratory.description, '')}
                </p>
              </AnimatedSection>

              {/* Laboratory Quick Stats */}
              <div className="flex flex-wrap gap-4 text-slate-700 dark:text-slate-300 mt-8">
                {laboratory.established_year && (
                  <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">Established</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{laboratory.established_year}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors duration-300">
                    <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Staff</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{laboratory.staff_count || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                    <GraduationCap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Students</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{laboratory.students_count || 0}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 mt-8">
                {laboratory.email && (
                  <a
                    href={`mailto:${laboratory.email}`}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Lab
                  </a>
                )}
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4" />
                  Request Visit
                </Link>
              </div>
            </div>

            {/* Image Column */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Main laboratory image */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <Image
                    src={laboratory.image || "/placeholder.svg"}
                    alt={getLocalizedText(laboratory.name, 'Laboratory')}
                    width={600}
                    height={400}
                    className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                  {/* Status badge on image */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${laboratory.is_active ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {laboratory.is_active ? 'Active Laboratory' : 'Under Maintenance'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative elements around image */}
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100/30 dark:bg-blue-900/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }}></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-100/30 dark:bg-emerald-900/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Navigation Breadcrumb */}
      <Section className="pt-0">
        <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <Link href="/departments" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Departments
          </Link>
          <span>/</span>
          <Link href="/laboratories" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Laboratories
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-medium">
            {getLocalizedText(laboratory.name, 'Laboratory')}
          </span>
        </nav>
      </Section>

      {/* Main Content */}
      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={initialTab} className="w-full">
              <TabsList className="flex w-full mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm overflow-x-auto gap-1">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="head"
                  className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                >
                  <UserCheck className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">Lab Head</span>
                </TabsTrigger>
                <TabsTrigger
                  value="facilities"
                  className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">Facilities</span>
                </TabsTrigger>
                <TabsTrigger
                  value="research"
                  className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                >
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">Research</span>
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                >
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">Contact</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Laboratory Overview
                  </h2>

                  <AnimatedSection animation="fade-up">
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                      <CardContent className="px-6">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                          {getLocalizedText(laboratory.description, '')}
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>

                  {/* Laboratory Statistics */}
                  <AnimatedSection animation="fade-up" delay={0.1}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300">
                        <CardContent className="px-4 text-center">
                          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{laboratory.staff_count || 0}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Staff Members</div>
                        </CardContent>
                      </Card>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300">
                        <CardContent className="px-4 text-center">
                          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <GraduationCap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{laboratory.students_count || 0}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Students</div>
                        </CardContent>
                      </Card>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300">
                        <CardContent className="px-4 text-center">
                          <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{laboratory.established_year || 'N/A'}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Established</div>
                        </CardContent>
                      </Card>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300">
                        <CardContent className="px-4 text-center">
                          <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Building className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{laboratory.floor || 'N/A'}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Floor</div>
                        </CardContent>
                      </Card>
                    </div>
                  </AnimatedSection>

                  {/* Services Offered */}
                  {laboratory.services_offered && (
                    <AnimatedSection animation="fade-up" delay={0.2}>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <Beaker className="h-5 w-5" />
                            Services Offered
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {getLocalizedText(laboratory.services_offered, '')}
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  )}
                </div>
              </TabsContent>

              {/* Lab Head Tab */}
              <TabsContent value="head" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Laboratory Head
                  </h2>

                  {laboratory.head_name ? (
                    <AnimatedSection animation="fade-up">
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardContent className="px-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Head Photo */}
                            <div className="flex-shrink-0">
                              <div className="relative h-48 w-48 mx-auto md:mx-0">
                                <Image
                                  src={laboratory.head_picture || "/placeholder.svg"}
                                  alt={getLocalizedText(laboratory.head_name, 'Laboratory Head')}
                                  fill
                                  className="object-cover rounded-xl shadow-lg"
                                />
                              </div>
                            </div>

                            {/* Head Information */}
                            <div className="flex-1 space-y-4">
                              <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                  {getLocalizedText(laboratory.head_academic_title, '')} {getLocalizedText(laboratory.head_name, '')}
                                </h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400">
                                  {getLocalizedText(laboratory.head_title, '')}
                                </p>
                              </div>

                              {laboratory.head_bio && (
                                <div>
                                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Biography</h4>
                                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {getLocalizedText(laboratory.head_bio, '')}
                                  </p>
                                </div>
                              )}

                              {/* Contact Information */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">Contact Information</h4>
                                {laboratory.head_email && (
                                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    <a
                                      href={`mailto:${laboratory.head_email}`}
                                      className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                      {laboratory.head_email}
                                    </a>
                                  </div>
                                )}
                                {laboratory.head_cv_url && (
                                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                    <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    <a
                                      href={laboratory.head_cv_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                      Download CV <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  ) : (
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                      <CardContent className="pt-6 text-center">
                        <UserCheck className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                        <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Laboratory Head Information</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Laboratory head information is being updated. Please contact us for more details.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Facilities Tab */}
              <TabsContent value="facilities" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Facilities & Equipment
                  </h2>

                  {/* Facilities Description */}
                  {laboratory.facilities && (
                    <AnimatedSection animation="fade-up">
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <Building className="h-5 w-5" />
                            Laboratory Facilities
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {getLocalizedText(laboratory.facilities, '')}
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  )}

                  {/* Equipment List */}
                  {laboratory.equipment_list && (
                    <AnimatedSection animation="fade-up" delay={0.1}>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <Microscope className="h-5 w-5" />
                            Major Equipment
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {getLocalizedText(laboratory.equipment_list, '')}
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  )}

                  {/* Location Information */}
                  <AnimatedSection animation="fade-up" delay={0.2}>
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                          <MapPin className="h-5 w-5" />
                          Location Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {laboratory.building && (
                          <div className="flex items-center gap-3">
                            <Building className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            <span className="text-slate-700 dark:text-slate-300">
                              {laboratory.building}
                              {laboratory.floor && `, ${laboratory.floor}`}
                              {laboratory.room_numbers && ` - Rooms: ${laboratory.room_numbers}`}
                            </span>
                          </div>
                        )}
                        {laboratory.address && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5" />
                            <span className="text-slate-700 dark:text-slate-300">
                              {getLocalizedText(laboratory.address, '')}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                </div>
              </TabsContent>

              {/* Research Tab */}
              <TabsContent value="research" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Research Activities
                  </h2>

                  {laboratory.research_areas && (
                    <AnimatedSection animation="fade-up">
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <Target className="h-5 w-5" />
                            Research Areas
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                            {getLocalizedText(laboratory.research_areas, '')}
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  )}

                  {laboratory.services_offered && (
                    <AnimatedSection animation="fade-up" delay={0.1}>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <FlaskConical className="h-5 w-5" />
                            Research Services
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                            {getLocalizedText(laboratory.services_offered, '')}
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  )}

                  {(!laboratory.research_areas && !laboratory.services_offered) && (
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                      <CardContent className="pt-6 text-center">
                        <Target className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                        <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Research Information</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Research activities and focus areas are being updated. Please contact the laboratory for current research projects and opportunities.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Contact Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Contact Details */}
                    <AnimatedSection animation="fade-up">
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <PhoneCall className="h-5 w-5" />
                            Get in Touch
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {laboratory.email && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                              <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              <div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Email</div>
                                <a
                                  href={`mailto:${laboratory.email}`}
                                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                                >
                                  {laboratory.email}
                                </a>
                              </div>
                            </div>
                          )}
                          {laboratory.phone && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                              <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              <div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Phone</div>
                                <a
                                  href={`tel:${laboratory.phone}`}
                                  className="text-slate-900 dark:text-slate-100 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  {laboratory.phone}
                                </a>
                              </div>
                            </div>
                          )}
                          {laboratory.alternative_phone && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                              <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              <div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Alternative Phone</div>
                                <a
                                  href={`tel:${laboratory.alternative_phone}`}
                                  className="text-slate-900 dark:text-slate-100 font-medium hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  {laboratory.alternative_phone}
                                </a>
                              </div>
                            </div>
                          )}
                          {laboratory.fax && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                              <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              <div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Fax</div>
                                <span className="text-slate-900 dark:text-slate-100 font-medium">
                                  {laboratory.fax}
                                </span>
                              </div>
                            </div>
                          )}
                          {laboratory.website && (
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                              <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                              <div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">Website</div>
                                <a
                                  href={laboratory.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
                                >
                                  Visit Website <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </AnimatedSection>

                    {/* Location Information */}
                    <AnimatedSection animation="fade-up" delay={0.1}>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                            <MapPin className="h-5 w-5" />
                            Visit Us
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {laboratory.address && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Address</h4>
                              <p className="text-slate-700 dark:text-slate-300">
                                {getLocalizedText(laboratory.address, '')}
                              </p>
                            </div>
                          )}
                          {laboratory.building && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                              <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Building & Location</h4>
                              <p className="text-slate-700 dark:text-slate-300">
                                {laboratory.building}
                                {laboratory.floor && `, ${laboratory.floor}`}
                                {laboratory.room_numbers && ` - Rooms: ${laboratory.room_numbers}`}
                              </p>
                            </div>
                          )}

                          {/* Quick Actions */}
                          <div className="flex flex-col gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Link
                              href="/contact"
                              className="w-full"
                            >
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                <Mail className="h-4 w-4 mr-2" />
                                Request Lab Visit
                              </Button>
                            </Link>
                            {laboratory.email && (
                              <a
                                href={`mailto:${laboratory.email}`}
                                className="w-full"
                              >
                                <Button variant="outline" className="w-full">
                                  <Phone className="h-4 w-4 mr-2" />
                                  Contact Lab Directly
                                </Button>
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Quick Info */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fade-up">
              <Card className="sticky top-24 border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Quick Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 space-y-6">
                  {/* Status */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${laboratory.is_active ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`}></div>
                    <div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Status</div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {laboratory.is_active ? 'Active' : 'Under Maintenance'}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-400">Staff Members</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{laboratory.staff_count || 0}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-600 dark:text-slate-400">Students</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{laboratory.students_count || 0}</span>
                    </div>
                    {laboratory.established_year && (
                      <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-400">Established</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{laboratory.established_year}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-2">
                    {laboratory.website && (
                      <a
                        href={laboratory.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Globe className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      </a>
                    )}
                    {laboratory.email && (
                      <a
                        href={`mailto:${laboratory.email}`}
                        className="w-full"
                      >
                        <Button variant="outline" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Lab
                        </Button>
                      </a>
                    )}
                    <Link
                      href="/contact"
                      className="w-full"
                    >
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Visit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}