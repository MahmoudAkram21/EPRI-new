"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DecorativeShapes } from "./decorative-shapes"

type MediaType = "image" | "video"

interface Slide {
  id: number
  mediaType: MediaType
  mediaUrl: string
  staticText: string
  typewriterPhrases: string[]
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  quote?: string
  quoteAuthor?: string
}

const slides: Slide[] = [
  {
    id: 1,
    mediaType: "image",
    mediaUrl: "/petroleum-lab-testing.jpg",
    staticText: "Dream. Big.",
    typewriterPhrases: [
      "Innovation in Petroleum Research",
      "Excellence in Energy Solutions",
      "Advancing Technology & Science",
    ],
    subtitle: "Made to Captivate your Audience",
    ctaText: "ABOUT US",
    ctaLink: "/about",
    secondaryCtaText: "CONTACT",
    secondaryCtaLink: "/contact",
    quote: "It Always Seems Impossible Until its Done.",
    quoteAuthor: "Nelson Mandela",
  },
  {
    id: 2,
    mediaType: "image",
    mediaUrl: "/conference-symposium.jpg",
    staticText: "Web Agency",
    typewriterPhrases: [
      "Dedicated. Inspired. Passionate.",
      "Creating Digital Excellence",
      "Transforming Ideas into Reality",
    ],
    subtitle: "Building the Future of Digital Innovation",
    ctaText: "OUR SERVICES",
    ctaLink: "/services",
    secondaryCtaText: "VIEW PORTFOLIO",
    secondaryCtaLink: "/projects",
  },
  {
    id: 3,
    mediaType: "video",
    mediaUrl: "https://www.sliderrevolution.com/wp-content/uploads/revslider/Dancing-Bulbs.mp4", // Example video URL - replace with your video
    staticText: "Leading the Way",
    typewriterPhrases: [
      "In Research & Development",
      "In Energy Innovation",
      "In Scientific Excellence",
    ],
    subtitle: "Pioneering the Future of Petroleum Science",
    ctaText: "EXPLORE RESEARCH",
    ctaLink: "/research",
    secondaryCtaText: "LEARN MORE",
    secondaryCtaLink: "/about",
  },
]

export function TypewriterHero() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)

  const currentSlide = slides[currentSlideIndex]

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
    // Reset typewriter when slide changes
    setDisplayText("")
    setCurrentPhraseIndex(0)
    setIsDeleting(false)
    setTypingSpeed(100)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
    // Reset typewriter when slide changes
    setDisplayText("")
    setCurrentPhraseIndex(0)
    setIsDeleting(false)
    setTypingSpeed(100)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index)
    // Reset typewriter when slide changes
    setDisplayText("")
    setCurrentPhraseIndex(0)
    setIsDeleting(false)
    setTypingSpeed(100)
  }, [])

  // Auto-advance slides
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 8000) // Change slide every 8 seconds
      return () => clearInterval(interval)
    }
  }, [isPaused, nextSlide])

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = currentSlide.typewriterPhrases[currentPhraseIndex]
    if (!currentPhrase) return

    const currentLength = displayText.length

    if (!isDeleting && currentLength < currentPhrase.length) {
      // Typing forward
      const timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, currentLength + 1))
        setTypingSpeed(100)
      }, typingSpeed)
      return () => clearTimeout(timeout)
    } else if (!isDeleting && currentLength === currentPhrase.length) {
      // Finished typing, wait before deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true)
        setTypingSpeed(50)
      }, 2000)
      return () => clearTimeout(timeout)
    } else if (isDeleting && currentLength > 0) {
      // Deleting
      const timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, currentLength - 1))
        setTypingSpeed(50)
      }, typingSpeed)
      return () => clearTimeout(timeout)
    } else if (isDeleting && currentLength === 0) {
      // Finished deleting, move to next phrase
      setIsDeleting(false)
      setCurrentPhraseIndex((prev) => (prev + 1) % currentSlide.typewriterPhrases.length)
      setTypingSpeed(100)
    }
  }, [displayText, isDeleting, currentPhraseIndex, typingSpeed, currentSlide.typewriterPhrases])

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Media (Image or Video) */}
          <div className="absolute inset-0">
            {currentSlide.mediaType === "video" ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={currentSlide.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={currentSlide.mediaUrl || "/placeholder.svg"}
                alt={currentSlide.staticText}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/75 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />

          {/* Decorative Shapes */}
          <div className="absolute inset-0 z-[15]">
            <DecorativeShapes />
          </div>

          {/* Content Container */}
          <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-4xl mx-auto text-center w-full">
              {/* Main Heading with Typewriter Effect */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                  <span className="block mb-2">{currentSlide.staticText}</span>
                  <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl min-h-[1.2em]">
                    {displayText}
                    <span className="inline-block w-0.5 h-[1em] bg-white ml-1 animate-pulse">|</span>
                  </span>
                </h1>
              </motion.div>

              {/* Subtitle */}
              {currentSlide.subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
                >
                  {currentSlide.subtitle}
                </motion.p>
              )}

              {/* CTA Buttons */}
              {(currentSlide.ctaText || currentSlide.secondaryCtaText) && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  {currentSlide.ctaText && currentSlide.ctaLink && (
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white border-0 shadow-xl shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-600/50 transition-all duration-300 hover:scale-105 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                      asChild
                    >
                      <Link href={currentSlide.ctaLink}>
                        {currentSlide.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  )}
                  {currentSlide.secondaryCtaText && currentSlide.secondaryCtaLink && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
                      asChild
                    >
                      <Link href={currentSlide.secondaryCtaLink}>
                        {currentSlide.secondaryCtaText}
                      </Link>
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Quote Section */}
              {currentSlide.quote && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-12 sm:mt-16 md:mt-20"
                >
                  <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-white/80 mb-2">
                    "{currentSlide.quote}"
                  </p>
                  {currentSlide.quoteAuthor && (
                    <p className="text-base sm:text-lg text-white/70">
                      — {currentSlide.quoteAuthor}
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
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

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlideIndex
                ? "w-8 sm:w-12 bg-white shadow-lg"
                : "w-2 sm:w-2.5 bg-white/40 hover:bg-white/70 hover:w-6 sm:hover:w-8"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
