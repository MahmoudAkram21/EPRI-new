export interface Course {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  lessons: number
  price: number
  isFree: boolean
  instructor: string
  instructorId: string
  duration: string
  rating: number
  students: number
  curriculum?: CurriculumSection[] // Added curriculum structure
  objectives?: string[] // Added learning objectives
  requirements?: string[] // Added requirements
  // New delivery type fields
  deliveryType: "Online" | "Offline" | "Hybrid"
  platform?: string // Zoom, Teams, Google Meet, etc.
  meetingLocation?: string // Physical location for offline/hybrid
  roomNumber?: string
  building?: string
  address?: string
  zoomLink?: string
  meetingId?: string
  meetingPasscode?: string
  scheduleInfo?: string
  timeZone?: string
  startDate?: string
  endDate?: string
  durationWeeks?: number
  isFeatured?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export interface Instructor {
  id: string
  name: string
  bio: string
  picture: string
  expertise: string
  courses: number
}

export interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  description: string
  category: string
  capacity: number
  registered: number
  price?: number
  isConference?: boolean
  speakers?: Speaker[]
  agenda?: AgendaItem[]
  benefits?: string[]
}

export interface Speaker {
  id: string
  name: string
  title: string
  bio: string
  picture: string
  topic?: string
}

export interface AgendaItem {
  id: string
  time: string
  title: string
  description: string
  speaker?: string
  duration: string
}

export interface ConferenceRegistration {
  id: string
  eventId: string
  attendeeName: string
  email: string
  phone: string
  organization: string
  jobTitle: string
  ticketNumber: string
  registrationDate: string
  paymentStatus: "pending" | "completed" | "failed"
}

export interface NewsPost {
  id: string
  title: string
  date: string
  author: string
  image: string
  excerpt: string
  content: string
  category: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  picture: string
  bio: string
  email: string
}

export interface Testimonial {
  id: string
  author: string
  role: string
  content: string
  rating: number
}

export interface Stats {
  students: number
  courses: number
  satisfaction: number
  instructors: number
}

export interface CurriculumSection {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  type: "video" | "article" | "quiz" | "live_session"
  duration: string
  isPreview?: boolean
  videoUrl?: string
  videoType?: "youtube" | "vimeo" | "direct" | "zoom_recording"
  videoId?: string // YouTube/Vimeo ID or direct video identifier
  articleContent?: string
  resources?: Resource[]
  quiz?: Quiz
  description?: string
  notes?: string // Lesson notes or transcript
  attachments?: { name: string; url: string; type: string }[]
  isRecorded?: boolean // For live sessions that have recordings
  liveSessionUrl?: string // For upcoming live sessions
  sessionDate?: string // When the live session will occur
}

export interface Resource {
  name: string
  url: string
  type: "pdf" | "image" | "document"
}

export interface Quiz {
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "true-false"
  options: string[]
  correctAnswer: number
  explanation?: string
}

export interface Review {
  id: string
  courseId: string
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
}

export interface Service {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  category: string
  icon: string
  equipment: Equipment[]
  centerHead: CenterHead
  features: string[]
  duration?: string
  price?: number
  isFree?: boolean
}

export interface Equipment {
  id: string
  name: string
  description: string
  image: string
  specifications?: string[]
}

export interface CenterHead {
  id: string
  name: string
  title: string
  picture: string
  bio: string
  email: string
  phone: string
  expertise: string[]
}

export interface Department {
  id: string
  name: string
  description: string
  image: string
  icon: string
  manager: DepartmentManager
  equipment: Equipment[]
  analysisServices: AnalysisService[]
  staff: StaffMember[]
  about: string
  achievements: string[]
  researchAreas: string[]
}

export interface DepartmentManager {
  id: string
  name: string
  title: string
  picture: string
  bio: string
  email: string
  phone: string
  expertise: string[]
}

export interface AnalysisService {
  id: string
  name: string
  description: string
  duration?: string
  price?: number
}

export interface StaffMember {
  id: string
  name: string
  title: string
  picture: string
  specialization: string
  email: string
}

export interface Client {
  id: string
  name: string
  logo: string
  description?: string
  website?: string
}

export interface Project {
  id: string
  title: string
  description: string
  images: string[]
  category: string
  status: "Planning" | "In Progress" | "Completed" | "On Hold"
  staff?: StaffMember[]
  video?: string
  startDate: string
  endDate?: string
  objectives?: string[]
  achievements?: string[]
}

// Mock Data
export const stats: Stats = {
  students: 15000,
  courses: 250,
  satisfaction: 98,
  instructors: 85,
}

export const categories: Category[] = [
  { id: "1", name: "Technology", icon: "💻", count: 45 },
  { id: "2", name: "Business", icon: "💼", count: 38 },
  { id: "3", name: "Science", icon: "🔬", count: 32 },
  { id: "4", name: "Engineering", icon: "⚙️", count: 28 },
  { id: "5", name: "Arts", icon: "🎨", count: 22 },
  { id: "6", name: "Health", icon: "🏥", count: 18 },
]

export const instructors: Instructor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    bio: "Professor of Computer Science with 15 years of experience in AI and machine learning.",
    picture: "/professional-woman-professor.png",
    expertise: "Artificial Intelligence",
    courses: 12,
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    bio: "Leading researcher in renewable energy and sustainable engineering practices.",
    picture: "/professional-professor.png",
    expertise: "Engineering",
    courses: 8,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    bio: "Business strategist and entrepreneur with expertise in digital transformation.",
    picture: "/professional-business-woman.png",
    expertise: "Business Strategy",
    courses: 10,
  },
]

// Courses are now loaded dynamically from the API
// Use the Course interface above for type definitions
export const courses: Course[] = []

// Legacy course data removed - now using API endpoints
// For course management, use the admin dashboard at /admin/courses

