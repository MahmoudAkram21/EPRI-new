'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  DollarSign, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Building,
  Save,
  Home,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Plus,
  Edit,
  Trash2,
  X,
  Users,
  BookOpen,
  GraduationCap,
  Library,
  Newspaper,
  Calendar,
  Briefcase,
  Wrench,
  Contact,
  ShoppingBag,
  Microscope,
  Sparkles,
  Award,
  CheckCircle2,
  TrendingUp,
  Shield,
  Target,
  Zap,
  FileCheck,
  Star,
  Heart,
  Lightbulb,
  Rocket,
  Flame,
  Gem,
  Crown,
  Trophy,
  Medal,
  Award as BadgeIcon, // Using Award as Badge icon
  CheckSquare,
  ThumbsUp,
  Eye,
  Brain,
  Cpu,
  Zap as ZapIcon,
  Activity,
  BarChart3,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ArrowRight as ArrowRightIcon,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Circle,
  Square,
  Triangle,
  Hexagon
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { useLocale, useTranslations } from 'next-intl';

interface SystemSettings {
  // General
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  
  // Payment
  currency: string;
  currencySymbol: string;
  paymentMethods: string;
  
  // Contact
  contactEmail: string;
  contactPhone: string;
  
  // Social Media
  facebook: string;
  twitter: string;
  linkedin: string;
  
  // Bank Details
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankAddress: string;
}

interface HomePageContent {
  id?: string;
  section_key: string;
  title?: { en: string; ar: string } | null;
  subtitle?: { en: string; ar: string } | null;
  description?: { en: string; ar: string } | null;
  content?: any;
  images?: string[];
  button_text?: { en: string; ar: string } | null;
  button_link?: string | null;
  is_active: boolean;
  order_index: number;
  metadata?: any;
}

const HOME_SECTIONS = [
  { key: 'why_choose', icon: FileText },
  { key: 'achievements', icon: FileText },
  { key: 'cta', icon: LinkIcon },
  { key: 'connect', icon: Globe },
];

// Icon options for Why Choose features
const FEATURE_ICONS = [
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'TrendingUp', label: 'Trending Up', icon: TrendingUp },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Target', label: 'Target', icon: Target },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'CheckCircle2', label: 'Check Circle', icon: CheckCircle2 },
  { value: 'FileCheck', label: 'File Check', icon: FileCheck },
  { value: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'Rocket', label: 'Rocket', icon: Rocket },
  { value: 'Flame', label: 'Flame', icon: Flame },
  { value: 'Gem', label: 'Gem', icon: Gem },
  { value: 'Crown', label: 'Crown', icon: Crown },
  { value: 'Trophy', label: 'Trophy', icon: Trophy },
  { value: 'Medal', label: 'Medal', icon: Medal },
  { value: 'Badge', label: 'Badge', icon: BadgeIcon },
  { value: 'CheckSquare', label: 'Check Square', icon: CheckSquare },
  { value: 'ThumbsUp', label: 'Thumbs Up', icon: ThumbsUp },
  { value: 'Eye', label: 'Eye', icon: Eye },
  { value: 'Brain', label: 'Brain', icon: Brain },
  { value: 'Cpu', label: 'CPU', icon: Cpu },
  { value: 'Activity', label: 'Activity', icon: Activity },
  { value: 'BarChart3', label: 'Bar Chart', icon: BarChart3 },
];

// Color gradient options
const COLOR_OPTIONS = [
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow to Orange' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
  { value: 'from-green-500 to-emerald-500', label: 'Green to Emerald' },
  { value: 'from-red-500 to-rose-500', label: 'Red to Rose' },
  { value: 'from-indigo-500 to-violet-500', label: 'Indigo to Violet' },
  { value: 'from-teal-500 to-cyan-500', label: 'Teal to Cyan' },
  { value: 'from-pink-500 to-rose-500', label: 'Pink to Rose' },
  { value: 'from-orange-500 to-red-500', label: 'Orange to Red' },
  { value: 'from-blue-600 to-indigo-600', label: 'Blue to Indigo' },
];

