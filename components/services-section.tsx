"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, DollarSign } from "lucide-react"
import { services } from "@/lib/data"
import { AnimatedSection } from "@/components/animated-section"

export function ServicesSection() {
  const featuredServices = services.slice(0, 3)

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade-up">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-serif text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground text-lg">Professional petroleum research and testing services</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex bg-transparent">
              <Link href="/services">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service, index) => (
            <AnimatedSection key={service.id} animation="fade-up" delay={index * 0.15}>
              <Link href={`/services/${service.id}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 group">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg -mt-6">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300"
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
                    {service.centerHead && (
                      <div className="inline-flex items-center gap-2 mb-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-full pe-5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                            {service.centerHead.name
                              .split(" ")
                              .map(n => n[0])
                              .join("")
                              .substring(0, 2)}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                            {service.centerHead.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {service.centerHead.title}
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
                      {service.price && service.price > 0 && !service.isFree && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>From ${service.price}</span>
                        </div>
                      )}
                      {service.isFree && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span>Free</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/services">
              View All Services <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
