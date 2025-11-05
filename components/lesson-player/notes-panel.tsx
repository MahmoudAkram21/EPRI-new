"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NotesPanelProps {
  courseId: string
  lessonId: string
}

export function NotesPanel({ courseId, lessonId }: NotesPanelProps) {
  const { getLessonNote, saveLessonNote } = useUser()
  const [note, setNote] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    setNote(getLessonNote(courseId, lessonId))
  }, [courseId, lessonId, getLessonNote])

  const handleSave = () => {
    saveLessonNote(courseId, lessonId, note)
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">My Notes</h3>
        <Button onClick={handleSave} size="sm" variant="outline">
          <Save className="h-4 w-4 mr-2" />
          Save Note
        </Button>
      </div>
      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Take notes about this lesson..."
        className="min-h-[200px]"
      />
    </div>
  )
}