// Why Choose Feature Editor Component
function WhyChooseFeatureEditor({ content, onChange }: { content: HomePageContent; onChange: (content: any) => void }) {
  const features = (content.content?.features || []) as Array<{
    icon?: string;
    title?: { en: string; ar: string };
    description?: { en: string; ar: string };
    color?: string;
    link?: string;
  }>;

  const updateFeature = (index: number, field: string, lang: 'en' | 'ar' | null, value: any) => {
    const newFeatures = [...features];
    if (!newFeatures[index]) {
      newFeatures[index] = { icon: 'Award', title: { en: '', ar: '' }, description: { en: '', ar: '' }, color: 'from-blue-500 to-cyan-500', link: '' };
    }
    
    if (lang) {
      newFeatures[index] = {
        ...newFeatures[index],
        [field]: {
          ...(newFeatures[index][field as keyof typeof newFeatures[0]] as any || { en: '', ar: '' }),
          [lang]: value
        }
      };
    } else {
      newFeatures[index] = {
        ...newFeatures[index],
        [field]: value
      };
    }
    
    onChange({ ...content.content, features: newFeatures });
  };

  const addFeature = () => {
    const newFeatures = [...features, {
      icon: 'Award',
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      color: 'from-blue-500 to-cyan-500',
      link: ''
    }];
    onChange({ ...content.content, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    onChange({ ...content.content, features: newFeatures });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Features</Label>
        <Button type="button" size="sm" onClick={addFeature}>
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>
      
      {features.map((feature, index) => {
        const IconComponent = FEATURE_ICONS.find(ic => ic.value === feature.icon)?.icon || Award;
        return (
          <Card key={index} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Feature {index + 1}</CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Icon Selection */}
              <div>
                <Label>Icon</Label>
                <Select
                  value={feature.icon || 'Award'}
                  onValueChange={(value) => updateFeature(index, 'icon', null, value)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {FEATURE_ICONS.find(ic => ic.value === feature.icon)?.label || 'Award'}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {FEATURE_ICONS.map((icon) => {
                      const Icon = icon.icon;
                      return (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {icon.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label>Title</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">English</Label>
                    <Input
                      value={feature.title?.en || ''}
                      onChange={(e) => updateFeature(index, 'title', 'en', e.target.value)}
                      placeholder="English title"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Arabic</Label>
                    <Input
                      value={feature.title?.ar || ''}
                      onChange={(e) => updateFeature(index, 'title', 'ar', e.target.value)}
                      placeholder="Arabic title"
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">English</Label>
                    <Textarea
                      value={feature.description?.en || ''}
                      onChange={(e) => updateFeature(index, 'description', 'en', e.target.value)}
                      placeholder="English description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Arabic</Label>
                    <Textarea
                      value={feature.description?.ar || ''}
                      onChange={(e) => updateFeature(index, 'description', 'ar', e.target.value)}
                      placeholder="Arabic description"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>
              </div>

              {/* Color Gradient */}
              <div>
                <Label>Color Gradient</Label>
                <Select
                  value={feature.color || 'from-blue-500 to-cyan-500'}
                  onValueChange={(value) => updateFeature(index, 'color', null, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_OPTIONS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded bg-gradient-to-r ${color.value}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Link */}
              <div>
                <Label>Link (Optional)</Label>
                <Input
                  value={feature.link || ''}
                  onChange={(e) => updateFeature(index, 'link', null, e.target.value)}
                  placeholder="/path/to/page or https://example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty if you don't want the card to be clickable
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {features.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No features yet. Click "Add Feature" to create one.
        </div>
      )}
    </div>
  );
}

const PAGE_TABS = [
  { 
    key: 'about', 
    icon: Users, 
    label: 'About',
    sections: ['overview', 'top-management', 'iso-certificate', 'awards', 'clients-partners', 'schools', 'protocols-agreements']
  },
  { 
    key: 'departments', 
    icon: Briefcase, 
    label: 'Departments',
    sections: ['overview']
  },
  { 
    key: 'services', 
    icon: Wrench, 
    label: 'Services',
    sections: ['overview']
  },
  { 
    key: 'training', 
    icon: GraduationCap, 
    label: 'Training Center',
    sections: ['overview']
  },
  { 
    key: 'library', 
    icon: Library, 
    label: 'Library',
    sections: ['overview']
  },
  { 
    key: 'news', 
    icon: Newspaper, 
    label: 'News',
    sections: ['overview']
  },
  { 
    key: 'events', 
    icon: Calendar, 
    label: 'Events',
    sections: ['overview']
  },
  { 
    key: 'products', 
    icon: ShoppingBag, 
    label: 'Products',
    sections: ['overview']
  },
  { 
    key: 'equipment', 
    icon: Microscope, 
    label: 'Equipment',
    sections: ['overview']
  },
  { 
    key: 'innovation', 
    icon: Sparkles, 
    label: 'Innovation',
    sections: ['overview']
  },
];

export default function AdminSettings() {
  const { toast } = useToast();
  const locale = useLocale();
  const t = useTranslations('settings');
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [homeContentLoading, setHomeContentLoading] = useState(false);
  const [homeContents, setHomeContents] = useState<Record<string, HomePageContent>>({});
  const [heroSliders, setHeroSliders] = useState<any[]>([]);
  const [heroSliderLoading, setHeroSliderLoading] = useState(false);
  const [editingSlider, setEditingSlider] = useState<any | null>(null);
  const [showSliderForm, setShowSliderForm] = useState(false);
  const [pageContents, setPageContents] = useState<Record<string, Record<string, any>>>({});
  const [pageContentLoading, setPageContentLoading] = useState<Record<string, boolean>>({});
  
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Egyptian Petroleum Research Institute',
    siteEmail: 'info@epri.edu',
    sitePhone: '+20 2 1234 5678',
    siteAddress: '1 Ahmed El-Zomor Street, Nasr City, Cairo, Egypt',
    currency: 'EGP',
    currencySymbol: 'EGP',
    paymentMethods: 'Bank Transfer, Cash, Online Payment',
    contactEmail: 'contact@epri.edu',
    contactPhone: '+20 2 1234 5678',
    facebook: 'https://facebook.com/epri',
    twitter: 'https://twitter.com/epri',
    linkedin: 'https://linkedin.com/company/epri',
    bankName: 'National Bank of Egypt',
    accountNumber: '1234567890',
    accountName: 'Egyptian Petroleum Research Institute',
    bankAddress: 'Bank Branch Address, Cairo, Egypt'
  });

  useEffect(() => {
    fetchHomeContent();
    fetchHeroSliders();
    // Load content for the active tab if it's a page tab
    if (PAGE_TABS.some(tab => tab.key === activeTab)) {
      fetchPageContent(activeTab);
    }
  }, []);

  // Load page content when tab changes to a page tab
  useEffect(() => {
    if (PAGE_TABS.some(tab => tab.key === activeTab)) {
      fetchPageContent(activeTab);
    }
  }, [activeTab]);

  const fetchHeroSliders = async () => {
    setHeroSliderLoading(true);
    try {
      const response = await apiClient.getAdminHeroSliders();
      const sliders = response.sliders || [];
      
      // Parse JSON fields
      const parsedSliders = sliders.map((slider: any) => ({
        ...slider,
        title: typeof slider.title === 'string' ? JSON.parse(slider.title) : slider.title,
        subtitle: typeof slider.subtitle === 'string' ? JSON.parse(slider.subtitle) : slider.subtitle,
        description: typeof slider.description === 'string' ? JSON.parse(slider.description) : slider.description,
        cta: typeof slider.cta === 'string' ? JSON.parse(slider.cta) : slider.cta,
        badge: typeof slider.badge === 'string' ? JSON.parse(slider.badge) : slider.badge,
        stats: typeof slider.stats === 'string' ? JSON.parse(slider.stats) : slider.stats || [],
      }));
      
      setHeroSliders(parsedSliders);
    } catch (error) {
      console.error('Error fetching hero sliders:', error);
    } finally {
      setHeroSliderLoading(false);
    }
  };

  const fetchHomeContent = async () => {
    setHomeContentLoading(true);
    try {
      const response = await apiClient.get('/admin/home-content');
      console.log('Home content API response:', response);
      
      const contents: HomePageContent[] = response.contents || [];
      console.log('Parsed contents:', contents);
      
      if (contents.length === 0) {
        console.warn('No home page content found. Make sure to run the seed file.');
        toast({
          title: 'No Content',
          description: 'No home page content found. Please run the database seed.',
          variant: 'default',
        });
      }
      
      const contentsMap: Record<string, HomePageContent> = {};
      
      contents.forEach((content: any) => {
        // Helper to safely parse JSON fields
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
        
        const parsedContent: HomePageContent = {
          id: content.id,
          section_key: content.section_key,
          title: parseJsonField(content.title) || { en: '', ar: '' },
          subtitle: parseJsonField(content.subtitle) || { en: '', ar: '' },
          description: parseJsonField(content.description) || { en: '', ar: '' },
          button_text: parseJsonField(content.button_text) || { en: '', ar: '' },
          button_link: content.button_link || null,
          images: Array.isArray(content.images) 
            ? content.images 
            : (typeof content.images === 'string' 
                ? (() => { try { return JSON.parse(content.images); } catch { return []; } })()
                : content.images || []),
          content: parseJsonField(content.content),
          metadata: parseJsonField(content.metadata),
          is_active: content.is_active !== undefined ? content.is_active : true,
          order_index: content.order_index || 0,
        };
        
        contentsMap[content.section_key] = parsedContent;
        console.log(`Loaded section ${content.section_key}:`, parsedContent);
      });
      
      setHomeContents(contentsMap);
      console.log('All home contents loaded:', Object.keys(contentsMap));
    } catch (error: any) {
      console.error('Error fetching home content:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch home page content. Make sure you are logged in as admin.',
        variant: 'destructive',
      });
    } finally {
      setHomeContentLoading(false);
    }
  };

  const handleChange = (field: keyof SystemSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHomeContentChange = (sectionKey: string, field: keyof HomePageContent, value: any) => {
    setHomeContents(prev => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey] || {
          section_key: sectionKey,
          is_active: true,
          order_index: 0
        },
        [field]: value
      }
    }));
  };

  const handleHomeContentLocalizedChange = (
    sectionKey: string,
    field: 'title' | 'subtitle' | 'description' | 'button_text',
    lang: 'en' | 'ar',
    value: string
  ) => {
    const current = homeContents[sectionKey] || {
      section_key: sectionKey,
      is_active: true,
      order_index: 0
    };
    
    handleHomeContentChange(sectionKey, field, {
      ...(current[field] as any || {}),
      [lang]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: t('general.settingsSaved'),
        description: t('general.settingsSaved'),
      });
    } catch (error) {
      toast({
        title: t('general.saveError'),
        description: t('general.saveError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHomeContent = async (sectionKey: string) => {
    setLoading(true);
    try {
      const content = homeContents[sectionKey];
      if (!content) return;

      await apiClient.post('/admin/home-content', {
        ...content,
        title: JSON.stringify(content.title || {}),
        subtitle: JSON.stringify(content.subtitle || {}),
        description: JSON.stringify(content.description || {}),
        button_text: JSON.stringify(content.button_text || {}),
        images: JSON.stringify(content.images || []),
        content: JSON.stringify(content.content || {}),
        metadata: JSON.stringify(content.metadata || {}),
      });

      toast({
        title: t('homePage.contentSaved'),
        description: t('homePage.contentSaved'),
      });
    } catch (error: any) {
      toast({
        title: t('homePage.saveContentError'),
        description: error.message || t('homePage.saveContentError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getHomeContent = (sectionKey: string): HomePageContent => {
    const content = homeContents[sectionKey];
    if (content) {
      return {
        ...content,
        title: content.title || { en: '', ar: '' },
        subtitle: content.subtitle || { en: '', ar: '' },
        description: content.description || { en: '', ar: '' },
        button_text: content.button_text || { en: '', ar: '' },
        images: content.images || [],
        content: content.content || null,
      };
    }
    return {
      section_key: sectionKey,
      is_active: true,
      order_index: 0,
      title: { en: '', ar: '' },
      subtitle: { en: '', ar: '' },
      description: { en: '', ar: '' },
      button_text: { en: '', ar: '' },
      images: [],
      content: null,
    };
  };

  const fetchPageContent = async (pageKey: string) => {
    if (pageContentLoading[pageKey]) return;
    setPageContentLoading(prev => ({ ...prev, [pageKey]: true }));
    try {
      const response = await apiClient.getAdminPageContent(pageKey);
      const contents: any[] = response.contents || [];
      
      const contentsMap: Record<string, any> = {};
      contents.forEach((content: any) => {
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
        
        const sectionKey = content.section_key || 'overview';
        contentsMap[sectionKey] = {
          id: content.id,
          page_key: content.page_key,
          section_key: sectionKey,
          title: parseJsonField(content.title) || { en: '', ar: '' },
          subtitle: parseJsonField(content.subtitle) || { en: '', ar: '' },
          description: parseJsonField(content.description) || { en: '', ar: '' },
          button_text: parseJsonField(content.button_text) || { en: '', ar: '' },
          button_link: content.button_link || null,
          images: Array.isArray(content.images) 
            ? content.images 
            : (typeof content.images === 'string' 
                ? (() => { try { return JSON.parse(content.images); } catch { return []; } })()
                : content.images || []),
          content: parseJsonField(content.content),
          metadata: parseJsonField(content.metadata),
          is_active: content.is_active !== undefined ? content.is_active : true,
          order_index: content.order_index || 0,
        };
      });
      
      setPageContents(prev => ({ ...prev, [pageKey]: contentsMap }));
    } catch (error: any) {
      console.error(`Error fetching page content for ${pageKey}:`, error);
      toast({
        title: 'Error',
        description: error.message || `Failed to fetch ${pageKey} page content.`,
        variant: 'destructive',
      });
    } finally {
      setPageContentLoading(prev => ({ ...prev, [pageKey]: false }));
    }
  };

  const handlePageContentChange = (pageKey: string, sectionKey: string, field: string, value: any) => {
    setPageContents(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey] || {},
        [sectionKey]: {
          ...(prev[pageKey]?.[sectionKey] || {
            page_key: pageKey,
            section_key: sectionKey,
            is_active: true,
            order_index: 0
          }),
          [field]: value
        }
      }
    }));
  };

  const handlePageContentLocalizedChange = (
    pageKey: string,
    sectionKey: string,
    field: 'title' | 'subtitle' | 'description' | 'button_text',
    lang: 'en' | 'ar',
    value: string
  ) => {
    const current = pageContents[pageKey]?.[sectionKey] || {
      page_key: pageKey,
      section_key: sectionKey,
      is_active: true,
      order_index: 0
    };
    
    handlePageContentChange(pageKey, sectionKey, field, {
      ...(current[field] as any || {}),
      [lang]: value
    });
  };

  const handleSavePageContent = async (pageKey: string, sectionKey: string) => {
    setLoading(true);
    try {
      const content = pageContents[pageKey]?.[sectionKey];
      if (!content) return;

      await apiClient.createOrUpdateAdminPageContent({
        page_key: pageKey,
        section_key: sectionKey,
        ...content,
      });

      toast({
        title: 'Content Saved',
        description: `${pageKey} page content saved successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save page content',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPageContent = (pageKey: string, sectionKey: string): any => {
    const content = pageContents[pageKey]?.[sectionKey];
    if (content) {
      return {
        ...content,
        title: content.title || { en: '', ar: '' },
        subtitle: content.subtitle || { en: '', ar: '' },
        description: content.description || { en: '', ar: '' },
        button_text: content.button_text || { en: '', ar: '' },
        images: content.images || [],
        content: content.content || null,
      };
    }
    return {
      page_key: pageKey,
      section_key: sectionKey,
      is_active: true,
      order_index: 0,
      title: { en: '', ar: '' },
      subtitle: { en: '', ar: '' },
      description: { en: '', ar: '' },
      button_text: { en: '', ar: '' },
      images: [],
      content: null,
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          {t('title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t('description')}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="general">{t('tabs.general')}</TabsTrigger>
          <TabsTrigger value="home">
            <Home className="h-4 w-4 mr-2" />
            {t('tabs.homePage')}
          </TabsTrigger>
          {PAGE_TABS.map((page) => {
            const Icon = page.icon;
            return (
              <TabsTrigger key={page.key} value={page.key}>
                <Icon className="h-4 w-4 mr-2" />
                {page.label}
              </TabsTrigger>
            );
          })}
          <TabsTrigger value="payment">{t('tabs.payment')}</TabsTrigger>
          <TabsTrigger value="contact">{t('tabs.contact')}</TabsTrigger>
          <TabsTrigger value="social">{t('tabs.socialMedia')}</TabsTrigger>
          <TabsTrigger value="bank">{t('tabs.bankDetails')}</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {t('general.title')}
                </CardTitle>
                <CardDescription>{t('general.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteName">{t('general.siteName')}</Label>
                  <Input 
                    id="siteName" 
                    value={settings.siteName}
                    onChange={(e) => handleChange('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteEmail">{t('general.siteEmail')}</Label>
                  <Input 
                    id="siteEmail" 
                    type="email"
                    value={settings.siteEmail}
                    onChange={(e) => handleChange('siteEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sitePhone">{t('general.sitePhone')}</Label>
                  <Input 
                    id="sitePhone"
                    value={settings.sitePhone}
                    onChange={(e) => handleChange('sitePhone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteAddress">{t('general.siteAddress')}</Label>
                  <Textarea 
                    id="siteAddress"
                    value={settings.siteAddress}
                    onChange={(e) => handleChange('siteAddress', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? t('general.saving') : t('general.saveSettings')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* Home Page Content Tab */}
        <TabsContent value="home" className="space-y-6">
          {/* Hero Sliders Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {t('homePage.heroSliders')}
                </CardTitle>
                <Button onClick={() => {
                  setEditingSlider(null);
                  setShowSliderForm(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('homePage.addSlider')}
                </Button>
              </div>
              <CardDescription>{t('homePage.manageSliders')}</CardDescription>
            </CardHeader>
            <CardContent>
              {heroSliderLoading ? (
                <div className="text-center py-8">{t('common.loading', { defaultValue: 'Loading...' })}</div>
              ) : heroSliders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('homePage.noSliders')}
                </div>
              ) : (
                <div className="space-y-4">
                  {heroSliders.map((slider: any) => (
                    <div key={slider.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{slider.title?.en || slider.title?.ar || 'Untitled'}</h4>
                          <p className="text-sm text-muted-foreground">{slider.subtitle?.en || slider.subtitle?.ar || ''}</p>
                          <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                            <span>{t('homePage.order')}: {slider.order_index}</span>
                            <span>•</span>
                            <span>{t('homePage.type')}: {slider.media_type}</span>
                            <span>•</span>
                            <span>{t('homePage.active')}: {slider.is_active ? t('common.yes', { defaultValue: 'Yes' }) : t('common.no', { defaultValue: 'No' })}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSlider(slider);
                              setShowSliderForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (confirm(t('homePage.deleteConfirm'))) {
                                try {
                                  await apiClient.deleteAdminHeroSlider(slider.id);
                                  toast({
                                    title: t('homePage.sliderDeleted'),
                                    description: t('homePage.sliderDeleted'),
                                  });
                                  fetchHeroSliders();
                                } catch (error: any) {
                                  toast({
                                    title: t('homePage.deleteError'),
                                    description: error.message || t('homePage.deleteError'),
                                    variant: 'destructive',
                                  });
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hero Slider Form Modal */}
          {showSliderForm && (
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{editingSlider ? t('homePage.editSlider') : t('homePage.createSlider')}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setShowSliderForm(false);
                    setEditingSlider(null);
                  }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <HeroSliderForm
                  slider={editingSlider}
                  onSave={async () => {
                    await fetchHeroSliders();
                    setShowSliderForm(false);
                    setEditingSlider(null);
                  }}
                  onCancel={() => {
                    setShowSliderForm(false);
                    setEditingSlider(null);
                  }}
                />
              </CardContent>
            </Card>
          )}

          {/* Other Home Sections */}
          {homeContentLoading ? (
            <div className="text-center py-8">{t('common.loading', { defaultValue: 'Loading...' })}</div>
          ) : (
            HOME_SECTIONS.map((section: any) => {
              const content = getHomeContent(section.key);
              const Icon = section.icon;
              const sectionLabel = t(`homePage.sections.${section.key}` as any, { defaultValue: section.label });
              
              return (
                <Card key={section.key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {sectionLabel}
                    </CardTitle>
                    <CardDescription>{t('homePage.editContent', { section: sectionLabel })}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label>{t('homePage.title')}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('heroSlider.english')}</Label>
                          <Input
                            value={content.title?.en || ''}
                            onChange={(e) => handleHomeContentLocalizedChange(section.key, 'title', 'en', e.target.value)}
                            placeholder={`${t('heroSlider.english')} ${t('homePage.title').toLowerCase()}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('heroSlider.arabic')}</Label>
                          <Input
                            value={content.title?.ar || ''}
                            onChange={(e) => handleHomeContentLocalizedChange(section.key, 'title', 'ar', e.target.value)}
                            placeholder={`${t('heroSlider.arabic')} ${t('homePage.title').toLowerCase()}`}
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-2">
                      <Label>{t('homePage.subtitle')}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('heroSlider.english')}</Label>
                          <Input
                            value={content.subtitle?.en || ''}
                            onChange={(e) => handleHomeContentLocalizedChange(section.key, 'subtitle', 'en', e.target.value)}
                            placeholder={`${t('heroSlider.english')} ${t('homePage.subtitle').toLowerCase()}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('heroSlider.arabic')}</Label>
                          <Input
                            value={content.subtitle?.ar || ''}
                            onChange={(e) => handleHomeContentLocalizedChange(section.key, 'subtitle', 'ar', e.target.value)}
                            placeholder={`${t('heroSlider.arabic')} ${t('homePage.subtitle').toLowerCase()}`}
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>{t('homePage.description')}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('heroSlider.english')}</Label>
                          <Textarea
                            value={content.description?.en || ''}
                            onChange={(e) => handleHomeContentLocalizedChange(section.key, 'description', 'en', e.target.value)}
                            placeholder={`${t('heroSlider.english')} ${t('homePage.description').toLowerCase()}`}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('heroSlider.arabic')}</Label>
                          <Textarea
                            value={content.description?.ar || ''}
                            onChange={(e) => handleHomeContentLocalizedChange(section.key, 'description', 'ar', e.target.value)}
                            placeholder={`${t('heroSlider.arabic')} ${t('homePage.description').toLowerCase()}`}
                            rows={3}
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Button Text */}
                    <div className="space-y-2">
                      <Label>{t('homePage.buttonText')}</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('heroSlider.english')}</Label>
                          <Input
                            value={content.button_text?.en || ''}
                            onChange={(e) => handleHomeContentLocalizedChange(section.key, 'button_text', 'en', e.target.value)}
                            placeholder={`${t('heroSlider.english')} ${t('homePage.buttonText').toLowerCase()}`}
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">{t('heroSlider.arabic')}</Label>
                          <Input
                            value={content.button_text?.ar || ''}
                            onChange={(e) => handleHomeContentLocalizedChange(section.key, 'button_text', 'ar', e.target.value)}
                            placeholder={`${t('heroSlider.arabic')} ${t('homePage.buttonText').toLowerCase()}`}
                            dir="rtl"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Button Link */}
                    <div>
                      <Label>{t('homePage.buttonLink')}</Label>
                      <Input
                        value={content.button_link || ''}
                        onChange={(e) => handleHomeContentChange(section.key, 'button_link', e.target.value)}
                        placeholder="/path/to/page"
                      />
                    </div>

                    {/* Content (JSON) - Special handling for why_choose features */}
                    {section.key === 'why_choose' ? (
                      <WhyChooseFeatureEditor
                        content={content}
                        onChange={(newContent) => handleHomeContentChange(section.key, 'content', newContent)}
                      />
                    ) : (
                      <div>
                        <Label>{t('homePage.content')}</Label>
                        <Textarea
                          value={typeof content.content === 'string' ? content.content : JSON.stringify(content.content || {}, null, 2)}
                          onChange={(e) => {
                            try {
                              const parsed = JSON.parse(e.target.value);
                              handleHomeContentChange(section.key, 'content', parsed);
                            } catch {
                              // Invalid JSON, store as string for now
                              handleHomeContentChange(section.key, 'content', e.target.value);
                            }
                          }}
                          placeholder='{"features": [...], "achievements": [...]}'
                          rows={8}
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('homePage.contentHint')}
                        </p>
                      </div>
                    )}

                    {/* Images */}
                    <div>
                      <Label>{t('homePage.images')}</Label>
                      <Textarea
                        value={(content.images || []).join(', ')}
                        onChange={(e) => {
                          const images = e.target.value.split(',').map((url: string) => url.trim()).filter(Boolean);
                          handleHomeContentChange(section.key, 'images', images);
                        }}
                        placeholder="/image1.jpg, /image2.jpg"
                        rows={2}
                      />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between">
                      <Label>{t('homePage.isActive')}</Label>
                      <Switch
                        checked={content.is_active}
                        onCheckedChange={(checked) => handleHomeContentChange(section.key, 'is_active', checked)}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleSaveHomeContent(section.key)}
                        disabled={loading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? t('general.saving') : t('homePage.saveContent')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Payment Settings Tab */}
        <TabsContent value="payment">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  {t('payment.title')}
                </CardTitle>
                <CardDescription>{t('payment.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">{t('payment.currency')}</Label>
                    <Select 
                      value={settings.currency}
                      onValueChange={(value) => handleChange('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EGP">{t('payment.egp')}</SelectItem>
                        <SelectItem value="USD">{t('payment.usd')}</SelectItem>
                        <SelectItem value="EUR">{t('payment.eur')}</SelectItem>
                        <SelectItem value="GBP">{t('payment.gbp')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currencySymbol">{t('payment.currencySymbol')}</Label>
                    <Input 
                      id="currencySymbol"
                      value={settings.currencySymbol}
                      onChange={(e) => handleChange('currencySymbol', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="paymentMethods">{t('payment.paymentMethods')}</Label>
                  <Input 
                    id="paymentMethods"
                    value={settings.paymentMethods}
                    onChange={(e) => handleChange('paymentMethods', e.target.value)}
                    placeholder={t('payment.paymentMethodsPlaceholder')}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? t('general.saving') : t('general.saveSettings')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {t('contact.title')}
                </CardTitle>
                <CardDescription>{t('contact.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">{t('contact.contactEmail')}</Label>
                  <Input 
                    id="contactEmail" 
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">{t('contact.contactPhone')}</Label>
                  <Input 
                    id="contactPhone"
                    value={settings.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? t('general.saving') : t('general.saveSettings')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t('socialMedia.title')}
                </CardTitle>
                <CardDescription>{t('socialMedia.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="facebook">{t('socialMedia.facebook')}</Label>
                  <Input 
                    id="facebook"
                    value={settings.facebook}
                    onChange={(e) => handleChange('facebook', e.target.value)}
                    placeholder={t('socialMedia.facebookPlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="twitter">{t('socialMedia.twitter')}</Label>
                  <Input 
                    id="twitter"
                    value={settings.twitter}
                    onChange={(e) => handleChange('twitter', e.target.value)}
                    placeholder={t('socialMedia.twitterPlaceholder')}
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin">{t('socialMedia.linkedin')}</Label>
                  <Input 
                    id="linkedin"
                    value={settings.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value)}
                    placeholder={t('socialMedia.linkedinPlaceholder')}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? t('general.saving') : t('general.saveSettings')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* Bank Details Tab */}
        <TabsContent value="bank">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {t('bank.title')}
                </CardTitle>
                <CardDescription>{t('bank.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bankName">{t('bank.bankName')}</Label>
                  <Input 
                    id="bankName"
                    value={settings.bankName}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">{t('bank.accountName')}</Label>
                  <Input 
                    id="accountName"
                    value={settings.accountName}
                    onChange={(e) => handleChange('accountName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">{t('bank.accountNumber')}</Label>
                  <Input 
                    id="accountNumber"
                    value={settings.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="bankAddress">{t('bank.bankAddress')}</Label>
                  <Textarea 
                    id="bankAddress"
                    value={settings.bankAddress}
                    onChange={(e) => handleChange('bankAddress', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? t('general.saving') : t('general.saveSettings')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* Page Content Tabs */}
        {PAGE_TABS.map((page) => (
          <TabsContent key={page.key} value={page.key} className="space-y-6">
            {pageContentLoading[page.key] ? (
              <div className="text-center py-8">{t('common.loading', { defaultValue: 'Loading...' })}</div>
            ) : (
              <div className="space-y-6">
                {page.sections.map((sectionKey) => {
                  const content = getPageContent(page.key, sectionKey);
                  return (
                    <Card key={sectionKey}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1).replace(/-/g, ' ')}
                        </CardTitle>
                        <CardDescription>
                          Edit content for {page.label} - {sectionKey} section
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-muted-foreground">English</Label>
                              <Input
                                value={content.title?.en || ''}
                                onChange={(e) => handlePageContentLocalizedChange(page.key, sectionKey, 'title', 'en', e.target.value)}
                                placeholder="English title"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Arabic</Label>
                              <Input
                                value={content.title?.ar || ''}
                                onChange={(e) => handlePageContentLocalizedChange(page.key, sectionKey, 'title', 'ar', e.target.value)}
                                placeholder="Arabic title"
                                dir="rtl"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-2">
                          <Label>Subtitle</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-muted-foreground">English</Label>
                              <Input
                                value={content.subtitle?.en || ''}
                                onChange={(e) => handlePageContentLocalizedChange(page.key, sectionKey, 'subtitle', 'en', e.target.value)}
                                placeholder="English subtitle"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Arabic</Label>
                              <Input
                                value={content.subtitle?.ar || ''}
                                onChange={(e) => handlePageContentLocalizedChange(page.key, sectionKey, 'subtitle', 'ar', e.target.value)}
                                placeholder="Arabic subtitle"
                                dir="rtl"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-muted-foreground">English</Label>
                              <Textarea
                                value={content.description?.en || ''}
                                onChange={(e) => handlePageContentLocalizedChange(page.key, sectionKey, 'description', 'en', e.target.value)}
                                placeholder="English description"
                                rows={4}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Arabic</Label>
                              <Textarea
                                value={content.description?.ar || ''}
                                onChange={(e) => handlePageContentLocalizedChange(page.key, sectionKey, 'description', 'ar', e.target.value)}
                                placeholder="Arabic description"
                                rows={4}
                                dir="rtl"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Button Text */}
                        <div className="space-y-2">
                          <Label>Button Text (Optional)</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs text-muted-foreground">English</Label>
                              <Input
                                value={content.button_text?.en || ''}
                                onChange={(e) => handlePageContentLocalizedChange(page.key, sectionKey, 'button_text', 'en', e.target.value)}
                                placeholder="English button text"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Arabic</Label>
                              <Input
                                value={content.button_text?.ar || ''}
                                onChange={(e) => handlePageContentLocalizedChange(page.key, sectionKey, 'button_text', 'ar', e.target.value)}
                                placeholder="Arabic button text"
                                dir="rtl"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Button Link */}
                        <div className="space-y-2">
                          <Label>Button Link (Optional)</Label>
                          <Input
                            value={content.button_link || ''}
                            onChange={(e) => handlePageContentChange(page.key, sectionKey, 'button_link', e.target.value)}
                            placeholder="/page-url"
                          />
                        </div>

                        {/* Active Status */}
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Active</Label>
                            <p className="text-xs text-muted-foreground">Show this section on the page</p>
                          </div>
                          <Switch
                            checked={content.is_active}
                            onCheckedChange={(checked) => handlePageContentChange(page.key, sectionKey, 'is_active', checked)}
                          />
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-4 border-t">
                          <Button
                            type="button"
                            onClick={() => handleSavePageContent(page.key, sectionKey)}
                            disabled={loading}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Content'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// Hero Slider Form Component
interface StatItem {
  value: string;
  label: { en: string; ar: string };
}

function HeroSliderForm({ slider, onSave, onCancel }: { slider: any | null; onSave: () => void; onCancel: () => void }) {
  const { toast } = useToast();
  const t = useTranslations('settings');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    media_type: string;
    image: string;
    video: string;
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    description: { en: string; ar: string };
    cta: { en: string; ar: string };
    cta_link: string;
    badge: { en: string; ar: string };
    icon: string;
    stats: StatItem[];
    is_active: boolean;
    order_index: number;
  }>({
    media_type: slider?.media_type || 'image',
    image: slider?.image || '',
    video: slider?.video || '',
    title: slider?.title || { en: '', ar: '' },
    subtitle: slider?.subtitle || { en: '', ar: '' },
    description: slider?.description || { en: '', ar: '' },
    cta: slider?.cta || { en: '', ar: '' },
    cta_link: slider?.cta_link || '',
    badge: slider?.badge || { en: '', ar: '' },
    icon: slider?.icon || 'Microscope',
    stats: (slider?.stats || []) as StatItem[],
    is_active: slider?.is_active !== undefined ? slider.is_active : true,
    order_index: slider?.order_index || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (slider?.id) {
        await apiClient.updateAdminHeroSlider(slider.id, formData);
        toast({
          title: t('heroSlider.sliderUpdated'),
          description: t('heroSlider.sliderUpdated'),
        });
      } else {
        await apiClient.createAdminHeroSlider(formData);
        toast({
          title: t('heroSlider.sliderCreated'),
          description: t('heroSlider.sliderCreated'),
        });
      }
      onSave();
    } catch (error: any) {
      toast({
        title: t('heroSlider.sliderError'),
        description: error.message || t('heroSlider.sliderError'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { value: '', label: { en: '', ar: '' } }],
    });
  };

  const removeStat = (index: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_unused: StatItem, i: number) => i !== index),
    });
  };

  const updateStat = (index: number, field: 'value' | 'label', lang: 'en' | 'ar' | null, value: string) => {
    const newStats = [...formData.stats];
    if (field === 'value') {
      newStats[index] = { ...newStats[index], value };
    } else if (lang) {
      newStats[index] = {
        ...newStats[index],
        label: { ...newStats[index].label, [lang]: value },
      };
    }
    setFormData({ ...formData, stats: newStats });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Media Type */}
      <div>
        <Label>Media Type</Label>
        <Select
          value={formData.media_type}
          onValueChange={(value) => setFormData({ ...formData, media_type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Image */}
      {formData.media_type === 'image' && (
        <div>
          <Label>Image URL</Label>
          <Input
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="/image.jpg"
          />
        </div>
      )}

      {/* Video */}
      {formData.media_type === 'video' && (
        <div>
          <Label>Video URL</Label>
          <Input
            value={formData.video}
            onChange={(e) => setFormData({ ...formData, video: e.target.value })}
            placeholder="https://example.com/video.mp4"
          />
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label>Title</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">English</Label>
            <Input
              value={formData.title.en}
              onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
              placeholder="English title"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Arabic</Label>
            <Input
              value={formData.title.ar}
              onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
              placeholder="Arabic title"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">English</Label>
            <Input
              value={formData.subtitle.en}
              onChange={(e) => setFormData({ ...formData, subtitle: { ...formData.subtitle, en: e.target.value } })}
              placeholder="English subtitle"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Arabic</Label>
            <Input
              value={formData.subtitle.ar}
              onChange={(e) => setFormData({ ...formData, subtitle: { ...formData.subtitle, ar: e.target.value } })}
              placeholder="Arabic subtitle"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">English</Label>
            <Textarea
              value={formData.description.en}
              onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
              placeholder="English description"
              rows={3}
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Arabic</Label>
            <Textarea
              value={formData.description.ar}
              onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })}
              placeholder="Arabic description"
              rows={3}
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-2">
        <Label>CTA Text</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">English</Label>
            <Input
              value={formData.cta.en}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, en: e.target.value } })}
              placeholder="English CTA"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Arabic</Label>
            <Input
              value={formData.cta.ar}
              onChange={(e) => setFormData({ ...formData, cta: { ...formData.cta, ar: e.target.value } })}
              placeholder="Arabic CTA"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* CTA Link */}
      <div>
        <Label>CTA Link</Label>
        <Input
          value={formData.cta_link}
          onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
          placeholder="/path/to/page"
        />
      </div>

      {/* Badge */}
      <div className="space-y-2">
        <Label>Badge</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">English</Label>
            <Input
              value={formData.badge.en}
              onChange={(e) => setFormData({ ...formData, badge: { ...formData.badge, en: e.target.value } })}
              placeholder="English badge"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Arabic</Label>
            <Input
              value={formData.badge.ar}
              onChange={(e) => setFormData({ ...formData, badge: { ...formData.badge, ar: e.target.value } })}
              placeholder="Arabic badge"
              dir="rtl"
            />
          </div>
        </div>
      </div>

      {/* Icon */}
      <div>
        <Label>Icon</Label>
        <Select
          value={formData.icon}
          onValueChange={(value) => setFormData({ ...formData, icon: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Microscope">Microscope</SelectItem>
            <SelectItem value="Calendar">Calendar</SelectItem>
            <SelectItem value="Wrench">Wrench</SelectItem>
            <SelectItem value="Lightbulb">Lightbulb</SelectItem>
            <SelectItem value="Users">Users</SelectItem>
            <SelectItem value="Award">Award</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Stats</Label>
          <Button type="button" variant="outline" size="sm" onClick={addStat}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stat
          </Button>
        </div>
        <div className="space-y-2">
          {formData.stats.map((stat, index) => (
            <div key={index} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Stat {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStat(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', null, e.target.value)}
                placeholder="Value (e.g., 500+)"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={stat.label?.en || ''}
                  onChange={(e) => updateStat(index, 'label', 'en', e.target.value)}
                  placeholder="English label"
                />
                <Input
                  value={stat.label?.ar || ''}
                  onChange={(e) => updateStat(index, 'label', 'ar', e.target.value)}
                  placeholder="Arabic label"
                  dir="rtl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Index */}
      <div>
        <Label>{t('heroSlider.orderIndex')}</Label>
        <Input
          type="number"
          value={formData.order_index}
          onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
        />
      </div>

      {/* Active */}
      <div className="flex items-center justify-between">
        <Label>{t('heroSlider.isActive')}</Label>
        <Switch
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel', { defaultValue: 'Cancel' })}
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 mr-2" />
          {loading ? t('general.saving') : slider?.id ? t('common.update', { defaultValue: 'Update' }) : t('common.create', { defaultValue: 'Create' })}
        </Button>
      </div>
    </form>
  );
}