export const legacyCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    subtitle: "Master the fundamentals of ML and AI",
    description:
      "Learn the core concepts of machine learning, from supervised learning to neural networks. This comprehensive course covers everything you need to start your AI journey.",
    image: "/machine-learning-technology.jpg",
    category: "Technology",
    level: "Beginner",
    lessons: 24,
    price: 299,
    isFree: false,
    instructor: "Dr. Sarah Johnson",
    instructorId: "1",
    duration: "8 weeks",
    rating: 4.8,
    students: 1250,
    deliveryType: "Online",
    platform: "Zoom",
    zoomLink: "https://zoom.us/j/123456789",
    meetingId: "123 456 789",
    meetingPasscode: "ML2024",
    scheduleInfo: "Every Tuesday and Thursday, 7:00 PM - 9:00 PM UTC",
    timeZone: "UTC",
    startDate: "2024-12-01",
    endDate: "2025-01-26",
    durationWeeks: 8,
    isFeatured: true,
    objectives: [
      "Master fundamental concepts and principles of machine learning",
      "Apply supervised and unsupervised learning algorithms",
      "Build and train neural networks from scratch",
      "Understand deep learning architectures",
      "Implement ML models using Python and popular libraries",
      "Evaluate and optimize model performance",
    ],
    requirements: [
      "Basic understanding of Python programming",
      "Fundamental knowledge of mathematics (algebra and statistics)",
      "Computer with internet connection",
      "Willingness to learn and practice regularly",
    ],
    curriculum: [
      {
        id: "section-1",
        title: "Introduction to Machine Learning",
        lessons: [
          {
            id: "1-1",
            title: "Welcome to the Course",
            type: "video",
            duration: "05:00",
            isPreview: true,
            videoUrl: "https://example.com/welcome-video",
          },
          {
            id: "1-2",
            title: "What is Machine Learning?",
            type: "video",
            duration: "12:00",
            isPreview: true,
            videoUrl: "https://example.com/what-is-ml-video",
          },
          {
            id: "1-3",
            title: "Types of Machine Learning",
            type: "article",
            duration: "08:00",
            articleContent: "Detailed content here...",
          },
          {
            id: "1-4",
            title: "Setting Up Your Environment",
            type: "video",
            duration: "15:00",
            videoUrl: "https://example.com/setup-video",
          },
          {
            id: "1-5",
            title: "Quiz: Introduction",
            type: "quiz",
            duration: "10:00",
            quiz: {
              questions: [
                {
                  id: "1",
                  question: "What is ML?",
                  type: "multiple-choice",
                  options: ["A", "B", "C"],
                  correctAnswer: 0,
                },
              ],
            },
          },
        ],
      },
      {
        id: "section-2",
        title: "Supervised Learning",
        lessons: [
          {
            id: "2-1",
            title: "Linear Regression",
            type: "video",
            duration: "20:00",
            videoUrl: "https://example.com/linear-regression-video",
          },
          {
            id: "2-2",
            title: "Logistic Regression",
            type: "video",
            duration: "18:00",
            videoUrl: "https://example.com/logistic-regression-video",
          },
          {
            id: "2-3",
            title: "Decision Trees",
            type: "video",
            duration: "22:00",
            videoUrl: "https://example.com/decision-trees-video",
          },
          {
            id: "2-4",
            title: "Random Forests",
            type: "article",
            duration: "12:00",
            articleContent: "Detailed content here...",
          },
          {
            id: "2-5",
            title: "Quiz: Supervised Learning",
            type: "quiz",
            duration: "15:00",
            quiz: {
              questions: [
                {
                  id: "2",
                  question: "What is LR?",
                  type: "multiple-choice",
                  options: ["A", "B", "C"],
                  correctAnswer: 1,
                },
              ],
            },
          },
        ],
      },
      {
        id: "section-3",
        title: "Unsupervised Learning",
        lessons: [
          {
            id: "3-1",
            title: "K-Means Clustering",
            type: "video",
            duration: "18:00",
            videoUrl: "https://example.com/k-means-video",
          },
          {
            id: "3-2",
            title: "Hierarchical Clustering",
            type: "video",
            duration: "16:00",
            videoUrl: "https://example.com/hierarchical-video",
          },
          {
            id: "3-3",
            title: "Principal Component Analysis",
            type: "video",
            duration: "20:00",
            videoUrl: "https://example.com/pca-video",
          },
          {
            id: "3-4",
            title: "Dimensionality Reduction",
            type: "article",
            duration: "10:00",
            articleContent: "Detailed content here...",
          },
        ],
      },
      {
        id: "section-4",
        title: "Neural Networks & Deep Learning",
        lessons: [
          {
            id: "4-1",
            title: "Introduction to Neural Networks",
            type: "video",
            duration: "25:00",
            videoUrl: "https://example.com/neural-networks-video",
          },
          {
            id: "4-2",
            title: "Backpropagation",
            type: "video",
            duration: "22:00",
            videoUrl: "https://example.com/backpropagation-video",
          },
          {
            id: "4-3",
            title: "Convolutional Neural Networks",
            type: "video",
            duration: "28:00",
            videoUrl: "https://example.com/cnn-video",
          },
          {
            id: "4-4",
            title: "Recurrent Neural Networks",
            type: "video",
            duration: "24:00",
            videoUrl: "https://example.com/rnn-video",
          },
          {
            id: "4-5",
            title: "Final Project",
            type: "article",
            duration: "30:00",
            articleContent: "Detailed content here...",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Sustainable Energy Systems",
    subtitle: "Design the future of clean energy",
    description:
      "Explore renewable energy technologies and learn how to design sustainable power systems for a greener future.",
    image: "/solar-panels-renewable-energy.jpg",
    category: "Engineering",
    level: "Intermediate",
    lessons: 18,
    price: 349,
    isFree: false,
    instructor: "Prof. Michael Chen",
    instructorId: "2",
    duration: "6 weeks",
    rating: 4.9,
    students: 890,
    deliveryType: "Hybrid",
    platform: "Microsoft Teams",
    meetingLocation: "EPRI Engineering Building",
    roomNumber: "Room 301",
    building: "Engineering Building",
    address: "1 Ahmed El-Zomor Street, El Zohour Region, Nasr city, Cairo, Egypt",
    zoomLink: "https://teams.microsoft.com/l/meetup-join/sustainable-energy",
    meetingId: "SUST-ENG-2024",
    meetingPasscode: "Energy24",
    scheduleInfo: "Weeks 1-3: Online (Mon & Wed 6:00-8:00 PM), Weeks 4-6: On-campus labs (Sat 9:00-17:00)",
    timeZone: "Africa/Cairo",
    startDate: "2024-12-15",
    endDate: "2025-01-26",
    durationWeeks: 6,
    isFeatured: true,
    objectives: [
      "Understand renewable energy technologies",
      "Design sustainable power systems",
      "Analyze energy efficiency and optimization",
      "Evaluate environmental impact",
      "Implement green energy solutions",
    ],
    requirements: ["Basic engineering knowledge", "Understanding of physics principles", "Interest in sustainability"],
    curriculum: [
      {
        id: "section-1",
        title: "Fundamentals of Renewable Energy",
        lessons: [
          {
            id: "1-1",
            title: "Introduction to Renewable Energy",
            type: "video",
            duration: "10:00",
            isPreview: true,
            videoType: "youtube",
            videoId: "dQw4w9WgXcQ",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            description: "Overview of renewable energy sources and their importance in sustainable development",
            notes: "Introduction covers global energy challenges, renewable vs non-renewable sources, and future trends",
            attachments: [
              { name: "Course Introduction Slides", url: "/attachments/renewable-intro.pdf", type: "pdf" },
              { name: "Reading Material", url: "/attachments/renewable-reading.pdf", type: "pdf" }
            ]
          },
          {
            id: "1-2",
            title: "Solar Energy Basics",
            type: "video",
            duration: "15:00",
            videoType: "vimeo",
            videoId: "123456789",
            videoUrl: "https://vimeo.com/123456789",
            description: "Understanding photovoltaic systems and solar thermal energy conversion",
            notes: "Covers solar radiation principles, PV cell technology, and system design basics",
            attachments: [
              { name: "Solar Energy Calculations", url: "/attachments/solar-calculations.xlsx", type: "excel" },
              { name: "Solar Panel Specifications", url: "/attachments/solar-specs.pdf", type: "pdf" }
            ]
          },
          {
            id: "1-3",
            title: "Wind Energy Systems",
            type: "video",
            duration: "18:00",
            videoType: "direct",
            videoUrl: "https://epri-media.s3.amazonaws.com/courses/wind-energy-systems.mp4",
            description: "Comprehensive overview of wind turbine technology and wind farm design",
            notes: "Covers wind resource assessment, turbine types, and aerodynamic principles",
            attachments: [
              { name: "Wind Atlas Data", url: "/attachments/wind-atlas.pdf", type: "pdf" },
              { name: "Turbine Selection Guide", url: "/attachments/turbine-guide.pdf", type: "pdf" }
            ]
          },
          {
            id: "1-4",
            title: "Live Q&A Session - Renewable Energy",
            type: "live_session",
            duration: "60:00",
            isRecorded: true,
            liveSessionUrl: "https://teams.microsoft.com/l/meetup-join/renewable-qa",
            sessionDate: "2024-12-20T18:00:00Z",
            description: "Interactive session covering questions about renewable energy fundamentals",
            notes: "Recording available after the live session ends",
            videoType: "zoom_recording",
            videoUrl: "https://epri-recordings.com/renewable-qa-session",
            attachments: [
              { name: "Q&A Session Notes", url: "/attachments/qa-notes.pdf", type: "pdf" }
            ]
          },
        ],
      },
      {
        id: "section-2",
        title: "System Design",
        lessons: [
          {
            id: "2-1",
            title: "Grid Integration",
            type: "video",
            duration: "20:00",
            videoUrl: "https://example.com/grid-integration-video",
          },
          {
            id: "2-2",
            title: "Energy Storage Solutions",
            type: "video",
            duration: "22:00",
            videoUrl: "https://example.com/energy-storage-video",
          },
          {
            id: "2-3",
            title: "Design Project",
            type: "article",
            duration: "25:00",
            articleContent: "Detailed content here...",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Digital Business Transformation",
    subtitle: "Lead change in the digital age",
    description:
      "Understand how to drive digital transformation in organizations and leverage technology for business growth.",
    image: "/digital-business-technology.png",
    category: "Business",
    level: "Advanced",
    lessons: 20,
    price: 399,
    isFree: false,
    instructor: "Dr. Emily Rodriguez",
    instructorId: "3",
    duration: "10 weeks",
    rating: 4.7,
    students: 670,
    deliveryType: "Offline",
    meetingLocation: "EPRI Business Center",
    roomNumber: "Conference Hall A",
    building: "Business Center",
    address: "15 Research Avenue, New Administrative Capital, Cairo, Egypt",
    scheduleInfo: "Saturdays and Sundays, 9:00 AM - 1:00 PM, with networking sessions",
    timeZone: "Africa/Cairo",
    startDate: "2025-01-11",
    endDate: "2025-03-22",
    durationWeeks: 10,
    isFeatured: true,
    objectives: [
      "Lead digital transformation initiatives",
      "Develop digital business strategies",
      "Manage organizational change",
      "Leverage emerging technologies",
    ],
    requirements: ["Business management experience", "Understanding of digital technologies", "Leadership skills"],
    curriculum: [
      {
        id: "section-1",
        title: "Digital Transformation Fundamentals",
        lessons: [
          {
            id: "1-1",
            title: "What is Digital Transformation?",
            type: "video",
            duration: "12:00",
            isPreview: true,
            videoUrl: "https://example.com/digital-transformation-video",
          },
          {
            id: "1-2",
            title: "Digital Strategy Development",
            type: "video",
            duration: "18:00",
            videoUrl: "https://example.com/digital-strategy-video",
          },
        ],
      },
    ],
  },
  {
    id: "4",
    title: "Data Science Fundamentals",
    subtitle: "From data to insights",
    description:
      "Learn data analysis, visualization, and statistical methods to extract meaningful insights from data.",
    image: "/data-science-analytics.jpg",
    category: "Technology",
    level: "Beginner",
    lessons: 16,
    price: 0,
    isFree: true,
    instructor: "Dr. Sarah Johnson",
    instructorId: "1",
    duration: "4 weeks",
    rating: 4.6,
    students: 2100,
    deliveryType: "Online",
    platform: "Google Meet",
    zoomLink: "https://meet.google.com/abc-defg-hij",
    meetingId: "DATA-SCI-FREE",
    meetingPasscode: "DataFree24",
    scheduleInfo: "Every Monday, Wednesday, and Friday, 6:00 PM - 7:30 PM UTC",
    timeZone: "UTC",
    startDate: "2024-11-25",
    endDate: "2024-12-20",
    durationWeeks: 4,
    isFeatured: false,
    objectives: [
      "Analyze data using statistical methods",
      "Create compelling data visualizations",
      "Extract insights from datasets",
      "Use Python for data analysis",
    ],
    requirements: ["Basic programming knowledge", "Interest in data analysis"],
    curriculum: [
      {
        id: "section-1",
        title: "Getting Started with Data Science",
        lessons: [
          {
            id: "1-1",
            title: "Introduction to Data Science",
            type: "video",
            duration: "08:00",
            isPreview: true,
            videoUrl: "https://example.com/data-science-intro-video",
          },
          {
            id: "1-2",
            title: "Python for Data Analysis",
            type: "video",
            duration: "15:00",
            videoUrl: "https://example.com/python-data-analysis-video",
          },
        ],
      },
    ],
  },
]

export const events: Event[] = [
  {
    id: "1",
    title: "Annual Research Symposium 2025",
    date: "2025-04-15",
    time: "09:00 AM - 05:00 PM",
    location: "Main Campus Auditorium",
    image: "/conference-symposium.jpg",
    description:
      "Join leading researchers and academics for a day of groundbreaking presentations and networking. This premier event brings together experts from across the petroleum industry to share insights on the latest research, technologies, and innovations.",
    category: "Conference",
    capacity: 500,
    registered: 342,
    price: 150,
    isConference: true,
    speakers: [
      {
        id: "sp-1",
        name: "Dr. Ahmed Hassan",
        title: "Director of Petroleum Analysis Center",
        bio: "Leading expert in petroleum chemistry with over 20 years of experience in crude oil analysis and refining technology.",
        picture: "/dr-ahmed-hassan.jpg",
        topic: "Enhanced Oil Recovery: Latest Innovations and Field Applications",
      },
      {
        id: "sp-2",
        name: "Prof. Samira El-Naggar",
        title: "Head of Paleontology Laboratory",
        bio: "Distinguished micropaleontologist with extensive experience in biostratigraphy and paleoenvironmental analysis.",
        picture: "/prof-samira-elnaggar.jpg",
        topic: "Biostratigraphy in Modern Petroleum Exploration",
      },
      {
        id: "sp-3",
        name: "Dr. Tarek Abdel-Fattah",
        title: "Head of Geophysics Laboratory",
        bio: "Renowned geophysicist specializing in seismic interpretation and reservoir geophysics.",
        picture: "/dr-tarek-abdelfattah.jpg",
        topic: "AI Applications in Seismic Interpretation",
      },
    ],
    agenda: [
      {
        id: "ag-1",
        time: "09:00 AM - 09:30 AM",
        title: "Registration & Welcome Coffee",
        description: "Check-in, registration, and networking over morning refreshments",
        duration: "30 min",
      },
      {
        id: "ag-2",
        time: "09:30 AM - 10:00 AM",
        title: "Opening Ceremony",
        description: "Welcome address and symposium overview",
        speaker: "Dr. Robert Williams, President & CEO",
        duration: "30 min",
      },
      {
        id: "ag-3",
        time: "10:00 AM - 11:00 AM",
        title: "Enhanced Oil Recovery: Latest Innovations",
        description: "Deep dive into cutting-edge EOR techniques and field case studies",
        speaker: "Dr. Ahmed Hassan",
        duration: "60 min",
      },
      {
        id: "ag-4",
        time: "11:00 AM - 11:15 AM",
        title: "Coffee Break",
        description: "Networking and refreshments",
        duration: "15 min",
      },
      {
        id: "ag-5",
        time: "11:15 AM - 12:15 PM",
        title: "AI Applications in Seismic Interpretation",
        description: "How artificial intelligence is revolutionizing geophysical analysis",
        speaker: "Dr. Tarek Abdel-Fattah",
        duration: "60 min",
      },
      {
        id: "ag-6",
        time: "12:15 PM - 01:30 PM",
        title: "Lunch Break",
        description: "Networking lunch with fellow researchers and industry professionals",
        duration: "75 min",
      },
      {
        id: "ag-7",
        time: "01:30 PM - 02:30 PM",
        title: "Biostratigraphy in Modern Petroleum Exploration",
        description: "Advanced techniques in micropaleontological analysis for exploration",
        speaker: "Prof. Samira El-Naggar",
        duration: "60 min",
      },
      {
        id: "ag-8",
        time: "02:30 PM - 03:30 PM",
        title: "Panel Discussion: Future of Petroleum Research",
        description: "Expert panel discussing emerging trends and future directions",
        speaker: "All Speakers",
        duration: "60 min",
      },
      {
        id: "ag-9",
        time: "03:30 PM - 04:00 PM",
        title: "Poster Session & Exhibition",
        description: "View research posters and visit technology exhibitions",
        duration: "30 min",
      },
      {
        id: "ag-10",
        time: "04:00 PM - 05:00 PM",
        title: "Closing Remarks & Networking",
        description: "Symposium conclusion and final networking opportunity",
        duration: "60 min",
      },
    ],
    benefits: [
      "Certificate of attendance",
      "Access to all presentations and materials",
      "Lunch and refreshments included",
      "Networking opportunities with industry leaders",
      "Exhibition access",
      "Conference proceedings document",
    ],
  },
  {
    id: "2",
    title: "AI & Ethics Workshop",
    date: "2025-04-22",
    time: "02:00 PM - 06:00 PM",
    location: "Technology Center, Room 301",
    image: "/ai-technology-workshop.jpg",
    description: "Explore the ethical implications of artificial intelligence and machine learning in modern society.",
    category: "Workshop",
    capacity: 50,
    registered: 38,
    price: 75,
  },
  {
    id: "3",
    title: "Career Fair 2025",
    date: "2025-05-10",
    time: "10:00 AM - 04:00 PM",
    location: "Student Center",
    image: "/career-fair-networking.jpg",
    description: "Connect with top employers and explore career opportunities across various industries.",
    category: "Career",
    capacity: 1000,
    registered: 756,
    price: 0,
  },
  {
    id: "4",
    title: "International Petroleum Technology Conference 2025",
    date: "2025-11-20",
    time: "08:00 AM - 06:00 PM",
    location: "Cairo International Convention Center",
    image: "/conference-symposium.jpg",
    description:
      "The largest petroleum technology conference in the Middle East. Join over 2000 professionals, researchers, and industry leaders for three days of cutting-edge presentations, workshops, and exhibitions covering all aspects of petroleum technology and innovation.",
    category: "Conference",
    capacity: 2000,
    registered: 1245,
    price: 250,
    isConference: true,
    speakers: [
      {
        id: "sp-4",
        name: "Dr. Mohamed Ibrahim",
        title: "Director of Environmental Studies Center",
        bio: "Environmental scientist specializing in petroleum-related environmental issues and sustainability.",
        picture: "/dr-mohamed-ibrahim.jpg",
        topic: "Sustainable Practices in Petroleum Operations",
      },
      {
        id: "sp-5",
        name: "Dr. Fatma El-Sayed",
        title: "Head of Reservoir Engineering Department",
        bio: "Renowned reservoir engineer with extensive experience in production optimization and EOR.",
        picture: "/dr-fatma-elsayed.jpg",
        topic: "Digital Transformation in Reservoir Management",
      },
      {
        id: "sp-6",
        name: "Eng. Khaled Mahmoud",
        title: "Head of Drilling Engineering Department",
        bio: "Senior drilling engineer with over 25 years of field experience in drilling operations.",
        picture: "/eng-khaled-mahmoud.jpg",
        topic: "Advanced Drilling Technologies and Automation",
      },
    ],
    agenda: [
      {
        id: "ag-11",
        time: "08:00 AM - 09:00 AM",
        title: "Registration & Exhibition Opening",
        description: "Conference registration and technology exhibition opening",
        duration: "60 min",
      },
      {
        id: "ag-12",
        time: "09:00 AM - 09:30 AM",
        title: "Opening Keynote",
        description: "Industry outlook and technology trends",
        speaker: "Industry Leader",
        duration: "30 min",
      },
      {
        id: "ag-13",
        time: "09:30 AM - 10:45 AM",
        title: "Technical Sessions - Track A: Drilling & Completions",
        description: "Latest advances in drilling technology and well completions",
        speaker: "Eng. Khaled Mahmoud",
        duration: "75 min",
      },
      {
        id: "ag-14",
        time: "09:30 AM - 10:45 AM",
        title: "Technical Sessions - Track B: Reservoir Engineering",
        description: "Digital transformation and smart reservoir management",
        speaker: "Dr. Fatma El-Sayed",
        duration: "75 min",
      },
      {
        id: "ag-15",
        time: "10:45 AM - 11:15 AM",
        title: "Coffee Break & Networking",
        description: "Refreshments and exhibition visit",
        duration: "30 min",
      },
      {
        id: "ag-16",
        time: "11:15 AM - 12:30 PM",
        title: "Environmental Sustainability Panel",
        description: "Sustainable practices and carbon neutrality in petroleum operations",
        speaker: "Dr. Mohamed Ibrahim",
        duration: "75 min",
      },
      {
        id: "ag-17",
        time: "12:30 PM - 02:00 PM",
        title: "Networking Lunch",
        description: "Catered lunch with networking opportunities",
        duration: "90 min",
      },
      {
        id: "ag-18",
        time: "02:00 PM - 04:00 PM",
        title: "Workshop Sessions (Choose One)",
        description: "Hands-on technical workshops on various topics",
        duration: "120 min",
      },
      {
        id: "ag-19",
        time: "04:00 PM - 05:30 PM",
        title: "Industry Roundtable Discussions",
        description: "Small group discussions on key industry challenges",
        duration: "90 min",
      },
      {
        id: "ag-20",
        time: "05:30 PM - 06:00 PM",
        title: "Day 1 Closing & Reception",
        description: "Daily wrap-up and evening networking reception",
        duration: "30 min",
      },
    ],
    benefits: [
      "3-day conference access",
      "All meals and refreshments included",
      "Conference materials and proceedings",
      "Certificate of participation",
      "Access to all technical sessions and workshops",
      "Exhibition hall access",
      "Networking events and receptions",
      "Digital access to presentations",
      "CPD/PDH credits",
    ],
  },
]

export const news: NewsPost[] = [
  {
    id: "1",
    title: "EPRI Launches New AI Research Center",
    date: "2025-03-15",
    author: "Communications Team",
    image: "/research-center-building.jpg",
    excerpt:
      "State-of-the-art facility will advance cutting-edge research in artificial intelligence and machine learning.",
    content: "Full article content here...",
    category: "Research",
  },
  {
    id: "2",
    title: "Students Win International Innovation Award",
    date: "2025-03-10",
    author: "Student Affairs",
    image: "/students-award-ceremony.png",
    excerpt: "EPRI team recognized for groundbreaking sustainable energy solution at global competition.",
    content: "Full article content here...",
    category: "Achievement",
  },
  {
    id: "3",
    title: "New Partnership with Leading Tech Companies",
    date: "2025-03-05",
    author: "External Relations",
    image: "/business-partnership-handshake.png",
    excerpt:
      "Strategic collaboration will provide students with real-world project experience and internship opportunities.",
    content: "Full article content here...",
    category: "Partnership",
  },
  {
    id: "4",
    title: "Breakthrough in Enhanced Oil Recovery Techniques",
    date: "2025-03-20",
    author: "Dr. Ahmed Hassan",
    image: "/petroleum-lab-testing.jpg",
    excerpt:
      "EPRI researchers develop innovative polymer flooding method that increases oil recovery by 25% in mature fields.",
    content:
      "A team of researchers at EPRI's Petroleum Analysis Center has achieved a significant breakthrough in enhanced oil recovery (EOR) technology. The new polymer flooding technique, developed after three years of intensive research, has shown remarkable results in laboratory tests and pilot field trials. The method utilizes a novel polymer formulation that is more stable at high temperatures and salinities, making it suitable for Egyptian oil fields. Initial field trials in the Western Desert showed a 25% increase in oil recovery compared to conventional water flooding. This breakthrough could potentially unlock billions of barrels of additional oil reserves from mature fields across Egypt.",
    category: "Research News",
  },
  {
    id: "5",
    title: "Novel Biostratigraphic Framework for Egyptian Basins",
    date: "2025-03-18",
    author: "Prof. Samira El-Naggar",
    image: "/paleontology-lab.jpg",
    excerpt:
      "Paleontology laboratory establishes comprehensive biostratigraphic zonation for Cretaceous-Tertiary sequences in Egypt.",
    content:
      "The Paleontology Laboratory at EPRI has completed a landmark study establishing a comprehensive biostratigraphic framework for Egyptian sedimentary basins. The research, led by Prof. Samira El-Naggar and her team, analyzed microfossil assemblages from over 500 wells across Egypt. The new zonation scheme provides unprecedented resolution for age dating and correlation of petroleum reservoir rocks. This framework will significantly improve exploration success rates and reduce drilling risks. The findings have been published in a special issue of the Journal of African Earth Sciences and are already being adopted by major oil companies operating in Egypt.",
    category: "Research News",
  },
  {
    id: "6",
    title: "Advanced Seismic Imaging Reveals New Prospects",
    date: "2025-03-12",
    author: "Dr. Tarek Abdel-Fattah",
    image: "/geophysical-survey.jpg",
    excerpt:
      "Geophysics laboratory applies machine learning to seismic data, identifying previously undetected hydrocarbon structures.",
    content:
      "Using cutting-edge machine learning algorithms combined with advanced seismic attribute analysis, the Geophysics Laboratory has identified several new hydrocarbon prospects in Egypt's Mediterranean offshore region. The research team, led by Dr. Tarek Abdel-Fattah, developed a neural network-based approach to detect subtle stratigraphic traps that were invisible to conventional interpretation methods. The technique has already led to three successful exploration wells, with estimated reserves of over 500 million barrels of oil equivalent. This breakthrough demonstrates the power of integrating artificial intelligence with traditional geophysical methods.",
    category: "Research News",
  },
]

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Robert Williams",
    role: "President & CEO",
    picture: "/executive-man-suit.jpg",
    bio: "Leading EPRI with over 25 years of experience in higher education and research administration.",
    email: "r.williams@epri.edu",
  },
  {
    id: "2",
    name: "Dr. Jennifer Martinez",
    role: "Vice President of Academic Affairs",
    picture: "/executive-woman-professional.jpg",
    bio: "Overseeing academic programs and curriculum development with a focus on innovation and excellence.",
    email: "j.martinez@epri.edu",
  },
  {
    id: "3",
    name: "Prof. David Thompson",
    role: "Dean of Research",
    picture: "/professor-man-academic.jpg",
    bio: "Directing research initiatives and fostering collaboration across disciplines.",
    email: "d.thompson@epri.edu",
  },
  {
    id: "4",
    name: "Ms. Lisa Anderson",
    role: "Chief Operations Officer",
    picture: "/executive-woman-business.jpg",
    bio: "Managing institutional operations and strategic planning for sustainable growth.",
    email: "l.anderson@epri.edu",
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "1",
    author: "James Wilson",
    role: "Software Engineer",
    content:
      "The courses at EPRI transformed my career. The instructors are world-class and the curriculum is cutting-edge.",
    rating: 5,
  },
  {
    id: "2",
    author: "Maria Garcia",
    role: "Data Scientist",
    content: "I gained practical skills that I use every day in my job. The hands-on projects were invaluable.",
    rating: 5,
  },
  {
    id: "3",
    author: "Ahmed Hassan",
    role: "Business Analyst",
    content: "EPRI provided me with the knowledge and network to advance in my field. Highly recommended!",
    rating: 5,
  },
]

export const reviews: Review[] = [
  {
    id: "1",
    courseId: "1",
    author: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2025-03-10",
    comment:
      "Excellent course! The instructor explains complex concepts in a very clear and understandable way. The hands-on projects really helped solidify my understanding.",
  },
  {
    id: "2",
    courseId: "1",
    author: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2025-03-08",
    comment:
      "Best ML course I've taken. The curriculum is well-structured and the pace is perfect for beginners. Highly recommend!",
  },
  {
    id: "3",
    courseId: "1",
    author: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    date: "2025-03-05",
    comment: "Great content and practical examples. Would have liked more advanced topics, but overall very satisfied.",
  },
  {
    id: "4",
    courseId: "2",
    author: "Sarah Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    date: "2025-03-12",
    comment:
      "This course opened my eyes to the possibilities of renewable energy. Prof. Chen is an amazing instructor!",
  },
]

export const services: Service[] = [
  {
    id: "1",
    title: "Petroleum Analysis & Testing",
    subtitle: "Comprehensive crude oil and petroleum product analysis",
    description:
      "Our state-of-the-art petroleum analysis laboratory provides comprehensive testing services for crude oil, refined products, and petrochemicals. We utilize advanced analytical techniques to ensure product quality, compliance with international standards, and optimization of refining processes.",
    image: "/petroleum-lab-testing.jpg",
    category: "Laboratory Services",
    icon: "🔬",
    features: [
      "Crude oil assay and characterization",
      "Petroleum product quality testing",
      "Fuel specifications analysis",
      "Contamination detection",
      "Octane and cetane number determination",
      "Viscosity and density measurements",
      "Sulfur content analysis",
      "Distillation curve analysis",
    ],
    equipment: [
      {
        id: "eq-1",
        name: "Gas Chromatography-Mass Spectrometry (GC-MS)",
        description:
          "Advanced analytical instrument for identifying and quantifying chemical compounds in petroleum samples",
        image: "/gc-ms-equipment.jpg",
        specifications: [
          "High-resolution mass spectrometer",
          "Temperature range: -60°C to 450°C",
          "Detection limit: ppb level",
          "Automated sample injection system",
        ],
      },
      {
        id: "eq-2",
        name: "Atomic Absorption Spectrophotometer",
        description: "Precision instrument for determining metal content in petroleum products",
        image: "/spectrophotometer-equipment.jpg",
        specifications: [
          "Multi-element analysis capability",
          "Flame and graphite furnace modes",
          "Detection range: ppm to ppb",
          "Automated sample changer",
        ],
      },
      {
        id: "eq-3",
        name: "Viscometer System",
        description: "Automated viscosity measurement system for petroleum products",
        image: "/viscometer-equipment.jpg",
        specifications: [
          "Temperature-controlled bath",
          "Multiple capillary sizes",
          "Kinematic viscosity range: 0.2 to 20,000 cSt",
          "ASTM D445 compliant",
        ],
      },
    ],
    centerHead: {
      id: "ch-1",
      name: "Dr. Ahmed Hassan",
      title: "Director of Petroleum Analysis Center",
      picture: "/dr-ahmed-hassan.jpg",
      bio: "Dr. Ahmed Hassan is a leading expert in petroleum chemistry with over 20 years of experience in crude oil analysis and refining technology. He holds a Ph.D. in Petroleum Engineering and has published numerous research papers on petroleum characterization and quality control.",
      email: "a.hassan@epri.edu",
      phone: "+20 2 1234 5678",
      expertise: [
        "Petroleum Chemistry",
        "Crude Oil Characterization",
        "Refining Technology",
        "Quality Control",
        "Analytical Methods Development",
      ],
    },
    duration: "2-5 business days",
    price: 500,
    isFree: false,
  },
  {
    id: "2",
    title: "Reservoir Engineering Services",
    subtitle: "Advanced reservoir characterization and simulation",
    description:
      "Our reservoir engineering team provides comprehensive services for reservoir characterization, performance analysis, and production optimization. We utilize cutting-edge simulation software and analytical techniques to maximize hydrocarbon recovery and optimize field development strategies.",
    image: "/reservoir-engineering.jpg",
    category: "Engineering Services",
    icon: "⚙️",
    features: [
      "Reservoir characterization and modeling",
      "Production forecasting and optimization",
      "Enhanced oil recovery (EOR) studies",
      "Well performance analysis",
      "Pressure transient analysis",
      "Material balance calculations",
      "Decline curve analysis",
      "Economic evaluation",
    ],
    equipment: [
      {
        id: "eq-4",
        name: "Reservoir Simulation Workstation",
        description: "High-performance computing system for complex reservoir simulations",
        image: "/simulation-workstation.jpg",
        specifications: [
          "Multi-core processors (64 cores)",
          "512 GB RAM",
          "GPU acceleration support",
          "Commercial reservoir simulators (Eclipse, CMG)",
        ],
      },
      {
        id: "eq-5",
        name: "Core Analysis System",
        description: "Comprehensive core analysis equipment for rock property measurements",
        image: "/core-analysis-equipment.jpg",
        specifications: [
          "Porosity and permeability measurements",
          "Capillary pressure analysis",
          "Relative permeability determination",
          "Wettability studies",
        ],
      },
    ],
    centerHead: {
      id: "ch-2",
      name: "Dr. Fatma El-Sayed",
      title: "Head of Reservoir Engineering Department",
      picture: "/dr-fatma-elsayed.jpg",
      bio: "Dr. Fatma El-Sayed is a renowned reservoir engineer with extensive experience in reservoir simulation and production optimization. She has worked on major oil and gas projects across the Middle East and holds a Ph.D. in Petroleum Engineering from a leading international university.",
      email: "f.elsayed@epri.edu",
      phone: "+20 2 1234 5679",
      expertise: [
        "Reservoir Simulation",
        "Production Optimization",
        "Enhanced Oil Recovery",
        "Reservoir Characterization",
        "Field Development Planning",
      ],
    },
    duration: "1-4 weeks",
    price: 2000,
    isFree: false,
  },
  {
    id: "3",
    title: "Environmental Impact Assessment",
    subtitle: "Comprehensive environmental studies for petroleum operations",
    description:
      "Our environmental services team conducts thorough environmental impact assessments for petroleum exploration, production, and refining operations. We help companies comply with environmental regulations and implement sustainable practices.",
    image: "/environmental-assessment.jpg",
    category: "Environmental Services",
    icon: "🌍",
    features: [
      "Environmental impact assessment (EIA)",
      "Soil and water contamination analysis",
      "Air quality monitoring",
      "Waste management planning",
      "Remediation strategy development",
      "Regulatory compliance consulting",
      "Sustainability reporting",
      "Carbon footprint analysis",
    ],
    equipment: [
      {
        id: "eq-6",
        name: "Environmental Monitoring Station",
        description: "Automated system for continuous environmental parameter monitoring",
        image: "/environmental-monitoring.jpg",
        specifications: [
          "Air quality sensors (PM2.5, PM10, NOx, SOx)",
          "Water quality analyzers",
          "Meteorological sensors",
          "Real-time data logging and transmission",
        ],
      },
      {
        id: "eq-7",
        name: "Soil Analysis Laboratory",
        description: "Complete facility for soil contamination assessment",
        image: "/soil-analysis-lab.jpg",
        specifications: [
          "Heavy metal analysis",
          "Hydrocarbon contamination detection",
          "pH and conductivity measurements",
          "Microbial analysis capability",
        ],
      },
    ],
    centerHead: {
      id: "ch-3",
      name: "Dr. Mohamed Ibrahim",
      title: "Director of Environmental Studies Center",
      picture: "/dr-mohamed-ibrahim.jpg",
      bio: "Dr. Mohamed Ibrahim is an environmental scientist specializing in petroleum-related environmental issues. With over 15 years of experience, he has led numerous environmental impact assessments and remediation projects for major oil and gas companies.",
      email: "m.ibrahim@epri.edu",
      phone: "+20 2 1234 5680",
      expertise: [
        "Environmental Impact Assessment",
        "Contamination Remediation",
        "Environmental Regulations",
        "Sustainability Consulting",
        "Air and Water Quality Management",
      ],
    },
    duration: "2-6 weeks",
    price: 3000,
    isFree: false,
  },
  {
    id: "4",
    title: "Drilling & Well Engineering",
    subtitle: "Expert drilling engineering and well design services",
    description:
      "Our drilling engineering team provides comprehensive services for well planning, drilling optimization, and well integrity management. We combine theoretical knowledge with practical experience to deliver safe and efficient drilling operations.",
    image: "/drilling-engineering.jpg",
    category: "Engineering Services",
    icon: "🛢️",
    features: [
      "Well design and planning",
      "Drilling program development",
      "Mud system design",
      "Casing and cementing design",
      "Drilling optimization",
      "Well control analysis",
      "Directional drilling planning",
      "Cost estimation",
    ],
    equipment: [
      {
        id: "eq-8",
        name: "Drilling Simulator",
        description: "Advanced drilling simulation system for training and planning",
        image: "/drilling-simulator.jpg",
        specifications: [
          "Real-time drilling simulation",
          "Multiple well scenarios",
          "Well control training modules",
          "Virtual reality integration",
        ],
      },
      {
        id: "eq-9",
        name: "Mud Testing Laboratory",
        description: "Complete facility for drilling fluid analysis and testing",
        image: "/mud-testing-lab.jpg",
        specifications: [
          "Rheology measurements",
          "Filtration testing",
          "pH and alkalinity analysis",
          "Contamination detection",
        ],
      },
    ],
    centerHead: {
      id: "ch-4",
      name: "Eng. Khaled Mahmoud",
      title: "Head of Drilling Engineering Department",
      picture: "/eng-khaled-mahmoud.jpg",
      bio: "Eng. Khaled Mahmoud is a senior drilling engineer with over 25 years of field experience in drilling operations across various geological formations. He has managed complex drilling projects and is an expert in drilling optimization and well control.",
      email: "k.mahmoud@epri.edu",
      phone: "+20 2 1234 5681",
      expertise: [
        "Drilling Engineering",
        "Well Design",
        "Drilling Optimization",
        "Well Control",
        "Directional Drilling",
      ],
    },
    duration: "1-3 weeks",
    price: 1500,
    isFree: false,
  },
  {
    id: "5",
    title: "Corrosion & Materials Testing",
    subtitle: "Advanced materials analysis and corrosion prevention",
    description:
      "Our materials testing laboratory provides comprehensive services for corrosion assessment, materials selection, and failure analysis. We help prevent costly equipment failures and extend the life of petroleum infrastructure.",
    image: "/corrosion-testing.jpg",
    category: "Laboratory Services",
    icon: "🔧",
    features: [
      "Corrosion rate measurements",
      "Materials compatibility testing",
      "Failure analysis",
      "Metallurgical examination",
      "Coating evaluation",
      "Cathodic protection design",
      "Inhibitor effectiveness testing",
      "Non-destructive testing (NDT)",
    ],
    equipment: [
      {
        id: "eq-10",
        name: "Electrochemical Workstation",
        description: "Advanced system for corrosion rate measurements and electrochemical analysis",
        image: "/electrochemical-workstation.jpg",
        specifications: [
          "Potentiostatic and galvanostatic modes",
          "Impedance spectroscopy",
          "Cyclic voltammetry",
          "Temperature-controlled cell",
        ],
      },
      {
        id: "eq-11",
        name: "Scanning Electron Microscope (SEM)",
        description: "High-resolution imaging for materials characterization",
        image: "/sem-equipment.jpg",
        specifications: [
          "Magnification up to 500,000x",
          "Energy-dispersive X-ray spectroscopy (EDS)",
          "Variable pressure mode",
          "Digital image capture",
        ],
      },
    ],
    centerHead: {
      id: "ch-5",
      name: "Dr. Laila Abdel-Rahman",
      title: "Director of Materials Science Center",
      picture: "/dr-laila-abdelrahman.jpg",
      bio: "Dr. Laila Abdel-Rahman is a materials scientist with expertise in corrosion engineering and failure analysis. She has conducted extensive research on corrosion prevention in petroleum environments and has published numerous papers in international journals.",
      email: "l.abdelrahman@epri.edu",
      phone: "+20 2 1234 5682",
      expertise: [
        "Corrosion Engineering",
        "Materials Science",
        "Failure Analysis",
        "Metallurgy",
        "Corrosion Prevention",
      ],
    },
    duration: "1-2 weeks",
    price: 800,
    isFree: false,
  },
  {
    id: "6",
    title: "Geophysical Surveys",
    subtitle: "Advanced seismic and geophysical exploration services",
    description:
      "Our geophysics team provides comprehensive geophysical survey services for petroleum exploration and reservoir characterization. We utilize state-of-the-art equipment and advanced interpretation techniques to identify hydrocarbon prospects.",
    image: "/geophysical-survey.jpg",
    category: "Exploration Services",
    icon: "📡",
    features: [
      "2D and 3D seismic surveys",
      "Seismic data processing and interpretation",
      "Well log analysis",
      "Gravity and magnetic surveys",
      "Electrical resistivity surveys",
      "Prospect identification",
      "Reservoir mapping",
      "Structural interpretation",
    ],
    equipment: [
      {
        id: "eq-12",
        name: "Seismic Data Processing Workstation",
        description: "High-performance system for seismic data processing and interpretation",
        image: "/seismic-workstation.jpg",
        specifications: [
          "Multi-core processors",
          "Large-scale data storage",
          "Commercial seismic software (Petrel, Kingdom)",
          "3D visualization capabilities",
        ],
      },
      {
        id: "eq-13",
        name: "Portable Seismograph",
        description: "Field equipment for seismic data acquisition",
        image: "/seismograph-equipment.jpg",
        specifications: [
          "24-channel recording",
          "GPS synchronization",
          "Wireless data transmission",
          "Rugged field design",
        ],
      },
    ],
    centerHead: {
      id: "ch-6",
      name: "Dr. Yasser Khalil",
      title: "Head of Geophysics Department",
      picture: "/dr-yasser-khalil.jpg",
      bio: "Dr. Yasser Khalil is a geophysicist with extensive experience in seismic interpretation and petroleum exploration. He has worked on exploration projects in various geological settings and is an expert in advanced seismic interpretation techniques.",
      email: "y.khalil@epri.edu",
      phone: "+20 2 1234 5683",
      expertise: [
        "Seismic Interpretation",
        "Petroleum Exploration",
        "Geophysical Surveys",
        "Reservoir Characterization",
        "Structural Geology",
      ],
    },
    duration: "2-8 weeks",
    price: 5000,
    isFree: false,
  },
  {
    id: "6",
    title: "Surfaces Protection Center",
    subtitle: "Advanced coating and surface protection solutions",
    description:
      "Our Surfaces Protection Center provides comprehensive coating and surface protection services for industrial equipment, pipelines, and infrastructure. We specialize in corrosion prevention, thermal protection, and specialized coatings for harsh environments.",
    image: "/corrosion-testing.jpg",
    category: "Protection Services",
    icon: "🛡️",
    features: [
      "Industrial coating applications",
      "Corrosion protection systems",
      "Thermal barrier coatings",
      "Pipeline protection services",
      "Surface preparation and treatment",
      "Coating performance testing",
      "Environmental resistance testing",
      "Maintenance coating programs",
    ],
    equipment: [
      {
        id: "eq-sp-1",
        name: "Spray Application System",
        description: "Professional spray coating equipment for industrial applications",
        image: "/corrosion-testing.jpg",
        specifications: [
          "High-pressure spray system",
          "Multiple coating material compatibility",
          "Precision application control",
          "Environmental safety features",
        ],
      },
    ],
    centerHead: {
      id: "ch-6",
      name: "Eng. Khaled Mahmoud",
      title: "Director of Surfaces Protection Center",
      picture: "/eng-khaled-mahmoud.jpg",
      bio: "Eng. Khaled Mahmoud is a materials engineering specialist with over 18 years of experience in industrial coatings and corrosion protection. He has led numerous protection projects for major oil and gas companies.",
      email: "k.mahmoud@epri.edu",
      phone: "+20 2 1234 5683",
      expertise: [
        "Industrial Coatings",
        "Corrosion Protection",
        "Surface Engineering",
        "Materials Science",
        "Protection Systems",
      ],
    },
    duration: "1-3 weeks",
    price: 1500,
    isFree: false,
  },
  {
    id: "7",
    title: "Core Analysis Laboratory",
    subtitle: "Comprehensive rock and core sample analysis",
    description:
      "Our Core Analysis Laboratory provides detailed analysis of rock cores and samples to determine reservoir properties, porosity, permeability, and fluid flow characteristics essential for reservoir evaluation and development planning.",
    image: "/core-analysis-equipment.jpg",
    category: "Laboratory Services",
    icon: "🪨",
    features: [
      "Porosity and permeability measurements",
      "Capillary pressure analysis",
      "Relative permeability studies",
      "Rock mechanical properties",
      "Wettability analysis",
      "Core flooding experiments",
      "Reservoir quality assessment",
      "Digital core analysis",
    ],
    equipment: [
      {
        id: "eq-ca-1",
        name: "Core Analysis System",
        description: "Advanced equipment for comprehensive core property analysis",
        image: "/core-analysis-equipment.jpg",
        specifications: [
          "Automated porosity measurement",
          "Permeability analysis capability",
          "High-pressure core holder",
          "Digital imaging system",
        ],
      },
    ],
    centerHead: {
      id: "ch-7",
      name: "Dr. Laila Abdelrahman",
      title: "Head of Core Analysis Laboratory",
      picture: "/dr-laila-abdelrahman.jpg",
      bio: "Dr. Laila Abdelrahman is a petrophysicist with extensive experience in core analysis and reservoir characterization. She has published numerous papers on reservoir quality assessment.",
      email: "l.abdelrahman@epri.edu",
      phone: "+20 2 1234 5684",
      expertise: [
        "Core Analysis",
        "Petrophysics",
        "Reservoir Characterization",
        "Rock Properties",
        "Digital Core Analysis",
      ],
    },
    duration: "2-4 weeks",
    price: 2500,
    isFree: false,
  },
  {
    id: "8",
    title: "Asphalt & Polymers Services Center",
    subtitle: "Advanced asphalt and polymer testing and development",
    description:
      "Our Asphalt & Polymers Services Center provides comprehensive testing and development services for asphalt materials, polymer additives, and composite materials used in road construction and industrial applications.",
    image: "/drilling-engineering.jpg",
    category: "Materials Services",
    icon: "🛣️",
    features: [
      "Asphalt performance testing",
      "Polymer modification services",
      "Rheological property analysis",
      "Durability testing",
      "Environmental resistance studies",
      "Quality control testing",
      "Custom formulation development",
      "Field application support",
    ],
    equipment: [
      {
        id: "eq-ap-1",
        name: "Asphalt Testing Equipment",
        description: "Comprehensive testing suite for asphalt and polymer materials",
        image: "/drilling-engineering.jpg",
        specifications: [
          "Dynamic shear rheometer",
          "Bending beam rheometer",
          "Pressure aging vessel",
          "Rolling thin film oven",
        ],
      },
    ],
    centerHead: {
      id: "ch-8",
      name: "Dr. Yasser Khalil",
      title: "Director of Asphalt & Polymers Center",
      picture: "/dr-yasser-khalil.jpg",
      bio: "Dr. Yasser Khalil is a materials scientist specializing in asphalt and polymer technology. He has over 20 years of experience in road construction materials and polymer engineering.",
      email: "y.khalil@epri.edu",
      phone: "+20 2 1234 5685",
      expertise: [
        "Asphalt Technology",
        "Polymer Engineering",
        "Materials Science",
        "Road Construction",
        "Composite Materials",
      ],
    },
    duration: "1-2 weeks",
    price: 1200,
    isFree: false,
  },
  {
    id: "9",
    title: "Chemical Services and Development Center",
    subtitle: "Advanced chemical analysis and development services",
    description:
      "Our Chemical Services and Development Center provides comprehensive chemical analysis, synthesis, and development services for petroleum products, additives, and specialty chemicals used in the oil and gas industry.",
    image: "/petroleum-lab-testing.jpg",
    category: "Laboratory Services",
    icon: "🧪",
    features: [
      "Chemical composition analysis",
      "Additive development and testing",
      "Synthesis of specialty chemicals",
      "Quality control testing",
      "Method development and validation",
      "Stability and compatibility studies",
      "Environmental impact assessment",
      "Regulatory compliance testing",
    ],
    equipment: [
      {
        id: "eq-cs-1",
        name: "Chemical Analysis Laboratory",
        description: "State-of-the-art equipment for chemical analysis and development",
        image: "/petroleum-lab-testing.jpg",
        specifications: [
          "High-performance liquid chromatography",
          "Gas chromatography systems",
          "Spectrophotometric analyzers",
          "Automated titration systems",
        ],
      },
    ],
    centerHead: {
      id: "ch-9",
      name: "Dr. Fatma El-Sayed",
      title: "Director of Chemical Services Center",
      picture: "/dr-fatma-elsayed.jpg",
      bio: "Dr. Fatma El-Sayed is a chemical engineer with extensive experience in petroleum chemistry and chemical development. She has led numerous research projects in chemical analysis and synthesis.",
      email: "f.elsayed@epri.edu",
      phone: "+20 2 1234 5686",
      expertise: [
        "Chemical Analysis",
        "Petroleum Chemistry",
        "Chemical Synthesis",
        "Quality Control",
        "Method Development",
      ],
    },
    duration: "1-3 weeks",
    price: 1800,
    isFree: false,
  },
  {
    id: "10",
    title: "PVT Services Center",
    subtitle: "Pressure-Volume-Temperature analysis and reservoir fluid studies",
    description:
      "Our PVT Services Center provides comprehensive pressure-volume-temperature analysis and reservoir fluid characterization services essential for reservoir engineering, production planning, and enhanced oil recovery studies.",
    image: "/reservoir-engineering.jpg",
    category: "Laboratory Services",
    icon: "⚗️",
    features: [
      "PVT analysis of reservoir fluids",
      "Phase behavior studies",
      "Fluid property measurements",
      "EOR fluid compatibility testing",
      "Gas condensate analysis",
      "Heavy oil characterization",
      "Reservoir fluid sampling",
      "Enhanced recovery studies",
    ],
    equipment: [
      {
        id: "eq-pvt-1",
        name: "PVT Analysis System",
        description: "Advanced equipment for comprehensive PVT analysis",
        image: "/reservoir-engineering.jpg",
        specifications: [
          "High-pressure PVT cell",
          "Temperature control system",
          "Phase separation equipment",
          "Fluid property analyzers",
        ],
      },
    ],
    centerHead: {
      id: "ch-10",
      name: "Dr. Ahmed Hassan",
      title: "Director of PVT Services Center",
      picture: "/dr-ahmed-hassan.jpg",
      bio: "Dr. Ahmed Hassan is a reservoir engineer specializing in PVT analysis and fluid characterization. He has extensive experience in reservoir fluid studies and enhanced oil recovery.",
      email: "a.hassan@epri.edu",
      phone: "+20 2 1234 5687",
      expertise: [
        "PVT Analysis",
        "Reservoir Fluids",
        "Phase Behavior",
        "Enhanced Oil Recovery",
        "Fluid Characterization",
      ],
    },
    duration: "2-6 weeks",
    price: 3000,
    isFree: false,
  },
  {
    id: "11",
    title: "Tanks Services Center",
    subtitle: "Storage tank inspection, maintenance, and integrity assessment",
    description:
      "Our Tanks Services Center provides comprehensive inspection, maintenance, and integrity assessment services for storage tanks, pressure vessels, and industrial containers used in petroleum and chemical industries.",
    image: "/drilling-simulator.jpg",
    category: "Inspection Services",
    icon: "🏗️",
    features: [
      "Tank integrity assessment",
      "Non-destructive testing (NDT)",
      "Corrosion monitoring and evaluation",
      "Tank cleaning and maintenance",
      "Safety inspection services",
      "Leak detection and repair",
      "Structural analysis",
      "Compliance certification",
    ],
    equipment: [
      {
        id: "eq-ts-1",
        name: "Tank Inspection Equipment",
        description: "Comprehensive equipment for tank inspection and assessment",
        image: "/drilling-simulator.jpg",
        specifications: [
          "Ultrasonic thickness gauges",
          "Magnetic particle testing equipment",
          "Visual inspection tools",
          "Leak detection systems",
        ],
      },
    ],
    centerHead: {
      id: "ch-11",
      name: "Eng. Khaled Mahmoud",
      title: "Director of Tanks Services Center",
      picture: "/eng-khaled-mahmoud.jpg",
      bio: "Eng. Khaled Mahmoud is a mechanical engineer specializing in tank inspection and maintenance. He has over 15 years of experience in industrial equipment integrity assessment.",
      email: "k.mahmoud@epri.edu",
      phone: "+20 2 1234 5688",
      expertise: [
        "Tank Inspection",
        "Non-Destructive Testing",
        "Corrosion Assessment",
        "Structural Analysis",
        "Safety Engineering",
      ],
    },
    duration: "1-4 weeks",
    price: 2000,
    isFree: false,
  },
  {
    id: "12",
    title: "Central Analytical Laboratory",
    subtitle: "Comprehensive analytical services for petroleum and chemical analysis",
    description:
      "Our Central Analytical Laboratory serves as the primary analytical facility providing comprehensive testing services for petroleum products, chemicals, and environmental samples using state-of-the-art analytical instruments and methodologies.",
    image: "/gc-ms-equipment.jpg",
    category: "Laboratory Services",
    icon: "🔬",
    features: [
      "Comprehensive chemical analysis",
      "Petroleum product testing",
      "Environmental sample analysis",
      "Quality assurance testing",
      "Method development and validation",
      "Regulatory compliance testing",
      "Research and development support",
      "Consulting and advisory services",
    ],
    equipment: [
      {
        id: "eq-cal-1",
        name: "Central Analytical Instruments",
        description: "Complete suite of analytical instruments for comprehensive testing",
        image: "/gc-ms-equipment.jpg",
        specifications: [
          "Gas chromatography-mass spectrometry",
          "Atomic absorption spectrophotometry",
          "Fourier transform infrared spectroscopy",
          "Nuclear magnetic resonance",
        ],
      },
    ],
    centerHead: {
      id: "ch-12",
      name: "Dr. Laila Abdelrahman",
      title: "Director of Central Analytical Laboratory",
      picture: "/dr-laila-abdelrahman.jpg",
      bio: "Dr. Laila Abdelrahman is an analytical chemist with extensive experience in petroleum and environmental analysis. She has published numerous papers on analytical method development.",
      email: "l.abdelrahman@epri.edu",
      phone: "+20 2 1234 5689",
      expertise: [
        "Analytical Chemistry",
        "Petroleum Analysis",
        "Environmental Analysis",
        "Method Development",
        "Quality Assurance",
      ],
    },
    duration: "1-5 days",
    price: 800,
    isFree: false,
  },
  {
    id: "13",
    title: "Technical Support & Technology Center",
    subtitle: "Comprehensive technical support and technology transfer services",
    description:
      "Our Technical Support & Technology Center provides comprehensive technical support, technology transfer, and consulting services to help companies implement advanced technologies and optimize their operations in the petroleum and energy sectors.",
    image: "/machine-learning-technology.jpg",
    category: "Technical Services",
    icon: "🔧",
    features: [
      "Technical consulting services",
      "Technology transfer programs",
      "Process optimization support",
      "Training and capacity building",
      "Technical documentation",
      "Field support services",
      "Troubleshooting and diagnostics",
      "Innovation and R&D support",
    ],
    equipment: [
      {
        id: "eq-tst-1",
        name: "Technical Support Equipment",
        description: "Comprehensive equipment for technical support and field services",
        image: "/machine-learning-technology.jpg",
        specifications: [
          "Portable diagnostic equipment",
          "Field testing instruments",
          "Communication systems",
          "Technical documentation tools",
        ],
      },
    ],
    centerHead: {
      id: "ch-13",
      name: "Dr. Yasser Khalil",
      title: "Director of Technical Support Center",
      picture: "/dr-yasser-khalil.jpg",
      bio: "Dr. Yasser Khalil is a technical expert with extensive experience in petroleum operations and technology transfer. He has led numerous technical support projects for major oil companies.",
      email: "y.khalil@epri.edu",
      phone: "+20 2 1234 5690",
      expertise: [
        "Technical Support",
        "Technology Transfer",
        "Process Optimization",
        "Field Operations",
        "Technical Training",
      ],
    },
    duration: "Ongoing",
    price: 2500,
    isFree: false,
  },
]

export const serviceCategories = [
  { id: "1", name: "Laboratory Services", icon: "🔬", count: 6 },
  { id: "2", name: "Engineering Services", icon: "⚙️", count: 2 },
  { id: "3", name: "Environmental Services", icon: "🌍", count: 1 },
  { id: "4", name: "Exploration Services", icon: "📡", count: 1 },
  { id: "5", name: "Protection Services", icon: "🛡️", count: 1 },
  { id: "6", name: "Materials Services", icon: "🛣️", count: 1 },
  { id: "7", name: "Inspection Services", icon: "🏗️", count: 1 },
  { id: "8", name: "Technical Services", icon: "🔧", count: 1 },
]

export const departments: Department[] = [
  {
    id: "1",
    name: "Sedimentology Laboratory",
    description:
      "Advanced sedimentological analysis and research facility specializing in sediment characterization, depositional environment interpretation, and reservoir quality assessment.",
    image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
    icon: "🪨",
    manager: {
      id: "dm-1",
      name: "Dr. Hoda Mahmoud",
      title: "Head of Sedimentology Laboratory",
      picture: "/dr-hoda-mahmoud.jpg",
      bio: "Dr. Hoda Mahmoud is a leading sedimentologist with over 18 years of experience in sedimentary petrology and reservoir characterization. She has published extensively on clastic reservoir systems and has led numerous research projects on Egyptian petroleum reservoirs.",
      email: "h.mahmoud@epri.edu",
      phone: "+20 2 1234 5690",
      expertise: [
        "Sedimentary Petrology",
        "Reservoir Characterization",
        "Clastic Reservoir Systems",
        "Petroleum Geology",
        "Core Analysis",
      ],
    },
    equipment: [
      {
        id: "sed-eq-1",
        name: "Petrographic Microscope System",
        description:
          "Advanced polarizing microscope with digital imaging for detailed thin section analysis and mineral identification",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Transmitted and reflected light modes",
          "Polarization capabilities",
          "High-resolution digital camera (20MP)",
          "Image analysis software",
          "Automated stage control",
        ],
      },
      {
        id: "sed-eq-2",
        name: "Grain Size Analyzer",
        description: "Laser diffraction particle size analyzer for sediment grain size distribution analysis",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Measurement range: 0.01 to 3500 μm",
          "Wet and dry dispersion",
          "Automated sample handling",
          "Statistical analysis software",
        ],
      },
      {
        id: "sed-eq-3",
        name: "X-Ray Diffractometer (XRD)",
        description: "High-precision XRD system for mineral composition and clay mineral analysis",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Cu Kα radiation source",
          "2θ range: 3° to 90°",
          "Automated sample changer",
          "Phase identification software",
          "Quantitative analysis capability",
        ],
      },
      {
        id: "sed-eq-4",
        name: "Sieve Shaker System",
        description: "Mechanical sieve shaker for traditional grain size analysis",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Digital timer control",
          "Variable amplitude settings",
          "Capacity: up to 8 sieves",
          "ASTM standard sieves",
        ],
      },
    ],
    analysisServices: [
      {
        id: "sed-srv-1",
        name: "Thin Section Preparation & Analysis",
        description: "Preparation of polished thin sections and comprehensive petrographic analysis",
        duration: "3-5 days",
        price: 300,
      },
      {
        id: "sed-srv-2",
        name: "Grain Size Distribution Analysis",
        description: "Complete grain size analysis using laser diffraction and sieving methods",
        duration: "2-3 days",
        price: 200,
      },
      {
        id: "sed-srv-3",
        name: "Mineral Composition Analysis (XRD)",
        description: "Quantitative mineral composition determination using X-ray diffraction",
        duration: "3-4 days",
        price: 400,
      },
      {
        id: "sed-srv-4",
        name: "Sedimentary Facies Analysis",
        description: "Detailed facies description and depositional environment interpretation",
        duration: "5-7 days",
        price: 600,
      },
      {
        id: "sed-srv-5",
        name: "Reservoir Quality Assessment",
        description: "Comprehensive evaluation of reservoir rock properties and quality",
        duration: "7-10 days",
        price: 1000,
      },
    ],
    staff: [
      {
        id: "sed-staff-1",
        name: "Dr. Ahmed Farouk",
        title: "Senior Sedimentologist",
        picture: "/dr-ahmed-farouk.jpg",
        specialization: "Carbonate Sedimentology",
        email: "a.farouk@epri.edu",
      },
      {
        id: "sed-staff-2",
        name: "Dr. Mona Hassan",
        title: "Research Scientist",
        picture: "/dr-mona-hassan.jpg",
        specialization: "Clastic Reservoirs",
        email: "m.hassan@epri.edu",
      },
      {
        id: "sed-staff-3",
        name: "Eng. Karim Youssef",
        title: "Laboratory Technician",
        picture: "/eng-karim-youssef.jpg",
        specialization: "Sample Preparation",
        email: "k.youssef@epri.edu",
      },
      {
        id: "sed-staff-4",
        name: "Ms. Nadia Ali",
        title: "Research Assistant",
        picture: "/ms-nadia-ali.jpg",
        specialization: "Grain Size Analysis",
        email: "n.ali@epri.edu",
      },
    ],
    about:
      "The Sedimentology Laboratory at EPRI is a state-of-the-art facility dedicated to the study of sedimentary rocks and their properties. Our laboratory provides comprehensive sedimentological analysis services for petroleum exploration and production, reservoir characterization, and geological research. We combine traditional sedimentological techniques with modern analytical methods to deliver accurate and reliable results. Our team of experienced sedimentologists and technicians work closely with clients to understand their specific needs and provide customized solutions.",
    achievements: [
      "Published over 100 research papers in international journals",
      "Analyzed samples from more than 500 wells across Egypt",
      "Developed innovative methods for reservoir quality prediction",
      "Trained over 200 geologists and petroleum engineers",
      "Collaborated with major oil and gas companies on exploration projects",
    ],
    researchAreas: [
      "Clastic reservoir characterization",
      "Carbonate sedimentology",
      "Depositional environment analysis",
      "Diagenesis and reservoir quality",
      "Sequence stratigraphy",
      "Sediment provenance studies",
    ],
  },
  {
    id: "2",
    name: "Paleontology Laboratory",
    description:
      "Specialized facility for micropaleontological and biostratigraphic analysis, providing age dating, paleoenvironmental interpretation, and correlation services for petroleum exploration.",
    image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
    icon: "🦴",
    manager: {
      id: "dm-2",
      name: "Prof. Samira El-Naggar",
      title: "Head of Paleontology Laboratory",
      picture: "/prof-samira-elnaggar.jpg",
      bio: "Prof. Samira El-Naggar is a distinguished micropaleontologist with over 25 years of experience in biostratigraphy and paleoenvironmental analysis. She is recognized internationally for her work on Cretaceous and Tertiary foraminifera of Egypt and has supervised numerous Ph.D. students.",
      email: "s.elnaggar@epri.edu",
      phone: "+20 2 1234 5691",
      expertise: [
        "Micropaleontology",
        "Biostratigraphy",
        "Paleoenvironmental Analysis",
        "Foraminifera Studies",
        "Palynology",
      ],
    },
    equipment: [
      {
        id: "pal-eq-1",
        name: "Stereomicroscope with Digital Imaging",
        description: "High-quality stereomicroscope for fossil identification and photography",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Magnification: 7x to 90x",
          "LED illumination system",
          "Digital camera (16MP)",
          "Image stacking software",
          "Calibrated measurement tools",
        ],
      },
      {
        id: "pal-eq-2",
        name: "Microfossil Preparation System",
        description: "Complete system for sample processing and microfossil extraction",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Ultrasonic cleaner",
          "Sieving equipment (various mesh sizes)",
          "Drying oven",
          "Heavy liquid separation setup",
          "Picking tools and slides",
        ],
      },
      {
        id: "pal-eq-3",
        name: "Scanning Electron Microscope (SEM)",
        description: "High-resolution SEM for detailed microfossil morphology studies",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Magnification up to 100,000x",
          "Variable pressure mode",
          "Energy-dispersive spectroscopy (EDS)",
          "Digital image capture",
          "3D reconstruction capability",
        ],
      },
      {
        id: "pal-eq-4",
        name: "Reference Collection Database",
        description: "Comprehensive digital and physical reference collection of microfossils",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Over 10,000 catalogued specimens",
          "Digital image database",
          "Searchable taxonomy system",
          "Geographic and stratigraphic data",
        ],
      },
    ],
    analysisServices: [
      {
        id: "pal-srv-1",
        name: "Biostratigraphic Analysis",
        description: "Age determination and correlation using microfossils (foraminifera, nannofossils, palynomorphs)",
        duration: "5-7 days",
        price: 500,
      },
      {
        id: "pal-srv-2",
        name: "Paleoenvironmental Interpretation",
        description: "Reconstruction of depositional environments based on fossil assemblages",
        duration: "4-6 days",
        price: 450,
      },
      {
        id: "pal-srv-3",
        name: "Foraminiferal Analysis",
        description: "Detailed foraminiferal identification and quantitative analysis",
        duration: "3-5 days",
        price: 400,
      },
      {
        id: "pal-srv-4",
        name: "Palynological Analysis",
        description: "Pollen, spore, and organic-walled microfossil analysis",
        duration: "5-8 days",
        price: 550,
      },
      {
        id: "pal-srv-5",
        name: "Well Correlation Studies",
        description: "Biostratigraphic correlation of multiple wells for reservoir mapping",
        duration: "10-15 days",
        price: 1500,
      },
    ],
    staff: [
      {
        id: "pal-staff-1",
        name: "Dr. Mahmoud Abdel-Aziz",
        title: "Senior Micropaleontologist",
        picture: "/dr-mahmoud-abdelaziz.jpg",
        specialization: "Foraminifera",
        email: "m.abdelaziz@epri.edu",
      },
      {
        id: "pal-staff-2",
        name: "Dr. Eman Mostafa",
        title: "Research Scientist",
        picture: "/dr-eman-mostafa.jpg",
        specialization: "Palynology",
        email: "e.mostafa@epri.edu",
      },
      {
        id: "pal-staff-3",
        name: "Dr. Hassan Khalil",
        title: "Biostratigrapher",
        picture: "/dr-hassan-khalil.jpg",
        specialization: "Nannofossils",
        email: "h.khalil@epri.edu",
      },
      {
        id: "pal-staff-4",
        name: "Ms. Rania Ahmed",
        title: "Laboratory Technician",
        picture: "/ms-rania-ahmed.jpg",
        specialization: "Sample Processing",
        email: "r.ahmed@epri.edu",
      },
    ],
    about:
      "The Paleontology Laboratory at EPRI is a premier facility for micropaleontological research and biostratigraphic services. Our laboratory specializes in the study of microfossils for petroleum exploration, providing accurate age dating, paleoenvironmental interpretation, and well correlation services. We maintain an extensive reference collection and utilize both traditional and modern analytical techniques. Our team of expert micropaleontologists has extensive experience working with Egyptian sedimentary sequences and provides reliable, high-quality results for exploration and production projects.",
    achievements: [
      "Established comprehensive biostratigraphic framework for Egyptian basins",
      "Analyzed samples from over 800 exploration and production wells",
      "Published landmark studies on Egyptian micropaleontology",
      "Developed innovative methods for paleoenvironmental reconstruction",
      "Trained generations of micropaleontologists and biostratigraphers",
    ],
    researchAreas: [
      "Cretaceous-Tertiary biostratigraphy",
      "Foraminiferal taxonomy and evolution",
      "Paleoenvironmental reconstruction",
      "Sequence biostratigraphy",
      "Palynology and paleoecology",
      "Integrated stratigraphic studies",
    ],
  },
  {
    id: "3",
    name: "Geophysics Laboratory",
    description:
      "Advanced geophysical research facility equipped with state-of-the-art instruments for seismic data processing, well log analysis, and geophysical modeling for petroleum exploration and reservoir characterization.",
    image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
    icon: "📊",
    manager: {
      id: "dm-3",
      name: "Dr. Tarek Abdel-Fattah",
      title: "Head of Geophysics Laboratory",
      picture: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
      bio: "Dr. Tarek Abdel-Fattah is a renowned geophysicist with over 20 years of experience in seismic interpretation and reservoir geophysics. He has worked on major exploration projects across Egypt and the Middle East and is an expert in advanced seismic attributes and reservoir characterization techniques.",
      email: "t.abdelfattah@epri.edu",
      phone: "+20 2 1234 5692",
      expertise: [
        "Seismic Interpretation",
        "Reservoir Geophysics",
        "Seismic Attributes",
        "Reservoir Characterization",
        "Exploration Geophysics",
      ],
    },
    equipment: [
      {
        id: "geo-eq-1",
        name: "Seismic Interpretation Workstation",
        description: "High-performance workstation with commercial seismic interpretation software",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Dual Xeon processors (32 cores each)",
          "256 GB RAM",
          "NVIDIA RTX A6000 GPU",
          "Petrel, Kingdom, and OpendTect software",
          "Large-format display (43-inch 4K)",
        ],
      },
      {
        id: "geo-eq-2",
        name: "Well Log Analysis System",
        description: "Comprehensive system for petrophysical analysis and formation evaluation",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Interactive Petrophysics (IP) software",
          "Techlog software suite",
          "Multi-well correlation tools",
          "Automated log quality control",
          "Reservoir property calculation",
        ],
      },
      {
        id: "geo-eq-3",
        name: "Gravity and Magnetic Data Processing System",
        description: "Specialized software and hardware for potential field data processing",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "Oasis montaj software",
          "GM-SYS modeling software",
          "Automated data processing workflows",
          "3D visualization capabilities",
        ],
      },
      {
        id: "geo-eq-4",
        name: "Portable Seismograph",
        description: "Field seismograph for seismic data acquisition and testing",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "48-channel recording capability",
          "GPS time synchronization",
          "Real-time data quality monitoring",
          "Wireless data transmission",
          "Rugged field design",
        ],
      },
      {
        id: "geo-eq-5",
        name: "Electrical Resistivity Imaging System",
        description: "Multi-electrode system for subsurface resistivity surveys",
        image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?_gl=1*41q9qu*_ga*MjA0Nzg5My4xNzU4Nzk1MTkx*_ga_8JE65Q40S6*czE3NjA0MzA5MDMkbzUkZzEkdDE3NjA0MzA5OTckajYwJGwwJGgw",
        specifications: [
          "64-channel capability",
          "Automatic electrode switching",
          "Multiple array configurations",
          "2D and 3D inversion software",
        ],
      },
    ],
    analysisServices: [
      {
        id: "geo-srv-1",
        name: "2D/3D Seismic Interpretation",
        description: "Comprehensive seismic data interpretation including structural and stratigraphic analysis",
        duration: "2-4 weeks",
        price: 3000,
      },
      {
        id: "geo-srv-2",
        name: "Well Log Analysis & Petrophysics",
        description: "Complete petrophysical evaluation including porosity, permeability, and saturation calculations",
        duration: "1-2 weeks",
        price: 1200,
      },
      {
        id: "geo-srv-3",
        name: "Seismic Attribute Analysis",
        description: "Advanced seismic attribute extraction and interpretation for reservoir characterization",
        duration: "2-3 weeks",
        price: 2000,
      },
      {
        id: "geo-srv-4",
        name: "Gravity and Magnetic Survey Processing",
        description: "Processing and interpretation of potential field data for basin analysis",
        duration: "2-3 weeks",
        price: 1800,
      },
      {
        id: "geo-srv-5",
        name: "Integrated Geophysical Studies",
        description: "Multi-disciplinary geophysical analysis combining seismic, well log, and potential field data",
        duration: "4-6 weeks",
        price: 5000,
      },
      {
        id: "geo-srv-6",
        name: "Reservoir Geophysics",
        description: "Specialized geophysical analysis for reservoir characterization and monitoring",
        duration: "3-5 weeks",
        price: 4000,
      },
    ],
    staff: [
      {
        id: "geo-staff-1",
        name: "Dr. Amira Soliman",
        title: "Senior Geophysicist",
        picture: "/dr-amira-soliman.jpg",
        specialization: "Seismic Interpretation",
        email: "a.soliman@epri.edu",
      },
      {
        id: "geo-staff-2",
        name: "Dr. Omar Rashad",
        title: "Petrophysicist",
        picture: "/dr-omar-rashad.jpg",
        specialization: "Well Log Analysis",
        email: "o.rashad@epri.edu",
      },
      {
        id: "geo-staff-3",
        name: "Eng. Dina Kamal",
        title: "Geophysical Analyst",
        picture: "/eng-dina-kamal.jpg",
        specialization: "Seismic Attributes",
        email: "d.kamal@epri.edu",
      },
      {
        id: "geo-staff-4",
        name: "Dr. Youssef Ibrahim",
        title: "Research Scientist",
        picture: "/dr-youssef-ibrahim.jpg",
        specialization: "Potential Field Methods",
        email: "y.ibrahim@epri.edu",
      },
      {
        id: "geo-staff-5",
        name: "Eng. Sara Mahmoud",
        title: "Geophysical Technician",
        picture: "/eng-sara-mahmoud.jpg",
        specialization: "Data Processing",
        email: "s.mahmoud@epri.edu",
      },
    ],
    about:
      "The Geophysics Laboratory at EPRI is a cutting-edge facility dedicated to geophysical research and services for petroleum exploration and production. Our laboratory is equipped with the latest hardware and software for seismic data processing and interpretation, well log analysis, and potential field studies. We provide comprehensive geophysical services to oil and gas companies, research institutions, and government agencies. Our team of experienced geophysicists combines theoretical knowledge with practical expertise to deliver high-quality results and innovative solutions to complex exploration and reservoir challenges.",
    achievements: [
      "Processed and interpreted over 50,000 km of 2D seismic data",
      "Analyzed well logs from more than 1,000 wells",
      "Discovered multiple hydrocarbon prospects through integrated studies",
      "Developed innovative seismic attribute workflows",
      "Published groundbreaking research on Egyptian petroleum systems",
      "Trained hundreds of geophysicists and petroleum engineers",
    ],
    researchAreas: [
      "Seismic stratigraphy and sequence analysis",
      "Reservoir geophysics and characterization",
      "Seismic attribute analysis and machine learning",
      "Petrophysics and formation evaluation",
      "Potential field methods for basin analysis",
      "4D seismic and reservoir monitoring",
      "Integrated geophysical-geological studies",
    ],
  },
  {
    id: "4",
    name: "Exploration Department",
    description: "Advanced exploration techniques and geological studies for hydrocarbon discovery",
    image: "/geophysical-survey.jpg",
    icon: "🔍",
    manager: {
      id: "mgr-4",
      name: "Dr. Tarek Abdel-Fattah",
      title: "Head of Exploration Department",
      picture: "/dr-tarek-abdelfattah.jpg",
      bio: "Dr. Tarek Abdel-Fattah is a renowned exploration geologist with over 25 years of experience in hydrocarbon exploration. He has led numerous successful exploration campaigns across Egypt and the Middle East.",
      email: "t.abdelfattah@epri.edu",
      phone: "+20 2 1234 5691",
      expertise: [
        "Exploration Geology",
        "Structural Geology",
        "Basin Analysis",
        "Prospect Evaluation",
        "Exploration Risk Assessment",
      ],
    },
    equipment: [
      {
        id: "eq-exp-1",
        name: "Seismic Interpretation Workstation",
        description: "Advanced workstation for seismic data interpretation and analysis",
        image: "/seismic-workstation.jpg",
        specifications: [
          "High-resolution display system",
          "Advanced interpretation software",
          "3D visualization capabilities",
          "Multi-attribute analysis tools",
        ],
      },
      {
        id: "eq-exp-2",
        name: "Portable Seismograph",
        description: "Field-deployable seismograph for exploration surveys",
        image: "/seismograph-equipment.jpg",
        specifications: [
          "Multi-channel recording system",
          "GPS synchronization",
          "Weather-resistant housing",
          "Real-time data transmission",
        ],
      },
    ],
    analysisServices: [
      {
        id: "as-exp-1",
        name: "Seismic Data Interpretation",
        description: "Comprehensive interpretation of 2D and 3D seismic data for structural and stratigraphic analysis",
      },
      {
        id: "as-exp-2",
        name: "Prospect Evaluation",
        description: "Detailed evaluation of exploration prospects including risk assessment and resource estimation",
      },
      {
        id: "as-exp-3",
        name: "Basin Analysis",
        description: "Regional basin analysis and petroleum system modeling for exploration planning",
      },
    ],
    staff: [
      {
        id: "staff-exp-1",
        name: "Dr. Tarek Abdel-Fattah",
        title: "Head of Exploration",
        picture: "/dr-tarek-abdelfattah.jpg",
        specialization: "Exploration Geology",
        email: "t.abdelfattah@epri.edu",
      },
      {
        id: "staff-exp-2",
        name: "Dr. Ahmed Hassan",
        title: "Senior Exploration Geologist",
        picture: "/dr-ahmed-hassan.jpg",
        specialization: "Structural Geology",
        email: "a.hassan@epri.edu",
      },
      {
        id: "staff-exp-3",
        name: "Dr. Fatma El-Sayed",
        title: "Exploration Geophysicist",
        picture: "/dr-fatma-elsayed.jpg",
        specialization: "Seismic Interpretation",
        email: "f.elsayed@epri.edu",
      },
    ],
    about: "The Exploration Department is dedicated to discovering new hydrocarbon resources through advanced geological and geophysical techniques. Our team combines traditional exploration methods with cutting-edge technology to identify and evaluate exploration prospects.",
    achievements: [
      "Discovered 15 new oil and gas fields in the past 10 years",
      "Developed innovative seismic interpretation techniques",
      "Published 25+ research papers in international journals",
      "Trained 100+ exploration professionals",
    ],
    researchAreas: [
      "Seismic interpretation and attribute analysis",
      "Structural geology and trap analysis",
      "Basin analysis and petroleum systems",
      "Prospect evaluation and risk assessment",
      "Exploration geochemistry",
      "Remote sensing applications in exploration",
    ],
  },
  {
    id: "5",
    name: "Production Department",
    description: "Optimization of hydrocarbon production and field development strategies",
    image: "/drilling-engineering.jpg",
    icon: "⛽",
    manager: {
      id: "mgr-5",
      name: "Dr. Mohamed Ibrahim",
      title: "Head of Production Department",
      picture: "/dr-mohamed-ibrahim.jpg",
      bio: "Dr. Mohamed Ibrahim is a production engineer with extensive experience in field development and production optimization. He has worked on major production projects across Egypt and North Africa.",
      email: "m.ibrahim@epri.edu",
      phone: "+20 2 1234 5692",
      expertise: [
        "Production Engineering",
        "Field Development",
        "Production Optimization",
        "Well Performance",
        "Artificial Lift Systems",
      ],
    },
    equipment: [
      {
        id: "eq-prod-1",
        name: "Drilling Simulator",
        description: "Advanced drilling simulation system for training and optimization",
        image: "/drilling-simulator.jpg",
        specifications: [
          "Real-time drilling simulation",
          "Multiple wellbore scenarios",
          "Drilling optimization algorithms",
          "Safety training modules",
        ],
      },
      {
        id: "eq-prod-2",
        name: "Production Testing Equipment",
        description: "Comprehensive equipment for production testing and optimization",
        image: "/drilling-engineering.jpg",
        specifications: [
          "Multi-phase flow meters",
          "Pressure and temperature sensors",
          "Production logging tools",
          "Data acquisition systems",
        ],
      },
    ],
    analysisServices: [
      {
        id: "as-prod-1",
        name: "Production Optimization",
        description: "Comprehensive analysis and optimization of production systems for maximum efficiency",
      },
      {
        id: "as-prod-2",
        name: "Field Development Planning",
        description: "Strategic planning and design of field development projects",
      },
      {
        id: "as-prod-3",
        name: "Well Performance Analysis",
        description: "Detailed analysis of well performance and productivity enhancement",
      },
    ],
    staff: [
      {
        id: "staff-prod-1",
        name: "Dr. Mohamed Ibrahim",
        title: "Head of Production",
        picture: "/dr-mohamed-ibrahim.jpg",
        specialization: "Production Engineering",
        email: "m.ibrahim@epri.edu",
      },
      {
        id: "staff-prod-2",
        name: "Eng. Khaled Mahmoud",
        title: "Senior Production Engineer",
        picture: "/eng-khaled-mahmoud.jpg",
        specialization: "Field Development",
        email: "k.mahmoud@epri.edu",
      },
      {
        id: "staff-prod-3",
        name: "Dr. Yasser Khalil",
        title: "Production Optimization Specialist",
        picture: "/dr-yasser-khalil.jpg",
        specialization: "Production Optimization",
        email: "y.khalil@epri.edu",
      },
    ],
    about: "The Production Department focuses on optimizing hydrocarbon production through advanced engineering techniques and innovative technologies. We work closely with operators to maximize recovery and ensure efficient field operations.",
    achievements: [
      "Increased production by 30% in 20+ fields",
      "Developed innovative artificial lift systems",
      "Implemented digital oilfield technologies",
      "Reduced production costs by 25%",
    ],
    researchAreas: [
      "Production optimization and enhancement",
      "Artificial lift systems and design",
      "Digital oilfield technologies",
      "Well completion and stimulation",
      "Production chemistry and flow assurance",
      "Field development and planning",
    ],
  },
  {
    id: "6",
    name: "Analysis & Evaluation Department",
    description: "Comprehensive analysis and evaluation of petroleum systems and resources",
    image: "/petroleum-lab-testing.jpg",
    icon: "📊",
    manager: {
      id: "mgr-6",
      name: "Dr. Laila Abdelrahman",
      title: "Head of Analysis & Evaluation Department",
      picture: "/dr-laila-abdelrahman.jpg",
      bio: "Dr. Laila Abdelrahman is an analytical chemist specializing in petroleum analysis and evaluation. She has over 20 years of experience in laboratory analysis and quality control.",
      email: "l.abdelrahman@epri.edu",
      phone: "+20 2 1234 5693",
      expertise: [
        "Petroleum Analysis",
        "Quality Control",
        "Laboratory Management",
        "Method Development",
        "Data Analysis",
      ],
    },
    equipment: [
      {
        id: "eq-ae-1",
        name: "Gas Chromatography-Mass Spectrometry",
        description: "Advanced analytical instrument for petroleum analysis",
        image: "/gc-ms-equipment.jpg",
        specifications: [
          "High-resolution mass spectrometer",
          "Temperature programming capability",
          "Automated sample injection",
          "Data analysis software",
        ],
      },
      {
        id: "eq-ae-2",
        name: "Spectrophotometer",
        description: "Precision instrument for chemical analysis",
        image: "/spectrophotometer-equipment.jpg",
        specifications: [
          "UV-Vis spectrophotometer",
          "Atomic absorption capability",
          "Multi-element analysis",
          "Automated sample handling",
        ],
      },
    ],
    analysisServices: [
      {
        id: "as-ae-1",
        name: "Petroleum Product Analysis",
        description: "Comprehensive analysis of petroleum products and crude oils",
      },
      {
        id: "as-ae-2",
        name: "Quality Control Testing",
        description: "Quality assurance and control testing for petroleum products",
      },
      {
        id: "as-ae-3",
        name: "Environmental Analysis",
        description: "Analysis of environmental samples and contamination assessment",
      },
    ],
    staff: [
      {
        id: "staff-ae-1",
        name: "Dr. Laila Abdelrahman",
        title: "Head of Analysis & Evaluation",
        picture: "/dr-laila-abdelrahman.jpg",
        specialization: "Analytical Chemistry",
        email: "l.abdelrahman@epri.edu",
      },
      {
        id: "staff-ae-2",
        name: "Dr. Fatma El-Sayed",
        title: "Senior Analytical Chemist",
        picture: "/dr-fatma-elsayed.jpg",
        specialization: "Petroleum Analysis",
        email: "f.elsayed@epri.edu",
      },
      {
        id: "staff-ae-3",
        name: "Dr. Ahmed Hassan",
        title: "Quality Control Specialist",
        picture: "/dr-ahmed-hassan.jpg",
        specialization: "Quality Assurance",
        email: "a.hassan@epri.edu",
      },
    ],
    about: "The Analysis & Evaluation Department provides comprehensive analytical services for petroleum products, environmental samples, and research materials. We maintain the highest standards of accuracy and precision in all our analyses.",
    achievements: [
      "Processed over 10,000 samples annually",
      "Maintained 99.5% accuracy rate",
      "Developed 15 new analytical methods",
      "Achieved ISO 17025 accreditation",
    ],
    researchAreas: [
      "Analytical method development",
      "Petroleum product characterization",
      "Environmental contamination analysis",
      "Quality control and assurance",
      "Data analysis and interpretation",
      "Laboratory automation and optimization",
    ],
  },
  {
    id: "7",
    name: "Refining Department",
    description: "Advanced refining processes and petrochemical production technologies",
    image: "/reservoir-engineering.jpg",
    icon: "🏭",
    manager: {
      id: "mgr-7",
      name: "Dr. Yasser Khalil",
      title: "Head of Refining Department",
      picture: "/dr-yasser-khalil.jpg",
      bio: "Dr. Yasser Khalil is a chemical engineer specializing in refining processes and petrochemical production. He has extensive experience in refinery operations and process optimization.",
      email: "y.khalil@epri.edu",
      phone: "+20 2 1234 5694",
      expertise: [
        "Refining Processes",
        "Petrochemical Production",
        "Process Optimization",
        "Catalysis",
        "Process Design",
      ],
    },
    equipment: [
      {
        id: "eq-ref-1",
        name: "Pilot Refining Unit",
        description: "Small-scale refining unit for process development and testing",
        image: "/reservoir-engineering.jpg",
        specifications: [
          "Multiple distillation columns",
          "Catalytic cracking unit",
          "Hydrotreating capability",
          "Process control system",
        ],
      },
      {
        id: "eq-ref-2",
        name: "Catalyst Testing Equipment",
        description: "Equipment for catalyst performance evaluation and optimization",
        image: "/petroleum-lab-testing.jpg",
        specifications: [
          "Fixed-bed reactor system",
          "Temperature and pressure control",
          "Gas analysis capability",
          "Automated data collection",
        ],
      },
    ],
    analysisServices: [
      {
        id: "as-ref-1",
        name: "Process Optimization",
        description: "Optimization of refining processes for improved efficiency and product quality",
      },
      {
        id: "as-ref-2",
        name: "Catalyst Development",
        description: "Development and testing of new catalysts for refining applications",
      },
      {
        id: "as-ref-3",
        name: "Product Quality Analysis",
        description: "Comprehensive analysis of refined products and intermediates",
      },
    ],
    staff: [
      {
        id: "staff-ref-1",
        name: "Dr. Yasser Khalil",
        title: "Head of Refining",
        picture: "/dr-yasser-khalil.jpg",
        specialization: "Chemical Engineering",
        email: "y.khalil@epri.edu",
      },
      {
        id: "staff-ref-2",
        name: "Dr. Mohamed Ibrahim",
        title: "Senior Process Engineer",
        picture: "/dr-mohamed-ibrahim.jpg",
        specialization: "Process Engineering",
        email: "m.ibrahim@epri.edu",
      },
      {
        id: "staff-ref-3",
        name: "Eng. Khaled Mahmoud",
        title: "Catalyst Specialist",
        picture: "/eng-khaled-mahmoud.jpg",
        specialization: "Catalysis",
        email: "k.mahmoud@epri.edu",
      },
    ],
    about: "The Refining Department focuses on developing and optimizing refining processes for maximum efficiency and product quality. We work on both conventional and advanced refining technologies.",
    achievements: [
      "Improved refinery efficiency by 15%",
      "Developed 5 new catalyst formulations",
      "Reduced energy consumption by 20%",
      "Enhanced product quality standards",
    ],
    researchAreas: [
      "Refining process optimization",
      "Catalyst development and testing",
      "Petrochemical production",
      "Process integration and design",
      "Energy efficiency improvement",
      "Environmental impact reduction",
    ],
  },
  {
    id: "8",
    name: "Petroleum Applications Department",
    description: "Development of petroleum-based applications and specialty products",
    image: "/corrosion-testing.jpg",
    icon: "🔬",
    manager: {
      id: "mgr-8",
      name: "Dr. Fatma El-Sayed",
      title: "Head of Petroleum Applications Department",
      picture: "/dr-fatma-elsayed.jpg",
      bio: "Dr. Fatma El-Sayed is a materials scientist specializing in petroleum-based applications and specialty products. She has extensive experience in product development and applications research.",
      email: "f.elsayed@epri.edu",
      phone: "+20 2 1234 5695",
      expertise: [
        "Materials Science",
        "Product Development",
        "Applications Research",
        "Polymer Science",
        "Surface Chemistry",
      ],
    },
    equipment: [
      {
        id: "eq-pa-1",
        name: "Polymer Testing Equipment",
        description: "Comprehensive equipment for polymer and materials testing",
        image: "/corrosion-testing.jpg",
        specifications: [
          "Rheometer for viscosity testing",
          "Tensile testing machine",
          "Thermal analysis equipment",
          "Surface analysis tools",
        ],
      },
      {
        id: "eq-pa-2",
        name: "Application Testing Laboratory",
        description: "Specialized laboratory for application testing and development",
        image: "/petroleum-lab-testing.jpg",
        specifications: [
          "Environmental testing chambers",
          "Aging and durability testing",
          "Performance evaluation systems",
          "Quality control equipment",
        ],
      },
    ],
    analysisServices: [
      {
        id: "as-pa-1",
        name: "Product Development",
        description: "Development of new petroleum-based products and applications",
      },
      {
        id: "as-pa-2",
        name: "Performance Testing",
        description: "Comprehensive testing of petroleum products and applications",
      },
      {
        id: "as-pa-3",
        name: "Quality Assessment",
        description: "Quality assessment and certification of petroleum applications",
      },
    ],
    staff: [
      {
        id: "staff-pa-1",
        name: "Dr. Fatma El-Sayed",
        title: "Head of Petroleum Applications",
        picture: "/dr-fatma-elsayed.jpg",
        specialization: "Materials Science",
        email: "f.elsayed@epri.edu",
      },
      {
        id: "staff-pa-2",
        name: "Dr. Laila Abdelrahman",
        title: "Senior Applications Engineer",
        picture: "/dr-laila-abdelrahman.jpg",
        specialization: "Product Development",
        email: "l.abdelrahman@epri.edu",
      },
      {
        id: "staff-pa-3",
        name: "Eng. Khaled Mahmoud",
        title: "Testing Specialist",
        picture: "/eng-khaled-mahmoud.jpg",
        specialization: "Quality Testing",
        email: "k.mahmoud@epri.edu",
      },
    ],
    about: "The Petroleum Applications Department develops innovative petroleum-based products and applications for various industries. We focus on creating value-added products from petroleum resources.",
    achievements: [
      "Developed 20+ new petroleum applications",
      "Filed 8 patent applications",
      "Commercialized 5 products",
      "Established industry partnerships",
    ],
    researchAreas: [
      "Petroleum-based product development",
      "Polymer and composite materials",
      "Specialty chemicals and additives",
      "Surface modification techniques",
      "Application performance optimization",
      "Sustainable product development",
    ],
  },
  {
    id: "9",
    name: "Petrochemicals Department",
    description: "Advanced petrochemical production and process development",
    image: "/machine-learning-technology.jpg",
    icon: "⚗️",
    manager: {
      id: "mgr-9",
      name: "Dr. Ahmed Hassan",
      title: "Head of Petrochemicals Department",
      picture: "/dr-ahmed-hassan.jpg",
      bio: "Dr. Ahmed Hassan is a chemical engineer specializing in petrochemical processes and production. He has extensive experience in petrochemical plant operations and process development.",
      email: "a.hassan@epri.edu",
      phone: "+20 2 1234 5696",
      expertise: [
        "Petrochemical Processes",
        "Process Development",
        "Plant Operations",
        "Process Safety",
        "Process Optimization",
      ],
    },
    equipment: [
      {
        id: "eq-pet-1",
        name: "Pilot Petrochemical Unit",
        description: "Small-scale petrochemical production unit for process development",
        image: "/machine-learning-technology.jpg",
        specifications: [
          "Multiple reactor systems",
          "Separation and purification units",
          "Process control and monitoring",
          "Safety systems and controls",
        ],
      },
      {
        id: "eq-pet-2",
        name: "Analytical Laboratory",
        description: "Specialized laboratory for petrochemical analysis and testing",
        image: "/gc-ms-equipment.jpg",
        specifications: [
          "Gas chromatography systems",
          "Mass spectrometry equipment",
          "Infrared spectroscopy",
          "Nuclear magnetic resonance",
        ],
      },
    ],
    analysisServices: [
      {
        id: "as-pet-1",
        name: "Process Development",
        description: "Development and optimization of petrochemical processes",
      },
      {
        id: "as-pet-2",
        name: "Product Analysis",
        description: "Comprehensive analysis of petrochemical products and intermediates",
      },
      {
        id: "as-pet-3",
        name: "Process Safety Assessment",
        description: "Safety assessment and risk analysis for petrochemical processes",
      },
    ],
    staff: [
      {
        id: "staff-pet-1",
        name: "Dr. Ahmed Hassan",
        title: "Head of Petrochemicals",
        picture: "/dr-ahmed-hassan.jpg",
        specialization: "Chemical Engineering",
        email: "a.hassan@epri.edu",
      },
      {
        id: "staff-pet-2",
        name: "Dr. Yasser Khalil",
        title: "Senior Process Engineer",
        picture: "/dr-yasser-khalil.jpg",
        specialization: "Process Engineering",
        email: "y.khalil@epri.edu",
      },
      {
        id: "staff-pet-3",
        name: "Dr. Mohamed Ibrahim",
        title: "Safety Engineer",
        picture: "/dr-mohamed-ibrahim.jpg",
        specialization: "Process Safety",
        email: "m.ibrahim@epri.edu",
      },
    ],
    about: "The Petrochemicals Department focuses on developing and optimizing petrochemical processes for the production of high-value chemicals and materials from petroleum feedstocks.",
    achievements: [
      "Developed 10 new petrochemical processes",
      "Improved process efficiency by 25%",
      "Reduced environmental impact by 30%",
      "Established safety standards",
    ],
    researchAreas: [
      "Petrochemical process development",
      "Catalyst design and optimization",
      "Process integration and intensification",
      "Environmental impact reduction",
      "Product quality improvement",
      "Process safety and risk management",
    ],
  },
  {
    id: "10",
    name: "Processes Design & Development Department",
    description: "Innovative process design and development for petroleum and petrochemical industries",
    image: "/data-science-analytics.jpg",
    icon: "🔧",
    manager: {
      id: "mgr-10",
      name: "Eng. Khaled Mahmoud",
      title: "Head of Processes Design & Development Department",
      picture: "/eng-khaled-mahmoud.jpg",
      bio: "Eng. Khaled Mahmoud is a process engineer with extensive experience in process design and development. He has led numerous process design projects for major petroleum and petrochemical companies.",
      email: "k.mahmoud@epri.edu",
      phone: "+20 2 1234 5697",
      expertise: [
        "Process Design",
        "Process Development",
        "Process Simulation",
        "Process Optimization",
        "Project Management",
      ],
    },
    equipment: [
      {
        id: "eq-pdd-1",
        name: "Process Simulation Workstation",
        description: "Advanced workstation for process simulation and design",
        image: "/data-science-analytics.jpg",
        specifications: [
          "High-performance computing system",
          "Process simulation software",
          "3D modeling capabilities",
          "Optimization algorithms",
        ],
      },
      {
        id: "eq-pdd-2",
        name: "Pilot Plant Facility",
        description: "Flexible pilot plant for process development and testing",
        image: "/simulation-workstation.jpg",
        specifications: [
          "Modular process units",
          "Advanced control systems",
          "Data acquisition systems",
          "Safety monitoring equipment",
        ],
      },
    ],
    analysisServices: [
      {
        id: "as-pdd-1",
        name: "Process Design",
        description: "Comprehensive process design and engineering services",
      },
      {
        id: "as-pdd-2",
        name: "Process Simulation",
        description: "Advanced process simulation and modeling services",
      },
      {
        id: "as-pdd-3",
        name: "Process Optimization",
        description: "Process optimization and improvement services",
      },
    ],
    staff: [
      {
        id: "staff-pdd-1",
        name: "Eng. Khaled Mahmoud",
        title: "Head of Processes Design & Development",
        picture: "/eng-khaled-mahmoud.jpg",
        specialization: "Process Engineering",
        email: "k.mahmoud@epri.edu",
      },
      {
        id: "staff-pdd-2",
        name: "Dr. Yasser Khalil",
        title: "Senior Process Designer",
        picture: "/dr-yasser-khalil.jpg",
        specialization: "Process Design",
        email: "y.khalil@epri.edu",
      },
      {
        id: "staff-pdd-3",
        name: "Dr. Ahmed Hassan",
        title: "Process Simulation Specialist",
        picture: "/dr-ahmed-hassan.jpg",
        specialization: "Process Simulation",
        email: "a.hassan@epri.edu",
      },
    ],
    about: "The Processes Design & Development Department provides comprehensive process design and development services for the petroleum and petrochemical industries. We combine theoretical knowledge with practical experience to deliver innovative solutions.",
    achievements: [
      "Designed 50+ process units",
      "Developed 15 new processes",
      "Optimized 30 existing processes",
      "Reduced capital costs by 20%",
    ],
    researchAreas: [
      "Process design and optimization",
      "Process simulation and modeling",
      "Process intensification",
      "Sustainable process development",
      "Process integration",
      "Advanced process control",
    ],
  },
]

