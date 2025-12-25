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
    },
    {
      name: "WhatsApp",
      icon: (
        <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      url: "https://wa.me/201201123333",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
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

        {/* WhatsApp Button */}
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
            <Link 
              href="https://wa.me/201201123333" 
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </Link>
          </Button>

          {/* WhatsApp Tooltip */}
          <div className={`
            absolute ${position === "left" ? "left-14" : "right-14"} top-1/2 -translate-y-1/2
            bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full
            opacity-0 group-hover:opacity-100 transition-opacity duration-300
            pointer-events-none whitespace-nowrap shadow-lg z-50
          `}>
            WhatsApp
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