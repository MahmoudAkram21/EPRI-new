"use client"

import { Card } from "@/components/ui/card"
import { BookOpen, Clock, Target } from "lucide-react"

interface LessonOverviewProps {
  title: string
  description: string
  duration: string
  objectives?: string[]
}

export function LessonOverview({ title, description, duration, objectives }: LessonOverviewProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="text-sm">{duration}</span>
        </div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          About This Lesson
        </h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </Card>

      {objectives && objectives.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Objectives
          </h3>
          <ul className="space-y-3">
            {objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">{index + 1}</span>
                </div>
                <span className="text-muted-foreground leading-relaxed">{objective}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
