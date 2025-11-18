"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { AnimatedCounter } from "@/components/animated-counter"
import { useInView } from "framer-motion"

interface Achievement {
  title: string
  value: number
}

const achievements: Achievement[] = [
  { title: "MSc Programs", value: 126 },
  { title: "PhD Programs", value: 40 },
  { title: "Higher Specialization Programs In Medicine And Dentistry", value: 22 },
  { title: "Higher Diploma", value: 8 },
  { title: "Certificate Programs", value: 15 }, // Added 5th item
]

export function AchievementsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerPage = 5
  const totalPages = Math.ceil(achievements.length / itemsPerPage)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }, [totalPages])

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [goToNext])

  const currentAchievements = achievements.slice(
    currentIndex * itemsPerPage,
    currentIndex * itemsPerPage + itemsPerPage
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {currentAchievements.map((achievement, index) => (
            <AchievementItem 
              key={`${achievement.title}-${currentIndex}`} 
              achievement={achievement}
              isInView={isInView}
            />
          ))}
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

