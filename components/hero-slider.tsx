"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight, Microscope, Calendar, Wrench, Lightbulb, Users, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DecorativeShapes } from "./decorative-shapes"
import { apiClient } from "@/lib/api"
import { useLocale } from "next-intl"

type MediaType = "image" | "video"

interface Slide {
  id: string
  mediaType?: MediaType
  image?: string
  video?: string
  title: string
  subtitle: string
  description: string
  cta: string
  ctaLink: string
  badge: string
  icon: React.ComponentType<{ className?: string }>
  stats: Array<{ value: string; label: string }>
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Microscope,
  Calendar,
  Wrench,
  Lightbulb,
  Users,
  Award,
}

// Default icon if not found
const DefaultIcon = Microscope

// Helper function to extract localized value
function getLocalizedValue(value: any, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || value.ar || ''
  }
  return ''
}

export function HeroSlider() {
  const locale = useLocale()
  const [slides, setSlides] = useState<Slide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getHeroSliders()
        const sliders = response.sliders || []
        
        const transformedSlides: Slide[] = sliders.map((slider: any) => {
          const stats = slider.stats || []
          const IconComponent = slider.icon ? iconMap[slider.icon] || DefaultIcon : DefaultIcon
          
          return {
            id: slider.id,
            mediaType: slider.media_type === 'video' ? 'video' : 'image',
            image: slider.image || undefined,
            video: slider.video || undefined,
            title: getLocalizedValue(slider.title, locale),
            subtitle: getLocalizedValue(slider.subtitle, locale),
            description: getLocalizedValue(slider.description, locale),
            cta: getLocalizedValue(slider.cta, locale),
            ctaLink: slider.cta_link || '/',
            badge: getLocalizedValue(slider.badge, locale),
            icon: IconComponent,
            stats: stats.map((stat: any) => ({
              value: stat.value || '',
              label: getLocalizedValue(stat.label, locale)
            }))
          }
        })
        
        setSlides(transformedSlides)
      } catch (error) {
        console.error('Error fetching hero sliders:', error)
        // Fallback to empty array on error
        setSlides([])
      } finally {
        setLoading(false)
      }
    }

    fetchSliders()
  }, [locale])

  const nextSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }
  }, [slides.length])

  const prevSlide = useCallback(() => {
    if (slides.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    }
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index)
    }
  }, [slides.length])

  useEffect(() => {
    if (!isPaused && slides.length > 0) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused, nextSlide, slides.length])

  if (loading) {
    return (
      <section className="relative h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading hero slider...</p>
        </div>
      </section>
    )
  }

  if (slides.length === 0) {
    return null
  }

  const currentSlideData = slides[currentSlide]
  const Icon = currentSlideData.icon

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Media (Image or Video) with Parallax Effect */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {currentSlideData.mediaType === "video" && currentSlideData.video ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={currentSlideData.video} type="video/mp4" />
                {/* Fallback to image if video fails */}
                {currentSlideData.image && (
                  <img
                    src={currentSlideData.image}
                    alt={currentSlideData.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </video>
            ) : (
              <img
                src={currentSlideData.image || "/placeholder.svg"}
                alt={currentSlideData.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </motion.div>

          {/* Gradient Overlay with Modern Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/85 to-primary/75 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

          {/* Decorative Shapes */}
          <div className="absolute inset-0 z-[15]">
            <DecorativeShapes />
          </div>

          {/* Content Container */}
          <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
              {/* Left Side - Main Content */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-white"
              >
                {/* Large Glowing Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 10 }}
                  className="mb-6"
                >
                  <div className="relative inline-block">
                    {/* Glowing background layers */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-2xl opacity-60 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-pink-400 via-red-500 to-yellow-500 rounded-full blur-xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    
                    {/* Icon container */}
                    <div className="relative bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-3 sm:p-4 shadow-2xl">
                      <Icon className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-white drop-shadow-2xl" />
                    </div>
                  </div>
                </motion.div>

                {/* Badge with Icon */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="mb-6 inline-block"
                >
                  <Badge className="bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 backdrop-blur-md border-cyan-300/50 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/20">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
                    {currentSlideData.badge}
                  </Badge>
                </motion.div>

                {/* Title with Stagger Animation */}
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight"
                >
                  {currentSlideData.title}
                </motion.h1>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.7 }}
                  className="text-base sm:text-lg md:text-xl mb-3 sm:mb-4 text-white/95 leading-relaxed"
                >
                  {currentSlideData.subtitle}
                </motion.p>

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.7 }}
                  className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-white/80 leading-relaxed"
                >
                  {currentSlideData.description}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.7 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white border-0 shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                    asChild
                  >
                    <Link href={currentSlideData.ctaLink}>
                      {currentSlideData.cta} <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Right Side - Stats Cards */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="hidden lg:flex flex-col gap-4 xl:gap-6"
              >
                {currentSlideData.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.15, type: "spring", stiffness: 150 }}
                    className="relative group"
                  >
                    {/* Glowing gradient background */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-75 blur transition-all duration-300" />
                    
                    {/* Card content */}
                    <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 xl:p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-white/30">
                      <div className="text-3xl xl:text-4xl 2xl:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
                        {stat.value}
                      </div>
                      <div className="text-base xl:text-lg text-white/90">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows with Enhanced Style */}
      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white p-2 sm:p-3 rounded-full transition-all duration-300 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
      </motion.button>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 sm:w-12 bg-white shadow-lg"
                : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/70 hover:w-6 sm:hover:w-8"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Stats - Show below fold */}
      {/* <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 z-30 lg:hidden px-4">
        <div className="flex gap-2 sm:gap-4 justify-center">
          {currentSlideData.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="relative flex-1 max-w-[120px] sm:max-w-none"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl opacity-60 blur" />
              
              <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-3 sm:px-6 py-2 sm:py-3 text-center">
                <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/90">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div> */}
    </section>
  )
}
