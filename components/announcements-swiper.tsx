"use client"

import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, Navigation } from "swiper/modules"
import { X, ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"

export interface Announcement {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "urgent"
  link?: {
    url: string
    text: string
  }
  startDate?: string // ISO date string
  endDate?: string // ISO date string
  daysToShow?: number // Number of days to show from creation
  createdAt: string // ISO date string
  priority: number // Higher number = higher priority
  isActive: boolean
}

interface AnnouncementsSwiperProps {
  announcements?: Announcement[]
  autoHide?: boolean // Whether to auto-hide expired announcements
  showCloseButton?: boolean // Whether to show close button for individual announcements
  className?: string
}

export function AnnouncementsSwiper({ 
  announcements = [], 
  autoHide = true,
  showCloseButton = true,
  className = ""
}: AnnouncementsSwiperProps) {
  const [visibleAnnouncements, setVisibleAnnouncements] = useState<Announcement[]>([])
  const [hiddenAnnouncementIds, setHiddenAnnouncementIds] = useState<Set<string>>(new Set())
  const [isVisible, setIsVisible] = useState(false)

  // Filter announcements based on time conditions
  const filterAnnouncementsByTime = (announcements: Announcement[]): Announcement[] => {
    if (!autoHide) return announcements.filter(a => a.isActive)

    const now = new Date()
    
    return announcements.filter(announcement => {
      if (!announcement.isActive) return false

      const createdAt = new Date(announcement.createdAt)
      
      // Check start date
      if (announcement.startDate) {
        const startDate = new Date(announcement.startDate)
        if (now < startDate) return false
      }
      
      // Check end date
      if (announcement.endDate) {
        const endDate = new Date(announcement.endDate)
        if (now > endDate) return false
      }
      
      // Check days to show
      if (announcement.daysToShow) {
        const expiryDate = new Date(createdAt)
        expiryDate.setDate(expiryDate.getDate() + announcement.daysToShow)
        if (now > expiryDate) return false
      }
      
      return true
    })
  }

  // Load hidden announcements from localStorage
  useEffect(() => {
    const hidden = localStorage.getItem('hiddenAnnouncements')
    if (hidden) {
      try {
        setHiddenAnnouncementIds(new Set(JSON.parse(hidden)))
      } catch (e) {
        console.error('Error loading hidden announcements:', e)
      }
    }
  }, [])

  // Filter and sort announcements
  useEffect(() => {
    const timeFiltered = filterAnnouncementsByTime(announcements)
    const activeAnnouncements = timeFiltered
      .filter(a => !hiddenAnnouncementIds.has(a.id))
      .sort((a, b) => b.priority - a.priority) // Sort by priority (highest first)
    
    setVisibleAnnouncements(activeAnnouncements)
    setIsVisible(activeAnnouncements.length > 0)
  }, [announcements, hiddenAnnouncementIds, autoHide])

  // Hide individual announcement
  const hideAnnouncement = (announcementId: string) => {
    const newHidden = new Set(hiddenAnnouncementIds)
    newHidden.add(announcementId)
    setHiddenAnnouncementIds(newHidden)
    
    // Save to localStorage
    localStorage.setItem('hiddenAnnouncements', JSON.stringify(Array.from(newHidden)))
  }

  // Hide all announcements
  const hideAllAnnouncements = () => {
    const allIds = new Set(visibleAnnouncements.map(a => a.id))
    setHiddenAnnouncementIds(prev => new Set([...prev, ...allIds]))
    
    // Save to localStorage
    localStorage.setItem('hiddenAnnouncements', JSON.stringify(Array.from(allIds)))
  }

  // Get announcement type styling
  const getAnnouncementStyle = (type: Announcement['type']) => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-white dark:bg-gray-900',
          border: 'border-gray-100 dark:border-gray-800',
          shadow: 'shadow-[0_2px_16px_rgba(239,68,68,0.08)] dark:shadow-[0_2px_16px_rgba(239,68,68,0.2)]',
          icon: <AlertCircle className="h-4 w-4 text-red-500" />,
          badge: 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
        }
      case 'warning':
        return {
          bg: 'bg-white dark:bg-gray-900',
          border: 'border-gray-100 dark:border-gray-800',
          shadow: 'shadow-[0_2px_16px_rgba(245,158,11,0.08)] dark:shadow-[0_2px_16px_rgba(245,158,11,0.2)]',
          icon: <AlertCircle className="h-4 w-4 text-amber-500" />,
          badge: 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
        }
      case 'success':
        return {
          bg: 'bg-white dark:bg-gray-900',
          border: 'border-gray-100 dark:border-gray-800',
          shadow: 'shadow-[0_2px_16px_rgba(34,197,94,0.08)] dark:shadow-[0_2px_16px_rgba(34,197,94,0.2)]',
          icon: <Clock className="h-4 w-4 text-green-500" />,
          badge: 'bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
        }
      default:
        return {
          bg: 'bg-white dark:bg-gray-900',
          border: 'border-gray-100 dark:border-gray-800',
          shadow: 'shadow-[0_2px_16px_rgba(59,130,246,0.08)] dark:shadow-[0_2px_16px_rgba(59,130,246,0.2)]',
          icon: <Clock className="h-4 w-4 text-blue-500" />,
          badge: 'bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
        }
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!isVisible || visibleAnnouncements.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`relative bg-gray-50/50 dark:bg-gray-900/50 ${className}`}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Announcements
              </h3>
              <Badge className="text-xs bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 rounded-full px-2 py-1">
                {visibleAnnouncements.length}
              </Badge>
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={hideAllAnnouncements}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Swiper */}
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-primary/30',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
            }}
            navigation={{
              prevEl: '.announcements-prev',
              nextEl: '.announcements-next',
            }}
            className="announcements-swiper"
          >
            {visibleAnnouncements.map((announcement) => {
              const style = getAnnouncementStyle(announcement.type)
              
              return (
                <SwiperSlide key={announcement.id}>
                  <Card className={`${style.bg} ${style.border} ${style.shadow} hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 group relative rounded-xl`}>
                    <CardContent className="px-5">
                      {/* Close button for individual announcement */}
                      {showCloseButton && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => hideAnnouncement(announcement.id)}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}

                      {/* Compact Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-shrink-0 p-1.5 rounded-full bg-gray-50 dark:bg-gray-800">
                          {style.icon}
                        </div>
                        <Badge className={`text-xs font-medium px-2 py-1 rounded-full ${style.badge}`} variant="outline">
                          {announcement.type.toUpperCase()}
                        </Badge>
                        {announcement.priority > 5 && (
                          <Badge className="text-xs font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800" variant="outline">
                            HIGH
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 leading-relaxed mb-4 pr-6">
                        {announcement.title}
                      </h4>

                      {/* Action Button */}
                      <div className="flex justify-end">
                        {announcement.link ? (
                          <Button
                            asChild
                            size="sm"
                            className="text-xs px-4 py-2 h-8 bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 rounded-full font-medium transition-colors"
                          >
                            <Link href={announcement.link.url}>
                              {announcement.link.text}
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="text-xs px-4 py-2 h-8 bg-gray-900 hover:bg-gray-800 text-white dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 rounded-full font-medium"
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}