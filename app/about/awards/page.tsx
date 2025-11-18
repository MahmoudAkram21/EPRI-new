'use client'

import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Award, Trophy, Star, Medal, Calendar, Search, RefreshCw, User } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { useState, useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AwardRecipient {
  id: string
  year: string
  awardName: string
  recipientName: string
  recipientTitle: string
  department: string
  image?: string
  hasPhoto: boolean
}

const awardRecipients: AwardRecipient[] = [
  {
    id: '1',
    year: '2024',
    awardName: 'Nile Award',
    recipientName: 'Prof. Dr. Ahmed Hassan Mohamed',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Petroleum Engineering Research Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: '2',
    year: '2023',
    awardName: 'State Appreciation Award',
    recipientName: 'Prof. Dr. Fatima Ali Ibrahim',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Chemical Analysis and Testing Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: '3',
    year: '2023',
    awardName: 'Scientific Excellence Award',
    recipientName: 'Prof. Dr. Mohamed Samir El-Din',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Geophysical Research Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: '4',
    year: '2022',
    awardName: 'Scientific Encouragement Award',
    recipientName: 'Prof. Dr. Noha Abdel Rahman',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Environmental Research Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: '5',
    year: '2022',
    awardName: 'Technological Innovation Award',
    recipientName: 'Prof. Dr. Karim Mohamed Fawzy',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Technology Development Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: '6',
    year: '2021',
    awardName: 'Nile Award',
    recipientName: 'Prof. Dr. Samia Hassan Ali',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Petroleum Geology Research Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: '7',
    year: '2021',
    awardName: 'State Encouragement Award',
    recipientName: 'Prof. Dr. Tarek Mohamed El-Sayed',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Production Engineering Division',
    hasPhoto: false
  },
  {
    id: '8',
    year: '2020',
    awardName: 'Scientific Excellence Award',
    recipientName: 'Prof. Dr. Laila Mohamed Abdel Aziz',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Laboratory Services Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: '9',
    year: '2020',
    awardName: 'Innovation in Research Award',
    recipientName: 'Prof. Dr. Hossam El-Din Mohamed',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Advanced Materials Research Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: '10',
    year: '2019',
    awardName: 'Nile Award',
    recipientName: 'Prof. Dr. Mona Fawzy Ibrahim',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Petroleum Chemistry Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  },
  {
    id: '11',
    year: '2019',
    awardName: 'Scientific Encouragement Award',
    recipientName: 'Prof. Dr. Yasser Ahmed Mohamed',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Reservoir Engineering Division',
    hasPhoto: false
  },
  {
    id: '12',
    year: '2018',
    awardName: 'State Appreciation Award',
    recipientName: 'Prof. Dr. Rania Mohamed Hassan',
    recipientTitle: 'Professor and Senior Researcher',
    department: 'Environmental Impact Assessment Division',
    hasPhoto: true,
    image: '/placeholder.svg?height=200&width=200'
  }
]

const awardTypes = Array.from(new Set(awardRecipients.map(a => a.awardName)))
const years = Array.from(new Set(awardRecipients.map(a => a.year))).sort((a, b) => b.localeCompare(a))

export default function AwardsPage() {
  const [searchName, setSearchName] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedAward, setSelectedAward] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredAwards = useMemo(() => {
    return awardRecipients.filter(award => {
      const matchesName = searchName === '' || 
        award.recipientName.toLowerCase().includes(searchName.toLowerCase())
      const matchesYear = selectedYear === 'all' || award.year === selectedYear
      const matchesAward = selectedAward === 'all' || award.awardName === selectedAward
      return matchesName && matchesYear && matchesAward
    })
  }, [searchName, selectedYear, selectedAward])

  const totalPages = Math.ceil(filteredAwards.length / itemsPerPage)
  const paginatedAwards = filteredAwards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleReset = () => {
    setSearchName('')
    setSelectedYear('all')
    setSelectedAward('all')
    setCurrentPage(1)
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
        
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/90 via-orange-600/80 to-red-600/90"></div>
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Recognition & Achievements
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent leading-tight">
              Awards
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Awards received by the Egyptian Petroleum Research Institute
            </p>
          </div>
        </div>
      </Section>

      {/* Search and Filter Section */}
      <Section>
        <AnimatedSection animation="fade-up">
          <Card className="border border-white/20 mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Name"
                    value={searchName}
                    onChange={(e) => {
                      setSearchName(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="pl-10"
                  />
                </div>
                <Input
                  type="text"
                  placeholder="Year"
                  value={selectedYear === 'all' ? '' : selectedYear}
                  onChange={(e) => {
                    const year = e.target.value
                    setSelectedYear(year || 'all')
                    setCurrentPage(1)
                  }}
                />
                <Select value={selectedAward} onValueChange={(value) => {
                  setSelectedAward(value)
                  setCurrentPage(1)
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Award" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Awards</SelectItem>
                    {awardTypes.map((award) => (
                      <SelectItem key={award} value={award}>
                        {award}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleReset} variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Section>

      {/* Awards Grid */}
      <Section>
        {paginatedAwards.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedAwards.map((award, index) => (
              <AnimatedSection key={award.id} animation="fade-up" delay={index * 0.05}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border border-white/20 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Award Year Badge */}
                    <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-4 text-center border-b border-border/30">
                      <Badge variant="outline" className="text-sm font-semibold">
                        {award.year}
                      </Badge>
                    </div>

                    {/* Recipient Photo or Medal Icon */}
                    <div className="flex justify-center items-center p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                      {award.hasPhoto ? (
                        <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-lg">
                          <AvatarImage src={award.image} alt={award.recipientName} />
                          <AvatarFallback className="text-lg bg-primary/10 text-primary">
                            {award.recipientName.split(' ').slice(-2).map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                          <Medal className="h-12 w-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Award Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {award.awardName}
                        </Badge>
                        <h3 className="font-serif text-lg font-bold mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {award.recipientName}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {award.recipientTitle}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {award.department}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <Card className="border border-white/20">
            <CardContent className="p-12 text-center">
              <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg">No awards found matching your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </Section>

      {/* Pagination */}
      {totalPages > 1 && (
        <Section>
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 10) {
                  pageNum = i + 1
                } else if (currentPage <= 5) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 4) {
                  pageNum = totalPages - 9 + i
                } else {
                  pageNum = currentPage - 4 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </Section>
      )}

      {/* Statistics */}
      <Section className="bg-gradient-to-br from-slate-50 to-yellow-50 dark:from-slate-900 dark:to-yellow-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-yellow-900 to-orange-900 dark:from-slate-100 dark:via-yellow-100 dark:to-orange-100 bg-clip-text text-transparent">
              Recognition Summary
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Awards", value: awardRecipients.length.toString(), icon: Trophy },
            { label: "Award Types", value: awardTypes.length.toString(), icon: Award },
            { label: "Years Covered", value: `${years[years.length - 1]} - ${years[0]}`, icon: Calendar },
            { label: "Recipients", value: awardRecipients.length.toString(), icon: User }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <AnimatedSection key={stat.label} animation="fade-up" delay={index * 0.1}>
                <Card className="text-center h-full hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <p className="text-lg font-serif text-muted-foreground">
                      {stat.label}
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
