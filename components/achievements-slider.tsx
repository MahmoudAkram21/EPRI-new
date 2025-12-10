"use client"

import { useRef, useState, useEffect } from "react"
import { AnimatedCounter } from "@/components/animated-counter"
import { useInView } from "framer-motion"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { apiClient } from "@/lib/api"
import { useLocale } from "next-intl"

interface Achievement {
  title: string
  value: number
}

// Helper function to extract localized value
function getLocalizedValue(value: any, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || value.ar || ''
  }
  return ''
}

// Default achievements
const defaultAchievements: Achievement[] = [
  { title: "MSc Programs", value: 126 },
  { title: "PhD Programs", value: 40 },
  { title: "Higher Specialization Programs In Medicine And Dentistry", value: 22 },
  { title: "Higher Diploma", value: 8 },
  { title: "Certificate Programs", value: 15 },
]

export function AchievementsSlider() {
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const [achievements, setAchievements] = useState<Achievement[]>(defaultAchievements)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await apiClient.get('/home-content/achievements').catch(() => ({ content: null }))
        const content = response.content
        
        if (content?.content?.achievements && Array.isArray(content.content.achievements)) {
          const transformed = content.content.achievements.map((ach: any) => ({
            title: getLocalizedValue(ach.title, locale),
            value: ach.value || 0
          }))
          setAchievements(transformed)
        }
      } catch (error) {
        console.error('Error fetching achievements:', error)
        // Keep default achievements
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [locale])

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })] as any,
  )

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-primary/95">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 blur-md"
          style={{
            backgroundImage: `url('/conference-symposium.jpg')`,
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 lg:gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={achievement.title}
                className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-0.75rem)] lg:flex-[0_0_calc(33.333%-1rem)] min-w-0"
              >
                <AchievementItem 
                  achievement={achievement}
                  isInView={isInView}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AchievementItem({ achievement, isInView }: { achievement: Achievement; isInView: boolean }) {
  return (
    <div className="text-center">
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-white text-base sm:text-lg lg:text-xl font-semibold">
          {achievement.title.split(' ').length > 3 ? (
            <>
              {achievement.title.split(' ').slice(0, 3).join(' ')}
              <br />
              {achievement.title.split(' ').slice(3).join(' ')}
            </>
          ) : (
            achievement.title
          )}
        </h3>
        {/* Golden line */}
        <div className="w-16 h-0.5 bg-yellow-400 mx-auto mt-3"></div>
      </div>

      {/* Number */}
      <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">
        {isInView && <AnimatedCounter end={achievement.value} />}
        {!isInView && <span>0</span>}
      </div>
    </div>
  )
}

