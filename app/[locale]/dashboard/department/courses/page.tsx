'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Plus, Search, Filter, BookOpen, Users, Clock, MapPin, Video, Building, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { apiClient } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { useUser } from '@/contexts/user-context'
import Link from 'next/link'

interface Course {
  id: string
  title: string | { en: string; ar: string }
  subtitle?: string | { en: string; ar: string }
  description?: string | { en: string; ar: string }
  image?: string
  instructor_name?: string | { en: string; ar: string }
  category: string | { en: string; ar: string }
  price: number
  is_free: boolean
  duration_hours: number
  duration_weeks: number
  level: string | { en: string; ar: string }
  language: string | { en: string; ar: string }
  max_students: number
  is_published: boolean
  is_featured: boolean
  delivery_type: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  meeting_location?: string | { en: string; ar: string }
  room_number?: string
  building?: string
  address?: string
  zoom_link?: string
  meeting_id?: string
  meeting_passcode?: string
  platform?: string
  start_date?: string
  end_date?: string
  schedule_info?: string | { en: string; ar: string }
  time_zone: string
  objectives?: string[]
  requirements?: string[]
  lessons_count: number
  total_duration: number
  enrollment_count: number
  rating_average: number
  rating_count: number
  created_at: string
  updated_at?: string
}

const categories = [
  'Petroleum Engineering',
  'Geology',
  'Geophysics',
  'Drilling Engineering',
  'Reservoir Engineering',
  'Production Technology',
  'Chemical Analysis',
  'Refining',
  'Other'
]

const levels = [
  'BEGINNER',
  'INTERMEDIATE', 
  'ADVANCED'
]

