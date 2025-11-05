"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Service } from "@/lib/data"
import { Info, ExternalLink, Clock, DollarSign, User } from "lucide-react"

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => setOpen(true)}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={service.image || "/placeholder.svg"}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90">
              {service.category}
            </Badge>
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="p-2 bg-primary/90 rounded-full text-white">
              <Info className="h-5 w-5" />
            </div>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{service.title}</CardTitle>
          <CardDescription className="line-clamp-2">{service.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {service.duration}
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {service.isFree ? "Free" : `$${service.price}`}
            </div>
          </div>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
            View Details
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                fill
                className="object-cover"
              />
            </div>
            <DialogTitle className="text-2xl font-serif">{service.title}</DialogTitle>
            <DialogDescription className="text-base">{service.subtitle}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Service Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  Service Details
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge>{service.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Duration: {service.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Price: {service.isFree ? "Free" : `$${service.price}`}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Center Head
                </h4>
                <div className="flex items-center gap-3">
                  <Image
                    src={service.centerHead.picture || "/placeholder.svg"}
                    alt={service.centerHead.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium">{service.centerHead.name}</div>
                    <div className="text-sm text-muted-foreground">{service.centerHead.title}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-3 text-lg">Service Description</h4>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg">Key Features</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">▪</span>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Equipment */}
            {service.equipment && service.equipment.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg">Available Equipment</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.equipment.map((equipment) => (
                    <div key={equipment.id} className="bg-muted/50 rounded-lg p-4">
                      <div className="font-medium mb-2">{equipment.name}</div>
                      <p className="text-sm text-muted-foreground mb-3">{equipment.description}</p>
                      {equipment.specifications && (
                        <ul className="space-y-1">
                          {equipment.specifications.slice(0, 3).map((spec, index) => (
                            <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                              <span className="text-primary mt-1">•</span>
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Center Head Details */}
            <div>
              <h4 className="font-semibold mb-3 text-lg">Center Head Profile</h4>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={service.centerHead.picture || "/placeholder.svg"}
                    alt={service.centerHead.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold text-lg">{service.centerHead.name}</h5>
                    <p className="text-primary font-medium mb-2">{service.centerHead.title}</p>
                    <p className="text-sm text-muted-foreground mb-3">{service.centerHead.bio}</p>
                    <div className="space-y-1 text-sm">
                      <div>Email: {service.centerHead.email}</div>
                      <div>Phone: {service.centerHead.phone}</div>
                    </div>
                    {service.centerHead.expertise && (
                      <div className="mt-3">
                        <div className="text-sm font-medium mb-2">Expertise:</div>
                        <div className="flex flex-wrap gap-1">
                          {service.centerHead.expertise.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Link href="/contact" className="flex-1">
                <Button variant="outline" className="w-full">
                  Request Quote
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button className="w-full">Contact Center</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
