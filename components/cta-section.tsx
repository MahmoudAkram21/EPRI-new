"use client"

import { useState, useEffect } from "react"
import { Section } from "@/components/section"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "@/components/animated-section"
import { apiClient } from "@/lib/api"
import { useLocale } from "next-intl"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Helper function to extract localized value
function getLocalizedValue(value: any, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || value.ar || ''
  }
  return ''
}

export function CTASection() {
  const locale = useLocale()
  const [homeContent, setHomeContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/home-content/cta').catch(() => ({ content: null }))
        setHomeContent(response.content)
      } catch (error) {
        console.error('Error fetching CTA section:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return null
  }

  const title = getLocalizedValue(homeContent?.title, locale) || "Ready to Start Your Learning Journey?"
  const subtitle = getLocalizedValue(homeContent?.subtitle, locale) || "Join thousands of students advancing their careers with EPRI"
  const buttonText = getLocalizedValue(homeContent?.button_text, locale) || "Get Started Today"
  const buttonLink = homeContent?.button_link || "/register"
  const secondaryButtonText = getLocalizedValue(homeContent?.content?.secondary_button_text, locale) || "Browse Courses"
  const secondaryButtonLink = homeContent?.content?.secondary_button_link || "/courses"

  return (
    <Section className="bg-primary text-primary-foreground">
      <AnimatedSection animation="fade-up">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl font-bold mb-6">{title}</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href={buttonLink}>
                {buttonText} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {secondaryButtonText && (
              <Button
                size="lg"
                variant="outline"
                className="bg-primary-foreground/10 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/20"
                asChild
              >
                <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
              </Button>
            )}
          </div>
        </div>
      </AnimatedSection>
    </Section>
  )
}

