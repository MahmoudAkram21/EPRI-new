"use client"

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface UseVisitTrackerOptions {
  enabled?: boolean
  apiUrl?: string
}

export function useVisitTracker(options: UseVisitTrackerOptions = {}) {
  const { enabled = true, apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002' } = options
  const pathname = usePathname()
  const sessionIdRef = useRef<string>('')
  const lastTrackedPathRef = useRef<string>('')

  // Initialize session ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let storedSessionId = localStorage.getItem('epri_session_id')
      if (!storedSessionId) {
        storedSessionId = 'sess_' + Date.now().toString(36) + Math.random().toString(36).substr(2)
        localStorage.setItem('epri_session_id', storedSessionId)
      }
      sessionIdRef.current = storedSessionId
    }
  }, [])

  // Track page visits
  useEffect(() => {
    if (!enabled || !sessionIdRef.current || !pathname) return
    
    // Avoid tracking the same path twice in a row
    if (lastTrackedPathRef.current === pathname) return
    
    const trackVisit = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/visitor-stats/track`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            pagePath: pathname
          })
        })

        if (response.ok) {
          console.log(`Visit tracked successfully for: ${pathname}`)
          lastTrackedPathRef.current = pathname
        } else {
          console.warn('Failed to track visit, server responded with:', response.status)
        }
      } catch (error) {
        console.error('Failed to track visit:', error)
      }
    }

    // Small delay to ensure page has loaded
    const timeoutId = setTimeout(trackVisit, 100)
    return () => clearTimeout(timeoutId)
  }, [pathname, enabled, apiUrl])

  return {
    sessionId: sessionIdRef.current,
    currentPath: pathname
  }
}