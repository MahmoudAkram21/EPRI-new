"use client"

import { useVisitTracker } from "@/hooks/use-visit-tracker"

export function VisitTrackerProvider() {
  // This component uses the visit tracker hook to track all page visits
  useVisitTracker({ enabled: true })
  
  // This component renders nothing, it just provides the tracking functionality
  return null
}