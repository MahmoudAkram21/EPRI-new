'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

interface Department {
  id: string;
  name: string;
}

interface DepartmentSection {
  id: string;
  name: string;
}

interface LaboratoryFormData {
  name: string;
  description: string;
  image: string;
  // Head information
  head_name: string;
  head_title: string;
  head_academic_title: string;
  head_picture: string;
  head_cv_url: string;
  head_email: string;
  head_bio: string;
  // Contact information
  address: string;
  phone: string;
  alternative_phone: string;
  fax: string;
  email: string;
  website: string;
  // Laboratory details
  established_year: string;
  facilities: string;
  equipment_list: string;
  research_areas: string;
  services_offered: string;
  staff_count: string;
  students_count: string;
  // Organizational info
  department_id: string;
  section_id: string;
  building: string;
  floor: string;
  room_numbers: string;
  // Status
  is_active: boolean;
  is_featured: boolean;
  display_order: string;
}

export default function CreateLaboratory() {
  const router = useRouter();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<DepartmentSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LaboratoryFormData>({
    name: '',
    description: '',
    image: '',
    head_name: '',
    head_title: '',
    head_academic_title: '',
    head_picture: '',
    head_cv_url: '',
    head_email: '',
    head_bio: '',
    address: '',
    phone: '',
    alternative_phone: '',
    fax: '',
    email: '',
    website: '',
    established_year: '',
    facilities: '',
    equipment_list: '',
    research_areas: '',
    services_offered: '',
    staff_count: '0',
    students_count: '0',
    department_id: '',
    section_id: '',
    building: '',
    floor: '',
    room_numbers: '',
    is_active: true,
    is_featured: false,
    display_order: '0'
  });

  useEffect(() => {
    fetchDepartments();
    fetchSections();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await apiClient.getAdminDepartments();
      setDepartments(data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchSections = async () => {
    try {
      const data = await apiClient.getDepartmentSections();
      setSections(data.sections || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Laboratory name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await apiClient.createLaboratory(formData);
      toast({
        title: "Success",
        description: "Laboratory created successfully",
      });
      router.push('/admin/laboratories');
    } catch (error: any) {
      console.error('Error creating laboratory:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create laboratory",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/laboratories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Laboratories
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Laboratory</h1>
          <p className="text-gray-600 mt-1">Add a new research laboratory to the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Laboratory Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter laboratory name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Laboratory Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter laboratory description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Head of Laboratory */}
        <Card>
          <CardHeader>
            <CardTitle>Head of Laboratory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="head_name">Head Name</Label>
                <Input
                  id="head_name"
                  name="head_name"
                  value={formData.head_name}
                  onChange={handleInputChange}
                  placeholder="Enter head name"
                />
              </div>
              <div>
                <Label htmlFor="head_title">Head Title</Label>
                <Input
                  id="head_title"
                  name="head_title"
                  value={formData.head_title}
                  onChange={handleInputChange}
                  placeholder="e.g., Professor, Dr."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="head_academic_title">Academic Title</Label>
                <Input
                  id="head_academic_title"
                  name="head_academic_title"
                  value={formData.head_academic_title}
                  onChange={handleInputChange}
                  placeholder="e.g., Ph.D., M.Sc."
                />
              </div>
              <div>
                <Label htmlFor="head_email">Head Email</Label>
                <Input
                  id="head_email"
                  name="head_email"
                  type="email"
                  value={formData.head_email}
                  onChange={handleInputChange}
                  placeholder="head@epri.sci.eg"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="head_picture">Head Picture URL</Label>
                <Input
                  id="head_picture"
                  name="head_picture"
                  value={formData.head_picture}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <Label htmlFor="head_cv_url">CV URL</Label>
                <Input
                  id="head_cv_url"
                  name="head_cv_url"
                  value={formData.head_cv_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/cv.pdf"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="head_bio">Head Biography</Label>
              <Textarea
                id="head_bio"
                name="head_bio"
                value={formData.head_bio}
                onChange={handleInputChange}
                placeholder="Enter head biography"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter laboratory address"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+20 2 xxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="alternative_phone">Alternative Phone</Label>
                <Input
                  id="alternative_phone"
                  name="alternative_phone"
                  value={formData.alternative_phone}
                  onChange={handleInputChange}
                  placeholder="+20 2 xxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="fax">Fax</Label>
                <Input
                  id="fax"
                  name="fax"
                  value={formData.fax}
                  onChange={handleInputChange}
                  placeholder="+20 2 xxxxxxxx"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Laboratory Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="lab@epri.sci.eg"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://lab.epri.sci.eg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Laboratory Details */}
        <Card>
          <CardHeader>
            <CardTitle>Laboratory Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="established_year">Established Year</Label>
                <Input
                  id="established_year"
                  name="established_year"
                  type="number"
                  value={formData.established_year}
                  onChange={handleInputChange}
                  placeholder="2020"
                />
              </div>
              <div>
                <Label htmlFor="staff_count">Staff Count</Label>
                <Input
                  id="staff_count"
                  name="staff_count"
                  type="number"
                  value={formData.staff_count}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="students_count">Students Count</Label>
                <Input
                  id="students_count"
                  name="students_count"
                  type="number"
                  value={formData.students_count}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="facilities">Facilities</Label>
              <Textarea
                id="facilities"
                name="facilities"
                value={formData.facilities}
                onChange={handleInputChange}
                placeholder="Describe laboratory facilities"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="equipment_list">Equipment List</Label>
              <Textarea
                id="equipment_list"
                name="equipment_list"
                value={formData.equipment_list}
                onChange={handleInputChange}
                placeholder="List laboratory equipment"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="research_areas">Research Areas</Label>
              <Textarea
                id="research_areas"
                name="research_areas"
                value={formData.research_areas}
                onChange={handleInputChange}
                placeholder="Describe research areas"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="services_offered">Services Offered</Label>
              <Textarea
                id="services_offered"
                name="services_offered"
                value={formData.services_offered}
                onChange={handleInputChange}
                placeholder="Describe services offered"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Organizational Information */}
        <Card>
          <CardHeader>
            <CardTitle>Organizational Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department_id">Department</Label>
                <select
                  id="department_id"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="section_id">Section</Label>
                <select
                  id="section_id"
                  name="section_id"
                  value={formData.section_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="building">Building</Label>
                <Input
                  id="building"
                  name="building"
                  value={formData.building}
                  onChange={handleInputChange}
                  placeholder="Building A"
                />
              </div>
              <div>
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="Ground Floor"
                />
              </div>
              <div>
                <Label htmlFor="room_numbers">Room Numbers</Label>
                <Input
                  id="room_numbers"
                  name="room_numbers"
                  value={formData.room_numbers}
                  onChange={handleInputChange}
                  placeholder="101, 102, 103"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Status Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Active Laboratory</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => handleSwitchChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Featured Laboratory</Label>
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Link href="/admin/laboratories">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Laboratory
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}