# Egyptian Petroleum Research Institute (EPRI)

## Project Overview
This is a comprehensive web platform for the Egyptian Petroleum Research Institute, built with Next.js 14, React, TypeScript, and Tailwind CSS. The platform provides information about courses, services, departments, research equipment, projects, news, and events.

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Package Manager**: pnpm

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── contact/           # Contact page
│   ├── courses/           # Courses listing and details
│   ├── dashboard/         # User dashboard
│   ├── departments/       # Research departments
│   ├── events/           # Events listing and details
│   ├── news/             # News articles
│   ├── projects/         # Research projects (new)
│   ├── equipments/       # Scientific equipments (new)
│   ├── services/         # Services listing and details
│   ├── top-management/   # Leadership team
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/           # Reusable React components
│   ├── ui/              # Shadcn UI components
│   └── ...              # Custom components
├── contexts/            # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and data
│   ├── data.ts         # Mock data and type definitions
│   └── utils.ts        # Utility functions
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices (departments, services, events, etc.)
│   ├── hooks.ts        # Typed Redux hooks
│   ├── store.ts        # Store configuration
│   └── ReduxProvider.tsx # Redux provider component
└── public/             # Static assets
```

## Features

### 0. Enhanced Hero Section (NEW)
The hero section has been completely redesigned to focus on services and events with modern animations and visual effects:

#### Hero Slider Features:
- **4 Dynamic Slides** showcasing:
  1. **Petroleum Analysis & Testing** - Laboratory services with test statistics
  2. **Annual Research Symposium 2025** - Featured conference event
  3. **Reservoir Engineering Services** - Engineering capabilities
  4. **AI in Petroleum Technology Workshop** - Upcoming training events

#### Visual Enhancements:
- **Glassmorphism Design**: Translucent cards with backdrop blur effects
- **Parallax Animations**: Background images scale and move for depth
- **Staggered Content Loading**: Sequential fade-in animations for text and elements
- **Interactive Stat Cards**: 
  - Hover effects with scale transformations
  - Display key metrics (completion rates, attendance, experience)
  - Mobile-responsive layout
- **Badge Indicators**: Category badges with icons (Microscope, Calendar, Wrench, Lightbulb)

#### Advanced Decorative Shapes:
- **Geometric Patterns**: Hexagons, cubes, and grid structures
- **Organic Shapes**: Pulsing blobs, floating rings, and spiral patterns
- **Network Visualizations**: Connected lines with nodes
- **Molecular Structures**: Scientific-themed decorative elements
- **Floating Particles**: Animated dots with independent motion paths
- All shapes feature smooth CSS animations and opacity transitions

#### User Experience:
- **Auto-rotation**: 5-second intervals with pause on hover
- **Navigation Controls**: Enhanced arrow buttons with hover effects
- **Progress Indicators**: Animated dots showing current slide
- **Responsive Design**: Optimized layouts for mobile, tablet, and desktop
- **Performance**: Optimized animations using Framer Motion
- **Accessibility**: ARIA labels and keyboard navigation support

### 1. Courses System
- Course catalog with filtering by category and level
- Detailed course pages with curriculum
- Lesson player with video, articles, and quizzes
- Course reviews and ratings
- Enrollment functionality

### 2. Departments & Laboratories
The institute has three main research departments:

#### Sedimentology Laboratory
- **Manager**: Dr. Hoda Mahmoud
- **Equipment**: Petrographic Microscope, Grain Size Analyzer, X-Ray Diffractometer, Sieve Shaker
- **Services**: Thin Section Analysis, Grain Size Distribution, Mineral Composition Analysis, Sedimentary Facies Analysis, Reservoir Quality Assessment
- **Staff**: 4 members specializing in carbonate sedimentology, clastic reservoirs, sample preparation, and grain size analysis

#### Paleontology Laboratory
- **Manager**: Prof. Samira El-Naggar
- **Equipment**: Stereomicroscope, Microfossil Preparation System, SEM, Reference Collection Database
- **Services**: Biostratigraphic Analysis, Paleoenvironmental Interpretation, Foraminiferal Analysis, Palynological Analysis, Well Correlation Studies
- **Staff**: 4 members specializing in foraminifera, palynology, nannofossils, and sample processing

#### Geophysics Laboratory
- **Manager**: Dr. Tarek Abdel-Fattah
- **Equipment**: Seismic Interpretation Workstation, Well Log Analysis System, Gravity/Magnetic Processing, Portable Seismograph, Electrical Resistivity Imaging
- **Services**: 2D/3D Seismic Interpretation, Well Log Analysis, Seismic Attribute Analysis, Gravity/Magnetic Survey Processing, Integrated Geophysical Studies, Reservoir Geophysics
- **Staff**: 5 members specializing in seismic interpretation, well log analysis, seismic attributes, potential field methods, and data processing

### 3. Services
- Petroleum Analysis & Testing
- Reservoir Engineering Services
- Environmental Impact Assessment
- Drilling & Well Engineering
- Corrosion & Materials Testing
- Geophysical Surveys

**Enhanced Service Detail Pages (VIBRANT MODERN DESIGN):**
- **Dynamic Service Hero**: Service-specific background images with vibrant gradient overlays, parallax effects, and animated floating particles
- **Enhanced Background Styling**: Automatic background image filtering with brightness, contrast, and saturation adjustments for optimal text readability
- **Dynamic Tabbed Interface**: Color-coded tabs with unique gradient themes (Blue/Cyan, Purple/Pink, Green/Emerald, Orange/Red)
- **Animated Content Sections**: Each tab features distinct color schemes with pulsing animations and gradient text effects
- **Interactive Feature Cards**: Purple/Pink themed cards with rotation animations and color-changing hover effects
- **Vibrant Equipment Showcase**: Green/Emerald themed equipment cards with rotation and scale animations
- **Colorful Center Head Profile**: Orange/Red themed profile with animated avatar rings and gradient contact cards
- **Rainbow Sidebar**: Multi-color gradient sidebar with animated icons and colorful information cards
- **Advanced Micro-Animations**: Bounce, pulse, spin, and scale effects on icons and interactive elements
- **Gradient Typography**: Multi-color gradient text effects with pulsing animations throughout
- **Floating Particles**: Animated colorful particles in the hero section for dynamic visual appeal
- **Color-Coded Information**: Each information type has its own color theme for better visual organization

**Enhanced Page Titles with Background Images (NEW):**
- **Events Page**: Conference symposium background with purple/blue/cyan gradient overlay and floating particles
- **Equipments Page**: Laboratory testing background with green/emerald/teal gradient overlay and animated elements
- **Projects Page**: Research center background with orange/red/pink gradient overlay and dynamic particles
- **Courses Page**: University library background with indigo/purple/blue gradient overlay and floating animations
- **News Page**: Campus building background with slate/gray/blue gradient overlay and particle effects
- **Departments Page**: Research center background with teal/cyan/blue gradient overlay and animated particles
- **Consistent Design Language**: All pages feature the same modern glassmorphism effects, gradient overlays, and floating particles
- **Responsive Typography**: Large gradient text effects that scale properly on all devices
- **Enhanced Visual Hierarchy**: Each page has its own color theme while maintaining design consistency

**Responsive Design Enhancements (NEW):**
- **Mobile-First Approach**: All pages optimized for mobile devices with proper scaling and spacing
- **Flexible Grid Systems**: Responsive grid layouts that adapt to different screen sizes
- **Adaptive Typography**: Text sizes that scale appropriately across devices (text-2xl md:text-4xl)
- **Responsive Icons**: Icon sizes that adjust based on screen size (h-6 w-6 md:h-8 md:w-8)
- **Flexible Spacing**: Gap and padding adjustments for mobile and desktop (gap-4 md:gap-8)
- **Touch-Friendly Elements**: Buttons and interactive elements sized appropriately for touch devices
- **Optimized Images**: Background images and content images that display properly on all devices

### 4. Backend API System (NEW)
- **Authentication System**: JWT-based authentication with role-based access control
- **User Management**: Registration, login, profile management, and password change
- **Events Management**: Complete CRUD operations for events, categories, and speakers
- **Admin Dashboard**: Comprehensive admin panel for system management
- **Dashboard API**: Admin and user dashboard endpoints with analytics
- **Database Integration**: Prisma ORM with MySQL database
- **Security**: Password hashing, token validation, and route protection

**Backend Features:**
- **RESTful API**: Express.js server with TypeScript
- **Authentication Routes**: `/api/auth/*` for user authentication
- **Events Routes**: `/api/events/*` for event management
- **Admin Routes**: `/api/admin/*` for admin-only operations
- **Dashboard Routes**: `/api/dashboard/*` for analytics and management
- **Middleware**: Authentication, authorization, and validation middleware
- **Database Seeding**: Initial data population with categories, events, and users

**Admin Dashboard Features:**
- **Event Management**: Create, edit, delete events with full CRUD operations
- **User Management**: Manage user roles, verification status, and permissions
- **Event Requests**: Monitor event registrations and payment status
- **Analytics & Statistics**: Real-time dashboard with system metrics
- **System Health**: Monitor system performance and user activity

### 5. Scientific Equipments Page (NEW)
- Comprehensive catalog of all scientific equipment across departments
- Equipment cards with images and descriptions
- Interactive popup/modal for detailed equipment information
- Specifications and capabilities for each equipment

### 5. Projects Page (NEW)
Projects feature includes:
- Project title and description
- Multiple images/gallery
- Associated staff members (optional)
- Video content (optional)
- Project categories and status

### 6. News & Events
- News articles with categories including:
  - Research
  - Achievement
  - Partnership
  - **Research news** (NEW category)
- Event listings with registration tracking
- Detailed news and event pages

### 7. Clients Section (NEW)
- Carousel display of client logos and information
- Featured on homepage
- Responsive design

### 8. Conference Registration & Ticketing (NEW)
Complete conference management system with:
- **Conference Registration Page** - Dedicated registration form for conferences
- **Digital Ticket Generation** - Automatic ticket generation with unique ticket numbers
- **Conference Data:**
  - Featured speakers with bios and topics
  - Detailed agenda/schedule
  - Conference benefits and inclusions
  - Pricing and capacity management
- **Ticket Features:**
  - QR code placeholder for scanning
  - Download/Print functionality
  - Share capability
  - Attendee information display
  - Event details and important instructions
- **Payment Integration Ready** (currently simulated)

**Sample Conferences:**
1. Annual Research Symposium 2025 ($150)
2. International Petroleum Technology Conference 2025 ($250)

### 9. User Features
- User authentication (login/register)
- Dashboard with:
  - My Courses
  - Wishlist
  - Course progress tracking

## Data Types

### Department Interface
```typescript
interface Department {
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
```

### Equipment Interface
```typescript
interface Equipment {
  id: string
  name: string
  description: string
  image: string
  specifications?: string[]
}
```

### Project Interface
```typescript
interface Project {
  id: string
  title: string
  description: string
  images: string[]
  category: string
  status: string
  staff?: StaffMember[]
  video?: string
  startDate: string
  endDate?: string
}
```

### Client Interface
```typescript
interface Client {
  id: string
  name: string
  logo: string
  description?: string
  website?: string
}
```

## Key Components

### UI Components (Shadcn)
- Button, Card, Badge, Tabs
- Accordion, Carousel
- Dialog/Modal for popups
- Sheet for mobile navigation
- Toast for notifications

### Custom Components
- `PageContainer`: Consistent page layout wrapper
- `Section`: Reusable section wrapper
- `AnimatedSection`: Scroll-based animations
- `HeroSlider`: Enhanced homepage carousel with service and event focus
  - Dynamic slide transitions with parallax effects
  - Interactive stat cards with glassmorphism design
  - Badge indicators with icons for categorization
  - Smooth fade and scale animations
  - Mobile-responsive stat display
- `DecorativeShapes`: Advanced SVG animations and patterns
  - Geometric shapes (hexagons, cubes, rings)
  - Floating particles and molecular structures
  - Grid patterns and spiral designs
  - Network lines and pulsing blobs
- `Footer` & `Header`: Navigation components
- Equipment popup/modal for detailed views

## Styling

The project uses a consistent design system with:
- Primary color scheme for petroleum/research theme
- Responsive breakpoints (mobile, tablet, desktop)
- Smooth animations and transitions
- Modern card-based layouts
- Gradient backgrounds for hero sections

## Development

### Installation
```bash
pnpm install
```

### Running Development Server
```bash
pnpm dev
```

### Building for Production
```bash
pnpm build
```

### Running Production Server
```bash
pnpm start
```

## Navigation Structure

Main navigation includes:
- Home
- Courses
- Departments
- Services
- Scientific Equipments (NEW)
- Projects (NEW)
- News & Events
- Top Management
- Contact

## Backend Setup & Database Configuration

### Database Setup Error Resolution

If you encounter the error: `PrismaConfigEnvError: Missing required environment variable: DATABASE_URL`

This error occurs because Prisma cannot load environment variables from the `.env` file. Here's the complete solution:

#### Step 1: Create Environment File
Create a `.env` file in the `backend` directory with the following content:

```env
# Database Configuration
# Choose one of the following database options:

# Option 1: MySQL (Primary)
DATABASE_URL="mysql://username:password@localhost:3306/egyptian_petroleum_research"

# Option 2: SQLite (Easier for development)
DATABASE_URL="file:./dev.db"

# Option 3: PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/egyptian_petroleum_research"

# JWT Secret for authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=3001
NODE_ENV=development
```

#### Step 2: Create Prisma Config File
Create a `prisma.config.ts` file in the `backend` directory:

```typescript
import "dotenv/config";

// This file ensures that environment variables from .env are loaded
// when running Prisma commands and when the application starts
```

#### Step 3: Database Setup Commands
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma studio  # Optional: Open database GUI
```

**For Fresh Database Setup:**
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Optional: Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset

# Open Prisma Studio for database management
npx prisma studio
```

**For Production Setup:**
```bash
# Create migration files
npx prisma migrate dev --name init

# Apply migrations to production
npx prisma migrate deploy
```

#### Step 4: Fix Schema Issues (if any)
If you encounter schema validation errors, ensure:
- All models have `@id` fields
- All `@default()` directives have proper values
- Field names follow proper conventions

#### Step 4.1: Resolving Migration Drift Issues
If you encounter migration drift errors (database schema out of sync with migrations):

**Option 1: If database is already in sync with schema (recommended)**
```bash
# Check migration status
npx prisma migrate status

# If database is in sync but migration drift is detected, use db push instead
npx prisma db push

# This syncs schema directly without using migrations (fine for development)
```

**Option 2: Create a migration for existing database changes**
```bash
# Create migration file without applying
npx prisma migrate dev --create-only --name migration_name

# If database already has these changes, mark migration as applied
npx prisma migrate resolve --applied migration_name

# Verify everything is in sync
npx prisma migrate status
```

**Option 3: Reset database (WARNING: Deletes all data - development only)**
```bash
# Only use in development when you don't need to preserve data
npx prisma migrate reset
npx prisma migrate dev
```

#### Step 5: Start Backend Server
```bash
npm run dev
```

### Enhanced Database Schema

The backend now includes a comprehensive database schema designed specifically for the Egyptian Petroleum Research Institute, with the following models and features:

#### Core Models

**User Management:**
- **User**: Complete user profiles with roles (STUDENT, RESEARCHER, INSTRUCTOR, ADMIN, GUEST)
- **UserRole**: Enum for role-based access control
- Enhanced with password hashing, verification status, and comprehensive relations

**Event Management:**
- **Event**: Full event/conference/symposium management with pricing, capacity, and status tracking
- **EventCategory**: Junction table for many-to-many category relationships
- **EventOrder**: Order management with payment status tracking
- **Ticket**: Digital ticket system with QR codes and usage tracking
- **Speaker**: Enhanced speaker profiles with social links and expertise areas
- **Address**: Comprehensive location management with map integration

**Course Management:**
- **Course**: Full course catalog with instructor assignment and enrollment tracking
- **Lesson**: Individual course lessons with content management
- **CourseEnrollment**: Student enrollment tracking with progress monitoring
- **Review**: Rating and review system for courses and events

**Supporting Models:**
- **Category**: Content categorization with UI theming support (colors, icons)
- **Review**: Unified review system for both courses and events

#### Enhanced Features

**Type Safety with Enums:**
- `PaymentStatus`: PENDING, PAID, CANCELLED, REFUNDED
- `TicketStatus`: ACTIVE, USED, CANCELLED, EXPIRED
- `UserRole`: STUDENT, RESEARCHER, INSTRUCTOR, ADMIN, GUEST
- `EventStatus`: DRAFT, PUBLISHED, CANCELLED, COMPLETED

**Advanced Relationships:**
- Proper foreign key constraints with cascade deletion
- Many-to-many relationships with junction tables
- Optional relationships for flexible data modeling
- Comprehensive indexing for performance

**EPRI-Specific Enhancements:**
- Research-focused user roles (RESEARCHER, INSTRUCTOR)
- Event management for conferences and symposiums
- Course management for educational programs
- Digital ticket system for event registration
- QR code support for ticket scanning
- Payment integration ready with transaction tracking

#### Schema Improvements Over Original SQL

**Enhanced from Original SQL Schema:**
1. **Proper Relationships**: Fixed many-to-many relationships with junction tables
2. **Type Safety**: Added comprehensive enums for all status fields
3. **Extended User Model**: Added roles, verification, and password management
4. **Enhanced Event Management**: Added event status, featured flags, and registration controls
5. **Digital Ticket System**: Complete ticket management with QR codes and usage tracking
6. **Course Management**: Added comprehensive course and lesson management
7. **Review System**: Unified review and rating system
8. **Address Enhancement**: Added GPS coordinates and map integration
9. **Speaker Profiles**: Enhanced with social links and expertise tracking
10. **Payment Integration**: Ready for payment gateway integration

**New Models Added:**
- Course and Lesson management for educational programs
- CourseEnrollment for student tracking
- Review system for feedback
- Enhanced Address model with GPS coordinates
- Comprehensive Ticket management with QR codes

#### Database Schema Relationships

```
User (1) ←→ (M) EventOrder (M) ←→ (1) Event
User (1) ←→ (M) Ticket (M) ←→ (1) Event
User (1) ←→ (M) CourseEnrollment (M) ←→ (1) Course
User (1) ←→ (M) Review (M) ←→ (1) Course/Event

Event (1) ←→ (M) EventCategory (M) ←→ (1) Category
Event (1) ←→ (M) Speaker (M) ←→ (1) Event
Event (1) ←→ (1) Address
Event (1) ←→ (M) Ticket
Event (1) ←→ (M) EventOrder

Course (1) ←→ (M) Lesson
Course (1) ←→ (M) CourseEnrollment
Course (1) ←→ (M) Review
```

**Key Features:**
- **Many-to-Many**: Event ↔ Category (via EventCategory junction table)
- **One-to-Many**: User → EventOrder, User → Ticket, Event → Ticket
- **Optional Relations**: Event → Address (events can be virtual)
- **Cascade Deletion**: Proper cleanup when parent records are deleted

## API Integration (Current Status)

- **Frontend**: Using mock data from `lib/data.ts`
- **Backend**: Express.js server with Prisma ORM
- **Database**: MySQL/SQLite/PostgreSQL support via Prisma
- **Authentication**: JWT-based user authentication system
- **Future**: File upload, real-time notifications, advanced features

## Responsive Design

The platform is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Accessibility

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

## Performance Optimizations

- Next.js Image optimization
- Code splitting and lazy loading
- Static page generation where possible
- Optimized bundle size

## Future Enhancements

1. Real-time chat support
2. Advanced search functionality
3. Multi-language support (Arabic/English)
4. Interactive equipment 3D models
5. Virtual lab tours
6. Online booking system for services
7. Publication repository
8. Research collaboration tools

## Contact & Support

For technical support or questions about the platform:
- Email: info@epri.edu
- Phone: +20 2 1234 5678

---

Last Updated: October 16, 2025
Version: 1.2.0

## Recent Updates (v1.2.0 - October 16, 2025)
- **Glowing Icons in Hero Section**: Large animated icons with multi-layered glow effects (cyan, blue, purple, pink gradients)
- **Vibrant Color Scheme**: Colorful gradients throughout homepage sections
  - Stats section: Blue, Purple, Orange, and Green gradient icons
  - Vision/Mission/Values: Blue, Purple, and Orange themed cards
  - Partners section: Cyan to Indigo gradient headers
- **Local Partner Images**: Updated all 12 client logos to use local partner images from `/partners/` folder
- **Enhanced CTA Buttons**: Gradient buttons with glowing shadows and hover effects
- **Gradient Text Effects**: Text with gradient color fills using bg-clip-text
- **Interactive Hover States**: Glowing borders and shadows on stat cards

## Previous Updates (v1.1.0)
- **Hero Section Redesign**: Complete overhaul focusing on services and events
- **Enhanced Animations**: Advanced Framer Motion animations with parallax effects
- **Glassmorphism UI**: Modern translucent design elements with backdrop blur
- **Decorative Shapes**: New geometric and organic SVG animations
- **Improved Statistics Display**: Interactive stat cards with hover effects
- **Better Mobile Experience**: Responsive layouts for all screen sizes

