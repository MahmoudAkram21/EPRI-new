import { type Announcement } from "@/components/announcements-swiper"

export const announcements: Announcement[] = [
  {
    id: "welcome-2025",
    title: "Welcome to EPRI's Enhanced Digital Platform",
    message: "Explore our newly redesigned website with improved navigation, enhanced search capabilities, and streamlined access to our research services.",
    type: "success",
    link: {
      url: "/services",
      text: "Explore Services"
    },
    startDate: "2025-11-01T00:00:00Z",
    endDate: "2025-12-01T23:59:59Z",
    createdAt: "2025-11-01T08:00:00Z",
    priority: 8,
    isActive: true
  },
  {
    id: "conference-2025",
    title: "Annual Petroleum Research Conference 2025",
    message: "Join leading experts from around the world at our flagship conference featuring cutting-edge research presentations and networking opportunities.",
    type: "info",
    link: {
      url: "/conference",
      text: "Register Now"
    },
    startDate: "2025-11-05T00:00:00Z",
    endDate: "2025-12-15T23:59:59Z",
    createdAt: "2025-11-05T09:00:00Z",
    priority: 9,
    isActive: true
  },
  {
    id: "lab-maintenance-nov",
    title: "Scheduled Laboratory Maintenance",
    message: "Geophysics and Sedimentology labs will undergo routine maintenance November 20-22. Emergency testing services remain available.",
    type: "warning",
    link: {
      url: "/contact",
      text: "Contact Support"
    },
    startDate: "2025-11-15T00:00:00Z",
    endDate: "2025-11-25T23:59:59Z",
    createdAt: "2025-11-05T10:00:00Z",
    priority: 7,
    isActive: true
  },
  {
    id: "new-equipment-2025",
    title: "Advanced Mass Spectrometer Now Available",
    message: "Our Chemical Analysis Laboratory now features a state-of-the-art mass spectrometer for enhanced analytical capabilities.",
    type: "success",
    link: {
      url: "/services/chemical-analysis",
      text: "Learn More"
    },
    daysToShow: 45,
    createdAt: "2025-11-03T14:00:00Z",
    priority: 6,
    isActive: true
  },
  {
    id: "safety-update-2025",
    title: "Updated Safety Protocols",
    message: "New safety guidelines and emergency procedures are now in effect. All staff and visitors must review the updated protocols.",
    type: "urgent",
    link: {
      url: "/safety-protocols",
      text: "View Protocols"
    },
    startDate: "2025-11-05T00:00:00Z",
    endDate: "2025-12-31T23:59:59Z",
    createdAt: "2025-11-05T08:30:00Z",
    priority: 10,
    isActive: true
  },
  {
    id: "research-collaboration",
    title: "International Research Collaboration Program",
    message: "EPRI launches new collaboration opportunities with leading universities and research institutions worldwide.",
    type: "info",
    link: {
      url: "/research-collaborations",
      text: "Apply Now"
    },
    daysToShow: 60,
    createdAt: "2025-11-01T12:00:00Z",
    priority: 5,
    isActive: true
  },
  {
    id: "holiday-schedule",
    title: "Holiday Operating Schedule",
    message: "Please note our modified operating hours during the holiday season. Emergency services remain available 24/7.",
    type: "info",
    link: {
      url: "/contact",
      text: "View Schedule"
    },
    startDate: "2025-12-15T00:00:00Z",
    endDate: "2026-01-15T23:59:59Z",
    createdAt: "2025-11-05T16:00:00Z",
    priority: 4,
    isActive: true
  }
]

// Helper function to get active announcements
export const getActiveAnnouncements = (): Announcement[] => {
  const now = new Date()
  
  return announcements.filter(announcement => {
    if (!announcement.isActive) return false

    const createdAt = new Date(announcement.createdAt)
    
    // Check start date
    if (announcement.startDate) {
      const startDate = new Date(announcement.startDate)
      if (now < startDate) return false
    }
    
    // Check end date
    if (announcement.endDate) {
      const endDate = new Date(announcement.endDate)
      if (now > endDate) return false
    }
    
    // Check days to show
    if (announcement.daysToShow) {
      const expiryDate = new Date(createdAt)
      expiryDate.setDate(expiryDate.getDate() + announcement.daysToShow)
      if (now > expiryDate) return false
    }
    
    return true
  }).sort((a, b) => b.priority - a.priority) // Sort by priority
}

// Helper function to add new announcement
export const createAnnouncement = (announcement: Omit<Announcement, 'id' | 'createdAt'>): Announcement => {
  return {
    ...announcement,
    id: `announcement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
}