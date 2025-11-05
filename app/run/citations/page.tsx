import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, BookOpen, Users, TrendingUp, Calendar, Quote, Search, Filter } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CitationsPage() {
  const citations = [
    {
      id: "C001",
      title: "Advanced Machine Learning Techniques for Seismic Data Interpretation in Petroleum Exploration",
      authors: ["Dr. Ahmed Hassan", "Dr. Layla Omar", "Dr. Mohamed Rashid"],
      journal: "Journal of Petroleum Science and Engineering",
      year: 2024,
      volume: "235",
      pages: "112-128",
      doi: "10.1016/j.petrol.2024.112456",
      citations: 45,
      impact: "Q1",
      category: "Artificial Intelligence",
      abstract: "This study presents novel machine learning algorithms for improving accuracy in seismic data interpretation, resulting in better hydrocarbon detection rates and reduced exploration costs.",
      keywords: ["Machine Learning", "Seismic Analysis", "Petroleum Exploration", "Deep Learning"]
    },
    {
      id: "C002",
      title: "Enhanced Oil Recovery Using Biodegradable Polymer Systems: Environmental and Economic Benefits",
      authors: ["Dr. Fatima Al-Zahra", "Dr. Sara Ibrahim", "Dr. Hassan Ali"],
      journal: "Energy & Fuels",
      year: 2024,
      volume: "38",
      pages: "8542-8559",
      doi: "10.1021/acs.energyfuels.4c01234",
      citations: 67,
      impact: "Q1",
      category: "Enhanced Oil Recovery",
      abstract: "Investigation of novel biodegradable polymer systems for enhanced oil recovery, demonstrating improved recovery rates while minimizing environmental impact.",
      keywords: ["Enhanced Oil Recovery", "Biodegradable Polymers", "Environmental Impact", "Sustainability"]
    },
    {
      id: "C003",
      title: "Real-Time Reservoir Monitoring and Optimization Using IoT-Based Sensor Networks",
      authors: ["Dr. Omar Farid", "Dr. Amina Yassin", "Dr. Khaled Mahmoud"],
      journal: "SPE Journal",
      year: 2023,
      volume: "28",
      pages: "3456-3472",
      doi: "10.2118/214567-PA",
      citations: 89,
      impact: "Q1",
      category: "Digital Oilfield",
      abstract: "Development of an integrated IoT sensor network for real-time reservoir monitoring, enabling predictive maintenance and production optimization.",
      keywords: ["IoT", "Reservoir Monitoring", "Digital Oilfield", "Predictive Maintenance"]
    },
    {
      id: "C004",
      title: "Sustainable Drilling Fluid Formulations for Deep Water Operations",
      authors: ["Dr. Nadia Farouk", "Dr. Hassan Ali", "Dr. Sara Ibrahim"],
      journal: "Journal of Natural Gas Science and Engineering",
      year: 2023,
      volume: "118",
      pages: "104890",
      doi: "10.1016/j.jngse.2023.104890",
      citations: 34,
      impact: "Q2",
      category: "Drilling Technology",
      abstract: "Novel environmentally-friendly drilling fluid compositions that maintain superior performance characteristics while reducing ecological footprint.",
      keywords: ["Drilling Fluids", "Sustainability", "Deep Water", "Environmental Protection"]
    },
    {
      id: "C005",
      title: "Geochemical Characterization of Unconventional Reservoirs in the Western Desert of Egypt",
      authors: ["Dr. Layla Omar", "Dr. Ahmed Hassan", "Dr. Mohamed Rashid"],
      journal: "AAPG Bulletin",
      year: 2023,
      volume: "107",
      pages: "1823-1845",
      doi: "10.1306/08162322078",
      citations: 56,
      impact: "Q1",
      category: "Geochemistry",
      abstract: "Comprehensive geochemical analysis of unconventional reservoir rocks in Egypt's Western Desert, providing insights for exploration strategies.",
      keywords: ["Geochemistry", "Unconventional Reservoirs", "Western Desert", "Reservoir Characterization"]
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Q1":
        return "bg-green-500 text-white";
      case "Q2":
        return "bg-blue-500 text-white";
      case "Q3":
        return "bg-yellow-500 text-white";
      case "Q4":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-400 text-white";
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
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 via-purple-600/80 to-blue-600/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/40 via-transparent to-indigo-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-cyan-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-indigo-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-purple-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Research Publications
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-indigo-200 bg-clip-text text-transparent leading-tight">
              Research Citations
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Explore our extensive collection of peer-reviewed research publications that contribute to the advancement of petroleum science and engineering worldwide.
            </p>
          </div>
        </div>
      </Section>

      {/* Search and Filter */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search publications by title, author, or keywords..."
                  className="pl-10 py-3"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter by Category
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Filter by Year
              </Button>
            </div>
          </div>
        </AnimatedSection>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-blue-600">127</CardTitle>
                <CardDescription>Total Publications</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Quote className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-600">2,847</CardTitle>
                <CardDescription>Total Citations</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-purple-600">8.7</CardTitle>
                <CardDescription>H-Index</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.4}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-orange-600">45</CardTitle>
                <CardDescription>Contributing Authors</CardDescription>
              </CardHeader>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* Recent Publications */}
      <Section className="bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-slate-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
              Recent Publications
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our latest contributions to petroleum science and engineering literature
            </p>
          </div>
        </AnimatedSection>

        <div className="space-y-6">
          {citations.map((citation, index) => (
            <AnimatedSection key={citation.id} animation="fade-up" delay={index * 0.1}>
              <Card className="hover:shadow-lg transition-all duration-300 border border-border/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {citation.category}
                        </Badge>
                        <Badge className={`text-xs ${getImpactColor(citation.impact)}`}>
                          {citation.impact}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Quote className="h-3 w-3" />
                          <span>{citation.citations} citations</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-serif mb-2 hover:text-primary transition-colors cursor-pointer">
                        {citation.title}
                      </CardTitle>
                      <CardDescription className="text-base leading-relaxed mb-4">
                        {citation.abstract}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Paper
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Authors</h4>
                        <div className="flex flex-wrap gap-1">
                          {citation.authors.map((author, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {author}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Journal</h4>
                        <p className="text-sm font-medium">{citation.journal}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">DOI</h4>
                        <p className="text-sm font-mono text-blue-600 hover:underline cursor-pointer">
                          {citation.doi}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Year</h4>
                          <p className="text-sm">{citation.year}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Volume</h4>
                          <p className="text-sm">{citation.volume}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-muted-foreground mb-1">Pages</h4>
                          <p className="text-sm">{citation.pages}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">Keywords</h4>
                        <div className="flex flex-wrap gap-1">
                          {citation.keywords.map((keyword, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* Research Impact */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-slate-100 dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
              Research Impact
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our research contributes to multiple domains of petroleum science
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              category: "Artificial Intelligence",
              count: 23,
              citations: 756,
              color: "from-blue-500 to-blue-600"
            },
            {
              category: "Enhanced Oil Recovery",
              count: 31,
              citations: 892,
              color: "from-green-500 to-green-600"
            },
            {
              category: "Digital Oilfield",
              count: 18,
              citations: 567,
              color: "from-purple-500 to-purple-600"
            },
            {
              category: "Environmental Technology",
              count: 25,
              citations: 632,
              color: "from-orange-500 to-orange-600"
            }
          ].map((category, index) => (
            <AnimatedSection key={category.category} animation="fade-up" delay={index * 0.1}>
              <Card className="text-center hover:shadow-lg transition-all duration-300 group h-full">
                <CardHeader>
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-serif">{category.category}</CardTitle>
                  <CardDescription>{category.count} Publications</CardDescription>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <Quote className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{category.citations} citations</span>
                  </div>
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Collaborate with Our Researchers
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join our research community and contribute to advancing petroleum science through collaborative publications and joint research projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-3">
                <a href="/contact">
                  Research Collaboration
                </a>
              </Button>
              <Button variant="outline" asChild size="lg" className="px-8 py-3">
                <a href="/projects">
                  Current Projects
                </a>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageContainer>
  )
}