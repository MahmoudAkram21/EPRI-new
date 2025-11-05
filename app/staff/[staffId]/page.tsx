import { apiClient } from "@/lib/api"
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
    const response = await apiClient.getStaff(staffId)
    return response.staff
  } catch (error) {
    console.error("Failed to fetch staff:", error)
    return null
  }
}

export default async function StaffProfilePage({
  params,
}: {
  params: Promise<{ staffId: string }>
}) {
  const { staffId } = await params
  
  const staff = await getStaff(staffId)

  if (!staff) {
    notFound()
  }

  // Helper function to check if a social link exists and is valid
  const hasValidLink = (link: string | null | undefined): boolean => {
    return !!(link && link.trim() && link !== 'null' && link !== 'undefined')
  }

  // Get social media links that exist
  const socialLinks = [
    { name: 'Website', icon: Globe, url: staff.socialLinks?.website, color: 'text-blue-600' },
    { name: 'Google Scholar', icon: GraduationCap, url: staff.socialLinks?.googleScholar, color: 'text-blue-500' },
    { name: 'ResearchGate', icon: FileText, url: staff.socialLinks?.researchGate, color: 'text-green-600' },
    { name: 'LinkedIn', icon: Users, url: staff.socialLinks?.linkedin, color: 'text-blue-700' },
    { name: 'ORCID', icon: Award, url: staff.socialLinks?.orcid, color: 'text-green-500' },
    { name: 'Scopus', icon: BookOpen, url: staff.socialLinks?.scopus, color: 'text-orange-600' },
    { name: 'Academia.edu', icon: GraduationCap, url: staff.socialLinks?.academiaEdu, color: 'text-indigo-600' },
  ].filter(link => hasValidLink(link.url))

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/30 to-transparent dark:from-blue-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-slate-100/40 to-transparent dark:from-slate-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-bl from-emerald-50/20 to-transparent dark:from-emerald-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        </div>

        <div className="relative min-h-[400px] flex items-center">
          <div className="grid lg:grid-cols-3 gap-12 items-center w-full">
            {/* Profile Image */}
            <div className="lg:col-span-1">
              <AnimatedSection animation="fade-up">
                <div className="relative">
                  <div className="relative h-80 w-80 mx-auto overflow-hidden rounded-2xl shadow-2xl group">
                    <Image
                      src={staff.picture || "/placeholder.svg"}
                      alt={staff.name || "Staff Member"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                  
                  {/* Decorative elements around image */}
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100/30 dark:bg-blue-900/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-100/30 dark:bg-emerald-900/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
                </div>
              </AnimatedSection>
            </div>

            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
                <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                  <User className="h-3 w-3 mr-1" />
                  Staff Profile
                </Badge>
              </div>
              
              <AnimatedSection animation="fade-up">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-white dark:to-slate-100 bg-clip-text text-transparent leading-tight">
                  {staff.name || "Staff Member"}
                </h1>
                
                {staff.title && (
                  <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-light mt-4">
                    {staff.title}
                  </p>
                )}

                {/* Position Badges */}
                <div className="flex flex-wrap gap-3 mt-6">
                  {staff.academic_position && (
                    <Badge variant="outline" className="px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      {staff.academic_position}
                    </Badge>
                  )}
                  {staff.current_admin_position && (
                    <Badge variant="secondary" className="px-4 py-2 text-sm">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {staff.current_admin_position}
                    </Badge>
                  )}
                  {staff.ex_admin_position && (
                    <Badge variant="outline" className="px-4 py-2 text-sm border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      Former: {staff.ex_admin_position}
                    </Badge>
                  )}
                </div>
              </AnimatedSection>

              {/* Quick Contact */}
              <AnimatedSection animation="fade-up" delay={0.1}>
                <div className="flex flex-wrap gap-4 mt-8">
                  {staff.socialLinks?.email && (
                    <a
                      href={`mailto:${staff.socialLinks.email}`}
                      className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium">Contact</span>
                    </a>
                  )}
                  {staff.socialLinks?.phone && (
                    <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
                      <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{staff.socialLinks.phone}</span>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </Section>

      {/* Main Content */}
      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Biography */}
            {staff.bio && (
              <AnimatedSection animation="fade-up">
                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Biography
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {staff.bio}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Research Interests */}
            {staff.expertise && staff.expertise.length > 0 && (
              <AnimatedSection animation="fade-up" delay={0.1}>
                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Research Interests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {staff.expertise.map((interest: string, index: number) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Department Affiliations */}
            {staff.departments && staff.departments.length > 0 && (
              <AnimatedSection animation="fade-up" delay={0.2}>
                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Department Affiliations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {staff.departments.map((dept: any, index: number) => (
                        <div key={dept.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl">{dept.icon || "🏛️"}</div>
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{dept.name}</h4>
                              {dept.section_name && (
                                <p className="text-sm text-slate-600 dark:text-slate-400">{dept.section_name}</p>
                              )}
                            </div>
                          </div>
                          <Link href={`/departments/${dept.id}`}>
                            <Button size="sm" variant="outline">
                              View Department
                            </Button>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* Academic Stats */}
            {(staff.publications_count > 0 || staff.papers_count > 0 || staff.abstracts_count > 0 || 
              staff.courses_files_count > 0 || staff.inlinks_count > 0 || staff.external_links_count > 0) && (
              <AnimatedSection animation="fade-up" delay={0.3}>
                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Publication Statistics
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      Research output and academic contributions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {staff.publications_count > 0 && (
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{staff.publications_count}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Publications</div>
                        </div>
                      )}
                      {staff.papers_count > 0 && (
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{staff.papers_count}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Papers</div>
                        </div>
                      )}
                      {staff.abstracts_count > 0 && (
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{staff.abstracts_count}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Abstracts</div>
                        </div>
                      )}
                      {staff.courses_files_count > 0 && (
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{staff.courses_files_count}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Course Files</div>
                        </div>
                      )}
                      {staff.inlinks_count > 0 && (
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{staff.inlinks_count}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Inlinks</div>
                        </div>
                      )}
                      {staff.external_links_count > 0 && (
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{staff.external_links_count}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">External Links</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}

            {/* News/Updates */}
            {staff.news && (
              <AnimatedSection animation="fade-up" delay={0.4}>
                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Recent News & Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: staff.news }} />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar - Contact & Links */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Contact Information */}
              <AnimatedSection animation="fade-up">
                <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                  <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {staff.socialLinks?.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <a 
                          href={`mailto:${staff.socialLinks.email}`} 
                          className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {staff.socialLinks.email}
                        </a>
                      </div>
                    )}
                    
                    {staff.socialLinks?.alternativeEmail && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <a 
                          href={`mailto:${staff.socialLinks.alternativeEmail}`} 
                          className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {staff.socialLinks.alternativeEmail}
                        </a>
                      </div>
                    )}

                    {staff.socialLinks?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{staff.socialLinks.phone}</span>
                      </div>
                    )}

                    {staff.socialLinks?.mobile && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-emerald-500 dark:text-emerald-300" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{staff.socialLinks.mobile}</span>
                      </div>
                    )}

                    {staff.office_location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{staff.office_location}</span>
                      </div>
                    )}

                    {staff.office_hours && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{staff.office_hours}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>

              {/* Academic & Social Links */}
              {socialLinks.length > 0 && (
                <AnimatedSection animation="fade-up" delay={0.1}>
                  <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        Academic & Social Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {socialLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <link.icon className={`h-4 w-4 ${link.color}`} />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {link.name}
                            </span>
                          </div>
                          <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                        </a>
                      ))}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}

              {/* Additional Info */}
              {(staff.faculty || staff.department) && (
                <AnimatedSection animation="fade-up" delay={0.2}>
                  <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
                    <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                      <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                        Additional Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {staff.faculty && (
                        <div>
                          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Faculty</div>
                          <div className="text-sm text-slate-700 dark:text-slate-300">{staff.faculty}</div>
                        </div>
                      )}
                      {staff.department && (
                        <div>
                          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Department</div>
                          <div className="text-sm text-slate-700 dark:text-slate-300">{staff.department}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </Section>
    </PageContainer>
  )
}