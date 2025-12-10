'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  Upload,
  DollarSign,
  Clock,
  User,
  Settings,
  FileText,
  Target,
  Wrench,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ServiceCenterHead, SERVICE_CATEGORIES, Service } from '@/lib/services';

interface ServiceTab {
  id?: string;
  title: string;
  content: string;
  order_index: number;
}

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const serviceId = params.serviceId as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [centerHeads, setCenterHeads] = useState<ServiceCenterHead[]>([]);
  
  // Service form data
  const [serviceData, setServiceData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    category: '',
    icon: '',
    duration: '',
    price: 0,
    is_free: false,
    is_featured: false,
    is_published: true,
    group_name: '',
    group_order: 0,
    center_head_id: '',
  });
  
  // Features (array of strings)
  const [features, setFeatures] = useState<string[]>(['']);
  
  // Custom tabs
  const [customTabs, setCustomTabs] = useState<ServiceTab[]>([
    { title: 'Additional Information', content: '', order_index: 0 }
  ]);

  useEffect(() => {
    loadServiceData();
    loadCenterHeads();
  }, [serviceId]);

  const loadServiceData = async () => {
    try {
      setInitialLoading(true);
      const response = await apiClient.getAdminService(serviceId);
      const service = response.service;
      
      setServiceData({
        title: service.title || '',
        subtitle: service.subtitle || '',
        description: service.description || '',
        image: service.image || '',
        category: service.category || '',
        icon: service.icon || '',
        duration: service.duration || '',
        price: service.price || 0,
        is_free: service.is_free || false,
        is_featured: service.is_featured || false,
        is_published: service.is_published !== false,
        group_name: service.group_name || '',
        group_order: service.group_order || 0,
        center_head_id: service.center_head_id || 'none',
      });

      // Parse features
      let parsedFeatures: string[] = [];
      if (service.features) {
        if (typeof service.features === 'string') {
          try {
            parsedFeatures = JSON.parse(service.features);
          } catch {
            parsedFeatures = [service.features];
          }
        } else if (Array.isArray(service.features)) {
          parsedFeatures = service.features;
        }
      }
      setFeatures(parsedFeatures.length > 0 ? parsedFeatures : ['']);

      // Load tabs
      if (service.tabs && service.tabs.length > 0) {
        setCustomTabs(service.tabs.map((tab: any) => ({
          id: tab.id,
          title: tab.title,
          content: tab.content,
          order_index: tab.order_index
        })));
      }

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load service data',
        variant: 'destructive',
      });
      router.push('/admin/services');
    } finally {
      setInitialLoading(false);
    }
  };

  const loadCenterHeads = async () => {
    try {
      const response = await apiClient.getServiceCenterHeads();
      setCenterHeads(response.centerHeads);
    } catch (error) {
      console.error('Error loading center heads:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setServiceData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const addCustomTab = () => {
    setCustomTabs([
      ...customTabs,
      { 
        title: `Tab ${customTabs.length + 1}`, 
        content: '', 
        order_index: customTabs.length 
      }
    ]);
  };

  const updateCustomTab = (index: number, field: string, value: string) => {
    const newTabs = [...customTabs];
    newTabs[index] = { ...newTabs[index], [field]: value };
    setCustomTabs(newTabs);
  };

  const removeCustomTab = (index: number) => {
    if (customTabs.length > 1) {
      setCustomTabs(customTabs.filter((_, i) => i !== index));
    }
  };

  const handleSave = async (isDraft = false) => {
    // Validation
    if (!serviceData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Service title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!serviceData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Service description is required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const cleanFeatures = features.filter(f => f.trim() !== '');
      const cleanTabs = customTabs.filter(t => t.title.trim() !== '' && t.content.trim() !== '');

      await apiClient.updateAdminService(serviceId, {
        ...serviceData,
        center_head_id: serviceData.center_head_id === 'none' ? undefined : serviceData.center_head_id,
        features: cleanFeatures,
        is_published: isDraft ? false : serviceData.is_published,
        tabs: cleanTabs.map((tab, index) => ({
          title: tab.title,
          content: tab.content,
          order_index: index
        }))
      });

      toast({
        title: 'Success',
        description: `Service ${isDraft ? 'saved as draft' : 'updated'} successfully`,
      });

      router.push('/admin/services');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update service',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg font-medium">Loading service data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/services">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Services
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Service</h1>
                <p className="text-sm text-gray-500">Update service information and settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSave(true)}
                disabled={loading}
              >
                <FileText className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button 
                onClick={() => handleSave(false)}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Updating...' : 'Update Service'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update the core details about your service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Service Title *</Label>
                    <Input
                      id="title"
                      value={serviceData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., Petroleum Analysis & Testing"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      value={serviceData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      placeholder="Brief service summary"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <RichTextEditor
                    value={serviceData.description}
                    onChange={(value) => handleInputChange('description', value)}
                    placeholder="Detailed description of the service, its benefits, and applications..."
                    height="200px"
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={serviceData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (Emoji)</Label>
                    <Input
                      id="icon"
                      value={serviceData.icon}
                      onChange={(e) => handleInputChange('icon', e.target.value)}
                      placeholder="🔬"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={serviceData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="2-5 business days"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      value={serviceData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="/petroleum-lab-testing.jpg"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                  {serviceData.image && (
                    <div className="mt-2">
                      <img
                        src={serviceData.image}
                        alt="Service preview"
                        className="w-full h-48 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-service.jpg';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Key Features
                </CardTitle>
                <CardDescription>
                  Update the main features and benefits of this service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={features.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addFeature} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </CardContent>
            </Card>

            {/* Custom Tabs */}
            <Card>
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Additional Content Tabs
                </CardTitle>
                <CardDescription>
                  Manage custom tabs with additional information about your service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    {customTabs.map((_, index) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        Tab {index + 1}
                      </TabsTrigger>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addCustomTab}
                      className="h-10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TabsList>
                  {customTabs.map((tab, index) => (
                    <TabsContent key={index} value={index.toString()} className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          value={tab.title}
                          onChange={(e) => updateCustomTab(index, 'title', e.target.value)}
                          placeholder="Tab title"
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCustomTab(index)}
                          disabled={customTabs.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <RichTextEditor
                        value={tab.content}
                        onChange={(value) => updateCustomTab(index, 'content', value)}
                        placeholder="Tab content..."
                        height="250px"
                        className="w-full"
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 self-start sticky top-20">
            {/* Pricing & Settings */}
            <Card>
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_free"
                    checked={serviceData.is_free}
                    onCheckedChange={(checked) => handleInputChange('is_free', checked)}
                  />
                  <Label htmlFor="is_free">Free Service</Label>
                </div>
                
                {!serviceData.is_free && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (USD)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={serviceData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Center Head */}
            <Card>
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Service Director
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="center_head_id">Center Head</Label>
                  <Select
                    value={serviceData.center_head_id}
                    onValueChange={(value) => handleInputChange('center_head_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select center head" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {centerHeads.map((head) => (
                        <SelectItem key={head.id} value={head.id}>
                          <div className="flex flex-col text-start p-2 py-1">
                            <span className="font-medium">{head.name}</span>
                            <span className="text-sm text-gray-500">{head.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Organization */}
            <Card>
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group_name">Group Name</Label>
                  <Input
                    id="group_name"
                    value={serviceData.group_name}
                    onChange={(e) => handleInputChange('group_name', e.target.value)}
                    placeholder="e.g., Laboratory Services"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="group_order">Order in Group</Label>
                  <Input
                    id="group_order"
                    type="number"
                    min="0"
                    value={serviceData.group_order}
                    onChange={(e) => handleInputChange('group_order', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_featured"
                    checked={serviceData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                  />
                  <Label htmlFor="is_featured">Featured Service</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_published"
                    checked={serviceData.is_published}
                    onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                  />
                  <Label htmlFor="is_published">Published</Label>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    {serviceData.icon && <span className="text-lg">{serviceData.icon}</span>}
                    <Badge variant="secondary">{serviceData.category || 'Category'}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {serviceData.title || 'Service Title'}
                  </h3>
                  {serviceData.subtitle && (
                    <p className="text-sm text-gray-600">{serviceData.subtitle}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {serviceData.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {serviceData.duration}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {serviceData.is_free ? 'Free' : `$${serviceData.price}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}