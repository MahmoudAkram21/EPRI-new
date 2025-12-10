"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, FileText, Calendar, Search, Filter, BookOpen, Users, TrendingUp, SortAsc, SortDesc, X, Grid, List } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"

interface MagazineIssue {
  id: string
  title: string
  issueNumber: string
  volume: string
  year: number
  month: string
  description: string
  coverImage: string
  pdfUrl: string
  fileSize: string
  pages: number
  category: "Research" | "Technology" | "Industry" | "Education"
  featured: boolean
  downloadCount: number
}

export default function ElectronicalMagazinePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [showFilters, setShowFilters] = useState(false)

  const magazineIssues: MagazineIssue[] = [
    {
      id: "mag001",
      title: "Advances in Enhanced Oil Recovery Techniques",
      issueNumber: "Issue 12",
      volume: "Vol. 8",
      year: 2024,
      month: "November",
      description: "This issue explores cutting-edge enhanced oil recovery methods, including polymer flooding, CO2 injection, and thermal recovery techniques. Featured articles from leading researchers worldwide.",
      coverImage: "/magazine-covers/eor-techniques.jpg",
      pdfUrl: "/magazines/epri-magazine-2024-nov.pdf",
      fileSize: "15.2 MB",
      pages: 64,
      category: "Research",
      featured: true,
      downloadCount: 1247
    },
    {
      id: "mag002",
      title: "Digital Transformation in the Oil Industry",
      issueNumber: "Issue 11",
      volume: "Vol. 8",
      year: 2024,
      month: "October",
      description: "Comprehensive coverage of digital technologies revolutionizing petroleum operations, including IoT sensors, AI-driven analytics, and blockchain applications in supply chain management.",
      coverImage: "/magazine-covers/digital-transformation.jpg",
      pdfUrl: "/magazines/epri-magazine-2024-oct.pdf",
      fileSize: "18.7 MB",
      pages: 72,
      category: "Technology",
      featured: true,
      downloadCount: 982
    },
    {
      id: "mag003",
      title: "Sustainable Petroleum Practices and Environmental Protection",
      issueNumber: "Issue 10",
      volume: "Vol. 8",
      year: 2024,
      month: "September",
      description: "Focus on environmental sustainability in petroleum operations, featuring renewable energy integration, carbon capture technologies, and eco-friendly drilling practices.",
      coverImage: "/magazine-covers/sustainability.jpg",
      pdfUrl: "/magazines/epri-magazine-2024-sep.pdf",
      fileSize: "12.8 MB",
      pages: 56,
      category: "Industry",
      featured: false,
      downloadCount: 756
    },
    {
      id: "mag004",
      title: "Geophysical Innovations in Petroleum Exploration",
      issueNumber: "Issue 9",
      volume: "Vol. 8",
      year: 2024,
      month: "August",
      description: "Latest developments in seismic interpretation, well logging technologies, and subsurface imaging techniques for improved hydrocarbon detection and characterization.",
      coverImage: "/magazine-covers/geophysical-innovations.jpg",
      pdfUrl: "/magazines/epri-magazine-2024-aug.pdf",
      fileSize: "16.4 MB",
      pages: 68,
      category: "Research",
      featured: false,
      downloadCount: 634
    },
    {
      id: "mag005",
      title: "Petroleum Engineering Education: Modern Curricula",
      issueNumber: "Issue 8",
      volume: "Vol. 8",
      year: 2024,
      month: "July",
      description: "Evolution of petroleum engineering education programs, incorporating new technologies, interdisciplinary approaches, and industry-academia partnerships.",
      coverImage: "/magazine-covers/education.jpg",
      pdfUrl: "/magazines/epri-magazine-2024-jul.pdf",
      fileSize: "11.5 MB",
      pages: 48,
      category: "Education",
      featured: false,
      downloadCount: 523
    },
    {
      id: "mag006",
      title: "Reservoir Engineering: Advanced Modeling Techniques",
      issueNumber: "Issue 7",
      volume: "Vol. 8",
      year: 2024,
      month: "June",
      description: "In-depth analysis of reservoir simulation technologies, machine learning applications in reservoir modeling, and integrated asset management strategies.",
      coverImage: "/magazine-covers/reservoir-modeling.jpg",
      pdfUrl: "/magazines/epri-magazine-2024-jun.pdf",
      fileSize: "19.1 MB",
      pages: 76,
      category: "Technology",
      featured: false,
      downloadCount: 891
    }
  ];

  const filteredIssues = magazineIssues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || issue.category === selectedCategory;
    const matchesYear = selectedYear === "all" || issue.year.toString() === selectedYear;
    const matchesMonth = selectedMonth === "all" || issue.month === selectedMonth;
    
    return matchesSearch && matchesCategory && matchesYear && matchesMonth;
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.year, 0, 1).getTime() - new Date(a.year, 0, 1).getTime();
      case "oldest":
        return new Date(a.year, 0, 1).getTime() - new Date(b.year, 0, 1).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "downloads":
        return b.downloadCount - a.downloadCount;
      case "pages":
        return b.pages - a.pages;
      default:
        return 0;
    }
  });

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedYear("all");
    setSelectedMonth("all");
    setSortBy("newest");
  };

  const activeFiltersCount = [
    searchQuery !== "",
    selectedCategory !== "all",
    selectedYear !== "all",
    selectedMonth !== "all"
  ].filter(Boolean).length;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Research":
        return "bg-blue-500";
      case "Technology":
        return "bg-purple-500";
      case "Industry":
        return "bg-green-500";
      case "Education":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const handlePreview = (pdfUrl: string) => {
    window.open(pdfUrl, '_blank');
  };

  const handleDownload = (pdfUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-teal-600/80 to-cyan-600/90"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/40 via-transparent to-emerald-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-emerald-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-teal-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-cyan-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-green-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors mb-6">
              Digital Library
            </Badge>
            
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-teal-200 bg-clip-text text-transparent leading-tight">
              Electronical Magazine
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed font-light max-w-3xl mx-auto">
              Access our comprehensive digital library of petroleum research publications, technical articles, and industry insights. Download or preview magazines covering the latest developments in petroleum science and engineering.
            </p>
          </div>
        </div>
      </Section>

      {/* Advanced Search and Filter System */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="max-w-6xl mx-auto mb-12">
            {/* Main Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search magazines by title, content, or keywords..."
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-border/50 focus:border-primary/50 transition-all duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-border/50 p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    Filters & Sorting
                  </h3>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {activeFiltersCount} active
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Research">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          Research
                        </div>
                      </SelectItem>
                      <SelectItem value="Technology">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          Technology
                        </div>
                      </SelectItem>
                      <SelectItem value="Industry">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          Industry
                        </div>
                      </SelectItem>
                      <SelectItem value="Education">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          Education
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Year</label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Month Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Month</label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="All Months" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      <SelectItem value="January">January</SelectItem>
                      <SelectItem value="February">February</SelectItem>
                      <SelectItem value="March">March</SelectItem>
                      <SelectItem value="April">April</SelectItem>
                      <SelectItem value="May">May</SelectItem>
                      <SelectItem value="June">June</SelectItem>
                      <SelectItem value="July">July</SelectItem>
                      <SelectItem value="August">August</SelectItem>
                      <SelectItem value="September">September</SelectItem>
                      <SelectItem value="October">October</SelectItem>
                      <SelectItem value="November">November</SelectItem>
                      <SelectItem value="December">December</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10">
                      <div className="flex items-center gap-2">
                        {sortBy === "newest" || sortBy === "oldest" ? (
                          <Calendar className="h-4 w-4" />
                        ) : sortBy === "downloads" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                        <SelectValue placeholder="Sort By" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        <div className="flex items-center gap-2">
                          <SortDesc className="h-4 w-4" />
                          Newest First
                        </div>
                      </SelectItem>
                      <SelectItem value="oldest">
                        <div className="flex items-center gap-2">
                          <SortAsc className="h-4 w-4" />
                          Oldest First
                        </div>
                      </SelectItem>
                      <SelectItem value="title">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Title A-Z
                        </div>
                      </SelectItem>
                      <SelectItem value="downloads">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Most Downloaded
                        </div>
                      </SelectItem>
                      <SelectItem value="pages">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Most Pages
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Count */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Results</label>
                  <div className="h-10 flex items-center px-3 py-2 bg-muted rounded-md border border-border">
                    <span className="text-sm font-medium text-primary">
                      {filteredIssues.length} of {magazineIssues.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Filters Display */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground mr-2">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: "{searchQuery}"
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive" 
                          onClick={() => setSearchQuery("")}
                        />
                      </Badge>
                    )}
                    {selectedCategory !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Category: {selectedCategory}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSelectedCategory("all")}
                        />
                      </Badge>
                    )}
                    {selectedYear !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Year: {selectedYear}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSelectedYear("all")}
                        />
                      </Badge>
                    )}
                    {selectedMonth !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Month: {selectedMonth}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSelectedMonth("all")}
                        />
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <AnimatedSection animation="fade-up" delay={0.1}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-emerald-600">{magazineIssues.length}</CardTitle>
                <p className="text-sm text-muted-foreground">Total Issues</p>
              </CardHeader>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.2}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-teal-600">
                  {magazineIssues.reduce((total, issue) => total + issue.pages, 0)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Total Pages</p>
              </CardHeader>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.3}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-cyan-600">
                  {magazineIssues.reduce((total, issue) => total + issue.downloadCount, 0).toLocaleString()}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Downloads</p>
              </CardHeader>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={0.4}>
            <Card className="text-center hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-600">4</CardTitle>
                <p className="text-sm text-muted-foreground">Categories</p>
              </CardHeader>
            </Card>
          </AnimatedSection>
        </div>
      </Section>

      {/* Featured Issues */}
      <Section className="bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950">
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 dark:from-slate-100 dark:via-emerald-100 dark:to-teal-100 bg-clip-text text-transparent">
              Featured Issues
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our most popular and recent magazine issues covering cutting-edge petroleum research
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {filteredIssues.filter(issue => issue.featured).map((issue, index) => (
            <AnimatedSection key={issue.id} animation="fade-up" delay={index * 0.1}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border border-border/50 h-full">
                <div className="relative">
                  <div 
                    className="h-48 bg-cover bg-center bg-gradient-to-br from-emerald-500 to-teal-600"
                    style={{ backgroundImage: `url(${issue.coverImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getCategoryColor(issue.category)} text-white`}>
                        {issue.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-slate-800">
                        Featured
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">{issue.volume} • {issue.issueNumber}</p>
                      <p className="text-xs opacity-90">{issue.month} {issue.year}</p>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors">
                    {issue.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {issue.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <span>{issue.pages} pages</span>
                      <span>{issue.fileSize}</span>
                      <span>{issue.downloadCount.toLocaleString()} downloads</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePreview(issue.pdfUrl)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownload(issue.pdfUrl, issue.title)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* All Issues */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 dark:from-slate-100 dark:via-emerald-100 dark:to-teal-100 bg-clip-text text-transparent">
              All Issues
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse our complete archive of electronical magazine issues
            </p>
          </div>
        </AnimatedSection>

        {/* Results Display */}
        {viewMode === "list" ? (
          <div className="space-y-6">
            {filteredIssues.map((issue, index) => (
              <AnimatedSection key={issue.id} animation="fade-up" delay={index * 0.05}>
                <Card className="hover:shadow-lg transition-all duration-300 border border-border/50">
                  <CardContent className="px-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div 
                          className="w-24 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md"
                          style={{ backgroundImage: `url(${issue.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={`${getCategoryColor(issue.category)} text-white text-xs`}>
                                {issue.category}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {issue.volume} • {issue.issueNumber} • {issue.month} {issue.year}
                              </span>
                              {issue.featured && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-serif font-semibold mb-2 hover:text-primary transition-colors cursor-pointer">
                              {issue.title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                              {issue.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              <span>{issue.pages} pages</span>
                            </div>
                            <span>{issue.fileSize}</span>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              <span>{issue.downloadCount.toLocaleString()} downloads</span>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handlePreview(issue.pdfUrl)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleDownload(issue.pdfUrl, issue.title)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue, index) => (
              <AnimatedSection key={issue.id} animation="fade-up" delay={index * 0.1}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border border-border/50 h-full">
                  <div className="relative">
                    <div 
                      className="h-48 bg-cover bg-center bg-gradient-to-br from-emerald-500 to-teal-600"
                      style={{ backgroundImage: `url(${issue.coverImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <Badge className={`${getCategoryColor(issue.category)} text-white`}>
                          {issue.category}
                        </Badge>
                      </div>
                      {issue.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary" className="bg-white/90 text-slate-800">
                            Featured
                          </Badge>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-sm font-medium">{issue.volume} • {issue.issueNumber}</p>
                        <p className="text-xs opacity-90">{issue.month} {issue.year}</p>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors line-clamp-2">
                      {issue.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      {issue.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {issue.pages}p
                        </span>
                        <span>{issue.fileSize}</span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {issue.downloadCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handlePreview(issue.pdfUrl)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownload(issue.pdfUrl, issue.title)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        )}

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No magazines found matching your search criteria.</p>
          </div>
        )}
      </Section>

      {/* Call to Action */}
      <Section className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
        <AnimatedSection animation="fade-up">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Stay Updated with Our Latest Publications
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive notifications about new magazine issues and stay current with the latest petroleum research developments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-3">
                <a href="/contact">
                  Subscribe to Newsletter
                </a>
              </Button>
              <Button variant="outline" asChild size="lg" className="px-8 py-3">
                <a href="/news">
                  View All News
                </a>
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageContainer>
  )
}