"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/animated-section"
import { Mail, Phone, Users, Filter, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLocale } from "next-intl"
import { getTranslation } from "@/lib/utils"

interface StaffMember {
  id: string
  name: string
  title?: string
  academic_position?: string
  current_admin_position?: string
  picture?: string
  bio?: string
  email?: string
  phone?: string
}

interface DepartmentStaffFilterProps {
  staff: StaffMember[]
}

export function DepartmentStaffFilter({ staff }: DepartmentStaffFilterProps) {
  const locale = useLocale()
  const [selectedDegree, setSelectedDegree] = useState<string>("all")

  // Get unique academic positions
  const academicPositions = useMemo(() => {
    const positions = staff
      .map((member) => {
        if (!member.academic_position) return null
        return typeof member.academic_position === 'string' 
          ? member.academic_position 
          : getTranslation(member.academic_position, locale)
      })
      .filter((pos): pos is string => pos !== null && pos !== '')
    
    return Array.from(new Set(positions)).sort()
  }, [staff, locale])

  // Filter staff by selected degree
  const filteredStaff = useMemo(() => {
    if (selectedDegree === "all") return staff
    
    return staff.filter((member) => {
      if (!member.academic_position) return false
      const position = typeof member.academic_position === 'string' 
        ? member.academic_position 
        : getTranslation(member.academic_position, locale)
      return position.toLowerCase().includes(selectedDegree.toLowerCase())
    })
  }, [staff, selectedDegree, locale])

  if (staff.length === 0) {
    return (
      <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
        <CardContent className="pt-6 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
          <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">Staff Information</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Staff profiles for this department are being updated. Please contact us for more information about our team.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Department Staff
        </h2>
        {academicPositions.length > 0 && (
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={selectedDegree}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="h-10 px-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Scientific Degrees</option>
              {academicPositions.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredStaff.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredStaff.map((member, index) => {
            const memberName = typeof member.name === 'string' 
              ? member.name 
              : getTranslation(member.name, locale)
            const memberTitle = member.title 
              ? (typeof member.title === 'string' ? member.title : getTranslation(member.title, locale))
              : undefined
            const academicPosition = member.academic_position
              ? (typeof member.academic_position === 'string' 
                  ? member.academic_position 
                  : getTranslation(member.academic_position, locale))
              : undefined
            const adminPosition = member.current_admin_position
              ? (typeof member.current_admin_position === 'string'
                  ? member.current_admin_position
                  : getTranslation(member.current_admin_position, locale))
              : undefined
            const memberBio = member.bio
              ? (typeof member.bio === 'string' ? member.bio : getTranslation(member.bio, locale))
              : undefined

            return (
              <AnimatedSection key={member.id} animation="fade-up" delay={index * 0.1}>
                <Card className="border-2 border-slate-200 dark:border-slate-700 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group overflow-hidden relative">
                  {/* Decorative gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-emerald-500/0 group-hover:from-blue-500/5 group-hover:to-emerald-500/5 transition-all duration-300 pointer-events-none"></div>
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-start gap-4">
                      {/* Enhanced Profile Picture */}
                      <div className="relative shrink-0">
                        <div className="relative h-20 w-20">
                          <Image
                            src={member.picture || "/placeholder.svg"}
                            alt={memberName}
                            fill
                            className="object-cover rounded-full ring-4 ring-blue-100 dark:ring-blue-900/50 group-hover:ring-blue-300 dark:group-hover:ring-blue-700 transition-all duration-300 shadow-lg"
                          />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        {/* Status indicator */}
                        <div className="absolute bottom-0 right-0 h-5 w-5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {memberName}
                        </CardTitle>
                        {memberTitle && (
                          <CardDescription className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                            {memberTitle}
                          </CardDescription>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {academicPosition && (
                            <Badge variant="outline" className="text-xs font-semibold border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1">
                              <Users className="h-3 w-3 mr-1" />
                              {academicPosition}
                            </Badge>
                          )}
                          {adminPosition && (
                            <Badge className="text-xs font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 px-2.5 py-1 shadow-sm">
                              <Users className="h-3 w-3 mr-1" />
                              {adminPosition}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-4">
                    {memberBio && (
                      <div className="relative">
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                          {memberBio}
                        </p>
                        <div className="absolute bottom-0 right-0 w-20 h-6 bg-gradient-to-l from-transparent to-white dark:to-slate-800 pointer-events-none"></div>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2.5">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-sm text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-700/50 dark:to-blue-900/20 rounded-lg hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md group/email"
                        >
                          <div className="h-9 w-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center group-hover/email:bg-blue-200 dark:group-hover/email:bg-blue-800 transition-colors">
                            <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="flex-1 truncate font-medium">{member.email}</span>
                        </a>
                      )}
                      {member.phone && (
                        <div className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-emerald-50/50 dark:from-slate-700/50 dark:to-emerald-900/20 rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm">
                          <div className="h-9 w-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <span className="flex-1 font-medium">{member.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-3 border-t-2 border-slate-200 dark:border-slate-700">
                      <Link 
                        href={`/staff/${member.id}`}
                        className="w-full block"
                      >
                        <Button 
                          size="sm" 
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300 font-semibold group/btn"
                        >
                            <span className="flex items-center justify-center gap-2">
                            View Profile
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )
          })}
        </div>
      ) : (
        <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
          <CardContent className="pt-6 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
            <h3 className="font-semibold mb-2 text-slate-900 dark:text-slate-100">No Staff Found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              No staff members found with the selected scientific degree. Try selecting a different filter.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

