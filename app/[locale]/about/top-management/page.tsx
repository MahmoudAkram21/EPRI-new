'use client'

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AnimatedSection } from "@/components/animated-section"
import { useState, useEffect } from "react"
import { Users, User, Briefcase, Award, Mail, Calendar, Building2, Microscope, Settings } from "lucide-react"
import { useLocale } from "next-intl"
import { getTranslation } from "@/lib/utils"

const leadershipRoles = [
  { id: 'director', label: 'Director', active: true },
  { id: 'head-admin', label: 'Head of central Administration', active: false },
  { id: 'former-director', label: 'Former Director', active: false },
  { id: 'former-deputy', label: 'Former Director Deputy', active: false },
  { id: 'former-secretary', label: 'Former General Secretary', active: false },
]

// Former Directors List
const formerDirectors = [
  {
    name: "Prof. Dr. Ismail Kamal ElDin Abdou",
    image: "/placeholder.svg?height=200&width=200",
    tenure: [
      "From March 1974 to March 1976.",
      "From December 1979 to December 1983"
    ]
  },
  {
    name: "Prof. Dr. Bahram Hamed Mahmoud",
    image: "/placeholder.svg?height=200&width=200",
    tenure: [
      "From March 1976 to June 1977.",
      "From December 1987 to May 1993"
    ]
  },
  {
    name: "Prof. Dr. Fathi Mosaad Abead",
    image: "/placeholder.svg?height=200&width=200",
    tenure: [
      "From June 1977 to December 1979.",
      "From January 1984 to December 1986"
    ]
  },
  {
    name: "Prof. Dr. Mohamed Ibrahim Roshdy",
    image: "/placeholder.svg?height=200&width=200",
    tenure: [
      "From January 1987 to December 1987"
    ]
  }
]

// Former Director Deputies List
const formerDirectorDeputies = [
  {
    name: "Prof. Dr. [Name]",
    image: "/placeholder.svg?height=200&width=200",
    tenure: [
      "From [Date] to [Date]"
    ]
  }
  // Add more former deputies as needed
]

// Former General Secretaries List
const formerGeneralSecretaries = [
  {
    name: "Prof. Dr. [Name]",
    image: "/placeholder.svg?height=200&width=200",
    tenure: [
      "From [Date] to [Date]"
    ]
  }
  // Add more former secretaries as needed
]

const leadershipData: Record<string, {
  name: string
  title: string
  image: string
  message: string
  profile: string
}> = {
  director: {
    name: "Professor Mahmoud Ramzi Mahmoud",
    title: "Director 'Acting Head'",
    image: "/placeholder.svg?height=300&width=300",
    message: `Over more than four decades, Egyptian Petroleum Research Institute (EPRI) recorded its scientific success story. A story that is not a coincidence, but is the fruit and integrated system product, emerging from our commitment to the values of cooperation, innovation, teamwork and freedom of creativity, becoming one of the biggest scientific governmental edifices, in Egypt and the Middle East. 

Consequently, EPRI wins domestically and internationally recognition, as a House of Expertise, by directing scientific research for community service and industrial development. EPRI develops the scientific, intellectual and practical capacities of researchers - to create innovative and non-traditional scientific solutions for National problems, in all fields, through continuous engagement in advanced scientific research with the academic sectors, the industrial and international research institutions. 

Moreover, EPRI provides scientific consultancy and analytical and technical services backed by the highest standards of analytical quality, through the latest scientific equipment. EPRI also provides a variety of specialized scientific training, in various subjects, related to Petroleum industries and environment - to ensure sustainable development and competitiveness capacity for the Petroleum and energy industries. 

Here, I cordially express my sincere thanks, appreciation and gratitude to my colleagues, my professors and all EPRI staff, for enriching scientific research and innovation system, by continuing this remarkable success.`,
    profile: `Professor Mahmoud Ramzi Mahmoud serves as the Director (Acting Head) of the Egyptian Petroleum Research Institute. With extensive experience in petroleum research and academic leadership, Professor Mahmoud has been instrumental in advancing EPRI's mission of scientific excellence and innovation.

Under his leadership, EPRI has strengthened its position as a leading research institution in the Middle East, fostering collaboration between academia, industry, and government sectors. His commitment to research excellence and sustainable development has contributed significantly to Egypt's petroleum industry.`
  },
  'head-admin': {
    name: "Head of Central Administration",
    title: "Head of Central Administration",
    image: "/placeholder.svg?height=300&width=300",
    message: `The Central Administration plays a crucial role in supporting EPRI's research and operational activities. Our commitment is to ensure efficient administrative processes that enable our researchers and staff to focus on their core mission of advancing petroleum science and technology.

We work diligently to maintain the highest standards of administrative excellence, providing comprehensive support services across all departments. Our team is dedicated to creating an environment that fosters innovation, collaboration, and scientific achievement.

Through effective management of resources, facilities, and administrative functions, we contribute to EPRI's position as a leading research institution in the region.`,
    profile: `The Head of Central Administration oversees all administrative functions at EPRI, ensuring smooth operations across the institute. This role involves managing human resources, facilities, financial administration, and supporting the research activities of the institute.

The Central Administration team works closely with all departments to provide essential support services, maintain infrastructure, and ensure compliance with institutional policies and regulations.`
  }
}

