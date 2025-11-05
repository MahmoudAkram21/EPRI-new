import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, FileText, Lightbulb, Award, Users, Calendar, TrendingUp, Search } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function PatentPage() {
  const patents = [
    {
      id: "P001",
      title: "Enhanced Oil Recovery Method Using Novel Polymer Injection System",
      inventors: ["Dr. Ahmed Hassan", "Dr. Fatima Al-Zahra", "Dr. Mohamed Rashid"],
      patentNumber: "EG2023001234",
      applicationDate: "2023-03-15",
      grantDate: "2024-01-20",
      status: "Granted",
      category: "Petroleum Engineering",
      description: "A novel method for enhanced oil recovery using a specialized polymer injection system that increases recovery rates by up to 25% while reducing environmental impact.",
      technicalField: "Enhanced Oil Recovery",
      assignee: "Egyptian Petroleum Research Institute"
    },
    {
      id: "P002",
      title: "Advanced Seismic Data Processing Algorithm for Hydrocarbon Detection",
      inventors: ["Dr. Layla Omar", "Dr. Khaled Mahmoud"],
      patentNumber: "EG2023005678",
      applicationDate: "2023-06-10",
      grantDate: "2024-03-15",
      status: "Granted",
      category: "Geophysics",
      description: "An innovative algorithm for processing seismic data that improves hydrocarbon detection accuracy by 40% through advanced machine learning techniques.",
      technicalField: "Seismic Analysis",
      assignee: "Egyptian Petroleum Research Institute"
    },
    {
      id: "P003",
      title: "Eco-Friendly Drilling Fluid Composition for Deep Well Operations",
      inventors: ["Dr. Sara Ibrahim", "Dr. Hassan Ali", "Dr. Nadia Farouk"],
      patentNumber: "EG2024002468",
      applicationDate: "2024-01-25",
      grantDate: "Pending",
      status: "Under Review",
      category: "Environmental Technology",
      description: "A biodegradable drilling fluid composition that maintains excellent performance characteristics while minimizing environmental impact in deep well drilling operations.",
      technicalField: "Drilling Technology",
      assignee: "Egyptian Petroleum Research Institute"
    },
    {
      id: "P004",
      title: "Real-Time Reservoir Monitoring System Using IoT Sensors",
      inventors: ["Dr. Omar Farid", "Dr. Amina Yassin"],
      patentNumber: "EG2024003691",
      applicationDate: "2024-04-12",
      grantDate: "Pending",
      status: "Application Filed",
      category: "Digital Technology",
      description: "An integrated IoT-based system for real-time monitoring of reservoir parameters, enabling predictive maintenance and optimization of production operations.",
      technicalField: "Digital Oilfield",
      assignee: "Egyptian Petroleum Research Institute"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Granted":
        return "bg-green-500";
      case "Under Review":
        return "bg-yellow-500";
      case "Application Filed":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('/modern-university-library-students-studying.jpg')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.4) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-red-600/80 to-pink-600/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/40 via-transparent to-orange-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-orange-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-red-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-pink-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Innovation Portfolio
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-orange-200 bg-clip-text text-transparent leading-tight">
              Patent Portfolio
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Discover our innovative solutions and breakthrough technologies that are shaping the future of petroleum research and engineering through our comprehensive patent portfolio.
            </p>
          </div>
        </div>
      </Section>

      {/* Search and Filter */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patents by title, inventor, or technology..."
                className="pl-10 py-3"
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-blue-600">15</CardTitle>
                <CardDescription>Total Patents</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-600">8</CardTitle>
                <CardDescription>Granted Patents</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-orange-600">7</CardTitle>
                <CardDescription>Pending Applications</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.4}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-purple-600">25</CardTitle>
                <CardDescription>Inventors</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* Patent Listings */}
      <Section className="bg-gradient-to-br from-slate-50 to-orange-50 dark:from-slate-900 dark:to-orange-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 dark:from-slate-100 dark:via-orange-100 dark:to-red-100 bg-clip-text text-transparent">
              Recent Patents
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our latest innovations and technological breakthroughs in petroleum research
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-6">
          {patents.map((patent, index) => (
            <AnimatedSection key={patent.id} animation="fade-up" delay={index * 0.1}>
              <Card className="hover:shadow-lg transition-all duration-300 border border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {patent.category}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(patent.status)}`}></div>
                        <span className="text-sm text-muted-foreground">{patent.status}</span>
                      </div>
                      <CardTitle className="text-xl font-serif mb-2 hover:text-primary transition-colors cursor-pointer">
                        {patent.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {patent.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Patent Number</h4>
                        <p className="font-mono text-sm">{patent.patentNumber}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Technical Field</h4>
                        <p className="text-sm">{patent.technicalField}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Assignee</h4>
                        <p className="text-sm">{patent.assignee}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Inventors</h4>
                        <div className="flex flex-wrap gap-1">
                          {patent.inventors.map((inventor, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {inventor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Application Date</h4>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <p className="text-sm">{new Date(patent.applicationDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {patent.grantDate !== "Pending" && (
                          <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Grant Date</h4>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <p className="text-sm">{new Date(patent.grantDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Patent Categories */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-orange-900 to-red-900 dark:from-slate-100 dark:via-orange-100 dark:to-red-100 bg-clip-text text-transparent">
              Innovation Areas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our patent portfolio spans multiple technological domains
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              category: "Petroleum Engineering",
              count: 6,
              icon: <Lightbulb className="h-6 w-6" />,
              color: "from-blue-500 to-blue-600"
            },
            {
              category: "Geophysics",
              count: 4,
              icon: <Award className="h-6 w-6" />,
              color: "from-green-500 to-green-600"
            },
            {
              category: "Environmental Technology",
              count: 3,
              icon: <FileText className="h-6 w-6" />,
              color: "from-purple-500 to-purple-600"
            },
            {
              category: "Digital Technology",
              count: 2,
              icon: <TrendingUp className="h-6 w-6" />,
              color: "from-orange-500 to-orange-600"
            }
          ].map((category, index) => (
            <AnimatedSection key={category.category} animation="fade-up" delay={index * 0.1}>
              <Card className="text-center hover:shadow-lg transition-all duration-300 group h-full">
                <CardHeader>
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <div className="text-white">
                      {category.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-serif">{category.category}</CardTitle>
                  <CardDescription>{category.count} Patents</CardDescription>
                </CardHeader>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Call to Action */}
      <Section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <AnimatedSection animation="fade-up">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-orange-600 to-red-600 bg-clip-text text-transparent">
              Innovation Through Research
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Our patent portfolio represents decades of breakthrough research. Collaborate with us to bring cutting-edge innovations to the petroleum industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-3">
                <a href="/contact">
                  Licensing Inquiries
                </a>
              </Button>
              <Button variant="outline" asChild size="lg" className="px-8 py-3">
                <a href="/projects">
                  Research Projects
                </a>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageContainer>
  )
}