'use client'

import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, DollarSign, Mail, Phone, CheckCircle2, ArrowRight, Settings, User, Star, Info, Shield, Award, Zap, Target, TrendingUp, Users, Microscope, FlaskConical, BarChart3, CheckSquare } from "lucide-react"
import { apiClient } from "@/lib/api"
import { Service } from "@/lib/services"
import { AnimatedSection } from "@/components/animated-section"
import EquipmentCard from "@/components/equipment-card"

export default function ServiceDetailPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const resolvedParams = use(params)
  // Add custom animations
  const animationStyles = `
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.6s ease-out forwards;
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.6s ease-out forwards;
      opacity: 0;
    }
  `
  const [service, setService] = useState<Service | null>(null)
  const [otherServices, setOtherServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadService()
  }, [resolvedParams.serviceId])

  // Handle hash-based navigation to tabs
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash && hash.startsWith('tab-')) {
        setActiveTab(hash)
      }
    }

    // Set initial tab from hash
    handleHashChange()
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [service])

  // Function to get appropriate icon for feature based on keywords
  const getFeatureIcon = (feature: string, index: number) => {
    const lowerFeature = feature.toLowerCase()
    
    if (lowerFeature.includes('accurate') || lowerFeature.includes('precision') || lowerFeature.includes('precise')) {
      return <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    } else if (lowerFeature.includes('fast') || lowerFeature.includes('quick') || lowerFeature.includes('rapid') || lowerFeature.includes('speed')) {
      return <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
    } else if (lowerFeature.includes('certified') || lowerFeature.includes('standard') || lowerFeature.includes('quality') || lowerFeature.includes('iso')) {
      return <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
    } else if (lowerFeature.includes('secure') || lowerFeature.includes('safe') || lowerFeature.includes('reliable')) {
      return <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
    } else if (lowerFeature.includes('analysis') || lowerFeature.includes('test') || lowerFeature.includes('laboratory')) {
      return <FlaskConical className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
    } else if (lowerFeature.includes('report') || lowerFeature.includes('data') || lowerFeature.includes('result')) {
      return <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
    } else if (lowerFeature.includes('expert') || lowerFeature.includes('professional') || lowerFeature.includes('specialist')) {
      return <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
    } else if (lowerFeature.includes('advanced') || lowerFeature.includes('modern') || lowerFeature.includes('state-of-the-art')) {
      return <Microscope className="h-5 w-5 text-pink-600 dark:text-pink-400" />
    } else if (lowerFeature.includes('improve') || lowerFeature.includes('enhance') || lowerFeature.includes('optimize')) {
      return <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
    } else {
      // Default rotating icons for variety
      const icons = [
        <CheckSquare className="h-5 w-5 text-slate-600 dark:text-slate-400" />,
        <Star className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
      ]
      return icons[index % icons.length]
    }
  }

  // Helper function to normalize specifications to always be an array
  const normalizeSpecifications = (specs: any): string[] => {
    if (!specs) return [];
    if (Array.isArray(specs)) return specs;
    if (typeof specs === 'string') {
      try {
        const parsed = JSON.parse(specs);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const loadService = async () => {
    try {
      const response = await apiClient.getService(resolvedParams.serviceId)
      // Normalize equipment specifications
      const normalizedService = {
        ...response.service,
        equipment: (response.service.equipment || []).map((eq: any) => ({
          ...eq,
          specifications: normalizeSpecifications(eq.specifications)
        }))
      };
      setService(normalizedService)
      // Load other services after getting the current service
      loadOtherServices(normalizedService)
    } catch (error: any) {
      if (error.status === 404) {
        setNotFoundError(true)
      } else {
        console.error('Error loading service:', error)
        // Try fallback to static data
        try {
          const { services } = await import('@/lib/data')
          const staticService = services.find((s) => s.id === resolvedParams.serviceId)
          if (staticService) {
            // Convert static service to match Service interface
            const convertedService = {
              ...staticService,
              price: staticService.price || 0,
              equipment: staticService.equipment?.map(eq => ({
                ...eq,
                specifications: normalizeSpecifications(eq.specifications)
              })) || [],
              centerHead: staticService.centerHead,
              tabs: []
            }
            setService(convertedService)
            // Load other services from static data
            const otherStaticServices = services
              .filter(s => s.id !== resolvedParams.serviceId)
              .slice(0, 3)
              .map(s => ({
                ...s,
                price: s.price || 0,
                equipment: s.equipment?.map(eq => ({
                  ...eq,
                  specifications: normalizeSpecifications(eq.specifications)
                })) || [],
                centerHead: s.centerHead,
                tabs: []
              }))
            setOtherServices(otherStaticServices)
          } else {
            setNotFoundError(true)
          }
        } catch {
          setNotFoundError(true)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const loadOtherServices = async (currentService: Service) => {
    try {
      const response = await apiClient.getServices()
      // Filter out current service and get 3 random other services
      const filtered = response.services.filter((s: Service) => s.id !== currentService.id)
      // Prioritize services from the same category
      const sameCategory = filtered.filter((s: Service) => s.category === currentService.category)
      const otherCategories = filtered.filter((s: Service) => s.category !== currentService.category)
      
      // Take up to 2 from same category and fill with others
      const selected = [
        ...sameCategory.slice(0, 2),
        ...otherCategories.slice(0, 3 - sameCategory.slice(0, 2).length)
      ].slice(0, 3)
      
      setOtherServices(selected)
    } catch (error) {
      console.error('Error loading other services:', error)
      // Keep empty array if API fails
      setOtherServices([])
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <Section>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </Section>
      </PageContainer>
    )
  }

  if (notFoundError || !service) {
    notFound()
  }

  return (
    <PageContainer>
      <style jsx>{animationStyles}</style>

      <Section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden flex items-center">
        {/* Service background image with overlay */}
        {service.image && (
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 dark:opacity-10"
              style={{ backgroundImage: `url('${service.image}')` }}
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
        
        <div className="relative grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
              <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium animate-fade-in">
                {service.category}
              </Badge>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-white dark:to-slate-100 bg-clip-text text-transparent leading-tight animate-fade-in-up">
              {service.title}
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {service.subtitle}
            </p>
            
            <div className="flex flex-wrap gap-4 text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Duration</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{service.duration}</span>
                </div>
              </div>
              {service.price && (
                <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors duration-300">
                    <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block">Starting from</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">${service.price}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Premium service indicator */}
            <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>Professional Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Certified Process</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Column */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Main service image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Floating badge on image */}
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Active Service</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements around image */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100/30 dark:bg-blue-900/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-100/30 dark:bg-emerald-900/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="flex w-full mb-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm overflow-x-auto gap-1">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                >
                  <Info className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">Overview</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="features" 
                  className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                >
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">Features</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="equipment" 
                  className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">Equipment</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="center-head" 
                  className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium whitespace-nowrap">Center Head</span>
                </TabsTrigger>
                {service.tabs && service.tabs.length > 0 && service.tabs
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((tab, index) => (
                    <TabsTrigger 
                      key={tab.id}
                      value={`tab-${tab.id}`}
                      className="flex items-center gap-2 data-[state=active]:bg-slate-100 data-[state=active]:dark:bg-slate-700 data-[state=active]:text-slate-900 data-[state=active]:dark:text-slate-100 py-2 px-3 rounded-md transition-colors text-slate-600 dark:text-slate-400 flex-shrink-0"
                    >
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span className="text-sm font-medium whitespace-nowrap max-w-20 truncate">{tab.title}</span>
                    </TabsTrigger>
                  ))}
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Service Overview
                  </h2>
                  <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                    <CardContent className="px-6">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-0">
                <div className="space-y-6">
                  <div className="text-start mb-8">
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      Key Features & Benefits
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      Discover the advantages and capabilities that make our service stand out
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {(Array.isArray(service.features) ? service.features : 
                      typeof service.features === 'string' ? [service.features] : 
                      []).map((feature, index) => (
                      <Card key={index} className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-all duration-300 group">
                        <CardContent className="px-6">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                              {getFeatureIcon(feature, index)}
                            </div>
                            <div className="flex-1">
                              <div className="text-slate-900 dark:text-slate-100 font-medium leading-relaxed mb-1">
                                {feature.length > 50 ? (
                                  <>
                                    <span className="font-semibold text-lg">
                                      {feature.split(':')[0] || feature.split('.')[0] || feature.substring(0, 30)}
                                    </span>
                                    {(feature.includes(':') || feature.includes('.')) && (
                                      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed">
                                        {feature.split(':')[1] || feature.split('.').slice(1).join('.') || feature.substring(30)}
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-base font-medium">{feature}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Feature Summary */}
                  <Card className="border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 mt-8">
                    <CardContent className="px-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            <span>Professional Quality</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>Reliable Results</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Expert Support</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                    Equipment & Technology
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(service.equipment || []).map((equipment, index) => (
                      <div key={equipment.id}>
                        <EquipmentCard 
                          equipment={{
                            ...equipment,
                            image: equipment.image || "/placeholder.svg",
                            specifications: equipment.specifications || []
                          }} 
                          department={service.title} 
                          departmentId={service.id} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="center-head" className="mt-0">
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                    Center Head
                  </h2>
                  {(service.centerHead || service.center_head) ? (
                    <Card className="border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800 overflow-hidden">
                      <CardContent className="px-8">
                        <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="relative">
                              <Avatar className="h-32 w-32 ring-4 ring-slate-200 dark:ring-slate-600 shadow-xl">
                                <AvatarImage
                                  src={(service.centerHead || service.center_head)?.picture || "/placeholder.svg"}
                                  alt={(service.centerHead || service.center_head)?.name || "Center Head"}
                                  className="object-cover"
                                />
                                <AvatarFallback className="text-2xl font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                  {((service.centerHead || service.center_head)?.name || "")
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-slate-600 dark:bg-slate-400 rounded-full flex items-center justify-center shadow-md">
                                <User className="h-5 w-5 text-white dark:text-slate-900" />
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-2xl mb-2 text-slate-900 dark:text-slate-100">
                              {(service.centerHead || service.center_head)?.name}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 font-medium text-lg mb-4">
                              {(service.centerHead || service.center_head)?.title}
                            </p>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
                              {(service.centerHead || service.center_head)?.bio}
                            </p>
                            
                            <div className="space-y-3 mb-6">
                              {(service.centerHead || service.center_head)?.email && (
                                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 px-4 py-3 rounded-lg">
                                  <Mail className="h-5 w-5 text-slate-500" />
                                  <a 
                                    href={`mailto:${(service.centerHead || service.center_head)?.email}`} 
                                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium"
                                  >
                                    {(service.centerHead || service.center_head)?.email}
                                  </a>
                                </div>
                              )}
                              {(service.centerHead || service.center_head)?.phone && (
                                <div className="flex items-center justify-center md:justify-start gap-3 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 px-4 py-3 rounded-lg">
                                  <Phone className="h-5 w-5 text-slate-500" />
                                  <a 
                                    href={`tel:${(service.centerHead || service.center_head)?.phone}`} 
                                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium"
                                  >
                                    {(service.centerHead || service.center_head)?.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                            
                            {(() => {
                              const centerHead = service.centerHead || service.center_head;
                              let expertise = centerHead?.expertise;
                              
                              // Ensure expertise is always an array
                              if (expertise) {
                                // If it's a string, try to parse it as JSON
                                if (typeof expertise === 'string') {
                                  try {
                                    expertise = JSON.parse(expertise);
                                  } catch (e) {
                                    // If parsing fails, treat as single item or empty
                                    expertise = [];
                                  }
                                }
                                // If it's not an array, convert to empty array
                                if (!Array.isArray(expertise)) {
                                  expertise = [];
                                }
                              } else {
                                expertise = [];
                              }
                              
                              return expertise.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Areas of Expertise</h4>
                                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {expertise.map((area, index) => (
                                      <Badge 
                                        key={index} 
                                        variant="outline" 
                                        className="px-3 py-1 text-xs bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                                      >
                                        {area}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                      <p>No center head information available for this service.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {service.tabs && service.tabs.length > 0 && service.tabs
                .sort((a, b) => a.order_index - b.order_index)
                .map((tab, index) => (
                  <TabsContent key={tab.id} value={`tab-${tab.id}`} className="mt-0">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                        {tab.title}
                      </h2>
                      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                        <CardContent className="px-6">
                          <div 
                            className="text-slate-700 dark:text-slate-300 leading-relaxed prose prose-slate dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: tab.content }}
                          ></div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                ))}
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
              <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Request This Service
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Duration:</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{service.duration}</span>
                  </div>
                  {service.price && (
                    <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Starting Price:</span>
                      </div>
                      <span className="font-bold text-lg text-slate-900 dark:text-slate-100">${service.price}</span>
                    </div>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-3">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium py-3 transition-colors" asChild>
                    <Link href="/contact">
                      Request Quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  {(service.centerHead || service.center_head)?.email && (
                    <Button variant="outline" className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 py-3 transition-colors hover:bg-red-700 hover:border-red-700" asChild>
                      <Link href={`mailto:${(service.centerHead || service.center_head)?.email}`}>Contact Center Head</Link>
                    </Button>
                  )}
                </div>
                
                <div className="pt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <p className="mb-2 font-medium">Need more information?</p>
                    <p>
                      Contact us at{" "}
                      <a href="mailto:info@epri.edu" className="text-slate-900 dark:text-slate-100 hover:underline font-medium">
                        info@epri.edu
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Other Services Section */}
      {otherServices.length > 0 && (
        <Section>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Other Services
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Explore our comprehensive range of petroleum research and testing services
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServices.map((otherService) => (
                <Link key={otherService.id} href={`/services/${otherService.id}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 group">
                    <div className="aspect-video relative overflow-hidden rounded-t-lg -mt-6">
                      <img
                        src={otherService.image || "/placeholder.svg"}
                        alt={otherService.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="px-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                          {otherService.category}
                        </Badge>
                        {otherService.icon && (
                          <span className="text-xl opacity-70">{otherService.icon}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {otherService.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {otherService.subtitle || otherService.description}
                      </p>
                      
                      {/* Center Head Information */}
                      {(otherService.centerHead || otherService.center_head) && (
                        <div className="inline-flex items-center gap-2 mb-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-full pe-5">
                          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                              {(otherService.centerHead || otherService.center_head)?.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {(otherService.centerHead || otherService.center_head)?.title}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        {otherService.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{otherService.duration}</span>
                          </div>
                        )}
                        {otherService.price && otherService.price > 0 && !otherService.is_free && (
                          <div className="flex items-center gap-1">
                            <span>From ${otherService.price}</span>
                          </div>
                        )}
                        {otherService.is_free && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            <span>Free</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" asChild className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                <Link href="/services">
                  View All Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      )}

    </PageContainer>
  )
}