export const clients: Client[] = [
  {
    id: "1",
    name: "Egyptian General Petroleum Corporation (EGPC)",
    logo: "/partners/imageye___-_imgi_20_1.jpg",
    description: "Egypt's national oil company and our primary partner in petroleum research and development.",
    website: "https://www.egpc.com.eg",
  },
  {
    id: "2",
    name: "Apache Corporation Egypt",
    logo: "/partners/imageye___-_imgi_21_2.jpg",
    description: "Leading international oil and gas exploration company operating in Egypt's Western Desert.",
    website: "https://www.apachecorp.com",
  },
  {
    id: "3",
    name: "BP Egypt",
    logo: "/partners/imageye___-_imgi_22_3.jpg",
    description: "Major energy company with significant operations in Egypt's offshore gas fields.",
    website: "https://www.bp.com",
  },
  {
    id: "4",
    name: "Eni Egypt",
    logo: "/partners/imageye___-_imgi_23_4.jpg",
    description: "Italian energy giant operating the Zohr gas field, Egypt's largest natural gas discovery.",
    website: "https://www.eni.com",
  },
  {
    id: "5",
    name: "Shell Egypt",
    logo: "/partners/imageye___-_imgi_24_5.jpg",
    description: "Global energy company partnering in Egypt's exploration and production activities.",
    website: "https://www.shell.com",
  },
  {
    id: "6",
    name: "Khalda Petroleum Company",
    logo: "/partners/imageye___-_imgi_25_6.jpg",
    description: "Joint venture company operating in Egypt's Western Desert with extensive production.",
    website: "https://www.khalda.com",
  },
  {
    id: "7",
    name: "Schlumberger Egypt",
    logo: "/partners/imageye___-_imgi_26_7.jpg",
    description: "World's largest oilfield services company providing advanced technology solutions.",
    website: "https://www.slb.com",
  },
  {
    id: "8",
    name: "Halliburton Egypt",
    logo: "/partners/imageye___-_imgi_27_8.jpg",
    description: "Leading provider of products and services to the energy industry.",
    website: "https://www.halliburton.com",
  },
  {
    id: "9",
    name: "TotalEnergies Egypt",
    logo: "/partners/imageye___-_imgi_28_9.jpg",
    description: "Multi-energy company committed to cleaner energy solutions.",
    website: "https://www.totalenergies.com",
  },
  {
    id: "10",
    name: "Chevron Egypt",
    logo: "/partners/imageye___-_imgi_29_10.jpg",
    description: "Integrated energy company with exploration and production operations.",
    website: "https://www.chevron.com",
  },
  {
    id: "11",
    name: "Baker Hughes Egypt",
    logo: "/partners/imageye___-_imgi_30_11.jpg",
    description: "Energy technology company providing innovative solutions.",
    website: "https://www.bakerhughes.com",
  },
  {
    id: "12",
    name: "Weatherford Egypt",
    logo: "/partners/imageye___-_imgi_31_12.jpg",
    description: "Oilfield service company delivering innovative solutions.",
    website: "https://www.weatherford.com",
  },
]

