"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient, type User, type AuthResponse } from "@/lib/api"

interface LessonProgress {
  [courseId: string]: {
    [lessonId: string]: boolean
  }
}

interface LessonNotes {
  [courseId: string]: {
    [lessonId: string]: string
  }
}

interface UserContextType {
  isLoggedIn: boolean
  user: User | null
  enrolledCourses: string[]
  wishlist: string[]
  lessonProgress: LessonProgress
  lessonNotes: LessonNotes
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }) => Promise<void>
  logout: () => Promise<void>
  enrollInCourse: (courseId: string) => void
  toggleWishlist: (courseId: string) => void
  isEnrolled: (courseId: string) => boolean
  isInWishlist: (courseId: string) => boolean
  markLessonComplete: (courseId: string, lessonId: string) => void
  isLessonComplete: (courseId: string, lessonId: string) => boolean
  getCourseProgress: (courseId: string, totalLessons: number) => number
  saveLessonNote: (courseId: string, lessonId: string, note: string) => void
  getLessonNote: (courseId: string, lessonId: string) => string
  clearError: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [lessonProgress, setLessonProgress] = useState<LessonProgress>({})
  const [lessonNotes, setLessonNotes] = useState<LessonNotes>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load from localStorage on mount and check authentication
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true)
      
      const enrolled = JSON.parse(localStorage.getItem("enrolledCourses") || "[]")
      const wishlistData = JSON.parse(localStorage.getItem("wishlist") || "[]")
      const progress = JSON.parse(localStorage.getItem("lessonProgress") || "{}")
      const notes = JSON.parse(localStorage.getItem("lessonNotes") || "{}")

      setEnrolledCourses(enrolled)
      setWishlist(wishlistData)
      setLessonProgress(progress)
      setLessonNotes(notes)

      // Check if user is authenticated
      if (apiClient.isAuthenticated()) {
        try {
          const userData = await apiClient.getProfile() as { user: User }
          setUser(userData.user)
          setIsLoggedIn(true)
        } catch (error) {
          // Token is invalid, clear it
          apiClient.logout()
          setIsLoggedIn(false)
          setUser(null)
        }
      }
      
      setIsLoading(false)
    }

    loadUserData()
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn))
    localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses))
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
    localStorage.setItem("lessonProgress", JSON.stringify(lessonProgress)) // Save lesson progress
    localStorage.setItem("lessonNotes", JSON.stringify(lessonNotes)) // Added notes functionality
  }, [isLoggedIn, enrolledCourses, wishlist, lessonProgress, lessonNotes])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.login({ email, password })
      setUser(response.user)
      setIsLoggedIn(true)
    } catch (error: any) {
      // Check if account is pending verification
      if (error.message && (error.message.includes('pending') || error.message.includes('not verified'))) {
        setError('ACCOUNT_PENDING')
      } else {
        setError(error.message || 'Login failed')
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.register(userData)
      // Don't auto-login after registration since account is pending verification
      // User will be redirected to pending verification page
    } catch (error: any) {
      setError(error.message || 'Registration failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    
    try {
      await apiClient.logout()
      setIsLoggedIn(false)
      setUser(null)
      setEnrolledCourses([])
      setWishlist([])
      setLessonProgress({})
      setLessonNotes({})
      localStorage.clear()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  const enrollInCourse = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId])
      // Remove from wishlist if it was there
      setWishlist(wishlist.filter((id) => id !== courseId))
    }
  }

  const toggleWishlist = (courseId: string) => {
    if (wishlist.includes(courseId)) {
      setWishlist(wishlist.filter((id) => id !== courseId))
    } else {
      setWishlist([...wishlist, courseId])
    }
  }

  const isEnrolled = (courseId: string) => enrolledCourses.includes(courseId)

  const isInWishlist = (courseId: string) => wishlist.includes(courseId)

  const markLessonComplete = (courseId: string, lessonId: string) => {
    setLessonProgress((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [lessonId]: true,
      },
    }))
  }

  const isLessonComplete = (courseId: string, lessonId: string) => {
    return lessonProgress[courseId]?.[lessonId] || false
  }

  const getCourseProgress = (courseId: string, totalLessons: number) => {
    const courseProgressData = lessonProgress[courseId] || {}
    const completedLessons = Object.values(courseProgressData).filter(Boolean).length
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  const saveLessonNote = (courseId: string, lessonId: string, note: string) => {
    setLessonNotes((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [lessonId]: note,
      },
    }))
  }

  const getLessonNote = (courseId: string, lessonId: string) => {
    return lessonNotes[courseId]?.[lessonId] || ""
  }

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        enrolledCourses,
        wishlist,
        lessonProgress,
        lessonNotes, 
        isLoading,
        error,
        login,
        register,
        logout,
        enrollInCourse,
        toggleWishlist,
        isEnrolled,
        isInWishlist,
        markLessonComplete,
        isLessonComplete,
        getCourseProgress,
        saveLessonNote,
        getLessonNote,
        clearError,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