// Helper function to render list view
const renderListView = (title: string, description: string, items: Array<{ name: string; image: string; tenure: string[] }>) => {
  return (
    <AnimatedSection animation="fade-up" delay={0.1}>
      <Card className="border border-white/20 overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
          <CardTitle className="text-2xl font-serif">{title}</CardTitle>
          <p className="text-muted-foreground mt-2">
            {description}
          </p>
        </CardHeader>
        <CardContent className="p-8">
          {items.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((item, index) => (
                <AnimatedSection key={item.name} animation="fade-up" delay={index * 0.1}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group border border-white/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-md shrink-0">
                          <AvatarImage src={item.image} alt={item.name} />
                          <AvatarFallback className="text-lg bg-primary/10 text-primary">
                            {item.name.split(' ').slice(-2).map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-serif text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                          <div className="space-y-1">
                            {item.tenure.map((period, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                <span>{period}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Information will be available soon.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}

export default function TopManagementPage() {
  const [selectedRole, setSelectedRole] = useState('director')
  const currentLeader = leadershipData[selectedRole] || leadershipData.director

  // Render Former Directors List
  const renderFormerDirectorsList = () => {
    return renderListView(
      "Former Directors",
      "A historical overview of EPRI's former directors and their periods of service",
      formerDirectors
    )
  }

  // Render Former Director Deputies List
  const renderFormerDeputiesList = () => {
    return renderListView(
      "Former Director Deputies",
      "A historical overview of EPRI's former director deputies and their periods of service",
      formerDirectorDeputies
    )
  }

  // Render Former General Secretaries List
  const renderFormerSecretariesList = () => {
    return renderListView(
      "Former General Secretaries",
      "A historical overview of EPRI's former general secretaries and their periods of service",
      formerGeneralSecretaries
    )
  }

  // Render Single Profile View
  const renderSingleProfile = () => {
    return (
      <AnimatedSection animation="fade-up" delay={0.1} key={selectedRole}>
        <Card className="border border-white/20 overflow-hidden">
          <CardContent className="p-0">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={currentLeader.image} alt={currentLeader.name} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {currentLeader.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-serif text-3xl font-bold mb-2 text-foreground">
                    {currentLeader.name}
                  </h2>
                  <Badge variant="destructive" className="text-base px-3 py-1">
                    {currentLeader.title}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="p-8">
              <Tabs defaultValue="message" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="message" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Message
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="message" className="space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-4 text-foreground">
                      {selectedRole === 'director' ? "Director's Message" : `${currentLeader.title}'s Message`}
                    </h3>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {currentLeader.message}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="profile" className="space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold mb-4 text-foreground">
                      Professional Profile
                    </h3>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="text-muted-foreground leading-relaxed">
                        {currentLeader.profile}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>
    )
  }

  // Determine which view to render
  const renderContent = () => {
    switch (selectedRole) {
      case 'former-director':
        return renderFormerDirectorsList()
      case 'former-deputy':
        return renderFormerDeputiesList()
      case 'former-secretary':
        return renderFormerSecretariesList()
      default:
        return renderSingleProfile()
    }
  }

  return (<>
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1600&h=900&fit=crop')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.3) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-blue-800/95"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Leadership
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent leading-tight">
              Top Management
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Meet the leadership team guiding EPRI towards excellence in petroleum research and innovation
            </p>
          </div>
        </div>
      </Section>

      {/* Main Content with Sidebar */}
      <Section>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Leadership Navigation */}
          <div className="lg:col-span-1">
            <AnimatedSection animation="fade-up">
              <Card className="sticky top-24 border border-white/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold mb-4">EPRI LEADERSHIP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {leadershipRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                        selectedRole === role.id
                          ? 'bg-primary text-primary-foreground font-semibold shadow-md'
                          : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </Section>

 
      {/* Additional Leadership Info */}
      <Section className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
              Leadership Excellence
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our leadership team brings together decades of experience in petroleum research, education, and administration
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "Research Excellence",
              description: "Leading cutting-edge research in petroleum science and technology",
              icon: Award,
              color: "from-blue-500 to-blue-600"
            },
            {
              title: "Strategic Vision",
              description: "Guiding EPRI's mission and long-term strategic direction",
              icon: Briefcase,
              color: "from-purple-500 to-purple-600"
            },
            {
              title: "Team Leadership",
              description: "Fostering collaboration and excellence across all departments",
              icon: Users,
              color: "from-green-500 to-green-600"
            }
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <AnimatedSection key={item.title} animation="fade-up" delay={index * 0.1}>
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-serif">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      </Section>

      {/* Organizational Chart Section */}
      <Section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950">
        <AnimatedSection animation="fade-up">
          <div className="w-full">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Organization Structure
              </Badge>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
                Organizational Chart
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
                Explore EPRI's complete organizational structure and leadership hierarchy
              </p>
            </div>
            
            {/* Canva Embed - Full Width */}
            <div className="w-full px-4 md:px-8">
              <Card className="border-2 border-primary/20 shadow-2xl overflow-hidden bg-white dark:bg-slate-800">
                <CardContent className="p-6 md:p-8">
                  <div 
                    className="w-full"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: 0,
                      paddingTop: '75%',
                      paddingBottom: 0,
                      boxShadow: '0 4px 16px 0 rgba(63,69,81,0.2)',
                      overflow: 'hidden',
                      borderRadius: '12px',
                      willChange: 'transform',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    <iframe
                      loading="lazy"
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        top: 0,
                        left: 0,
                        border: 'none',
                        padding: 0,
                        margin: 0
                      }}
                      src="https://www.canva.com/design/DAGpZSG37Pc/7lULLOY5FJwil0wbnxbLAw/view?embed"
                      allowFullScreen
                      allow="fullscreen"
                      title="EPRI Organizational Chart"
                    />
                  </div>
                  
                  {/* Link to view on Canva */}
                  <div className="mt-6 pt-6 text-center border-t border-slate-200 dark:border-slate-700">
                    <a
                      href="https://www.canva.com/design/DAGpZSG37Pc/7lULLOY5FJwil0wbnxbLAw/view?utm_content=DAGpZSG37Pc&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-2 font-medium"
                    >
                      <span>View full chart on Canva</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <p className="text-sm text-muted-foreground mt-3">
                      Organizational Chart by Mahmoud Akram
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </AnimatedSection>
      </Section>

      {/* Heads of Units, Centers, and Departments Section */}
      <Section>
        <HeadsOfUnitsCentersDepartments />
      </Section>
    </PageContainer>
    </>)
}

// Component for displaying heads of units, centers, and departments
function HeadsOfUnitsCentersDepartments() {
  const locale = useLocale()
  const [departments, setDepartments] = useState<any[]>([])
  const [centerHeads, setCenterHeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'departments' | 'centers'>('departments')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments with managers
        const deptResponse = await fetch('/api/departments')
        if (deptResponse.ok) {
          const deptData = await deptResponse.json()
          const depts = deptData.departments || []
          
          // Fetch manager info for each department
          const deptsWithManagers = await Promise.all(
            depts.map(async (dept: any) => {
              if (dept.manager_id) {
                try {
                  const managerResponse = await fetch(`/api/staff/${dept.manager_id}`)
                  if (managerResponse.ok) {
                    const manager = await managerResponse.json()
                    return { ...dept, manager }
                  }
                } catch (err) {
                  console.error('Error fetching manager:', err)
                }
              }
              return { ...dept, manager: null }
            })
          )
          setDepartments(deptsWithManagers.filter((d: any) => d.manager))
        }

        // Fetch service center heads
        const centersResponse = await fetch('/api/service-center-heads')
        if (centersResponse.ok) {
          const centersData = await centersResponse.json()
          setCenterHeads(centersData.centerHeads || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <AnimatedSection animation="fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            Organizational Leadership
          </Badge>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
            Heads of Units, Centers & Departments
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            Meet the leaders who guide our departments, centers, and units
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'departments' | 'centers')} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Departments
            </TabsTrigger>
            <TabsTrigger value="centers" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Service Centers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="mt-8">
            {departments.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, index) => {
                  const deptName = getTranslation(dept.name, locale)
                  const managerName = dept.manager ? getTranslation(dept.manager.name, locale) : ''
                  const managerTitle = dept.manager?.current_admin_position 
                    ? getTranslation(dept.manager.current_admin_position, locale)
                    : getTranslation(dept.manager?.title, locale) || ''
                  const managerPicture = dept.manager?.picture || '/placeholder.svg?height=200&width=200'

                  return (
                    <AnimatedSection key={dept.id} animation="fade-up" delay={index * 0.1}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 group border border-white/20">
                        <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
                          <CardTitle className="text-lg font-serif text-center">
                            {deptName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-md mb-4">
                              <AvatarImage src={managerPicture} alt={managerName} />
                              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                {managerName.split(' ').slice(-2).map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-serif text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                              {managerName}
                            </h3>
                            {managerTitle && (
                              <Badge variant="secondary" className="mb-3">
                                {managerTitle}
                              </Badge>
                            )}
                            {dept.manager?.email && (
                              <a
                                href={`mailto:${dept.manager.email}`}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-2"
                              >
                                <Mail className="h-3 w-3" />
                                {dept.manager.email}
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No department heads available at this time.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="centers" className="mt-8">
            {centerHeads.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {centerHeads.map((head, index) => {
                  const headName = getTranslation(head.name, locale)
                  const headTitle = getTranslation(head.title, locale)
                  const headPicture = head.picture || '/placeholder.svg?height=200&width=200'

                  return (
                    <AnimatedSection key={head.id} animation="fade-up" delay={index * 0.1}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 group border border-white/20">
                        <CardHeader className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700">
                          <CardTitle className="text-lg font-serif text-center">
                            {headTitle}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-md mb-4">
                              <AvatarImage src={headPicture} alt={headName} />
                              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                {headName.split(' ').slice(-2).map((n: string) => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-serif text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                              {headName}
                            </h3>
                            {head.email && (
                              <a
                                href={`mailto:${head.email}`}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-2"
                              >
                                <Mail className="h-3 w-3" />
                                {head.email}
                              </a>
                            )}
                            {head.phone && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {head.phone}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </AnimatedSection>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No service center heads available at this time.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedSection>
  )
}
