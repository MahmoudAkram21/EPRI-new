import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Award, Mail, Phone, User, Star, GraduationCap, Clock } from "lucide-react"
import type { Instructor } from "@/lib/data"

interface InstructorProfileProps {
  instructor: Instructor | undefined
}

export function InstructorProfile({ instructor }: InstructorProfileProps) {
  if (!instructor) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Instructor information not available.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-purple-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-30"></div>
      </div>

      <h2 className="font-serif text-4xl font-bold bg-linear-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
        About the Instructor
      </h2>

      {/* Main Profile Card */}
      <Card className="border border-white/20 backdrop-blur-sm bg-linear-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 shadow-2xl overflow-hidden relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-cyan-400/10"></div>
        
        <CardContent className="px-8 py-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="shrink-0 mx-auto md:mx-0">
              <div className="relative group">
                <Avatar className="h-40 w-40 ring-4 ring-white/30 dark:ring-slate-600/50 shadow-2xl transition-all duration-300 group-hover:ring-blue-400/50 group-hover:shadow-blue-500/25">
                  <AvatarImage
                    src={instructor.picture || "/placeholder.svg"}
                    alt={instructor.name}
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                  />
                  <AvatarFallback className="text-3xl font-bold bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-slate-700 dark:text-slate-300">
                    {instructor.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-serif font-bold text-3xl mb-3 bg-linear-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-slate-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                {instructor.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 font-medium text-xl mb-6 flex items-center justify-center md:justify-start gap-2">
                <User className="h-5 w-5 text-blue-500" />
                {instructor.expertise}
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-8 text-lg font-light">
                {instructor.bio}
              </p>
              
              {/* Contact Information - if available in the future */}
              {(instructor as any).email && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center justify-center md:justify-start gap-3 text-slate-600 dark:text-slate-400 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/30 dark:border-slate-600/30 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <a
                      href={`mailto:${(instructor as any).email}`}
                      className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
                    >
                      {(instructor as any).email}
                    </a>
                  </div>
                </div>
              )}
              
              {/* Expertise badges - if available as array in the future */}
              {(instructor as any).expertiseAreas && Array.isArray((instructor as any).expertiseAreas) && (
                <div>
                  <h4 className="font-serif font-semibold mb-4 text-xl text-slate-900 dark:text-slate-100 flex items-center justify-center md:justify-start gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    Areas of Expertise
                  </h4>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {(instructor as any).expertiseAreas.map((area: string, index: number) => (
                      <Badge
                        key={index}
                        className="px-4 py-2 text-sm bg-linear-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-200/50 dark:border-blue-600/50 text-blue-700 dark:text-blue-300 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-white/20 backdrop-blur-sm bg-linear-to-br from-blue-500/10 via-blue-400/5 to-blue-300/10 hover:from-blue-500/20 hover:to-blue-300/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent"></div>
          <CardContent className="px-6 text-center relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold font-serif bg-linear-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent mb-2">
              {instructor.courses}
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Courses Taught</div>
          </CardContent>
        </Card>
        
        <Card className="border border-white/20 backdrop-blur-sm bg-linear-to-br from-green-500/10 via-green-400/5 to-green-300/10 hover:from-green-500/20 hover:to-green-300/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent"></div>
          <CardContent className="px-6 text-center relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold font-serif bg-linear-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-600 bg-clip-text text-transparent mb-2">
              10,000+
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Students Mentored</div>
          </CardContent>
        </Card>
        
        <Card className="border border-white/20 backdrop-blur-sm bg-linear-to-br from-yellow-500/10 via-yellow-400/5 to-yellow-300/10 hover:from-yellow-500/20 hover:to-yellow-300/20 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-yellow-500/5 to-transparent"></div>
          <CardContent className="px-6 text-center relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 bg-linear-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
              <Star className="h-8 w-8 text-white fill-white" />
            </div>
            <div className="text-3xl font-bold font-serif bg-linear-to-r from-yellow-600 to-yellow-800 dark:from-yellow-400 dark:to-yellow-600 bg-clip-text text-transparent mb-2">
              4.8
            </div>
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Rating</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
