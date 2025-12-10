# Innovation and Entrepreneurship - Implementation Plan

Based on the provided images, here's the comprehensive plan for restructuring the Innovation and Entrepreneurship menu and redesigning related pages.

## 📋 Overview

This plan covers:

1. **Innovation and Entrepreneurship Menu Restructure** - Add sub-menu items
2. **Patent Page Redesign** - Match reference design from NRC
3. **EJP Journal Page Redesign** - Match reference design from Technoservice
4. **Citation Page External Link** - Link to SciVal/Elsevier platform
5. **Publication Page External Link** - Link to Scopus organization page

---

## 🎯 Phase 1: Innovation and Entrepreneurship Menu Restructure

### Current State

- Menu item exists as direct link: `/innovation-and-entrepreneurship`
- Patent is currently under Library menu

### Required Changes

#### 1.1 Update Header Menu Structure

**Location:** `EPRI/components/header.tsx`

**Changes:**

- Convert "Innovation and Entrepreneurship" from direct link to dropdown menu
- Add the following sub-menu items:
  1. **Technology Transfer TTO** → `/innovation-and-entrepreneurship/technology-transfer-tto`
  2. **Grant & International Cooperation GICO** → `/innovation-and-entrepreneurship/grant-international-cooperation-gico`
  3. **Technology Innovation Support TISC** → `/innovation-and-entrepreneurship/technology-innovation-support-tisc`
  4. **IP Management** → `/innovation-and-entrepreneurship/ip-management`
  5. **E-Club** → `/innovation-and-entrepreneurship/e-club`
  6. **Incubators Of Startups** → `/innovation-and-entrepreneurship/incubators-startups`
  7. **Patent** → `/innovation-and-entrepreneurship/patent` (moved from Library)

#### 1.2 Create New Page Routes

Create the following pages:

- `EPRI/app/[locale]/innovation-and-entrepreneurship/technology-transfer-tto/page.tsx`
- `EPRI/app/[locale]/innovation-and-entrepreneurship/grant-international-cooperation-gico/page.tsx`
- `EPRI/app/[locale]/innovation-and-entrepreneurship/technology-innovation-support-tisc/page.tsx`
- `EPRI/app/[locale]/innovation-and-entrepreneurship/ip-management/page.tsx`
- `EPRI/app/[locale]/innovation-and-entrepreneurship/e-club/page.tsx`
- `EPRI/app/[locale]/innovation-and-entrepreneurship/incubators-startups/page.tsx`
- `EPRI/app/[locale]/innovation-and-entrepreneurship/patent/page.tsx` (move from library)

#### 1.3 Update Translation Keys

**Files:** `EPRI/messages/en.json` and `EPRI/messages/ar.json`

**Add keys:**

```json
{
  "nav": {
    "innovation": {
      "title": "Innovation and Entrepreneurship",
      "technologyTransferTTO": "Technology Transfer TTO",
      "grantInternationalCooperationGICO": "Grant & International Cooperation GICO",
      "technologyInnovationSupportTISC": "Technology Innovation Support TISC",
      "ipManagement": "IP Management",
      "eClub": "E-Club",
      "incubatorsStartups": "Incubators Of Startups",
      "patent": "Patent"
    }
  }
}
```

---

## 🎯 Phase 2: Patent Page Redesign

### Reference Design

**URL:** https://www.nrc.sci.eg/patents

### Current State

- Located at: `/library/patent/page.tsx`
- Basic placeholder content

### Required Changes

#### 2.1 Move Patent Page

- **From:** `EPRI/app/[locale]/library/patent/page.tsx`
- **To:** `EPRI/app/[locale]/innovation-and-entrepreneurship/patent/page.tsx`

#### 2.2 Redesign Based on NRC Reference

**Key Features to Implement:**

1. **Search and Filter System**

   - Search bar for patent titles/numbers
   - Filter by:
     - Year
     - Category/Field
     - Status (Active, Expired, Pending)
     - Inventor/Researcher

2. **Patent Listing Display**

   - Grid/List view toggle
   - Patent cards showing:
     - Patent number
     - Title
     - Inventors
     - Filing date
     - Status badge
     - Abstract/Description preview
     - View details button

3. **Patent Detail View**

   - Full patent information
   - Download PDF option
   - Related patents
   - Patent timeline/history

