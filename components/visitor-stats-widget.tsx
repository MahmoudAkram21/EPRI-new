"use client"

import { useEffect, useState } from "react"
import { Eye, Users, TrendingUp } from "lucide-react"
import { useVisitTracker } from "@/hooks/use-visit-tracker"

interface VisitorStats {
  totalVisits: number
  uniqueSessions: number
  since?: string
  lastUpdated: string
}

export function VisitorStatsWidget() {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  
  // Use the visit tracker hook to handle all visit tracking
  useVisitTracker({ enabled: true })

  // Fetch visitor statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total stats
        // const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/visitor-stats/stats`)
        const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://epri.developteam.site:5000'}/api/visitor-stats/stats`)
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          if (statsData.success) {
            setStats(statsData.data)
          } else {
            console.warn('API returned unsuccessful response:', statsData)
          }
        } else {
          console.warn('Failed to fetch stats, server responded with:', statsResponse.status)
        }
      } catch (error) {
        console.error('Failed to fetch visitor stats:', error)
        // Set default stats to prevent loading forever
        setStats({
          totalVisits: 0,
          uniqueSessions: 0,
          since: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        })
      }
    }

    fetchStats()

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) {
    return (
      <div>
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Site Statistics
        </h4>
        <div className="space-y-3 animate-pulse">
          <div className="bg-muted rounded-lg p-3">
            <div className="h-3 bg-muted-foreground/20 rounded mb-2"></div>
            <div className="h-5 bg-muted-foreground/20 rounded"></div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="h-3 bg-muted-foreground/20 rounded mb-2"></div>
            <div className="h-5 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h4 className="font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="h-4 w-4" />
        Site Statistics
      </h4>
      
      <div className="space-y-3">
        {/* Total Visits */}
        <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-lg p-3 border border-emerald-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-muted-foreground">Total Visits</span>
          </div>
          <div className="text-lg font-bold text-emerald-600">
            {stats.totalVisits.toLocaleString()}
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-lg p-3 border border-cyan-500/30">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-cyan-500" />
            <span className="text-xs font-medium text-muted-foreground">Unique Visitors</span>
          </div>
          <div className="text-lg font-bold text-cyan-600">
            {stats.uniqueSessions.toLocaleString()}
          </div>
        </div>

        {/* Live Status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>Since {new Date(stats.since || stats.lastUpdated).toLocaleDateString()}</span>
          <span className="flex items-center gap-1 text-green-500">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            Live
          </span>
        </div>
      </div>
    </div>
  )
}