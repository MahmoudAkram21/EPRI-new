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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ServiceCenter } from '@/types/service-center';

interface Equipment {
  name: string;
  description?: string;
  image?: string;
  specifications?: string[];
}

interface Product {
  name: string;
  description: string;
}

interface Service {
  name: string;
  summary: string;
}

export default function EditServiceCenterPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const centerId = params.centerId as string;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'center',
    headline: '',
    description: '',
    image: '',
    banner_image: '',
    location: '',
    contact_phone: '',
    contact_email: '',
    lab_methodology: '',
    future_prospective: '',
    is_featured: false,
    is_published: true,
    order_index: 0,
  });

  const [equipments, setEquipments] = useState<Equipment[]>([{ name: '', description: '' }]);
  const [products, setProducts] = useState<Product[]>([{ name: '', description: '' }]);
  const [services, setServices] = useState<Service[]>([{ name: '', summary: '' }]);
  const [workVolume, setWorkVolume] = useState({
    totalIncomeRate: 0,
    currency: 'million EGP',
    dataPoints: [
      { label: '2021', value: 0 },
      { label: '2022', value: 0 },
      { label: '2023', value: 0 },
      { label: '2024', value: 0 }
    ]
  });
  const [companyActivity, setCompanyActivity] = useState({
    totalProjects: 0,
    activityMix: [
      { label: '', value: 0 }
    ]
  });

  useEffect(() => {
    loadCenterData();
  }, [centerId]);

  const loadCenterData = async () => {
    try {
      setInitialLoading(true);
      const response = await apiClient.getAdminServiceCenter(centerId);
      const center = response.center;
      
      setFormData({
        name: center.name || '',
        slug: center.slug || '',
        type: center.type || 'center',
        headline: center.headline || '',
        description: center.description || '',
        image: center.image || '',
        banner_image: center.banner_image || '',
        location: center.location || '',
        contact_phone: center.contact_phone || '',
        contact_email: center.contact_email || '',
        lab_methodology: center.lab_methodology || '',
        future_prospective: center.future_prospective || '',
        is_featured: center.is_featured || false,
        is_published: center.is_published !== false,
        order_index: center.order_index || 0,
      });

      if (center.equipments && center.equipments.length > 0) {
        setEquipments(center.equipments.map((e: any) => ({
          name: e.name || '',
          description: e.description || e.details || '',
          image: e.image || '',
          specifications: e.specifications || []
        })));
      }

      if (center.products && Array.isArray(center.products) && center.products.length > 0) {
        setProducts(center.products.map((p: any) => ({
          name: p.name || '',
          description: p.description || ''
        })));
      }

      if (center.services && Array.isArray(center.services) && center.services.length > 0) {
        setServices(center.services.map((s: any) => ({
          name: s.name || '',
          summary: s.summary || ''
        })));
      }

      if (center.work_volume) {
        setWorkVolume({
          totalIncomeRate: center.work_volume.totalIncomeRate || 0,
          currency: center.work_volume.currency || 'million EGP',
          dataPoints: center.work_volume.dataPoints || [
            { label: '2021', value: 0 },
            { label: '2022', value: 0 },
            { label: '2023', value: 0 },
            { label: '2024', value: 0 }
          ]
        });
      }

      if (center.company_activity) {
        setCompanyActivity({
          totalProjects: center.company_activity.totalProjects || 0,
          activityMix: center.company_activity.activityMix || [
            { label: '', value: 0 }
          ]
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load center data',
        variant: 'destructive',
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEquipment = () => {
    setEquipments([...equipments, { name: '', description: '' }]);
  };

  const removeEquipment = (index: number) => {
    setEquipments(equipments.filter((_, i) => i !== index));
  };

  const updateEquipment = (index: number, field: string, value: string) => {
    const updated = [...equipments];
    updated[index] = { ...updated[index], [field]: value };
    setEquipments(updated);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', description: '' }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: string, value: string) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const addService = () => {
    setServices([...services, { name: '', summary: '' }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: string, value: string) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: value };
    setServices(updated);
  };

  const handleSave = async (asDraft: boolean = false) => {
    if (!formData.name || !formData.slug) {
      toast({
        title: 'Error',
        description: 'Name and slug are required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const centerData = {
        ...formData,
        is_published: asDraft ? false : formData.is_published,
        products: products.filter(p => p.name.trim() !== ''),
        services: services.filter(s => s.name.trim() !== ''),
        work_volume: workVolume,
        company_activity: companyActivity,
        equipments: equipments.filter(e => e.name.trim() !== '').map(e => ({
          name: e.name,
          description: e.description || null,
          image: e.image || null,
          specifications: e.specifications || null
        }))
      };

      await apiClient.updateAdminServiceCenter(centerId, centerData);
      toast({
        title: 'Success',
        description: 'Service center/unit updated successfully',
      });
      router.push('/admin/service-centers');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update service center/unit',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/service-centers">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Centers & Units
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Center/Unit</h1>
                <p className="text-sm text-gray-500">Update service center or unit information</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSave(true)}
                disabled={loading}
              >
                Save as Draft
              </Button>
              <Button 
                onClick={() => handleSave(false)}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="content">Content & Data</TabsTrigger>
            <TabsTrigger value="equipment">Equipment</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the core details about the center/unit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Asphalt & polymers"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="auto-generated-from-name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="unit">Unit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order_index">Order Index</Label>
                    <Input
                      id="order_index"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => handleInputChange('order_index', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => handleInputChange('headline', e.target.value)}
                    placeholder="Brief headline description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed description..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="banner_image">Banner Image URL</Label>
                    <Input
                      id="banner_image"
                      value={formData.banner_image}
                      onChange={(e) => handleInputChange('banner_image', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Nasr City, Cairo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Contact Phone</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      placeholder="+(202)22747847"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">Contact Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      placeholder="center@epri.edu.eg"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                    />
                    <Label htmlFor="is_featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                    />
                    <Label htmlFor="is_published">Published</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lab Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.lab_methodology || ''}
                  onChange={(e) => handleInputChange('lab_methodology', e.target.value)}
                  placeholder="Describe the lab methodology and services..."
                  rows={6}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>List products offered by this center/unit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {products.map((product, index) => (
                  <div key={index} className="flex gap-2 p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={product.name}
                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                        placeholder="Product name"
                      />
                      <Textarea
                        value={product.description}
                        onChange={(e) => updateProduct(index, 'description', e.target.value)}
                        placeholder="Product description"
                        rows={2}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(index)}
                      disabled={products.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addProduct} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>List services offered by this center/unit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {services.map((service, index) => (
                  <div key={index} className="flex gap-2 p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={service.name}
                        onChange={(e) => updateService(index, 'name', e.target.value)}
                        placeholder="Service name"
                      />
                      <Textarea
                        value={service.summary}
                        onChange={(e) => updateService(index, 'summary', e.target.value)}
                        placeholder="Service summary"
                        rows={2}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(index)}
                      disabled={services.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addService} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Future Prospective</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.future_prospective || ''}
                  onChange={(e) => handleInputChange('future_prospective', e.target.value)}
                  placeholder="Describe future plans and prospects..."
                  rows={6}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Equipment List</CardTitle>
                <CardDescription>Add equipment available at this center/unit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {equipments.map((equipment, index) => (
                  <div key={index} className="flex gap-2 p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Input
                        value={equipment.name}
                        onChange={(e) => updateEquipment(index, 'name', e.target.value)}
                        placeholder="Equipment name"
                      />
                      <Textarea
                        value={equipment.description || ''}
                        onChange={(e) => updateEquipment(index, 'description', e.target.value)}
                        placeholder="Equipment description/details"
                        rows={2}
                      />
                      <Input
                        value={equipment.image || ''}
                        onChange={(e) => updateEquipment(index, 'image', e.target.value)}
                        placeholder="Equipment image URL (optional)"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeEquipment(index)}
                      disabled={equipments.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addEquipment} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Equipment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Volume</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Income Rate</Label>
                    <Input
                      type="number"
                      value={workVolume.totalIncomeRate}
                      onChange={(e) => setWorkVolume({
                        ...workVolume,
                        totalIncomeRate: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Input
                      value={workVolume.currency}
                      onChange={(e) => setWorkVolume({
                        ...workVolume,
                        currency: e.target.value
                      })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Data Points (Year - Value)</Label>
                  {workVolume.dataPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={point.label}
                        onChange={(e) => {
                          const updated = [...workVolume.dataPoints];
                          updated[index].label = e.target.value;
                          setWorkVolume({ ...workVolume, dataPoints: updated });
                        }}
                        placeholder="Year"
                      />
                      <Input
                        type="number"
                        value={point.value}
                        onChange={(e) => {
                          const updated = [...workVolume.dataPoints];
                          updated[index].value = parseFloat(e.target.value) || 0;
                          setWorkVolume({ ...workVolume, dataPoints: updated });
                        }}
                        placeholder="Value"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Total Projects</Label>
                  <Input
                    type="number"
                    value={companyActivity.totalProjects}
                    onChange={(e) => setCompanyActivity({
                      ...companyActivity,
                      totalProjects: parseInt(e.target.value) || 0
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Activity Mix</Label>
                  {companyActivity.activityMix.map((activity, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={activity.label}
                        onChange={(e) => {
                          const updated = [...companyActivity.activityMix];
                          updated[index].label = e.target.value;
                          setCompanyActivity({ ...companyActivity, activityMix: updated });
                        }}
                        placeholder="Activity name"
                      />
                      <Input
                        type="number"
                        value={activity.value}
                        onChange={(e) => {
                          const updated = [...companyActivity.activityMix];
                          updated[index].value = parseInt(e.target.value) || 0;
                          setCompanyActivity({ ...companyActivity, activityMix: updated });
                        }}
                        placeholder="Percentage"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