4. **Statistics Section**
   - Total patents count
   - Patents by year
   - Patents by category
   - Active vs Expired breakdown

#### 2.3 Database Schema (if needed)

**Model:** `Patent`

- `id`: String (UUID)
- `patent_number`: String (unique)
- `title`: Json (en/ar)
- `description`: Json (en/ar)
- `abstract`: Json (en/ar)
- `inventors`: Json[] (array of inventor objects)
- `filing_date`: DateTime
- `publication_date`: DateTime
- `grant_date`: DateTime
- `expiry_date`: DateTime
- `status`: Enum (PENDING, ACTIVE, EXPIRED)
- `category`: Json (en/ar)
- `pdf_url`: String?
- `images`: Json? (array of image URLs)
- `related_patents`: Json? (array of patent IDs)
- `created_at`: DateTime
- `updated_at`: DateTime

---

## 🎯 Phase 3: EJP Journal Page Redesign

### Reference Design

**URL:** https://technoservice-egypt.com/contact-2

### Current State

- Located at: `EPRI/app/[locale]/library/journal/egyptian-journal-petroleum/page.tsx`
- Basic placeholder content

### Required Changes

#### 3.1 Redesign Based on Technoservice Reference

**Key Features to Implement:**

1. **Contact/Submission Form**

   - Author submission form
   - Manuscript upload
   - Contact information fields
   - Subject/Inquiry type selection

2. **Journal Information Sections**

   - About the Journal
   - Editorial Board
   - Submission Guidelines
   - Publication Ethics
   - Indexing Information

3. **Latest Articles/Issues**

   - Recent publications carousel
   - Issue archive
   - Article search

4. **Editorial Process**

   - Review process timeline
   - Peer review information
   - Publication timeline

5. **Contact Information**
   - Editorial office address
   - Email contacts
   - Phone numbers
   - Office hours

#### 3.2 Page Structure

```
Hero Section
├── Journal Title & Description
└── Quick Stats (Impact Factor, Articles, etc.)

Main Content
├── About Section
├── Submission Form
├── Editorial Board
├── Latest Articles
├── Guidelines & Policies
└── Contact Information
```

---

## 🎯 Phase 4: Citation and Publication External Links

### Current State

- **Citation Page:** Located at `/library/citation/page.tsx` - Basic placeholder
- **Publication Page:** Located at `/library/publication/page.tsx` - Has content but needs external link integration

### Required Changes

#### 4.1 Citation Page - Link to SciVal

**Location:** `EPRI/app/[locale]/library/citation/page.tsx`

**Changes:**

- Update page to redirect or embed link to SciVal platform
- **External URL:** `https://id.elsevier.com/as/authorization.oauth2?platSite=SVE%2FSciVal&ui_locales=en-JS&scope=openid+profile+email+els_auth_info+els_analytics_info&response_type=code&redirect_uri=https%3A%2F%2Fwww.scival.com%2Fidp%2Fcode&prompt=login&client_id=SCIVAL`

**Implementation Options:**

1. **Direct Redirect:** Page automatically redirects to external URL
2. **Button/Link:** Display page with information and prominent button to access SciVal
3. **Embedded iframe:** Embed SciVal interface (if allowed by platform)

**Recommended Approach:** Option 2 - Display page with:

- Hero section explaining citation tracking
- Information about SciVal platform
- Large, prominent button/link to access SciVal
- Opens in new tab with `target="_blank" rel="noopener noreferrer"`

#### 4.2 Publication Page - Link to Scopus

**Location:** `EPRI/app/[locale]/library/publication/page.tsx`

**Changes:**

- Add external link integration to Scopus organization page
- **External URL:** `https://www.scopus.com/pages/organization/60015541`

**Implementation:**

- Add prominent section or button linking to Scopus organization page
- Can be integrated into existing publication listing page
- Opens in new tab with `target="_blank" rel="noopener noreferrer"`

**Features to Add:**

1. **Scopus Integration Section**

   - Display Scopus organization profile link
   - Show organization metrics (if available via API)
   - Link to view all publications on Scopus

2. **Dual Display Option**
   - Keep existing publication listing
   - Add "View on Scopus" button/link for each publication
   - Add "View All on Scopus" button in header section

