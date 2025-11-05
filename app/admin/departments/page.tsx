'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Users,
  UserPlus,
  ChevronDown,
  ChevronRight,
  User,
  Mail,
  Phone,
  Globe,
  BookOpen,
  Award,
  MapPin
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
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

interface Department {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  section_id: string | null;
  section: {
    id: string;
    name: string;
    slug: string;
  } | null;
  staff_count?: number;
  created_at: string;
  updated_at: string;
}

interface Staff {
  id: string;
  name: string;
  title: string;
  academic_position?: string;
  current_admin_position?: string;
  ex_admin_position?: string;
  scientific_name?: string;
  picture: string | null;
  gallery?: string[];
  bio: string | null;
  research_interests?: string;
  news?: string;
  email: string | null;
  alternative_email?: string;
  phone: string | null;
  mobile?: string;
  website?: string;
  google_scholar?: string;
  research_gate?: string;
  academia_edu?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  google_plus?: string;
  youtube?: string;
  wordpress?: string;
  instagram?: string;
  mendeley?: string;
  zotero?: string;
  evernote?: string;
  orcid?: string;
  scopus?: string;
  publications_count?: number;
  papers_count?: number;
  abstracts_count?: number;
  courses_files_count?: number;
  inlinks_count?: number;
  external_links_count?: number;
  faculty?: string;
  department?: string;
  office_location?: string;
  office_hours?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [departmentStaff, setDepartmentStaff] = useState<Staff[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [showCreateStaffForm, setShowCreateStaffForm] = useState(false);
  const [collapsibleStates, setCollapsibleStates] = useState({
    admin: false,
    contact: false,
    org: false,
    academic: false,
    publications: false,
    links: false,
  });
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    title: '',
    academic_position: '',
    current_admin_position: '',
    ex_admin_position: '',
    scientific_name: '',
    picture: '',
    bio: '',
    research_interests: '',
    news: '',
    email: '',
    alternative_email: '',
    phone: '',
    mobile: '',
    website: '',
    google_scholar: '',
    research_gate: '',
    academia_edu: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    google_plus: '',
    youtube: '',
    wordpress: '',
    instagram: '',
    mendeley: '',
    zotero: '',
    evernote: '',
    orcid: '',
    scopus: '',
    publications_count: 0,
    papers_count: 0,
    abstracts_count: 0,
    courses_files_count: 0,
    inlinks_count: 0,
    external_links_count: 0,
    faculty: '',
    department: '',
    office_location: '',
    office_hours: '',
  });
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: '',
    image: '',
    icon: '',
    section_id: '',
  });
  const { toast } = useToast();

  const toggleCollapsible = (key: keyof typeof collapsibleStates) => {
    setCollapsibleStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [departmentsData, sectionsData, staffData] = await Promise.all([
        apiClient.getAdminDepartments(),
        apiClient.getDepartmentSections(),
        apiClient.getAdminStaff()
      ]);
      setDepartments(departmentsData.departments);
      setSections(sectionsData.sections);
      setAllStaff(staffData.staff);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load departments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!departmentForm.name.trim()) {
      toast({
        title: 'Error',
        description: 'Department name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await apiClient.createAdminDepartment({
        name: departmentForm.name,
        description: departmentForm.description || undefined,
        image: departmentForm.image || undefined,
        icon: departmentForm.icon || undefined,
        section_id: departmentForm.section_id || undefined,
      });
      toast({
        title: 'Success',
        description: 'Department created successfully',
      });
      setShowCreateDialog(false);
      setDepartmentForm({
        name: '',
        description: '',
        image: '',
        icon: '',
        section_id: '',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create department',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDepartment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
      await apiClient.deleteAdminDepartment(id);
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete department',
        variant: 'destructive',
      });
    }
  };

  const handleManageStaff = async (department: Department) => {
    setSelectedDepartment(department);
    setShowStaffDialog(true);
    
    try {
      const staffData = await apiClient.getDepartmentStaff(department.id);
      setDepartmentStaff(staffData.staff);
      setSelectedStaffIds(staffData.staff.map(s => s.id));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load department staff',
        variant: 'destructive',
      });
    }
  };

  const handleSaveStaffAssignment = async () => {
    if (!selectedDepartment) return;

    try {
      await apiClient.assignDepartmentStaff(selectedDepartment.id, selectedStaffIds);
      toast({
        title: 'Success',
        description: 'Staff assignments updated successfully',
      });
      setShowStaffDialog(false);
      loadData(); // Refresh to update staff counts
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update staff assignments',
        variant: 'destructive',
      });
    }
  };

  const toggleStaffSelection = (staffId: string) => {
    setSelectedStaffIds(prev => 
      prev.includes(staffId) 
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleCreateNewStaff = async () => {
    if (!newStaffForm.name.trim() || !newStaffForm.title.trim()) {
      toast({
        title: 'Error',
        description: 'Name and title are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await apiClient.createAdminStaff({
        name: newStaffForm.name,
        title: newStaffForm.title,
        picture: newStaffForm.picture || undefined,
        bio: newStaffForm.bio || undefined,
        email: newStaffForm.email || undefined,
        phone: newStaffForm.phone || undefined,
      });

      // Add the new staff to the list
      const newStaff = response.staff;
      setAllStaff(prev => [...prev, newStaff]);
      
      // Auto-select the new staff member
      setSelectedStaffIds(prev => [...prev, newStaff.id]);
      
      // Reset form and hide create form
      setNewStaffForm({
        name: '',
        title: '',
        academic_position: '',
        current_admin_position: '',
        ex_admin_position: '',
        scientific_name: '',
        picture: '',
        bio: '',
        research_interests: '',
        news: '',
        email: '',
        alternative_email: '',
        phone: '',
        mobile: '',
        website: '',
        google_scholar: '',
        research_gate: '',
        academia_edu: '',
        linkedin: '',
        facebook: '',
        twitter: '',
        google_plus: '',
        youtube: '',
        wordpress: '',
        instagram: '',
        mendeley: '',
        zotero: '',
        evernote: '',
        orcid: '',
        scopus: '',
        publications_count: 0,
        papers_count: 0,
        abstracts_count: 0,
        courses_files_count: 0,
        inlinks_count: 0,
        external_links_count: 0,
        faculty: '',
        department: '',
        office_location: '',
        office_hours: '',
      });
      setShowCreateStaffForm(false);

      toast({
        title: 'Success',
        description: 'Staff member created and selected for assignment',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create staff member',
        variant: 'destructive',
      });
    }
  };

  const resetStaffDialog = () => {
    setShowStaffDialog(false);
    setShowCreateStaffForm(false);
    setSelectedDepartment(null);
    setDepartmentStaff([]);
    setSelectedStaffIds([]);
    setNewStaffForm({
      name: '',
      title: '',
      academic_position: '',
      current_admin_position: '',
      ex_admin_position: '',
      scientific_name: '',
      picture: '',
      bio: '',
      research_interests: '',
      news: '',
      email: '',
      alternative_email: '',
      phone: '',
      mobile: '',
      website: '',
      google_scholar: '',
      research_gate: '',
      academia_edu: '',
      linkedin: '',
      facebook: '',
      twitter: '',
      google_plus: '',
      youtube: '',
      wordpress: '',
      instagram: '',
      mendeley: '',
      zotero: '',
      evernote: '',
      orcid: '',
      scopus: '',
      publications_count: 0,
      papers_count: 0,
      abstracts_count: 0,
      courses_files_count: 0,
      inlinks_count: 0,
      external_links_count: 0,
      faculty: '',
      department: '',
      office_location: '',
      office_hours: '',
    });
  };

  const filteredDepartments = departments.filter((department) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage all departments in the system</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Department
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Department</DialogTitle>
              <DialogDescription>Add a new department to the system</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Department Name *</Label>
                <Input
                  id="name"
                  value={departmentForm.name}
                  onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                  placeholder="Enter department name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={departmentForm.description}
                  onChange={(e) => setDepartmentForm({ ...departmentForm, description: e.target.value })}
                  placeholder="Enter department description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={departmentForm.image}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, image: e.target.value })}
                    placeholder="/images/department.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon Name</Label>
                  <Input
                    id="icon"
                    value={departmentForm.icon}
                    onChange={(e) => setDepartmentForm({ ...departmentForm, icon: e.target.value })}
                    placeholder="Building2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="section_id">Section</Label>
                <Select
                  value={departmentForm.section_id || "none"}
                  onValueChange={(value) => setDepartmentForm({ ...departmentForm, section_id: value === "none" ? "" : value })}
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
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDepartment}>Create Department</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Departments ({filteredDepartments.length})</CardTitle>
          <CardDescription>View and manage all departments</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDepartments.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No departments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {department.icon && (
                          <Building2 className="h-4 w-4 text-gray-400" />
                        )}
                        {department.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {department.section ? (
                        <Badge variant="secondary">{department.section.name}</Badge>
                      ) : (
                        <span className="text-gray-400">No section</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">{department.staff_count || 0}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleManageStaff(department)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        {department.description ? (
                          <p className="text-sm text-gray-600 truncate">
                            {department.description}
                          </p>
                        ) : (
                          <span className="text-gray-400 text-sm">No description</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(department.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/departments/${department.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/departments/${department.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDepartment(department.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Staff Management Dialog */}
      <Dialog open={showStaffDialog} onOpenChange={resetStaffDialog}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Staff - {selectedDepartment?.name}</DialogTitle>
            <DialogDescription>
              Assign existing staff members or create new ones for this department.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="existing" className="py-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing">Select Existing Staff</TabsTrigger>
              <TabsTrigger value="create">Create New Staff</TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="space-y-4">
              {allStaff.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No staff members found</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Create your first staff member using the "Create New Staff" tab.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Selected: {selectedStaffIds.length} of {allStaff.length} staff members
                  </div>
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {allStaff.map((staff) => (
                      <div
                        key={staff.id}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedStaffIds.includes(staff.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleStaffSelection(staff.id)}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            {staff.picture ? (
                              <img
                                src={staff.picture}
                                alt={staff.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-semibold text-gray-600">
                                {staff.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900 truncate">{staff.name}</h4>
                            <div className="flex-shrink-0 ml-2">
                              <div
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                  selectedStaffIds.includes(staff.id)
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }`}
                              >
                                {selectedStaffIds.includes(staff.id) && (
                                  <span className="text-white text-xs">✓</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{staff.title}</p>
                          {staff.email && (
                            <p className="text-xs text-gray-500 truncate">{staff.email}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="create" className="space-y-4">
              <div className="border rounded-lg p-6 bg-gray-50 max-h-[60vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Create New Staff Member</h3>
                <div className="space-y-6">
                  
                  {/* Basic Information - Always Visible */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="staff-name">Full Name *</Label>
                        <Input
                          id="staff-name"
                          value={newStaffForm.name}
                          onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                          placeholder="Prof. Gamal Elsayed Abdelaziz"
                        />
                      </div>
                      <div>
                        <Label htmlFor="staff-title">Job Title *</Label>
                        <Input
                          id="staff-title"
                          value={newStaffForm.title}
                          onChange={(e) => setNewStaffForm({ ...newStaffForm, title: e.target.value })}
                          placeholder="Senior Petroleum Engineer"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="academic-position">Academic Position</Label>
                        <Input
                          id="academic-position"
                          value={newStaffForm.academic_position}
                          onChange={(e) => setNewStaffForm({ ...newStaffForm, academic_position: e.target.value })}
                          placeholder="Prof. Emeritus"
                        />
                      </div>
                      <div>
                        <Label htmlFor="scientific-name">Scientific Name</Label>
                        <Input
                          id="scientific-name"
                          value={newStaffForm.scientific_name}
                          onChange={(e) => setNewStaffForm({ ...newStaffForm, scientific_name: e.target.value })}
                          placeholder="Gamal Abdelaziz"
                        />
                      </div>
                      <div>
                        <Label htmlFor="staff-picture">Picture URL</Label>
                        <Input
                          id="staff-picture"
                          value={newStaffForm.picture}
                          onChange={(e) => setNewStaffForm({ ...newStaffForm, picture: e.target.value })}
                          placeholder="/staff/gamal-abdelaziz.jpg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Administrative Positions */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => toggleCollapsible('admin')}
                      className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-100"
                    >
                      {collapsibleStates.admin ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <Award className="h-4 w-4" />
                      <span className="font-medium">Administrative Positions</span>
                    </button>
                    {collapsibleStates.admin && (
                      <div className="pt-3 space-y-4 pl-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="current-admin">Current Administrative Position</Label>
                            <Input
                              id="current-admin"
                              value={newStaffForm.current_admin_position}
                              onChange={(e) => setNewStaffForm({ ...newStaffForm, current_admin_position: e.target.value })}
                              placeholder="Head Manager of Strategic Planning"
                            />
                          </div>
                          <div>
                            <Label htmlFor="ex-admin">Ex-Administrative Position</Label>
                            <Input
                              id="ex-admin"
                              value={newStaffForm.ex_admin_position}
                              onChange={(e) => setNewStaffForm({ ...newStaffForm, ex_admin_position: e.target.value })}
                              placeholder="Former Department Head"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => toggleCollapsible('contact')}
                      className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-100"
                    >
                      {collapsibleStates.contact ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Contact Information</span>
                    </button>
                    {collapsibleStates.contact && (
                      <div className="pt-3 space-y-4 pl-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="staff-email">Primary Email</Label>
                            <Input
                              id="staff-email"
                              type="email"
                              value={newStaffForm.email}
                              onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                              placeholder="gamal.abdelaziz@epri.edu.eg"
                            />
                          </div>
                          <div>
                            <Label htmlFor="alt-email">Alternative Email</Label>
                            <Input
                              id="alt-email"
                              type="email"
                              value={newStaffForm.alternative_email}
                              onChange={(e) => setNewStaffForm({ ...newStaffForm, alternative_email: e.target.value })}
                              placeholder="abdelazizge@yahoo.co.uk"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="staff-phone">Phone</Label>
                            <Input
                              id="staff-phone"
                              value={newStaffForm.phone}
                              onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                              placeholder="+201234567890"
                            />
                          </div>
                          <div>
                            <Label htmlFor="staff-mobile">Mobile</Label>
                            <Input
                              id="staff-mobile"
                              value={newStaffForm.mobile}
                              onChange={(e) => setNewStaffForm({ ...newStaffForm, mobile: e.target.value })}
                              placeholder="+201001324860"
                            />
                          </div>
                          <div>
                            <Label htmlFor="staff-website">Website</Label>
                            <Input
                              id="staff-website"
                              value={newStaffForm.website}
                              onChange={(e) => setNewStaffForm({ ...newStaffForm, website: e.target.value })}
                              placeholder="http://www.epri.edu.eg/"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Organizational Information */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                      <ChevronRight className="h-4 w-4" />
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Organizational Information</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="staff-faculty">Faculty</Label>
                          <Input
                            id="staff-faculty"
                            value={newStaffForm.faculty}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, faculty: e.target.value })}
                            placeholder="Engineering, Shoubra"
                          />
                        </div>
                        <div>
                          <Label htmlFor="staff-department">Department</Label>
                          <Input
                            id="staff-department"
                            value={newStaffForm.department}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value })}
                            placeholder="Civil Engineering"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="office-location">Office Location</Label>
                          <Input
                            id="office-location"
                            value={newStaffForm.office_location}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, office_location: e.target.value })}
                            placeholder="Building A, Room 205"
                          />
                        </div>
                        <div>
                          <Label htmlFor="office-hours">Office Hours</Label>
                          <Input
                            id="office-hours"
                            value={newStaffForm.office_hours}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, office_hours: e.target.value })}
                            placeholder="Sun-Thu 10:00 AM - 2:00 PM"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Academic Content */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                      <ChevronRight className="h-4 w-4" />
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">Academic Content</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 space-y-4">
                      <div>
                        <Label htmlFor="staff-bio">Biography</Label>
                        <Textarea
                          id="staff-bio"
                          value={newStaffForm.bio}
                          onChange={(e) => setNewStaffForm({ ...newStaffForm, bio: e.target.value })}
                          placeholder="Brief professional biography..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="research-interests">Research Interests</Label>
                        <Textarea
                          id="research-interests"
                          value={newStaffForm.research_interests}
                          onChange={(e) => setNewStaffForm({ ...newStaffForm, research_interests: e.target.value })}
                          placeholder="Properties and Strength of Materials, Microstructure and Mass Transport Properties of Concrete..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="staff-news">News & Announcements</Label>
                        <Textarea
                          id="staff-news"
                          value={newStaffForm.news}
                          onChange={(e) => setNewStaffForm({ ...newStaffForm, news: e.target.value })}
                          placeholder="Recent achievements, announcements..."
                          rows={2}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Publication Statistics */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                      <ChevronRight className="h-4 w-4" />
                      <FileText className="h-4 w-4" />
                      <span className="font-medium">Publication Statistics</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="publications-count">Publications</Label>
                          <Input
                            id="publications-count"
                            type="number"
                            value={newStaffForm.publications_count}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, publications_count: parseInt(e.target.value) || 0 })}
                            placeholder="30"
                          />
                        </div>
                        <div>
                          <Label htmlFor="papers-count">Papers</Label>
                          <Input
                            id="papers-count"
                            type="number"
                            value={newStaffForm.papers_count}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, papers_count: parseInt(e.target.value) || 0 })}
                            placeholder="18"
                          />
                        </div>
                        <div>
                          <Label htmlFor="abstracts-count">Abstracts</Label>
                          <Input
                            id="abstracts-count"
                            type="number"
                            value={newStaffForm.abstracts_count}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, abstracts_count: parseInt(e.target.value) || 0 })}
                            placeholder="28"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="courses-files-count">Course Files</Label>
                          <Input
                            id="courses-files-count"
                            type="number"
                            value={newStaffForm.courses_files_count}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, courses_files_count: parseInt(e.target.value) || 0 })}
                            placeholder="12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inlinks-count">Inlinks</Label>
                          <Input
                            id="inlinks-count"
                            type="number"
                            value={newStaffForm.inlinks_count}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, inlinks_count: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="external-links-count">External Links</Label>
                          <Input
                            id="external-links-count"
                            type="number"
                            value={newStaffForm.external_links_count}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, external_links_count: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Academic Links */}
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                      <ChevronRight className="h-4 w-4" />
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">Academic & Social Links</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="google-scholar">Google Scholar</Label>
                          <Input
                            id="google-scholar"
                            value={newStaffForm.google_scholar}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, google_scholar: e.target.value })}
                            placeholder="https://scholar.google.com/citations?user=..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="research-gate">Research Gate</Label>
                          <Input
                            id="research-gate"
                            value={newStaffForm.research_gate}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, research_gate: e.target.value })}
                            placeholder="https://www.researchgate.net/profile/..."
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="academia-edu">Academia.edu</Label>
                          <Input
                            id="academia-edu"
                            value={newStaffForm.academia_edu}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, academia_edu: e.target.value })}
                            placeholder="https://university.academia.edu/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={newStaffForm.linkedin}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, linkedin: e.target.value })}
                            placeholder="https://www.linkedin.com/in/..."
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor="orcid">ORCID</Label>
                          <Input
                            id="orcid"
                            value={newStaffForm.orcid}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, orcid: e.target.value })}
                            placeholder="https://orcid.org/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="scopus">Scopus</Label>
                          <Input
                            id="scopus"
                            value={newStaffForm.scopus}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, scopus: e.target.value })}
                            placeholder="https://www.scopus.com/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            value={newStaffForm.facebook}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, facebook: e.target.value })}
                            placeholder="https://www.facebook.com/..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="twitter">Twitter</Label>
                          <Input
                            id="twitter"
                            value={newStaffForm.twitter}
                            onChange={(e) => setNewStaffForm({ ...newStaffForm, twitter: e.target.value })}
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => setNewStaffForm({
        name: '',
        title: '',
        academic_position: '',
        current_admin_position: '',
        ex_admin_position: '',
        scientific_name: '',
        picture: '',
        bio: '',
        research_interests: '',
        news: '',
        email: '',
        alternative_email: '',
        phone: '',
        mobile: '',
        website: '',
        google_scholar: '',
        research_gate: '',
        academia_edu: '',
        linkedin: '',
        facebook: '',
        twitter: '',
        google_plus: '',
        youtube: '',
        wordpress: '',
        instagram: '',
        mendeley: '',
        zotero: '',
        evernote: '',
        orcid: '',
        scopus: '',
        publications_count: 0,
        papers_count: 0,
        abstracts_count: 0,
        courses_files_count: 0,
        inlinks_count: 0,
        external_links_count: 0,
        faculty: '',
        department: '',
        office_location: '',
        office_hours: '',
                      })}
                    >
                      Clear Form
                    </Button>
                    <Button 
                      onClick={handleCreateNewStaff}
                      disabled={!newStaffForm.name.trim() || !newStaffForm.title.trim()}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create & Select Staff
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              {selectedStaffIds.length > 0 && (
                <span>{selectedStaffIds.length} staff member{selectedStaffIds.length !== 1 ? 's' : ''} selected</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetStaffDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveStaffAssignment}>
                Save Assignments
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

