'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, ArrowLeft, Play, FileText, HelpCircle, Clock, Eye, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { apiClient } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { useUser } from '@/contexts/user-context'

interface Lesson {
  id: string
  course_id: string
  title: string
  description?: string
  content?: string
  video_url?: string
  video_type: string
  video_id?: string
  duration: number
  order_index: number
  is_free: boolean
  is_preview: boolean
  attachments?: Array<{
    name: string
    url: string
    type: string
    size?: number
  }>
  quiz_data?: {
    questions: Array<{
      question: string
      options: string[]
      correct_answer: number
      explanation?: string
    }>
    passing_score?: number
    time_limit?: number
  }
  notes?: string
  created_at: string
  updated_at?: string
}

interface Course {
  id: string
  title: string | { en: string; ar: string }
}

const videoTypes = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'direct', label: 'Direct URL' },
  { value: 'none', label: 'No Video' }
]

// Helper function to extract localized value from Json field
const extractLocalizedValue = (value: any, locale: string = 'en'): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value !== null) {
    if (value[locale]) return value[locale]
    if (value.en) return value.en
    if (value.ar) return value.ar
    return JSON.stringify(value)
  }
  return String(value)
}

export default function DepartmentCourseLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const courseId = params.courseId as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    video_url: '',
    video_type: 'youtube',
    video_id: '',
    duration: 0,
    order_index: 0,
    is_free: false,
    is_preview: false,
    attachments: [{ name: '', url: '', type: '', size: 0 }],
    quiz_questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' }],
    quiz_passing_score: 70,
    quiz_time_limit: 0,
    notes: ''
  })

  useEffect(() => {
    // Check if user is department manager
    if (!user || user.role !== 'DEPARTMENT_MANAGER') {
      router.push('/dashboard')
      return
    }
    if (courseId) {
      fetchLessons()
    }
  }, [courseId, user, router])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAdminCourseLessons(courseId)
      setLessons(response.lessons || [])
      setCourse(response.course)
    } catch (error: any) {
      console.error('Error fetching lessons:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch lessons",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      video_url: '',
      video_type: 'youtube',
      video_id: '',
      duration: 0,
      order_index: lessons.length,
      is_free: false,
      is_preview: false,
      attachments: [{ name: '', url: '', type: '', size: 0 }],
      quiz_questions: [{ question: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' }],
      quiz_passing_score: 70,
      quiz_time_limit: 0,
      notes: ''
    })
    setEditingLesson(null)
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      video_url: lesson.video_url || '',
      video_type: lesson.video_type,
      video_id: lesson.video_id || '',
      duration: lesson.duration,
      order_index: lesson.order_index,
      is_free: lesson.is_free,
      is_preview: lesson.is_preview,
      attachments: lesson.attachments || [{ name: '', url: '', type: '', size: 0 }],
      quiz_questions: lesson.quiz_data?.questions || [
        { question: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' }
      ],
      quiz_passing_score: lesson.quiz_data?.passing_score || 70,
      quiz_time_limit: lesson.quiz_data?.time_limit || 0,
      notes: lesson.notes || ''
    })
    setShowCreateDialog(true)
  }

  const handleSubmit = async () => {
    try {
      if (!formData.title) {
        toast({
          title: "Validation Error",
          description: "Lesson title is required",
          variant: "destructive",
        })
        return
      }

      // Filter out empty attachments
      const attachments = formData.attachments.filter(att => att.name.trim() !== '' && att.url.trim() !== '')
      
      // Filter out empty quiz questions
      const quizQuestions = formData.quiz_questions.filter(q => q.question.trim() !== '')
      
      const lessonData = {
        title: formData.title,
        description: formData.description || undefined,
        content: formData.content || undefined,
        video_url: formData.video_url || undefined,
        video_type: formData.video_type,
        video_id: formData.video_id || undefined,
        duration: formData.duration,
        order_index: formData.order_index,
        is_free: formData.is_free,
        is_preview: formData.is_preview,
        attachments: attachments.length > 0 ? attachments : undefined,
        quiz_data: quizQuestions.length > 0 ? {
          questions: quizQuestions,
          passing_score: formData.quiz_passing_score,
          time_limit: formData.quiz_time_limit
        } : undefined,
        notes: formData.notes || undefined
      }

      if (editingLesson) {
        await apiClient.updateAdminLesson(editingLesson.id, lessonData)
        toast({
          title: "Success",
          description: "Lesson updated successfully",
        })
      } else {
        await apiClient.createAdminLesson(courseId, lessonData)
        toast({
          title: "Success",
          description: "Lesson created successfully",
        })
      }

      setShowCreateDialog(false)
      resetForm()
      fetchLessons()
    } catch (error: any) {
      console.error('Error saving lesson:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save lesson",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (lesson: Lesson) => {
    if (!confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
      return
    }

    try {
      await apiClient.deleteAdminLesson(lesson.id)
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      })
      fetchLessons()
    } catch (error: any) {
      console.error('Error deleting lesson:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete lesson",
        variant: "destructive",
      })
    }
  }

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.quiz_data?.questions && lesson.quiz_data.questions.length > 0) {
      return <HelpCircle className="h-4 w-4" />
    }
    if (lesson.video_url) {
      return <Play className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const getLessonType = (lesson: Lesson) => {
    if (lesson.quiz_data?.questions && lesson.quiz_data.questions.length > 0) {
      return 'Quiz'
    }
    if (lesson.video_url) {
      return 'Video'
    }
    return 'Article'
  }

  const addAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, { name: '', url: '', type: '', size: 0 }]
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const updateAttachment = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.map((att, i) => 
        i === index ? { ...att, [field]: value } : att
      )
    }))
  }

  const addQuizQuestion = () => {
    setFormData(prev => ({
      ...prev,
      quiz_questions: [...prev.quiz_questions, 
        { question: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' }
      ]
    }))
  }

  const removeQuizQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      quiz_questions: prev.quiz_questions.filter((_, i) => i !== index)
    }))
  }

  const updateQuizQuestion = (index: number, field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      quiz_questions: prev.quiz_questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }))
  }

  const updateQuizOption = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      quiz_questions: prev.quiz_questions.map((q, i) => 
        i === questionIndex ? {
          ...q,
          options: q.options.map((opt, j) => j === optionIndex ? value : opt)
        } : q
      )
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/department/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Course Lessons</h1>
            <p className="text-gray-600 mt-1">
              {course ? (typeof course.title === 'string' ? course.title : course.title.en || course.title.ar) : 'Loading...'} - Manage lessons and content
            </p>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
              </DialogTitle>
              <DialogDescription>
                {editingLesson ? 'Update lesson content' : 'Add a new lesson to the course'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Lesson title"
                  />
                </div>
                <div>
                  <Label htmlFor="order_index">Order Index</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Lesson description"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Lesson content (markdown supported)"
                  rows={4}
                />
              </div>

              {/* Video Section */}
              <div className="space-y-4">
                <h4 className="font-medium">Video Content</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="video_type">Video Type</Label>
                    <Select
                      value={formData.video_type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, video_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select video type" />
                      </SelectTrigger>
                      <SelectContent>
                        {videoTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                {formData.video_type !== 'none' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="video_url">Video URL</Label>
                      <Input
                        id="video_url"
                        value={formData.video_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                        placeholder="Full video URL"
                      />
                    </div>
                    <div>
                      <Label htmlFor="video_id">Video ID</Label>
                      <Input
                        id="video_id"
                        value={formData.video_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, video_id: e.target.value }))}
                        placeholder="Video ID (for YouTube/Vimeo)"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Attachments */}
              <div className="space-y-4">
                <h4 className="font-medium">Attachments</h4>
                {formData.attachments.map((attachment, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 items-end">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={attachment.name}
                        onChange={(e) => updateAttachment(index, 'name', e.target.value)}
                        placeholder="Attachment name"
                      />
                    </div>
                    <div>
                      <Label>URL</Label>
                      <Input
                        value={attachment.url}
                        onChange={(e) => updateAttachment(index, 'url', e.target.value)}
                        placeholder="Attachment URL"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Input
                        value={attachment.type}
                        onChange={(e) => updateAttachment(index, 'type', e.target.value)}
                        placeholder="pdf, doc, etc."
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                      disabled={formData.attachments.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttachment}
                >
                  Add Attachment
                </Button>
              </div>

              {/* Quiz Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Quiz Questions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Passing Score (%)</Label>
                      <Input
                        type="number"
                        value={formData.quiz_passing_score}
                        onChange={(e) => setFormData(prev => ({ ...prev, quiz_passing_score: parseInt(e.target.value) || 70 }))}
                        placeholder="70"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <Label>Time Limit (min)</Label>
                      <Input
                        type="number"
                        value={formData.quiz_time_limit}
                        onChange={(e) => setFormData(prev => ({ ...prev, quiz_time_limit: parseInt(e.target.value) || 0 }))}
                        placeholder="0 = unlimited"
                      />
                    </div>
                  </div>
                </div>
                
                {formData.quiz_questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="border p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">Question {questionIndex + 1}</h5>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeQuizQuestion(questionIndex)}
                        disabled={formData.quiz_questions.length === 1}
                      >
                        Remove Question
                      </Button>
                    </div>
                    
                    <div>
                      <Label>Question</Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuizQuestion(questionIndex, 'question', e.target.value)}
                        placeholder="Enter question"
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex}>
                          <Label>Option {optionIndex + 1}</Label>
                          <Input
                            value={option}
                            onChange={(e) => updateQuizOption(questionIndex, optionIndex, e.target.value)}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Correct Answer</Label>
                        <Select
                          value={question.correct_answer.toString()}
                          onValueChange={(value) => updateQuizQuestion(questionIndex, 'correct_answer', parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select correct answer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Option 1</SelectItem>
                            <SelectItem value="1">Option 2</SelectItem>
                            <SelectItem value="2">Option 3</SelectItem>
                            <SelectItem value="3">Option 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>Explanation (Optional)</Label>
                      <Textarea
                        value={question.explanation || ''}
                        onChange={(e) => updateQuizQuestion(questionIndex, 'explanation', e.target.value)}
                        placeholder="Explain the correct answer"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addQuizQuestion}
                >
                  Add Question
                </Button>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes for instructors"
                  rows={2}
                />
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Settings</h4>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_free"
                      checked={formData.is_free}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_free: checked }))}
                    />
                    <Label htmlFor="is_free">Free Lesson</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_preview"
                      checked={formData.is_preview}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_preview: checked }))}
                    />
                    <Label htmlFor="is_preview">Preview</Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingLesson ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Video Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.filter(l => l.video_url).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quiz Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.filter(l => l.quiz_data?.questions && l.quiz_data.questions.length > 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(lessons.reduce((sum, l) => sum + l.duration, 0) / 60)}h {lessons.reduce((sum, l) => sum + l.duration, 0) % 60}m
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons
          .sort((a, b) => a.order_index - b.order_index)
          .map((lesson, index) => (
          <Card key={lesson.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getLessonIcon(lesson)}
                        <span>{getLessonType(lesson)}</span>
                      </Badge>
                      {lesson.is_free && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Free
                        </Badge>
                      )}
                      {lesson.is_preview && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Preview
                        </Badge>
                      )}
                      {!lesson.is_free && !lesson.is_preview && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    {lesson.description && (
                      <CardDescription className="line-clamp-1">
                        {lesson.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.duration} minutes</span>
                  </div>
                  <div>Order: {lesson.order_index}</div>
                  {lesson.attachments && lesson.attachments.length > 0 && (
                    <div>{lesson.attachments.length} attachments</div>
                  )}
                  {lesson.quiz_data?.questions && lesson.quiz_data.questions.length > 0 && (
                    <div>{lesson.quiz_data.questions.length} quiz questions</div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(lesson)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(lesson)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first lesson for this course
          </p>
          <Button onClick={() => {
            resetForm()
            setShowCreateDialog(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Lesson
          </Button>
        </div>
      )}
    </div>
  )
}

