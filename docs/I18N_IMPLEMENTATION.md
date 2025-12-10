# Internationalization (i18n) Implementation Summary

## Overview
Full internationalization support has been implemented for both English (en) and Arabic (ar) across the entire application, including frontend and backend.

## Frontend Implementation

### 1. Setup
- **Package**: `next-intl` installed and configured
- **Configuration**: `EPRI/i18n.ts` - Main i18n configuration
- **Middleware**: `EPRI/middleware.ts` - Handles locale routing
- **Translation Files**: 
  - `EPRI/messages/en.json` - English translations
  - `EPRI/messages/ar.json` - Arabic translations

### 2. App Structure
- All pages moved to `app/[locale]/` directory
- Root layout at `app/layout.tsx` (redirects to locale)
- Locale-specific layout at `app/[locale]/layout.tsx`
- Supports RTL for Arabic (`dir="rtl"`)

### 3. Components
- **Language Switcher**: `components/language-switcher.tsx`
  - Dropdown menu with language options
  - Saves locale to localStorage for API requests
  - Updates URL with locale prefix

### 4. Usage in Components
```typescript
// Server Components
import { getTranslations } from 'next-intl/server';
const t = await getTranslations();
<h1>{t('home.title')}</h1>

// Client Components
import { useTranslations } from 'next-intl';
const t = useTranslations();
<h1>{t('home.title')}</h1>
```

### 5. API Client
- Updated `EPRI/lib/api.ts` to send `Accept-Language` header
- Reads locale from localStorage
- All API requests include language preference

## Backend Implementation

### 1. Setup
- **i18n Middleware**: `backend/src/lib/i18n.ts`
  - Extracts locale from `Accept-Language` header or `lang` query parameter
  - Attaches locale to request object
  - Defaults to 'en' if not specified

### 2. Translation System
- **Translation Files**: `backend/src/lib/translations.ts`
  - Structured translations for common messages
  - Support for auth, products, services, departments, events, news
  - Parameter substitution support

### 3. Usage in API Routes
```typescript
import { getTranslation } from './lib/translations';

app.post('/api/endpoint', async (req, res) => {
  const t = getTranslation(req);
  return res.json({
    message: t('common.success'),
    data: result
  });
});
```

### 4. Middleware Integration
- i18n middleware added to `backend/src/server-auth.ts`
- Applied before all routes
- Example endpoints updated (auth/register)

## Translation Keys Structure

### Common
- `common.*` - Common UI elements (save, cancel, delete, etc.)

### Navigation
- `nav.*` - Navigation menu items

### Home
- `home.*` - Home page content

### Auth
- `auth.login.*` - Login page
- `auth.register.*` - Registration page

### Products
- `products.*` - Product-related translations

### Admin
- `admin.*` - Admin dashboard

### Errors
- `errors.*` - Error messages

## Next Steps

### To Complete Full Translation:

1. **Update All Pages**
   - Add `useTranslations()` or `getTranslations()` to all pages
   - Replace hardcoded strings with translation keys
   - Update `messages/en.json` and `messages/ar.json`

2. **Update Components**
   - Header navigation links
   - Footer content
   - All UI components
   - Form labels and buttons

3. **Backend API Responses**
   - Update all API endpoints to use `getTranslation(req)`
   - Replace hardcoded error/success messages
   - Add more translation keys as needed

4. **Database Content**
   - Consider adding multilingual fields to database models
   - Store content in both languages
   - Update API responses to return content in requested language

5. **Testing**
   - Test language switching
   - Verify RTL layout for Arabic
   - Test API responses in both languages
   - Verify locale persistence

## Current Status

✅ **Completed:**
- i18n infrastructure setup
- Language switcher component
- Backend i18n middleware
- Translation system for backend
- API client language headers
- Home page example translations
- Basic translation files structure

🔄 **In Progress:**
- Translating all frontend components
- Updating all backend API endpoints

⏳ **Pending:**
- Database multilingual content support
- Complete translation of all pages
- RTL styling adjustments for Arabic

## Usage Examples

### Frontend - Server Component
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations();
  return <h1>{t('home.title')}</h1>;
}
```

### Frontend - Client Component
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations();
  return <button>{t('common.save')}</button>;
}
```

### Backend - API Route
```typescript
import { getTranslation } from './lib/translations';

app.get('/api/endpoint', async (req, res) => {
  const t = getTranslation(req);
  res.json({ message: t('common.success') });
});
```

## Notes

- Locale is stored in localStorage for API requests
- URLs include locale prefix (e.g., `/en/home`, `/ar/home`)
- Arabic pages automatically use RTL direction
- Default locale is English if not specified
- Backend falls back to English if translation not found