#### 4.3 Translation Keys

**Files:** `EPRI/messages/en.json` and `EPRI/messages/ar.json`

**Add keys:**

```json
{
  "citation": {
    "title": "Citation",
    "description": "Track citations and research impact metrics",
    "linkToSciVal": "Access SciVal Platform",
    "sciValDescription": "View citation metrics and research impact through the SciVal platform"
  },
  "publication": {
    "viewOnScopus": "View on Scopus",
    "viewAllOnScopus": "View All Publications on Scopus",
    "scopusOrganization": "Scopus Organization Profile",
    "scopusDescription": "Access our complete publication profile on Scopus"
  }
}
```

---

## 📝 Implementation Checklist

### Phase 1: Menu Restructure

- [ ] Update header.tsx with dropdown menu
- [ ] Create 7 new page routes
- [ ] Add translation keys (EN/AR)
- [ ] Update navigation links
- [ ] Test menu functionality

### Phase 2: Patent Page

- [ ] Move patent page to new location
- [ ] Research NRC patents page design
- [ ] Implement search/filter system
- [ ] Create patent listing component
- [ ] Create patent detail page
- [ ] Add statistics section
- [ ] Update database schema (if needed)
- [ ] Create API endpoints for patents
- [ ] Test responsive design

### Phase 3: EJP Journal Page

- [ ] Research Technoservice contact page design
- [ ] Implement contact/submission form
- [ ] Add journal information sections
- [ ] Create latest articles section
- [ ] Add editorial board display
- [ ] Implement guidelines section
- [ ] Add contact information
- [ ] Test form submission
- [ ] Test responsive design

### Phase 4: Citation and Publication Links

- [ ] Update Citation page with SciVal link integration
- [ ] Add external link button/redirect to SciVal
- [ ] Update Publication page with Scopus link
- [ ] Add "View on Scopus" functionality
- [ ] Add translation keys for external links
- [ ] Test external links open correctly
- [ ] Ensure proper security (target="\_blank" rel="noopener noreferrer")
- [ ] Test responsive design

---

## 🎨 Design Guidelines

### Color Scheme

- Maintain existing EPRI theme colors
- Primary: Blue (#3B82F6)
- Secondary: Slate grays
- Accent: Red for important elements

### Typography

- Headings: Serif font (existing)
- Body: Sans-serif (existing)
- Maintain Arabic font support (Cairo)

### Components to Reuse

- Card components
- Badge components
- Button components
- Form components
- Search/Filter components
- Tabs component (if needed)

---

## 🔄 Migration Notes

### Patent Page Migration

1. Copy content from `/library/patent` to `/innovation-and-entrepreneurship/patent`
2. Update all internal links
3. Update header menu references
4. Update footer links (if any)
5. Add redirect from old URL to new URL (optional)

### Database Considerations

- If patents need to be stored in database:
  - Create migration for Patent model
  - Seed initial data (if available)
  - Create API endpoints

---

## 📅 Estimated Timeline

- **Phase 1 (Menu Restructure):** 2-3 hours
- **Phase 2 (Patent Page):** 4-6 hours
- **Phase 3 (EJP Journal Page):** 3-4 hours
- **Phase 4 (Citation & Publication Links):** 1-2 hours
- **Testing & Refinement:** 2-3 hours

**Total:** ~12-18 hours

---

## ✅ Success Criteria

1. All menu items accessible and functional
2. Patent page matches NRC design reference
3. EJP Journal page matches Technoservice design reference
4. Citation page properly links to SciVal platform
5. Publication page properly links to Scopus organization page
6. All pages responsive on mobile/tablet/desktop
7. Full Arabic/English translation support
8. Forms functional with proper validation
9. Search/filter systems working correctly
10. No broken links or navigation issues
11. External links open securely in new tabs

---

## 📌 Notes

- Reference designs should be studied carefully before implementation
- Maintain consistency with existing EPRI design system
- Ensure all new pages follow accessibility guidelines
- Test thoroughly across different browsers and devices
- Consider SEO optimization for new pages
- **External Links:**
  - SciVal URL is an OAuth2 authorization URL - may require user authentication
  - Scopus URL is a direct organization profile page
  - Both should open in new tabs with proper security attributes
  - Consider adding loading states or redirect messages for external links
