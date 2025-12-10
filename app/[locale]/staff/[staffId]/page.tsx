import { notFound } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Clock, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Building2,
  ExternalLink,
  User,
  Briefcase,
  Users,
  Calendar,
  FileText,
  Link as LinkIcon
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

async function getStaff(staffId: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://epri.developteam.site:5000/api'
    const response = await fetch(`${apiUrl}/staff/${staffId}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.staff
  } catch (error) {
    console.error("Failed to fetch staff:", error)
    return null
  }
}

// Helper function to extract translation value
function getTranslation(value: any, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || ''
  }
  return ''
}

export default async function StaffProfilePage({
  params,
}: {
  params: Promise<{ staffId: string; locale?: string }>
}) {
  const { staffId } = await params
  const locale = (await params).locale || 'en'
  
  const staff = await getStaff(staffId)

  if (!staff) {
    notFound()
  }

  // Helper function to check if a social link exists and is valid
  const hasValidLink = (link: string | null | undefined): boolean => {
    return !!(link && link.trim() && link !== 'null' && link !== 'undefined')
  }

  // Get staff name, title, and other fields with locale support
  const staffName = getTranslation(staff.name, locale)
  const staffTitle = getTranslation(staff.title, locale)
  const academicPosition = getTranslation(staff.academic_position, locale)
  const bio = getTranslation(staff.bio, locale)
  const researchInterests = getTranslation(staff.research_interests, locale)
  const faculty = getTranslation(staff.faculty, locale)
  const department = getTranslation(staff.department, locale)
  const officeLocation = getTranslation(staff.office_location, locale)
  const officeHours = getTranslation(staff.office_hours, locale)

  return (
    <PageContainer>
      <Section className="py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture & Contact */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Profile Picture */}
              <AnimatedSection animation="fade-up">
                <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 mb-6">
                  <Image
                    src={staff.picture || "/placeholder.svg"}
                    alt={staffName || "Staff Member"}
                    fill
                    className="object-cover"
                  />
                </div>
              </AnimatedSection>

              {/* Name and Title */}
              <AnimatedSection animation="fade-up" delay={0.1}>
                <div className="space-y-2 mb-6">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {staffName || "Staff Member"}
                  </h1>
                  {staffTitle && (
                    <p className="text-lg text-slate-700 dark:text-slate-300">
                      {staffTitle}
                    </p>
                  )}
                  {academicPosition && (
                    <p className="text-base text-slate-600 dark:text-slate-400">
                      {academicPosition}
                    </p>
                  )}
                  {department && (
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                      {department}
                    </p>
                  )}
                </div>
              </AnimatedSection>

              {/* Contact Information */}
              <AnimatedSection animation="fade-up" delay={0.2}>
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardContent className="pt-6 space-y-4">
                    {staff.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5 shrink-0" />
                        <a 
                          href={`mailto:${staff.email}`} 
                          className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
                        >
                          {staff.email}
                        </a>
                      </div>
                    )}
                    
                    {staff.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {staff.phone}
                        </span>
                      </div>
                    )}

                    {/* Academic Links */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
                      {hasValidLink(staff.google_scholar) && (
                        <a
                          href={staff.google_scholar!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <span className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 text-xs">
                            G
                          </span>
                          <span>Google Scholar</span>
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      )}
                      
                      {hasValidLink(staff.scopus) && (
                        <a
                          href={staff.scopus!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                          <span className="w-8 h-8 rounded bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center font-bold text-orange-700 dark:text-orange-300 text-xs">
                            S
                          </span>
                          <span>Scopus</span>
                          <ExternalLink className="h-3 w-3 ml-auto" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>
          </div>

          {/* Right Column - Biography, Affiliations, Education */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            {bio && (
              <AnimatedSection animation="fade-up">
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                      Biography
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Affiliated Centers, Groups & Labs */}
            {staff.departments && staff.departments.length > 0 && (
              <AnimatedSection animation="fade-up" delay={0.1}>
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                      Affiliated Centers, Groups & Labs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {staff.departments.map((dept: any, index: number) => (
                        <div key={dept.id || index} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                          <Building2 className="h-5 w-5 text-slate-500 dark:text-slate-400 shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                              {typeof dept.name === 'string' ? dept.name : getTranslation(dept.name, locale)}
                            </h4>
                            {dept.section_name && (
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {typeof dept.section_name === 'string' ? dept.section_name : getTranslation(dept.section_name, locale)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Education */}
            <AnimatedSection animation="fade-up" delay={0.2}>
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {academicPosition && (
                      <div className="flex items-start gap-4">
                        <GraduationCap className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-1 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {academicPosition}
                          </p>
                          {faculty && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                              {faculty}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Add more education entries if available in the future */}
                    {!academicPosition && (
                      <p className="text-slate-500 dark:text-slate-400 italic">
                        Education information not available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Research Interests */}
            {researchInterests && (
              <AnimatedSection animation="fade-up" delay={0.3}>
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                      Research Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {researchInterests}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Additional Academic Links */}
            <AnimatedSection animation="fade-up" delay={0.4}>
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-slate-100">
                    Academic & Social Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hasValidLink(staff.research_gate) && (
                      <a
                        href={staff.research_gate!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ResearchGate</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-slate-400" />
                      </a>
                    )}
                    {hasValidLink(staff.linkedin) && (
                      <a
                        href={staff.linkedin!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Users className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">LinkedIn</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-slate-400" />
                      </a>
                    )}
                    {hasValidLink(staff.orcid) && (
                      <a
                        href={staff.orcid!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Award className="h-4 w-4 text-green-500 dark:text-green-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ORCID</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-slate-400" />
                      </a>
                    )}
                    {hasValidLink(staff.academia_edu) && (
                      <a
                        href={staff.academia_edu!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Academia.edu</span>
                        <ExternalLink className="h-3 w-3 ml-auto text-slate-400" />
                      </a>
                    )}
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
