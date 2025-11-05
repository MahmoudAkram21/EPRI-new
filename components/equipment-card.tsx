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
import { Equipment } from "@/lib/data"
import { Info, ExternalLink } from "lucide-react"

interface EquipmentCardProps {
  equipment: Equipment
  department: string
  departmentId: string
}

export default function EquipmentCard({ equipment, department, departmentId }: EquipmentCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer pt-0 pb-3 overflow-hidden " onClick={() => setOpen(true)}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={equipment.image || "/placeholder.svg"}
            alt={equipment.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90">
              {department}
            </Badge>
          </div>
          <div className="absolute bottom-4 right-4">
            <div className="p-2 bg-primary/90 rounded-full text-white">
              <Info className="h-5 w-5" />
            </div>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="text-lg line-clamp-2">{equipment.name}</CardTitle>
          <CardDescription className="line-clamp-2">{equipment.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
            View Details
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={equipment.image || "/placeholder.svg"}
                alt={equipment.name}
                fill
                className="object-cover"
              />
            </div>
            <DialogTitle className="text-2xl font-serif">{equipment.name}</DialogTitle>
            <DialogDescription className="text-base">{equipment.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Department Info */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                Department
              </h4>
              <div className="flex items-center gap-2">
                <Badge>{department}</Badge>
                <Link href={`/departments/${departmentId}`}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    Visit Department <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Specifications */}
            {equipment.specifications && equipment.specifications.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-lg">Technical Specifications</h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {equipment.specifications.map((spec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">▪</span>
                        <span className="text-sm text-muted-foreground">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Link href={`/departments/${departmentId}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Department
                </Button>
              </Link>
              <Link href="/contact" className="flex-1">
                <Button className="w-full">Request Service</Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

