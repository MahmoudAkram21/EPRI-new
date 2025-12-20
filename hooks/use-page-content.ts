'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { apiClient } from '@/lib/api';

interface PageContent {
  id?: string;
  page_key: string;
  section_key: string;
  title?: { en: string; ar: string } | null;
  subtitle?: { en: string; ar: string } | null;
  description?: { en: string; ar: string } | null;
  button_text?: { en: string; ar: string } | null;
  button_link?: string | null;
  images?: string[];
  content?: any;
  metadata?: any;
  is_active?: boolean;
  order_index?: number;
}

interface UsePageContentOptions {
  pageKey: string;
  sectionKey?: string;
  autoFetch?: boolean;
}

export function usePageContent({ pageKey, sectionKey, autoFetch = true }: UsePageContentOptions) {
  const locale = useLocale();
  const [content, setContent] = useState<PageContent | null>(null);
  const [contents, setContents] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseJsonField = (field: any) => {
    if (field === null || field === undefined) return null;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return field;
      }
    }
    if (typeof field === 'object') {
      return field;
    }
    return field;
  };

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getPageContent(pageKey, sectionKey);
      const fetchedContents: any[] = response.contents || [];
      
      const parsedContents: PageContent[] = fetchedContents
        .filter((c: any) => c.is_active !== false) // Only active content
        .map((c: any) => ({
          id: c.id,
          page_key: c.page_key,
          section_key: c.section_key || 'overview',
          title: parseJsonField(c.title) || { en: '', ar: '' },
          subtitle: parseJsonField(c.subtitle) || { en: '', ar: '' },
          description: parseJsonField(c.description) || { en: '', ar: '' },
          button_text: parseJsonField(c.button_text) || { en: '', ar: '' },
          button_link: c.button_link || null,
          images: Array.isArray(c.images) 
            ? c.images 
            : (typeof c.images === 'string' 
                ? (() => { try { return JSON.parse(c.images); } catch { return []; } })()
                : c.images || []),
          content: parseJsonField(c.content),
          metadata: parseJsonField(c.metadata),
          is_active: c.is_active !== undefined ? c.is_active : true,
          order_index: c.order_index || 0,
        }))
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

      setContents(parsedContents);
      
      // If sectionKey is specified, get that specific section
      if (sectionKey) {
        const sectionContent = parsedContents.find(c => c.section_key === sectionKey);
        setContent(sectionContent || null);
      } else {
        // If no sectionKey, get the first content (usually overview)
        setContent(parsedContents[0] || null);
      }
    } catch (err: any) {
      console.error(`Error fetching page content for ${pageKey}:`, err);
      setError(err.message || 'Failed to fetch page content');
      setContent(null);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchContent();
    }
  }, [pageKey, sectionKey, autoFetch]);

  // Helper function to get localized text
  const getLocalizedText = (field: { en: string; ar: string } | null | undefined, fallback = ''): string => {
    if (!field) return fallback;
    return locale === 'ar' ? (field.ar || field.en || fallback) : (field.en || fallback);
  };

  return {
    content,
    contents,
    loading,
    error,
    refetch: fetchContent,
    getLocalizedText,
    // Convenience getters for current content
    title: content ? getLocalizedText(content.title) : '',
    subtitle: content ? getLocalizedText(content.subtitle) : '',
    description: content ? getLocalizedText(content.description) : '',
    buttonText: content ? getLocalizedText(content.button_text) : '',
    buttonLink: content?.button_link || null,
    images: content?.images || [],
  };
}


