'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Save,
  Building2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface DepartmentForm {
  name: string;
  description: string;
  image: string;
  icon: string;
  section_id: string;
}

export default function EditDepartmentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const departmentId = params.departmentId as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [formData, setFormData] = useState<DepartmentForm>({
    name: '',
    description: '',
    image: '',
    icon: '',
    section_id: '',
  });

  useEffect(() => {
    loadData();
  }, [departmentId]);

  const loadData = async () => {
    try {
      const [departmentData, sectionsData] = await Promise.all([
        apiClient.getAdminDepartment(departmentId),
        apiClient.getDepartmentSections()
      ]);
      
      setSections(sectionsData.sections);
      
      if (departmentData.department) {
        const dept = departmentData.department;
        setFormData({
          name: dept.name || '',
          description: dept.description || '',
          image: dept.image || '',
          icon: dept.icon || '',
          section_id: dept.section_id || '',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load department',
        variant: 'destructive',
      });
      router.push('/admin/departments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Department name is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);

    try {
      await apiClient.updateAdminDepartment(departmentId, {
        name: formData.name,
        description: formData.description || undefined,
        image: formData.image || undefined,
        icon: formData.icon || undefined,
        section_id: formData.section_id || undefined,
      });

      toast({
        title: 'Success',
        description: 'Department updated successfully',
      });

      router.push('/admin/departments');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update department',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
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
          <Link href="/admin/departments">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Department</h1>
            <p className="text-gray-600 mt-1">Update department details</p>
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
                  <Building2 className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>Department name and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Department Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter department name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter department description"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Media & Display */}
            <Card>
              <CardHeader>
                <CardTitle>Media & Display</CardTitle>
                <CardDescription>Department image and icon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/department.jpg"
                  />
                  {formData.image && (
                    <div className="mt-2">
                      <img 
                        src={formData.image} 
                        alt="Department" 
                        className="w-full h-48 object-cover rounded-md border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="icon">Icon Name</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Building2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter a Lucide icon name (e.g., Building2, FlaskConical, Microscope)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Section Assignment */}
            <Card>
              <CardHeader>
                <CardTitle>Section Assignment</CardTitle>
                <CardDescription>Assign department to a section</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="section_id">Section</Label>
                  <Select
                    value={formData.section_id || "none"}
                    onValueChange={(value) => setFormData({ ...formData, section_id: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {sections.map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Link href="/admin/departments">
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

