import { apiClient } from "@/lib/api"
import { departments } from "@/lib/data"
import { notFound } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, GraduationCap, BookOpen, Award, Microscope, FlaskConical, Users, ExternalLink, MapPin, Calendar, Building, Images, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import EquipmentCard from "@/components/equipment-card"
import { DepartmentStaffFilter } from "@/components/department-staff-filter"

async function getDepartment(departmentId: string) {
  try {
    // Try to fetch from API first
    const response = await apiClient.getDepartment(departmentId)
    return response.department
  } catch (apiError) {
    // Fallback to static data
    console.warn("API fetch failed, falling back to static data:", apiError)
    const staticDepartment = departments.find((d) => d.id === departmentId)
    return staticDepartment || null
  }
}

async function getDepartmentLaboratories(departmentId: string) {
  try {
    const response = await apiClient.getLaboratories({ departmentId })
    return response.laboratories || []
  } catch (error) {
    console.warn("Failed to fetch laboratories:", error)
    return []
  }
}

export default async function DepartmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ departmentId: string; locale: string }>
  searchParams?: Promise<{ tab?: string }>
}) {
  const { departmentId, locale } = await params
  const searchParamsResolved = await searchParams

  const [department, laboratories] = await Promise.all([
    getDepartment(departmentId),
    getDepartmentLaboratories(departmentId)
  ])

  if (!department) {
    notFound()
  }

  const initialTab = ["about", "laboratories", "equipment", "services", "staff", "gallery"].includes(searchParamsResolved?.tab || "")
    ? (searchParamsResolved!.tab as "about" | "laboratories" | "equipment" | "services" | "staff" | "gallery")
    : "about"

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
        {/* Department background image with overlay */}
        {department.image && (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 dark:opacity-10"
              style={{ backgroundImage: `url('${department.image}')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/95 to-slate-50/90 dark:from-slate-900/90 dark:via-slate-800/95 dark:to-slate-900/90"></div>
          </div>
        )}

        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Floating animated orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/30 to-transparent dark:from-blue-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-slate-100/40 to-transparent dark:from-slate-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-bl from-emerald-50/20 to-transparent dark:from-emerald-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>

          {/* Floating particles */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-32 right-1/3 w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-40 left-1/2 w-1 h-1 bg-slate-400/50 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute top-40 right-1/2 w-2.5 h-2.5 bg-blue-300/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>

          {/* Moving gradient lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent animate-pulse dark:via-blue-800/30" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-slate-200/50 to-transparent animate-pulse dark:via-slate-700/30" style={{ animationDuration: '4s', animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            {/* Content Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
                <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                  Research Department
                </Badge>
              </div>

              <AnimatedSection animation="fade-up">
                <div className="text-6xl mb-4 filter drop-shadow-lg">{department.icon}</div>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-white dark:to-slate-100 bg-clip-text text-transparent leading-tight">
                  {department.name}
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light max-w-3xl">
                  {department.description}
                </p>
              </AnimatedSection>

              {/* Department Stats Preview */}
              <div className="flex flex-wrap gap-4 text-slate-700 dark:text-slate-300 mt-8">
                <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                    <FlaskConical className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Laboratories</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{laboratories?.length || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors duration-300">
                    <Microscope className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Equipment</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{department.equipment?.length || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors duration-300">
                    <FlaskConical className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Services</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{department.analysisServices?.length || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors duration-300">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Staff</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{department.staff?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Column */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Main department image */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <Image
                    src={department.image || "/placeholder.svg"}
                    alt={department.name}
                    width={600}
                    height={400}
                    className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

                  {/* Floating badge on image */}
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Active Department</span>
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



      {/* Main Content */}
      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={initialTab} className="w-full">
              <TabsList className="flex w-full mb-8 bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-2 shadow-lg overflow-x-auto gap-2">
                <TabsTrigger
                  value="about"
                  className="flex items-center gap-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/30 data-[state=active]:border-blue-500 py-3 px-5 rounded-lg transition-all duration-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 flex-shrink-0 border-2 border-transparent font-semibold text-sm"
                >
                  <BookOpen className="h-5 w-5 data-[state=active]:text-white" />
                  <span className="whitespace-nowrap">About</span>
                </TabsTrigger>
                <TabsTrigger
                  value="laboratories"
                  className="flex items-center gap-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/30 data-[state=active]:border-blue-500 py-3 px-5 rounded-lg transition-all duration-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 flex-shrink-0 border-2 border-transparent font-semibold text-sm"
                >
                  <FlaskConical className="h-5 w-5 data-[state=active]:text-white" />
                  <span className="whitespace-nowrap">Laboratories</span>
                </TabsTrigger>
                <TabsTrigger
                  value="equipment"
                  className="flex items-center gap-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/30 data-[state=active]:border-blue-500 py-3 px-5 rounded-lg transition-all duration-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 flex-shrink-0 border-2 border-transparent font-semibold text-sm"
                >
                  <Microscope className="h-5 w-5 data-[state=active]:text-white" />
                  <span className="whitespace-nowrap">Equipment</span>
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="flex items-center gap-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/30 data-[state=active]:border-blue-500 py-3 px-5 rounded-lg transition-all duration-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 flex-shrink-0 border-2 border-transparent font-semibold text-sm"
                >
                  <FlaskConical className="h-5 w-5 data-[state=active]:text-white" />
                  <span className="whitespace-nowrap">Services</span>
                </TabsTrigger>
                <TabsTrigger
                  value="staff"
                  className="flex items-center gap-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/30 data-[state=active]:border-blue-500 py-3 px-5 rounded-lg transition-all duration-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 flex-shrink-0 border-2 border-transparent font-semibold text-sm"
                >
                  <Users className="h-5 w-5 data-[state=active]:text-white" />
                  <span className="whitespace-nowrap">Staff</span>
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="flex items-center gap-2.5 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/30 data-[state=active]:border-blue-500 py-3 px-5 rounded-lg transition-all duration-300 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 flex-shrink-0 border-2 border-transparent font-semibold text-sm"
                >
                  <Images className="h-5 w-5 data-[state=active]:text-white" />
                  <span className="whitespace-nowrap">Gallery</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    About the Department
                  </h2>
                  <AnimatedSection animation="fade-up">
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                      <CardContent className="px-6">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {department.about || department.description || 'This department provides specialized research and analysis services as part of the Egyptian Petroleum Research Institute.'}
                        </p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                </div>

                {department.achievements && department.achievements.length > 0 && (
                  <AnimatedSection animation="fade-up" delay={0.1}>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Key Achievements
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {department.achievements.map((achievement: string, index: number) => (
                          <Card key={index} className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300 group">
                            <CardContent className="px-6">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                                  <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                                    {achievement}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                )}

                {department.researchAreas && department.researchAreas.length > 0 && (
                  <AnimatedSection animation="fade-up" delay={0.2}>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Research Areas
                      </h3>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardContent className="px-6">
                          <div className="flex flex-wrap gap-3">
                            {department.researchAreas.map((area: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </AnimatedSection>
                )}

                {(!department.achievements || department.achievements.length === 0) &&
                  (!department.researchAreas || department.researchAreas.length === 0) && (
                    <AnimatedSection animation="fade-up" delay={0.1}>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 mt-8">
                        <CardContent className="pt-6 text-center">
                          <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                          <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Additional Information</h3>
                          <p className="text-slate-600 dark:text-slate-400">
                            More detailed information about achievements and research areas will be available soon.
                          </p>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  )}
              </TabsContent>

              <TabsContent value="laboratories" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Department Laboratories
                  </h2>
                  {laboratories && laboratories.length > 0 ? (
                    <div className="grid gap-6">
                      {laboratories.map((laboratory: any, index: number) => (
                        <AnimatedSection key={laboratory.id} animation="fade-up" delay={index * 0.1}>
                          <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300">
                            <div className="md:flex">
                              {/* Laboratory Image */}
                              <div className="md:w-1/3">
                                <div className="relative h-48 md:h-full">
                                  <Image
                                    src={laboratory.image || "/placeholder.svg"}
                                    alt={getLocalizedText(laboratory.name, 'Laboratory')}
                                    fill
                                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                                  />
                                  {laboratory.is_featured && (
                                    <div className="absolute top-4 left-4">
                                      <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
                                        Featured
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Laboratory Content */}
                              <div className="md:w-2/3 p-6">
                                <CardHeader className="px-0 pt-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <CardTitle className="text-xl text-slate-900 dark:text-slate-100 mb-2">
                                        {getLocalizedText(laboratory.name, 'Laboratory')}
                                      </CardTitle>
                                      <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {getLocalizedText(laboratory.description, '')}
                                      </CardDescription>
                                    </div>
                                  </div>
                                </CardHeader>

                                <CardContent className="px-0 space-y-4">
                                  {/* Laboratory Head */}
                                  {laboratory.head_name && (
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                      {laboratory.head_picture && (
                                        <div className="relative h-12 w-12 flex-shrink-0">
                                          <Image
                                            src={laboratory.head_picture}
                                            alt={getLocalizedText(laboratory.head_name, 'Laboratory Head')}
                                            fill
                                            className="object-cover rounded-full"
                                          />
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                          {getLocalizedText(laboratory.head_academic_title, '')} {getLocalizedText(laboratory.head_name, '')}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                          {getLocalizedText(laboratory.head_title, '')}
                                        </p>
                                        {laboratory.head_email && (
                                          <a
                                            href={`mailto:${laboratory.head_email}`}
                                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                                          >
                                            <Mail className="h-3 w-3" />
                                            {laboratory.head_email}
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Laboratory Details */}
                                  <div className="grid md:grid-cols-2 gap-4">
                                    {laboratory.established_year && (
                                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>Established: {laboratory.established_year}</span>
                                      </div>
                                    )}
                                    {laboratory.building && (
                                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Building className="h-4 w-4" />
                                        <span>{laboratory.building}, {laboratory.floor}</span>
                                      </div>
                                    )}
                                    {laboratory.phone && (
                                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Phone className="h-4 w-4" />
                                        <span>{laboratory.phone}</span>
                                      </div>
                                    )}
                                    {laboratory.email && (
                                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Mail className="h-4 w-4" />
                                        <a href={`mailto:${laboratory.email}`} className="hover:underline">
                                          {laboratory.email}
                                        </a>
                                      </div>
                                    )}
                                  </div>

                                  {/* Staff and Students Count */}
                                  <div className="flex gap-4 text-sm">
                                    <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg">
                                      <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                      <span className="text-blue-700 dark:text-blue-300">
                                        {laboratory.staff_count || 0} Staff
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 rounded-lg">
                                      <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                      <span className="text-emerald-700 dark:text-emerald-300">
                                        {laboratory.students_count || 0} Students
                                      </span>
                                    </div>
                                  </div>

                                  {/* Research Areas */}
                                  {laboratory.research_areas && (
                                    <div>
                                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Research Areas</h4>
                                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {getLocalizedText(laboratory.research_areas, '')}
                                      </p>
                                    </div>
                                  )}

                                  {/* Actions */}
                                  <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <Link
                                      href={`/laboratories/${laboratory.id}`}
                                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                                    >
                                      <BookOpen className="h-4 w-4" />
                                      View Details
                                    </Link>
                                    <Link
                                      href="/contact"
                                      className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                                    >
                                      <Mail className="h-4 w-4" />
                                      Contact Lab
                                    </Link>
                                  </div>
                                </CardContent>
                              </div>
                            </div>
                          </Card>
                        </AnimatedSection>
                      ))}
                    </div>
                  ) : (
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                      <CardContent className="pt-6 text-center">
                        <FlaskConical className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                        <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">No Laboratories Found</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          This department currently has no associated laboratories. Please check back later or contact us for more information.
                        </p>
                        <Link href="/contact" className="mt-4 inline-block">
                          <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900">
                            Contact Us
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Equipment & Technology
                  </h2>
                  {department.equipment && department.equipment.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {department.equipment.map((equipment: any, index: number) => (
                        <AnimatedSection key={equipment.id} animation="fade-up" delay={index * 0.1}>
                          <EquipmentCard
                            equipment={equipment}
                            department={department.name}
                            departmentId={department.id}
                          />
                        </AnimatedSection>
                      ))}
                    </div>
                  ) : (
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                      <CardContent className="pt-6 text-center">
                        <Microscope className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                        <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Equipment Information</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Equipment details for this department are being updated. Please contact us for current equipment availability.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Department Services
                  </h2>
                  {department.analysisServices && department.analysisServices.length > 0 ? (
                    <div className="space-y-4">
                      {department.analysisServices.map((service: any, index: number) => (
                        <AnimatedSection key={service.id} animation="fade-up" delay={index * 0.1}>
                          <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group overflow-hidden relative">
                            {/* Decorative gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>

                            <CardHeader className="relative z-10">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                      <FlaskConical className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {service.name}
                                      </CardTitle>
                                    </div>
                                  </div>
                                  <CardDescription className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3">
                                    {service.description}
                                  </CardDescription>
                                </div>
                                {service.price && (
                                  <Badge className="ml-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-md text-base font-bold px-4 py-2 h-fit">
                                    ${service.price}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="relative z-10 space-y-4">
                              {service.duration && (
                                <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                                  <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Duration: <span className="text-blue-600 dark:text-blue-400">{service.duration}</span>
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-2 border-t-2 border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                  <Award className="h-4 w-4" />
                                  <span>Professional Service</span>
                                </div>
                                <Link href="/contact" className="flex-shrink-0">
                                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300 font-semibold group/btn">
                                    <span className="flex items-center justify-center gap-2">
                                      Request Service
                                      <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </span>
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        </AnimatedSection>
                      ))}
                    </div>
                  ) : (
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                      <CardContent className="pt-6 text-center">
                        <FlaskConical className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                        <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Services Information</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Service details for this department are being updated. Please contact us for available services.
                        </p>
                        <Link href="/contact" className="mt-4 inline-block">
                          <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900">
                            Contact Us
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="staff" className="mt-0">
                <DepartmentStaffFilter staff={department.staff || []} />
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Department Gallery
                  </h2>
                  {department.gallery && Array.isArray(department.gallery) && department.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {department.gallery.map((imageUrl: string, index: number) => (
                        <AnimatedSection key={index} animation="fade-up" delay={index * 0.05}>
                          <div className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer">
                            <Image
                              src={imageUrl || "/placeholder.svg"}
                              alt={`${department.name} - Image ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                          </div>
                        </AnimatedSection>
                      ))}
                    </div>
                  ) : (
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                      <CardContent className="pt-12 pb-8 text-center">
                        <Images className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                        <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Gallery Coming Soon</h3>
                        <p className="text-slate-600 dark:text-slate-400">
                          Department gallery images will be available soon. Check back later for photos of our facilities, equipment, and activities.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Department Manager */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fade-up">
              <Card className="sticky top-24 border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {department.manager ? "Department Manager" : "Department Information"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 space-y-6">
                  {department.manager ? (
                    <>
                      <div className="relative h-48 w-full">
                        <Image
                          src={department.manager.picture || "/placeholder.svg"}
                          alt={department.manager.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{department.manager.name}</h3>
                        <p className="text-sm text-muted-foreground">{department.manager.title}</p>
                      </div>
                      <Separator />
                      <p className="text-sm text-muted-foreground leading-relaxed">{department.manager.bio}</p>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href={`mailto:${department.manager.email}`} className="text-primary hover:underline">
                            {department.manager.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{department.manager.phone}</span>
                        </div>
                      </div>
                      <Separator />
                      {department.manager?.expertise && department.manager.expertise.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2">Areas of Expertise</h4>
                          <div className="flex flex-wrap gap-1">
                            {department.manager.expertise.map((area: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="relative h-48 w-full bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-6xl">{department.icon || "🏛️"}</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{department.name}</h3>
                        <p className="text-sm text-muted-foreground">Department Overview</p>
                      </div>
                      <Separator />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {department.description || "This department is part of our research institute providing specialized services and expertise."}
                      </p>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <a href="mailto:info@epri.edu" className="text-primary hover:underline">
                            Contact Department
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}
