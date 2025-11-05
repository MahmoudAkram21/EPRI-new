"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  Clock,
  CheckCircle2,
  FileText,
  Download,
  X,
  Edit3,
  Save,
  BookOpen,
  ChevronRight
} from "lucide-react"

interface LessonPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  lesson: {
    id: string
    title: string
    description?: string
    duration: number
    is_free: boolean
    is_preview: boolean
  } | null
  courseTitle: string
  isEnrolled: boolean
}

export function LessonPlayerModal({ 
  isOpen, 
  onClose, 
  lesson, 
  courseTitle, 
  isEnrolled 
}: LessonPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(25) // Demo progress
  const [currentTime, setCurrentTime] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [notes, setNotes] = useState("")
  const [savedNotes, setSavedNotes] = useState("")
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("info")
  const [volume, setVolume] = useState(75)
  
  const { toast } = useToast()

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen || !lesson) return
    
    const canAccess = isEnrolled || lesson.is_free || lesson.is_preview
    if (!canAccess) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return // Don't interfere with textarea input
      
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          handlePlayPause()
          break
        case 'KeyM':
          e.preventDefault()
          handleVolumeToggle()
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
        case 'KeyN':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setActiveTab('notes')
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, lesson, isEnrolled, isPlaying, isMuted])

  if (!lesson) return null

  const canAccess = isEnrolled || lesson.is_free || lesson.is_preview
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const handlePlayPause = () => {
    const newPlayingState = !isPlaying
    setIsPlaying(newPlayingState)
    
    // Simulate video progress when playing
    if (newPlayingState && progress < 100) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = Math.min(prev + 1, 100)
          setCurrentTime(Math.floor((newProgress / 100) * lesson.duration * 60))
          
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            setIsPlaying(false)
            if (isEnrolled) {
              setIsCompleted(true)
              toast({
                title: "Lesson Completed! 🎉",
                description: "Great job! You've finished this lesson.",
              })
            }
          }
          return newProgress
        })
      }, 1000) // Update every second
      
      // Store interval ID to clear it when pausing
      setTimeout(() => {
        if (!isPlaying) clearInterval(progressInterval)
      }, 100)
    }
    
    toast({
      title: newPlayingState ? "Video Playing" : "Video Paused",
      description: `${lesson.title}`,
    })
  }

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted)
    toast({
      title: isMuted ? "Audio Unmuted" : "Audio Muted",
    })
  }

  const handleMarkComplete = () => {
    setIsCompleted(true)
    toast({
      title: "Lesson Completed! 🎉",
      description: "Great job! You've completed this lesson.",
    })
  }

  const handleSaveNotes = () => {
    setSavedNotes(notes)
    toast({
      title: "Notes Saved",
      description: "Your lesson notes have been saved successfully.",
    })
  }

  const handleNotesChange = (value: string) => {
    setNotes(value)
    
    // Clear existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }
    
    // Set new auto-save timer (save after 2 seconds of inactivity)
    const timer = setTimeout(() => {
      if (value.trim() && value !== savedNotes) {
        setIsAutoSaving(true)
        setSavedNotes(value)
        setTimeout(() => {
          setIsAutoSaving(false)
          toast({
            title: "Notes Auto-saved",
            description: "Your notes have been automatically saved.",
          })
        }, 500)
      }
    }, 2000)
    
    setAutoSaveTimer(timer)
  }

  const handleDownloadResource = (resourceName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${resourceName}...`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {courseTitle}
                  </Badge>
                  {lesson.is_preview && (
                    <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      Preview
                    </Badge>
                  )}
                  {lesson.is_free && (
                    <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
                      Free
                    </Badge>
                  )}
                </div>
                <DialogTitle className="text-xl font-semibold line-clamp-2">
                  {lesson.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(lesson.duration)}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Video Player Area */}
          <div className="flex-1 flex flex-col lg:flex-row">
            {/* Main Video Area */}
            <div className="flex-1 bg-black relative">
              {canAccess ? (
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* Mock Video Player */}
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center relative group">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                        {isPlaying ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8 ml-1" />
                        )}
                      </div>
                      <p className="text-lg font-medium mb-2">{lesson.title}</p>
                      <p className="text-sm text-gray-300">
                        {isPlaying ? 'Playing...' : 'Click to play lesson'}
                      </p>
                    </div>

                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="space-y-2">
                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 text-xs text-white">
                          <span>{formatTime(currentTime)}</span>
                          <Progress 
                            value={progress} 
                            className="flex-1 h-1 bg-white/20" 
                          />
                          <span>{formatTime(lesson.duration * 60)}</span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10 h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                handlePlayPause()
                              }}
                            >
                              {isPlaying ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10 h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleVolumeToggle()
                              }}
                            >
                              {isMuted ? (
                                <VolumeX className="h-4 w-4" />
                              ) : (
                                <Volume2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10 h-8 w-8"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/10 h-8 w-8"
                            >
                              <Maximize className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Click to play overlay */}
                    <div 
                      className="absolute inset-0 cursor-pointer"
                      onClick={handlePlayPause}
                    />
                  </div>
                </div>
              ) : (
                // Locked content
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                  <div className="text-center p-8 max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl mb-3">🔒 Premium Lesson</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      This lesson is part of our premium content. Enroll in the course to unlock all lessons and exclusive materials.
                    </p>
                    <div className="space-y-3">
                      <Button className="w-full" onClick={() => {
                        toast({
                          title: "Redirecting to Enrollment",
                          description: "Taking you to the course enrollment page...",
                        })
                        // In a real app, this would redirect to enrollment
                      }}>
                        Enroll Now - ${lesson.is_free ? 'Free' : '49'}
                      </Button>
                      <Button variant="outline" className="w-full" onClick={onClose}>
                        Browse Other Lessons
                      </Button>
                    </div>
                    
                    <div className="mt-6 p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        💡 Free preview lessons are available to help you get started
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar with tabs */}
            <div className="lg:w-80 border-l bg-muted/30">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 m-2">
                  <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
                  <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                  <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
                </TabsList>

                {/* Info Tab */}
                <TabsContent value="info" className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {/* Lesson Description */}
                  {lesson.description && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        About this lesson
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>
                  )}

                  {/* Lesson Progress (if enrolled) */}
                  {isEnrolled && (
                    <Card>
                      <CardContent className="px-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-sm">Your Progress</h3>
                          <Badge variant={isCompleted ? "default" : "secondary"}>
                            {isCompleted ? "Completed" : `${progress}%`}
                          </Badge>
                        </div>
                        <Progress value={progress} className="h-2 mb-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(lesson.duration * 60)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    {isEnrolled && !isCompleted && (
                      <Button className="w-full" onClick={handleMarkComplete}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </Button>
                    )}
                    {isCompleted && (
                      <div className="flex items-center justify-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          Lesson Completed!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Next Lesson */}
                  <Card className="bg-primary/5 border-primary/10">
                    <CardContent className="px-4">
                      <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                        <ChevronRight className="h-3 w-3" />
                        Up Next
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Introduction to Petroleum Economics
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Continue Learning
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notes Tab */}
                <TabsContent value="notes" className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Edit3 className="h-4 w-4" />
                        Lesson Notes
                      </h3>
                      <div className="flex items-center gap-2">
                        {isAutoSaving && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            Saving...
                          </span>
                        )}
                        {notes !== savedNotes && notes.trim() && !isAutoSaving && (
                          <Button size="sm" onClick={handleSaveNotes}>
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <Textarea
                      placeholder="Take notes about this lesson..."
                      value={notes}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    
                    {savedNotes && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        Notes saved successfully
                      </div>
                    )}

                    <Card className="bg-muted/30">
                      <CardContent className="px-3">
                        <h4 className="text-xs font-medium mb-2">💡 Keyboard Shortcuts</h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Play/Pause:</span>
                            <code className="bg-muted px-1 rounded">Space</code>
                          </div>
                          <div className="flex justify-between">
                            <span>Mute/Unmute:</span>
                            <code className="bg-muted px-1 rounded">M</code>
                          </div>
                          <div className="flex justify-between">
                            <span>Notes:</span>
                            <code className="bg-muted px-1 rounded">Ctrl+N</code>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Downloads
                    </h3>
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => handleDownloadResource("Lesson Notes (PDF)")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Lesson Notes (PDF)
                        <span className="ml-auto text-xs text-muted-foreground">2.1 MB</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => handleDownloadResource("Exercise Files")}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Exercise Files
                        <span className="ml-auto text-xs text-muted-foreground">1.5 MB</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start"
                        onClick={() => handleDownloadResource("Presentation Slides")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Presentation Slides
                        <span className="ml-auto text-xs text-muted-foreground">3.2 MB</span>
                      </Button>
                    </div>
                  </div>

                  {!isEnrolled && (
                    <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                      <CardContent className="px-4">
                        <h4 className="font-medium text-sm mb-2 text-amber-800 dark:text-amber-200">
                          🔒 Premium Resources
                        </h4>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
                          Enroll in this course to access all downloadable resources
                        </p>
                        <Button size="sm" className="w-full">
                          Enroll Now
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}