export const projects: Project[] = [
  {
    id: "1",
    title: "Enhanced Oil Recovery in Mature Western Desert Fields",
    description:
      "A comprehensive research project aimed at developing and implementing advanced enhanced oil recovery (EOR) techniques to increase production from mature oil fields in Egypt's Western Desert. The project focuses on polymer flooding, chemical EOR, and CO2 injection methods tailored to the specific geological and fluid characteristics of Egyptian reservoirs.",
    images: [
      "/reservoir-engineering.jpg",
      "/petroleum-lab-testing.jpg",
      "/drilling-engineering.jpg",
    ],
    category: "Reservoir Engineering",
    status: "In Progress",
    startDate: "2023-01-15",
    endDate: "2025-12-31",
    objectives: [
      "Increase oil recovery factor by 15-25% in target fields",
      "Develop cost-effective EOR solutions suitable for Egyptian conditions",
      "Conduct laboratory studies and pilot field trials",
      "Transfer technology to local oil companies",
      "Train petroleum engineers in EOR techniques",
    ],
    achievements: [
      "Successful polymer flooding pilot in Khalda Concession",
      "25% increase in oil recovery demonstrated in laboratory tests",
      "Filed three patent applications for novel EOR formulations",
      "Published 8 research papers in international journals",
    ],
    staff: [
      {
        id: "proj1-staff-1",
        name: "Dr. Ahmed Hassan",
        title: "Principal Investigator",
        picture: "/dr-ahmed-hassan.jpg",
        specialization: "Enhanced Oil Recovery",
        email: "a.hassan@epri.edu",
      },
      {
        id: "proj1-staff-2",
        name: "Dr. Fatma El-Sayed",
        title: "Co-Investigator",
        picture: "/dr-fatma-elsayed.jpg",
        specialization: "Reservoir Engineering",
        email: "f.elsayed@epri.edu",
      },
    ],
    video: "https://www.youtube.com/watch?v=example1",
  },
  {
    id: "2",
    title: "Integrated Biostratigraphic Database for Egyptian Basins",
    description:
      "Development of a comprehensive digital biostratigraphic database covering all major sedimentary basins in Egypt. The project integrates micropaleontological data from thousands of wells to create high-resolution biostratigraphic zonation schemes that improve exploration success and reduce drilling risks.",
    images: [
      "/petroleum-lab-testing.jpg",
      "/soil-analysis-lab.jpg",
      "/research-center-building.jpg",
      "/modern-university-library-students-studying.jpg",
    ],
    category: "Biostratigraphy",
    status: "Completed",
    startDate: "2020-06-01",
    endDate: "2024-05-31",
    objectives: [
      "Analyze microfossil assemblages from 1000+ wells",
      "Establish high-resolution biostratigraphic zonations",
      "Create searchable digital database with imaging",
      "Improve exploration well correlation accuracy",
      "Publish comprehensive biostratigraphic atlas",
    ],
    achievements: [
      "Analyzed samples from 1,250 wells across Egypt",
      "Established 45 new biostratigraphic zones",
      "Created database with 50,000+ fossil images",
      "Published landmark atlas of Egyptian biostratigraphy",
      "Adopted by 12 major oil companies",
    ],
    staff: [
      {
        id: "proj2-staff-1",
        name: "Prof. Samira El-Naggar",
        title: "Project Director",
        picture: "/prof-samira-elnaggar.jpg",
        specialization: "Micropaleontology",
        email: "s.elnaggar@epri.edu",
      },
      {
        id: "proj2-staff-2",
        name: "Dr. Mahmoud Abdel-Aziz",
        title: "Senior Researcher",
        picture: "/dr-mahmoud-abdelaziz.jpg",
        specialization: "Foraminifera",
        email: "m.abdelaziz@epri.edu",
      },
      {
        id: "proj2-staff-3",
        name: "Dr. Eman Mostafa",
        title: "Palynologist",
        picture: "/dr-eman-mostafa.jpg",
        specialization: "Palynology",
        email: "e.mostafa@epri.edu",
      },
    ],
  },
  {
    id: "3",
    title: "AI-Powered Seismic Interpretation Platform",
    description:
      "Development of an advanced seismic interpretation platform that leverages artificial intelligence and machine learning to automatically detect geological features, identify hydrocarbon prospects, and reduce interpretation time. The system uses deep learning algorithms trained on Egyptian subsurface data.",
    images: [
      "/geophysical-survey.jpg",
      "/seismic-workstation.jpg",
      "/simulation-workstation.jpg",
    ],
    category: "Geophysics",
    status: "In Progress",
    startDate: "2024-01-01",
    endDate: "2026-06-30",
    objectives: [
      "Develop deep learning models for automatic fault detection",
      "Create AI-based stratigraphic trap identification system",
      "Reduce seismic interpretation time by 60%",
      "Improve prospect success rate through AI predictions",
      "Deploy system to Egyptian oil companies",
    ],
    achievements: [
      "Achieved 95% accuracy in automated fault detection",
      "Identified 15 new prospects using AI analysis",
      "Reduced interpretation time by 45% in pilot studies",
      "Presented at 3 international geophysics conferences",
    ],
    staff: [
      {
        id: "proj3-staff-1",
        name: "Dr. Tarek Abdel-Fattah",
        title: "Principal Investigator",
        picture: "/dr-tarek-abdelfattah.jpg",
        specialization: "Geophysics & AI",
        email: "t.abdelfattah@epri.edu",
      },
      {
        id: "proj3-staff-2",
        name: "Dr. Amira Soliman",
        title: "Geophysicist",
        picture: "/dr-amira-soliman.jpg",
        specialization: "Seismic Interpretation",
        email: "a.soliman@epri.edu",
      },
    ],
    video: "https://www.youtube.com/watch?v=example2",
  },
  {
    id: "4",
    title: "Unconventional Resources Assessment in Egypt",
    description:
      "Comprehensive evaluation of Egypt's unconventional hydrocarbon resources including shale gas, tight oil, and coalbed methane. The project aims to quantify resources, assess technical and economic viability, and develop appropriate extraction technologies for Egyptian geological conditions.",
    images: [
      "/reservoir-engineering.jpg",
      "/drilling-engineering.jpg",
      "/geophysical-survey.jpg",
    ],
    category: "Petroleum Geology",
    status: "In Progress",
    startDate: "2023-09-01",
    endDate: "2026-08-31",
    objectives: [
      "Map and characterize unconventional resource plays",
      "Estimate technically recoverable resources",
      "Evaluate economic viability under Egyptian conditions",
      "Develop appropriate extraction technologies",
      "Assess environmental impacts and mitigation strategies",
    ],
    achievements: [
      "Identified 5 prospective shale gas plays",
      "Estimated 50 TCF of shale gas resources",
      "Completed geochemical analysis of 200+ samples",
      "Conducted first horizontal well stimulation experiment",
    ],
    staff: [
      {
        id: "proj4-staff-1",
        name: "Dr. Mohamed Ibrahim",
        title: "Project Lead",
        picture: "/dr-mohamed-ibrahim.jpg",
        specialization: "Petroleum Geology",
        email: "m.ibrahim@epri.edu",
      },
    ],
  },
  {
    id: "5",
    title: "Corrosion Prevention in Petroleum Infrastructure",
    description:
      "Research program focused on developing advanced corrosion prevention and monitoring technologies for petroleum production and transportation infrastructure in harsh Egyptian environments. The project addresses both sweet and sour corrosion challenges.",
    images: [
      "/corrosion-testing.jpg",
      "/electrochemical-workstation.jpg",
      "/spectrophotometer-equipment.jpg",
    ],
    category: "Materials Science",
    status: "Completed",
    startDate: "2021-03-01",
    endDate: "2024-02-28",
    objectives: [
      "Develop novel corrosion inhibitor formulations",
      "Design real-time corrosion monitoring systems",
      "Evaluate protective coating performance",
      "Establish corrosion prediction models",
      "Reduce infrastructure maintenance costs",
    ],
    achievements: [
      "Developed 3 patent-pending inhibitor formulations",
      "Reduced corrosion rates by 80% in field trials",
      "Installed monitoring systems in 25 facilities",
      "Saved industry $15 million in maintenance costs",
      "Trained 100+ engineers in corrosion management",
    ],
    staff: [
      {
        id: "proj5-staff-1",
        name: "Dr. Laila Abdel-Rahman",
        title: "Principal Investigator",
        picture: "/dr-laila-abdelrahman.jpg",
        specialization: "Corrosion Engineering",
        email: "l.abdelrahman@epri.edu",
      },
    ],
    video: "https://www.youtube.com/watch?v=example3",
  },
  {
    id: "6",
    title: "Carbon Capture and Storage for Egyptian Oil Fields",
    description:
      "Pioneering research on carbon capture, utilization, and storage (CCUS) technologies adapted to Egyptian oil and gas fields. The project explores CO2-EOR opportunities while reducing carbon emissions from petroleum operations.",
    images: [
      "/environmental-assessment.jpg",
      "/environmental-monitoring.jpg",
      "/research-center-building.jpg",
    ],
    category: "Environmental Engineering",
    status: "Planning",
    startDate: "2025-01-01",
    endDate: "2028-12-31",
    objectives: [
      "Identify suitable CO2 storage reservoirs",
      "Develop CO2-EOR implementation strategies",
      "Design capture systems for petroleum facilities",
      "Assess long-term storage integrity",
      "Create carbon credit framework for Egypt",
    ],
    staff: [
      {
        id: "proj6-staff-1",
        name: "Dr. Mohamed Ibrahim",
        title: "Project Coordinator",
        picture: "/dr-mohamed-ibrahim.jpg",
        specialization: "Environmental Engineering",
        email: "m.ibrahim@epri.edu",
      },
    ],
  },
]

export const newsCategories = [
  { id: "1", name: "All News", count: news.length },
  { id: "2", name: "Research", count: news.filter((n) => n.category === "Research").length },
  { id: "3", name: "Achievement", count: news.filter((n) => n.category === "Achievement").length },
  { id: "4", name: "Partnership", count: news.filter((n) => n.category === "Partnership").length },
  { id: "5", name: "Research News", count: news.filter((n) => n.category === "Research News").length },
]

export const projectCategories = [
  { id: "1", name: "All Projects", count: projects.length },
  {
    id: "2",
    name: "Reservoir Engineering",
    count: projects.filter((p) => p.category === "Reservoir Engineering").length,
  },
  { id: "3", name: "Biostratigraphy", count: projects.filter((p) => p.category === "Biostratigraphy").length },
  { id: "4", name: "Geophysics", count: projects.filter((p) => p.category === "Geophysics").length },
  { id: "5", name: "Petroleum Geology", count: projects.filter((p) => p.category === "Petroleum Geology").length },
  { id: "6", name: "Materials Science", count: projects.filter((p) => p.category === "Materials Science").length },
  {
    id: "7",
    name: "Environmental Engineering",
    count: projects.filter((p) => p.category === "Environmental Engineering").length,
  },
]
