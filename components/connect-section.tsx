"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api"
import { useLocale } from "next-intl"

// Helper function to extract localized value
function getLocalizedValue(value: any, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || value.ar || ''
  }
  return ''
}

interface InstagramPost {
  id: string
  image: string
  caption?: string
}

interface Tweet {
  id: string
  text: string
  author: string
  handle: string
  timestamp?: string
}

interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  description: string
  date: string
  url: string
}

// Mock data - replace with actual API calls
const instagramPosts: InstagramPost[] = [
  { id: "1", image: "/placeholder.svg", caption: "we compare" },
  { id: "2", image: "/placeholder.svg", caption: "" },
  { id: "3", image: "/placeholder.svg", caption: "Teams in action" },
  { id: "4", image: "/placeholder.svg", caption: "" },
  { id: "5", image: "/placeholder.svg", caption: "" },
  { id: "6", image: "/placeholder.svg", caption: "11.2" },
]

const tweets: Tweet[] = [
  {
    id: "1",
    text: "RT @AutonomousAD: انتهى الانتظار! كأس آسيا والمحيط الهادئ للروبوتات 2025 مع حفل افتتاح ملهم...",
    author: "KhalifaUni جامعة خليفة للعلوم والتكنولوجيا",
    handle: "@KhalifaUni",
    timestamp: "2h"
  },
  {
    id: "2",
    text: "RT @AutonomousAD: https://t.co/AdKNN9Jhfl",
    author: "KhalifaUni جامعة خليفة للعلوم والتكنولوجيا",
    handle: "@KhalifaUni",
    timestamp: "3h"
  },
  {
    id: "3",
    text: "RT @AutonomousAD: https://t.co/AdKNN9Jhfl",
    author: "KhalifaUni جامعة خليفة للعلوم والتكنولوجيا",
    handle: "@KhalifaUni",
    timestamp: "4h"
  },
  {
    id: "4",
    text: "RT @AutonomousAD: https://t.co/AdKNN9Jhfl",
    author: "KhalifaUni جامعة خليفة للعلوم والتكنولوجيا",
    handle: "@KhalifaUni",
    timestamp: "5h"
  },
]

const youtubeVideos: YouTubeVideo[] = [
  {
    id: "1",
    title: "Can Your Wearable Add Years to Your Life?",
    thumbnail: "/placeholder.svg",
    description: "Wearable devices do more than count steps, as they hold clues about your heart, sleep, and even your lifespan. In...",
    date: "November 17, 2025, 6:52 am",
    url: "#"
  },
]

export function ConnectSection() {
  const locale = useLocale()
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [homeContent, setHomeContent] = useState<any>(null)
  const [connectData, setConnectData] = useState<any>({
    instagramPosts,
    tweets,
    youtubeVideos
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get('/home-content/connect').catch(() => ({ content: null }))
        const content = response.content
        
        if (content) {
          setHomeContent(content)
          if (content.content) {
            setConnectData({
              instagramPosts: content.content.instagramPosts || instagramPosts,
              tweets: content.content.tweets || tweets,
              youtubeVideos: content.content.youtubeVideos || youtubeVideos
            })
          }
        }
      } catch (error) {
        console.error('Error fetching connect section:', error)
      }
    }

    fetchData()
  }, [])

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % connectData.youtubeVideos.length)
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + connectData.youtubeVideos.length) % connectData.youtubeVideos.length)
  }

  const currentVideo = connectData.youtubeVideos[currentVideoIndex]
  const sectionTitle = getLocalizedValue(homeContent?.title, locale) || "CONNECT"

  return (
    <div className="w-full bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {sectionTitle}
          </h2>
          <div className="w-24 h-1 bg-slate-900 dark:bg-slate-100"></div>
        </div>

        {/* Three Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Instagram Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">INSTAGRAM</h3>
            <div className="h-[500px] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-2">
                {connectData.instagramPosts.map((post: any) => (
                  <div
                    key={post.id}
                    className="relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 group cursor-pointer"
                  >
                    <img
                      src={post.image}
                      alt={post.caption || "Instagram post"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {post.caption && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium px-2 text-center">
                          {post.caption}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* X (Twitter) Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">X</h3>
            <div className="h-[500px] overflow-y-auto pr-2 space-y-0 border border-slate-200 dark:border-slate-700 rounded-lg">
              {connectData.tweets.map((tweet: any, index: number) => (
                <div
                  key={tweet.id}
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${
                    index < tweets.length - 1 ? "border-b border-slate-200 dark:border-slate-700" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Logo/Icon */}
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-6 h-6 bg-primary rounded"></div>
                    </div>
                    
                    {/* Tweet Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {tweet.author}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm">
                          {tweet.handle}
                        </span>
                        {tweet.timestamp && (
                          <span className="text-slate-400 dark:text-slate-500 text-xs">
                            · {tweet.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                        {tweet.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">YOUTUBE</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevVideo}
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </button>
                <button
                  onClick={nextVideo}
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center transition-colors"
                  aria-label="Next video"
                >
                  <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Video Thumbnail */}
              <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 group cursor-pointer">
                <img
                  src={currentVideo.thumbnail}
                  alt={currentVideo.title}
                  className="w-full h-full object-cover"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-8 w-8 text-slate-900 ml-1" fill="currentColor" />
                  </div>
                </div>
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-semibold text-sm">
                    Can Your <span className="text-yellow-400">Wearable</span> Add Years to Your Life?
                  </p>
                </div>
              </div>

              {/* Video Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  {currentVideo.title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {currentVideo.date}
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {currentVideo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

