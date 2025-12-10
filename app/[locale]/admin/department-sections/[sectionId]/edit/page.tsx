'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Save,
  FolderTree,
  Hash
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface SectionForm {
  name: string;
  slug: string;
  order_index: number;
}

export default function EditDepartmentSectionPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const sectionId = params.sectionId as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SectionForm>({
    name: '',
    slug: '',
    order_index: 0,
  });
  const [departmentsCount, setDepartmentsCount] = useState(0);

  useEffect(() => {
    loadSection();
  }, [sectionId]);

  const loadSection = async () => {
    try {
      const data = await apiClient.getAdminDepartmentSection(sectionId);
      
      if (data.section) {
        const section = data.section;
        setFormData({
          name: section.name || '',
          slug: section.slug || '',
          order_index: section.order_index || 0,
        });
        setDepartmentsCount(section.departments_count || 0);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load department section',
        variant: 'destructive',
      });
      router.push('/admin/department-sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Section name is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      await apiClient.updateAdminDepartmentSection(sectionId, {
        name: formData.name,
        slug: formData.slug || undefined,
        order_index: formData.order_index || 0,
      });

      toast({
        title: 'Success',
        description: 'Department section updated successfully',
      });

      router.push('/admin/department-sections');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update department section',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/department-sections">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Department Section</h1>
            <p className="text-gray-600 mt-1">Update section details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Section name, slug, and ordering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Section Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter section name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="section-slug"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL-friendly identifier (auto-generated from name)
                  </p>
                </div>
                <div>
                  <Label htmlFor="order_index">Order Index</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Lower numbers appear first in listings
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Section Info */}
            <Card>
              <CardHeader>
                <CardTitle>Section Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Departments Count</Label>
                  <div className="mt-2">
                    <Badge variant={departmentsCount > 0 ? 'default' : 'secondary'} className="text-lg">
                      {departmentsCount} department{departmentsCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  {departmentsCount > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      This section contains departments. Make sure to reassign them before deleting.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full" disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Link href="/admin/department-sections">
                  <Button variant="outline" className="w-full" type="button">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

