'use client'

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AnimatedSection } from "@/components/animated-section"
import { useState } from "react"
import { Users, User, Briefcase, Award, Mail, Calendar } from "lucide-react"

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
                        <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-md flex-shrink-0">
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
                                <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
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

  return (
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
    </PageContainer>
  )
}
