import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, GraduationCap, User, Users, Building2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function StaffListingPage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50/30 to-transparent dark:from-blue-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-slate-100/40 to-transparent dark:from-slate-700/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
        </div>

        <div className="relative min-h-[400px] flex items-center">
          <div className="text-center w-full">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 rounded-full animate-pulse" style={{ animationDuration: '2s' }}></div>
              <Badge variant="outline" className="border-blue-200 bg-blue-50/50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-medium">
                <Users className="h-3 w-3 mr-1" />
                Our Team
              </Badge>
            </div>
            
            <AnimatedSection animation="fade-up">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-white dark:to-slate-100 bg-clip-text text-transparent leading-tight mb-6">
                Staff Directory
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light max-w-3xl mx-auto">
                Meet our dedicated team of researchers, engineers, and specialists working at the forefront of petroleum research and development.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* Coming Soon Content */}
      <Section>
        <AnimatedSection animation="fade-up">
          <Card className="max-w-2xl mx-auto border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Staff Directory Coming Soon
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-lg mx-auto">
                We're currently updating our comprehensive staff directory. In the meantime, you can view individual staff profiles through department pages or contact us directly for staff information.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/departments">
                  <Button className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900">
                    <Building2 className="h-4 w-4 mr-2" />
                    Browse Departments
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Section>
    </PageContainer>
  )
}