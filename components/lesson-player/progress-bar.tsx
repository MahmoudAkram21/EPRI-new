"use client"

interface ProgressBarProps {
  progress: number
  courseTitle: string
}

export function ProgressBar({ progress, courseTitle }: ProgressBarProps) {
  return (
    <div className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-semibold text-sm truncate">{courseTitle}</h1>
          <span className="text-sm font-medium">{progress}% Complete</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