const deliveryTypes = [
  { value: 'ONLINE', label: 'Online' },
  { value: 'OFFLINE', label: 'Offline' },
  { value: 'HYBRID', label: 'Hybrid' }
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

export default function DepartmentCoursesPage() {
  const locale = useLocale()
  const router = useRouter()
  const { user } = useUser()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [deliveryFilter, setDeliveryFilter] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    instructor_name: '',
    category: '',
    price: 0,
    is_free: false,
    duration_hours: 0,
    duration_weeks: 0,
    level: '',
    language: 'English',
    max_students: 50,
    is_published: false,
    is_featured: false,
    delivery_type: 'ONLINE' as 'ONLINE' | 'OFFLINE' | 'HYBRID',
    meeting_location: '',
    room_number: '',
    building: '',
    address: '',
    zoom_link: '',
    meeting_id: '',
    meeting_passcode: '',
    platform: '',
    start_date: '',
    end_date: '',
    schedule_info: '',
    time_zone: 'UTC',
    objectives: [''],
    requirements: ['']
  })

  useEffect(() => {
    // Check if user is department manager
    if (!user || user.role !== 'DEPARTMENT_MANAGER') {
      router.push('/dashboard')
      return
    }
    fetchCourses()
  }, [user, router])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, categoryFilter, levelFilter, deliveryFilter, locale])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAdminCourses()
      setCourses(response.courses || [])
    } catch (error: any) {
      console.error('Error fetching courses:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to fetch courses",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = courses

    if (searchTerm) {
      filtered = filtered.filter(course => {
        const title = extractLocalizedValue(course.title, locale as string)
        const description = extractLocalizedValue(course.description, locale as string)
        const instructorName = extractLocalizedValue(course.instructor_name, locale as string)
        return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructorName?.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => {
        const category = extractLocalizedValue(course.category, locale as string)
        return category === categoryFilter
      })
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(course => {
        const level = extractLocalizedValue(course.level, locale as string)
        return level === levelFilter
      })
    }

    if (deliveryFilter !== 'all') {
      filtered = filtered.filter(course => course.delivery_type === deliveryFilter)
    }

    setFilteredCourses(filtered)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      instructor_name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : '',
      category: '',
      price: 0,
      is_free: false,
      duration_hours: 0,
      duration_weeks: 0,
      level: '',
      language: 'English',
      max_students: 50,
      is_published: false,
      is_featured: false,
      delivery_type: 'ONLINE',
      meeting_location: '',
      room_number: '',
      building: '',
      address: '',
      zoom_link: '',
      meeting_id: '',
      meeting_passcode: '',
      platform: '',
      start_date: '',
      end_date: '',
      schedule_info: '',
      time_zone: 'UTC',
      objectives: [''],
      requirements: ['']
    })
    setEditingCourse(null)
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: extractLocalizedValue(course.title, locale as string),
      subtitle: extractLocalizedValue(course.subtitle, locale as string) || '',
      description: extractLocalizedValue(course.description, locale as string) || '',
      image: course.image || '',
      instructor_name: extractLocalizedValue(course.instructor_name, locale as string) || '',
      category: extractLocalizedValue(course.category, locale as string),
      price: course.price,
      is_free: course.is_free,
      duration_hours: course.duration_hours,
      duration_weeks: course.duration_weeks,
      level: extractLocalizedValue(course.level, locale as string),
      language: extractLocalizedValue(course.language, locale as string),
      max_students: course.max_students,
      is_published: course.is_published,
      is_featured: course.is_featured,
      delivery_type: course.delivery_type,
      meeting_location: extractLocalizedValue(course.meeting_location, locale as string) || '',
      room_number: course.room_number || '',
      building: course.building || '',
      address: course.address || '',
      zoom_link: course.zoom_link || '',
      meeting_id: course.meeting_id || '',
      meeting_passcode: course.meeting_passcode || '',
      platform: course.platform || '',
      start_date: course.start_date ? course.start_date.split('T')[0] : '',
      end_date: course.end_date ? course.end_date.split('T')[0] : '',
      schedule_info: extractLocalizedValue(course.schedule_info, locale as string) || '',
      time_zone: course.time_zone,
      objectives: course.objectives && course.objectives.length > 0 ? course.objectives : [''],
      requirements: course.requirements && course.requirements.length > 0 ? course.requirements : ['']
    })
    setShowCreateDialog(true)
  }

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.category || !formData.level || !formData.delivery_type) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Filter out empty objectives and requirements
      const objectives = formData.objectives.filter(obj => obj.trim() !== '')
      const requirements = formData.requirements.filter(req => req.trim() !== '')

      // Build multilingual title, subtitle, and description
      const buildMultilingual = (value: string): { en: string; ar: string } => {
        // For now, use the same value for both languages
        // In a real scenario, you'd have separate inputs for EN and AR
        return { en: value, ar: value }
      }

      const courseData = {
        title: buildMultilingual(formData.title),
        subtitle: formData.subtitle ? buildMultilingual(formData.subtitle) : undefined,
        description: formData.description ? buildMultilingual(formData.description) : undefined,
        image: formData.image || undefined,
        instructor_name: formData.instructor_name || undefined,
        category: formData.category,
        price: formData.price,
        is_free: formData.is_free,
        duration_hours: formData.duration_hours,
        duration_weeks: formData.duration_weeks,
        level: formData.level,
        language: formData.language,
        max_students: formData.max_students,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        delivery_type: formData.delivery_type,
        meeting_location: formData.meeting_location || undefined,
        room_number: formData.room_number || undefined,
        building: formData.building || undefined,
        address: formData.address || undefined,
        zoom_link: formData.zoom_link || undefined,
        meeting_id: formData.meeting_id || undefined,
        meeting_passcode: formData.meeting_passcode || undefined,
        platform: formData.platform || undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        schedule_info: formData.schedule_info || undefined,
        time_zone: formData.time_zone,
        objectives: objectives.length > 0 ? objectives : undefined,
        requirements: requirements.length > 0 ? requirements : undefined
      }

      if (editingCourse) {
        await apiClient.updateAdminCourse(editingCourse.id, courseData)
        toast({
          title: "Success",
          description: "Course updated successfully",
        })
      } else {
        await apiClient.createAdminCourse(courseData)
        toast({
          title: "Success", 
          description: "Course created successfully",
        })
      }

      setShowCreateDialog(false)
      resetForm()
      fetchCourses()
    } catch (error: any) {
      console.error('Error saving course:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save course",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (course: Course) => {
    const courseTitle = extractLocalizedValue(course.title, locale as string)
    if (!confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      return
    }

    try {
      await apiClient.deleteAdminCourse(course.id)
      toast({
        title: "Success",
        description: "Course deleted successfully",
      })
      fetchCourses()
    } catch (error: any) {
      console.error('Error deleting course:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete course",
        variant: "destructive",
      })
    }
  }

  const getDeliveryIcon = (type: string) => {
    switch (type) {
      case 'ONLINE':
        return <Video className="h-4 w-4" />
      case 'OFFLINE': 
        return <Building className="h-4 w-4" />
      case 'HYBRID':
        return <MapPin className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getDeliveryColor = (type: string) => {
    switch (type) {
      case 'ONLINE':
        return 'bg-blue-100 text-blue-800'
      case 'OFFLINE':
        return 'bg-green-100 text-green-800'
      case 'HYBRID':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }))
  }

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }))
  }

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  const updateRequirement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
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
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/department">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Department Courses</h1>
            <p className="text-gray-600 mt-2">Manage your department's courses and lessons</p>
          </div>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Update course information' : 'Add a new course to your department'}
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
                    placeholder="Course title"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Course subtitle"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Course description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Course image URL"
                  />
                </div>
                <div>
                  <Label htmlFor="instructor_name">Instructor Name</Label>
                  <Input
                    id="instructor_name"
                    value={formData.instructor_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructor_name: e.target.value }))}
                    placeholder="Instructor name"
                  />
                </div>
              </div>

              {/* Course Details */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="delivery_type">Delivery Type *</Label>
                  <Select
                    value={formData.delivery_type}
                    onValueChange={(value: 'ONLINE' | 'OFFLINE' | 'HYBRID') => setFormData(prev => ({ ...prev, delivery_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing and Duration */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="duration_hours">Duration (Hours)</Label>
                  <Input
                    id="duration_hours"
                    type="number"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="duration_weeks">Duration (Weeks)</Label>
                  <Input
                    id="duration_weeks"
                    type="number"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_weeks: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="max_students">Max Students</Label>
                  <Input
                    id="max_students"
                    type="number"
                    value={formData.max_students}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_students: parseInt(e.target.value) || 50 }))}
                    placeholder="50"
                  />
                </div>
              </div>

              {/* Delivery-specific fields */}
              {(formData.delivery_type === 'OFFLINE' || formData.delivery_type === 'HYBRID') && (
                <div className="space-y-4">
                  <h4 className="font-medium">Physical Location Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="meeting_location">Meeting Location</Label>
                      <Input
                        id="meeting_location"
                        value={formData.meeting_location}
                        onChange={(e) => setFormData(prev => ({ ...prev, meeting_location: e.target.value }))}
                        placeholder="Building or location name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="room_number">Room Number</Label>
                      <Input
                        id="room_number"
                        value={formData.room_number}
                        onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                        placeholder="Room number"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="building">Building</Label>
                      <Input
                        id="building"
                        value={formData.building}
                        onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                        placeholder="Building name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Full address"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(formData.delivery_type === 'ONLINE' || formData.delivery_type === 'HYBRID') && (
                <div className="space-y-4">
                  <h4 className="font-medium">Online Meeting Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zoom_link">Meeting Link</Label>
                      <Input
                        id="zoom_link"
                        value={formData.zoom_link}
                        onChange={(e) => setFormData(prev => ({ ...prev, zoom_link: e.target.value }))}
                        placeholder="Zoom/Teams/Meet link"
                      />
                    </div>
                    <div>
                      <Label htmlFor="platform">Platform</Label>
                      <Input
                        id="platform"
                        value={formData.platform}
                        onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                        placeholder="Zoom, Teams, etc."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="meeting_id">Meeting ID</Label>
                      <Input
                        id="meeting_id"
                        value={formData.meeting_id}
                        onChange={(e) => setFormData(prev => ({ ...prev, meeting_id: e.target.value }))}
                        placeholder="Meeting ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="meeting_passcode">Meeting Passcode</Label>
                      <Input
                        id="meeting_passcode"
                        value={formData.meeting_passcode}
                        onChange={(e) => setFormData(prev => ({ ...prev, meeting_passcode: e.target.value }))}
                        placeholder="Meeting passcode"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule */}
              <div className="space-y-4">
                <h4 className="font-medium">Schedule</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_date">End Date</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time_zone">Time Zone</Label>
                    <Input
                      id="time_zone"
                      value={formData.time_zone}
                      onChange={(e) => setFormData(prev => ({ ...prev, time_zone: e.target.value }))}
                      placeholder="UTC, EST, etc."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="schedule_info">Schedule Information</Label>
                  <Textarea
                    id="schedule_info"
                    value={formData.schedule_info}
                    onChange={(e) => setFormData(prev => ({ ...prev, schedule_info: e.target.value }))}
                    placeholder="Detailed schedule information"
                    rows={2}
                  />
                </div>
              </div>

              {/* Objectives */}
              <div>
                <Label>Learning Objectives</Label>
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      placeholder="Learning objective"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeObjective(index)}
                      disabled={formData.objectives.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addObjective}
                  className="mt-2"
                >
                  Add Objective
                </Button>
              </div>

              {/* Requirements */}
              <div>
                <Label>Requirements</Label>
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      value={requirement}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="Course requirement"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                      disabled={formData.requirements.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="mt-2"
                >
                  Add Requirement
                </Button>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Settings</h4>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_free"
                      checked={formData.is_free}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_free: checked }))}
                    />
                    <Label htmlFor="is_free">Free Course</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                    />
                    <Label htmlFor="is_published">Published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map(level => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Delivery" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {deliveryTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter(c => c.is_published).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.filter(c => c.is_featured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.reduce((sum, c) => sum + c.enrollment_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getDeliveryColor(course.delivery_type)}>
                      {getDeliveryIcon(course.delivery_type)}
                      <span className="ml-1">{course.delivery_type}</span>
                    </Badge>
                    <Badge variant="outline">{extractLocalizedValue(course.level, locale as string)}</Badge>
                    <Badge variant="outline">{extractLocalizedValue(course.category, locale as string)}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{extractLocalizedValue(course.title, locale as string)}</CardTitle>
                  {course.subtitle && (
                    <CardDescription className="line-clamp-1">{extractLocalizedValue(course.subtitle, locale as string)}</CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.instructor_name && (
                  <p className="text-sm text-gray-600">
                    Instructor: {extractLocalizedValue(course.instructor_name, locale as string)}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons_count} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(course.total_duration / 60)}h {course.total_duration % 60}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrollment_count}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {course.is_free ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Free
                      </Badge>
                    ) : (
                      <span className="font-semibold">${course.price}</span>
                    )}
                    {course.is_featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    )}
                    {!course.is_published && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        Draft
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(course)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <Link href={`/dashboard/department/courses/${course.id}/lessons`}>
                      Lessons
                    </Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(course)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all' || deliveryFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first course'
            }
          </p>
        </div>
      )}
    </div>
  )
}

