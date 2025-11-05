import { apiClient } from "@/lib/api"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Mail, 
  Phone, 
  GraduationCap, 
  BookOpen, 
  FlaskConical, 
  Users, 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Building,
  Globe,
  Search,
  Filter,
  UserCheck
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

async function getLaboratories() {
  try {
    const response = await apiClient.getLaboratories()
    return response.laboratories || []
  } catch (error) {
    console.warn("Failed to fetch laboratories:", error)
    return []
  }
}

export default async function LaboratoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; department?: string }>
}) {
  const searchParamsResolved = await searchParams
  const laboratories = await getLaboratories()

  // Filter laboratories based on search params
  const filteredLaboratories = laboratories.filter((lab: any) => {
    const matchesSearch = !searchParamsResolved?.search || 
      lab.name.toLowerCase().includes(searchParamsResolved.search.toLowerCase()) ||
      lab.description?.toLowerCase().includes(searchParamsResolved.search.toLowerCase()) ||
      lab.research_areas?.toLowerCase().includes(searchParamsResolved.search.toLowerCase())
    
    const matchesDepartment = !searchParamsResolved?.department || 
      lab.department_id === searchParamsResolved.department

    return matchesSearch && matchesDepartment
  })

  // Separate featured and regular laboratories
  const featuredLabs = filteredLaboratories.filter((lab: any) => lab.is_featured)
  const regularLabs = filteredLaboratories.filter((lab: any) => !lab.is_featured)

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/30 to-transparent dark:from-blue-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-100/40 to-transparent dark:from-emerald-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-bl from-purple-50/20 to-transparent dark:from-purple-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        </div>

        <div className="relative text-center">
          <AnimatedSection animation="fade-up">
            <div className="text-6xl mb-6 filter drop-shadow-lg">🧪</div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-800 dark:from-slate-100 dark:via-blue-200 dark:to-emerald-200 bg-clip-text text-transparent leading-tight mb-6">
              Research Laboratories
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light max-w-3xl mx-auto">
              Explore our state-of-the-art research laboratories equipped with cutting-edge technology and staffed by leading experts in petroleum engineering and related fields.
            </p>
          </AnimatedSection>

          {/* Search and Filter */}
          <AnimatedSection animation="fade-up" delay={0.2}>
            <div className="max-w-2xl mx-auto mt-8">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search laboratories by name, description, or research areas..."
                    className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
          </AnimatedSection>

          {/* Statistics */}
          <AnimatedSection animation="fade-up" delay={0.3}>
            <div className="flex justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{laboratories.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Labs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{featuredLabs.length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Featured</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {laboratories.reduce((sum: number, lab: any) => sum + (lab.staff_count || 0), 0)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Total Staff</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* Featured Laboratories */}
      {featuredLabs.length > 0 && (
        <Section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Featured Laboratories</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our flagship research laboratories leading innovation in petroleum engineering and energy research.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredLabs.map((laboratory: any, index: number) => (
              <AnimatedSection key={laboratory.id} animation="fade-up" delay={index * 0.1}>
                <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  {/* Laboratory Image */}
                  <div className="relative h-48 -mt-6">
                    <Image
                      src={laboratory.image || "/placeholder.svg"}
                      alt={laboratory.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500 text-yellow-900 border-yellow-400">
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {laboratory.name}
                      </h3>
                    </div>
                  </div>

                  <CardContent className="px-6">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                      {laboratory.description}
                    </p>

                    {/* Laboratory Head */}
                    {laboratory.head_name && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-4">
                        {laboratory.head_picture && (
                          <div className="relative h-10 w-10 flex-shrink-0">
                            <Image
                              src={laboratory.head_picture}
                              alt={laboratory.head_name}
                              fill
                              className="object-cover rounded-full"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                            {laboratory.head_academic_title} {laboratory.head_name}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {laboratory.head_title}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Quick Stats */}
                    <div className="flex gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Users className="h-4 w-4" />
                        <span>{laboratory.staff_count || 0} Staff</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <GraduationCap className="h-4 w-4" />
                        <span>{laboratory.students_count || 0} Students</span>
                      </div>
                      {laboratory.established_year && (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Calendar className="h-4 w-4" />
                          <span>{laboratory.established_year}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <Link 
                        href={`/laboratories/${laboratory.id}`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <BookOpen className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      {laboratory.email && (
                        <a 
                          href={`mailto:${laboratory.email}`}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full">
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </Section>
      )}

      {/* All Laboratories */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {featuredLabs.length > 0 ? 'All Laboratories' : 'Our Laboratories'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Complete list of our research and testing laboratories across different departments and specializations.
          </p>
        </div>

        {filteredLaboratories.length > 0 ? (
          <div className="grid gap-6">
            {(featuredLabs.length > 0 ? regularLabs : filteredLaboratories).map((laboratory: any, index: number) => (
              <AnimatedSection key={laboratory.id} animation="fade-up" delay={index * 0.1}>
                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300">
                  <div className="md:flex">
                    {/* Laboratory Image */}
                    <div className="md:w-1/3">
                      <div className="relative h-48 md:h-full">
                        <Image
                          src={laboratory.image || "/placeholder.svg"}
                          alt={laboratory.name}
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
                        <div className="absolute bottom-4 right-4">
                          <div className={`w-3 h-3 rounded-full ${laboratory.is_active ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Laboratory Content */}
                    <div className="md:w-2/3 p-6">
                      <CardHeader className="px-0 pt-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl text-slate-900 dark:text-slate-100 mb-2">
                              {laboratory.name}
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed">
                              {laboratory.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="px-0 space-y-4">
                        {/* Laboratory Head */}
                        {laboratory.head_name && (
                          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            {laboratory.head_picture && (
                              <div className="relative h-10 w-10 flex-shrink-0">
                                <Image
                                  src={laboratory.head_picture}
                                  alt={laboratory.head_name}
                                  fill
                                  className="object-cover rounded-full"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                {laboratory.head_academic_title} {laboratory.head_name}
                              </p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">
                                {laboratory.head_title}
                              </p>
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

                        {/* Research Areas Preview */}
                        {laboratory.research_areas && (
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 text-sm">Research Areas</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                              {laboratory.research_areas}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <Link 
                            href={`/laboratories/${laboratory.id}`}
                            className="flex-1"
                          >
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                              <BookOpen className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                          {laboratory.website && (
                            <a 
                              href={laboratory.website}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Website
                              </Button>
                            </a>
                          )}
                          {laboratory.email && (
                            <a 
                              href={`mailto:${laboratory.email}`}
                            >
                              <Button variant="outline">
                                <Mail className="h-4 w-4 mr-2" />
                                Contact
                              </Button>
                            </a>
                          )}
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
              <FlaskConical className="h-16 w-16 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
              <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100 text-xl">No Laboratories Found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {searchParamsResolved?.search || searchParamsResolved?.department
                  ? "No laboratories match your current search criteria. Try adjusting your filters."
                  : "Our laboratory information is being updated. Please check back soon."}
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/contact">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
                <Link href="/departments">
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Departments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </Section>
    </PageContainer>
  )
}

export const metadata = {
  title: 'Research Laboratories - EPRI',
  description: 'Explore our state-of-the-art research laboratories equipped with cutting-edge technology and staffed by leading experts in petroleum engineering.',
}