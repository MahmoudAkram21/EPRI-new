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
import { Department } from "@/lib/data"
import { Info, ExternalLink, Users, Microscope, Award } from "lucide-react"

interface DepartmentCardProps {
  department: Department
}

export default function DepartmentCard({ department }: DepartmentCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => setOpen(true)}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={department.image || "/placeholder.svg"}
            alt={department.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4">
            <div className="text-2xl">{department.icon}</div>
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="p-2 bg-primary/90 rounded-full text-white">
              <Info className="h-5 w-5" />
            </div>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{department.name}</CardTitle>
          <CardDescription className="line-clamp-2">{department.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Microscope className="h-4 w-4" />
              {department.equipment.length} Equipment
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {department.staff.length} Staff
            </div>
          </div>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
            View Details
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={department.image || "/placeholder.svg"}
                alt={department.name}
                fill
                className="object-cover"
              />
            </div>
            <DialogTitle className="text-2xl font-serif flex items-center gap-3">
              <span className="text-3xl">{department.icon}</span>
              {department.name}
            </DialogTitle>
            <DialogDescription className="text-base">{department.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Department Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-lg">Department Overview</h4>
                <p className="text-muted-foreground leading-relaxed">{department.about}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Department Manager
                </h4>
                <div className="flex items-center gap-3">
                  <Image
                    src={department.manager.picture || "/placeholder.svg"}
                    alt={department.manager.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium text-lg">{department.manager.name}</div>
                    <div className="text-sm text-muted-foreground">{department.manager.title}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            {department.achievements && department.achievements.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Key Achievements
                </h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {department.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">▪</span>
                        <span className="text-sm text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Equipment */}
            {department.equipment && department.equipment.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <Microscope className="h-4 w-4" />
                  Available Equipment ({department.equipment.length})
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {department.equipment.map((equipment) => (
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

            {/* Analysis Services */}
            {department.analysisServices && department.analysisServices.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg">Analysis Services</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {department.analysisServices.map((service) => (
                    <div key={service.id} className="bg-muted/50 rounded-lg p-4">
                      <div className="font-medium mb-2">{service.name}</div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff */}
            {department.staff && department.staff.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Department Staff ({department.staff.length})
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {department.staff.map((member) => (
                    <div key={member.id} className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Image
                          src={member.picture || "/placeholder.svg"}
                          alt={member.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.title}</div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium mb-1">Specialization:</div>
                        <div className="text-muted-foreground">{member.specialization}</div>
                        <div className="text-xs text-muted-foreground mt-2">{member.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Research Areas */}
            {department.researchAreas && department.researchAreas.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg">Research Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {department.researchAreas.map((area, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Manager Details */}
            <div>
              <h4 className="font-semibold mb-3 text-lg">Department Manager Profile</h4>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Image
                    src={department.manager.picture || "/placeholder.svg"}
                    alt={department.manager.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold text-lg">{department.manager.name}</h5>
                    <p className="text-primary font-medium mb-2">{department.manager.title}</p>
                    <p className="text-sm text-muted-foreground mb-3">{department.manager.bio}</p>
                    <div className="space-y-1 text-sm">
                      <div>Email: {department.manager.email}</div>
                      <div>Phone: {department.manager.phone}</div>
                    </div>
                    {department.manager.expertise && (
                      <div className="mt-3">
                        <div className="text-sm font-medium mb-2">Expertise:</div>
                        <div className="flex flex-wrap gap-1">
                          {department.manager.expertise.map((skill, index) => (
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
              <Link href={`/departments/${department.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  Visit Department Page
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button className="w-full">Contact Department</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
