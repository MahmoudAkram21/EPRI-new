"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Mail, 
  Share2,
  X,
  MessageCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SocialLink {
  name: string
  icon: JSX.Element
  url: string
  color: string
  hoverColor: string
}

interface SocialMediaButtonsProps {
  position?: "left" | "right"
  showLabels?: boolean
  className?: string
}

export function SocialMediaButtons({ 
  position = "right", 
  showLabels = false,
  className = ""
}: SocialMediaButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const socialLinks: SocialLink[] = [
    {
      name: "Facebook",
      icon: <Facebook className="h-8 w-8" />,
      url: "https://facebook.com/epri",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700"
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-8 w-8" />,
      url: "https://twitter.com/epri",
      color: "bg-sky-500",
      hoverColor: "hover:bg-sky-600"
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-8 w-8" />,
      url: "https://linkedin.com/company/epri",
      color: "bg-blue-700",
      hoverColor: "hover:bg-blue-800"
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-8 w-8" />,
      url: "https://instagram.com/epri",
      color: "bg-pink-600",
      hoverColor: "hover:bg-pink-700"
    },
    {
      name: "YouTube",
      icon: <Youtube className="h-8 w-8" />,
      url: "https://youtube.com/epri",
      color: "bg-red-600",
      hoverColor: "hover:bg-red-700"
    },
    {
      name: "Contact",
      icon: <Mail className="h-8 w-8" />,
      url: "/contact",
      color: "bg-gray-600",
      hoverColor: "hover:bg-gray-700"
    }
  ]

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const positionClasses = position === "left" 
    ? "left-6" 
    : "right-6"

  const expandDirection = position === "left" 
    ? "origin-bottom-left" 
    : "origin-bottom-right"

  return (
    <div className={`fixed bottom-6 ${positionClasses} z-40 ${className}`}>
      <div className="flex flex-col items-end gap-1">
        {/* Social Media Links */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ 
                duration: 0.3,
                type: "spring",
                damping: 20,
                stiffness: 300
              }}
              className={`flex flex-col gap-2 ${expandDirection}`}
            >
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, x: position === "left" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: position === "left" ? -20 : 20 }}
                  transition={{ 
                    delay: index * 0.05,
                    duration: 0.2
                  }}
                  className="group relative"
                >
                  <Button
                    asChild
                    size="sm"
                    className={`
                      h-12 w-12 p-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300
                      ${social.color} ${social.hoverColor} text-white
                      hover:scale-110 active:scale-95
                      border-2 border-white/20 hover:border-white/40
                    `}
                  >
                    <Link 
                      href={social.url}
                      target={social.url.startsWith('http') ? '_blank' : '_self'}
                      rel={social.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </Link>
                  </Button>
                  
                  {/* Tooltip - Always show, not dependent on showLabels prop */}
                  <div className={`
                    absolute ${position === "left" ? "left-14" : "right-14"} top-1/2 -translate-y-1/2
                    bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    pointer-events-none whitespace-nowrap shadow-lg z-50
                  `}>
                    {social.name}
                    <div className={`
                      absolute top-1/2 -translate-y-1/2 w-0 h-0
                      ${position === "left" 
                        ? "-left-1 border-r-4 border-r-gray-900 border-y-2 border-y-transparent" 
                        : "-right-1 border-l-4 border-l-gray-900 border-y-2 border-y-transparent"
                      }
                    `} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative pt-2"
        >
          <Button
            onClick={toggleExpanded}
            size="sm"
            className={`
              h-12 w-12 p-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300
              bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90
              text-white border-2 border-white/20 hover:border-white/40
              ${isExpanded ? 'rotate-45' : 'rotate-0'}
            `}
          >
            {isExpanded ? (
              <X className="h-5 w-5" />
            ) : (
              <Share2 className="h-5 w-5" />
            )}
          </Button>

          {/* Follow Us Tooltip for Main Button */}
          {!isExpanded && (
            <div className={`
              absolute ${position === "left" ? "left-14" : "right-14"} top-1/2 -translate-y-1/2
              bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
              pointer-events-none whitespace-nowrap shadow-lg z-50
            `}>
              Follow Us
              <div className={`
                absolute top-1/2 -translate-y-1/2 w-0 h-0
                ${position === "left" 
                  ? "-left-1 border-r-4 border-r-gray-900 border-y-2 border-y-transparent" 
                  : "-right-1 border-l-4 border-l-gray-900 border-y-2 border-y-transparent"
                }
              `} />
            </div>
          )}
        </motion.div>

        {/* Live Chat Button (Optional) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 group relative"
        >
          <Button
            asChild
            size="sm"
            className="
              h-12 w-12 p-0 rounded-full shadow-lg hover:shadow-xl transition-all duration-300
              bg-green-500 hover:bg-green-600 text-white
              hover:scale-110 active:scale-95
              border-2 border-white/20 hover:border-white/40
              animate-pulse hover:animate-none
            "
          >
            <Link href="/contact" aria-label="Live Chat">
              <MessageCircle className="h-4 w-4" />
            </Link>
          </Button>

          {/* Chat Tooltip */}
          <div className={`
            absolute ${position === "left" ? "left-14" : "right-14"} top-1/2 -translate-y-1/2
            bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
            pointer-events-none whitespace-nowrap shadow-lg z-50
          `}>
            Live Chat
            <div className={`
              absolute top-1/2 -translate-y-1/2 w-0 h-0
              ${position === "left" 
                ? "-left-1 border-r-4 border-r-gray-900 border-y-2 border-y-transparent" 
                : "-right-1 border-l-4 border-l-gray-900 border-y-2 border-y-transparent"
              }
            `} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}