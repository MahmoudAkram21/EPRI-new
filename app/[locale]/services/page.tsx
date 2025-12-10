"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock, DollarSign, Search, Wrench, User } from "lucide-react"
import { apiClient } from "@/lib/api"
import { Service, SERVICE_CATEGORIES } from "@/lib/services"
import { serviceCategories } from "@/lib/data" // Keep for fallback

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const response = await apiClient.getServices()
      setServices(response.services)
    } catch (error) {
      console.error('Error loading services:', error)
      // Show empty state if API fails
      setServices([])
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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

  return (
    <PageContainer>

      <Section className="bg-primary text-primary-foreground">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-primary-foreground/90">
            Professional petroleum research, testing, and consulting services backed by decades of expertise
          </p>
        </div>
      </Section>

      <Section>
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? "bg-primary" : "bg-transparent"}
            >
              All Services
            </Button>
            {Array.from(new Set(services.map(s => s.category))).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary" : "bg-transparent"}
              >
                <span className="mr-2">
                  {category.includes('Laboratory') ? '🔬' : 
                   category.includes('Engineering') ? '⚙️' : 
                   category.includes('Environmental') ? '🌍' : 
                   category.includes('Exploration') ? '📡' : 
                   category.includes('Protection') ? '🛡️' : 
                   category.includes('Materials') ? '🛣️' : 
                   category.includes('Inspection') ? '🏗️' : 
                   category.includes('Technical') ? '🔧' : '🔬'}
                </span>
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Link key={service.id} href={`/services/${service.id}`}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 group">
                <div className="aspect-video relative overflow-hidden rounded-t-lg -mt-6">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="px-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                      {service.category}
                    </Badge>
                    {service.icon && (
                      <span className="text-xl opacity-70">{service.icon}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {service.subtitle || service.description}
                  </p>
                  
                  {/* Center Head Information */}
                  {(service.centerHead || service.center_head) && (
                    <div className="inline-flex items-center gap-2 mb-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-full pe-5">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {((service.centerHead || service.center_head)?.name || "")
                            .split(" ")
                            .map(n => n[0])
                            .join("")
                            .substring(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                          {(service.centerHead || service.center_head)?.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {(service.centerHead || service.center_head)?.title}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    {service.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                    {service.price && service.price > 0 && !service.is_free && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>From ${service.price}</span>
                      </div>
                    )}
                    {service.is_free && (
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

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No services found matching your criteria.</p>
          </div>
        )}
      </Section>

    </PageContainer>
  )
}
