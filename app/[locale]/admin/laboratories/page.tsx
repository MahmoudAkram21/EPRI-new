'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Plus, Search, Edit, Trash2, Building, Users, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

type TranslationObject = { en: string; ar: string } | string;

// Helper function to extract translation value
function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || '';
  }
  return '';
}

interface Laboratory {
  id: string;
  name: string | TranslationObject;
  description?: string | TranslationObject;
  head_name?: string | TranslationObject;
  head_title?: string | TranslationObject;
  department?: {
    id: string;
    name: string | TranslationObject;
  };
  section?: {
    id: string;
    name: string | TranslationObject;
  };
  staff_count: number;
  students_count: number;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
}

interface Department {
  id: string;
  name: string | TranslationObject;
}

interface DepartmentSection {
  id: string;
  name: string | TranslationObject;
}

export default function LaboratoriesManagement() {
  const { toast } = useToast();
  const locale = useLocale();
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<DepartmentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [labToDelete, setLabToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchLaboratories();
    fetchDepartments();
    fetchSections();
  }, [selectedDepartment, selectedSection, searchTerm]);

  const fetchLaboratories = async () => {
    try {
      const params: any = {};
      if (selectedDepartment) params.departmentId = selectedDepartment;
      if (selectedSection) params.sectionId = selectedSection;
      if (searchTerm) params.search = searchTerm;

      const data = await apiClient.getAdminLaboratories(params);
      setLaboratories(data.laboratories || []);
    } catch (error: any) {
      console.error('Error fetching laboratories:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch laboratories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async () => {
    if (!labToDelete) return;

    try {
      await apiClient.deleteLaboratory(labToDelete);
      toast({
        title: "Success",
        description: "Laboratory deleted successfully",
      });
      fetchLaboratories();
      setDeleteDialogOpen(false);
      setLabToDelete(null);
    } catch (error: any) {
      console.error('Error deleting laboratory:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete laboratory",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (id: string) => {
    setLabToDelete(id);
    setDeleteDialogOpen(true);
  };

  const filteredLaboratories = laboratories.filter(lab => {
    if (!searchTerm) return true;
    const labName = getTranslation(lab.name, locale as string).toLowerCase();
    const labDescription = lab.description ? getTranslation(lab.description, locale as string).toLowerCase() : '';
    const labHeadName = lab.head_name ? getTranslation(lab.head_name, locale as string).toLowerCase() : '';
    const searchLower = searchTerm.toLowerCase();
    return labName.includes(searchLower) ||
      labDescription.includes(searchLower) ||
      labHeadName.includes(searchLower);
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Management</h1>
          <p className="text-gray-600 mt-2">Manage research laboratories and facilities</p>
        </div>
        <Link href="/admin/laboratories/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Laboratory
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Labs</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{laboratories.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Labs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {laboratories.filter(lab => lab.is_active).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {laboratories.reduce((sum, lab) => sum + lab.staff_count, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {laboratories.reduce((sum, lab) => sum + lab.students_count, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search laboratories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {getTranslation(dept.name, locale as string)}
                </option>
              ))}
            </select>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {getTranslation(section.name, locale as string)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Laboratories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Laboratories ({filteredLaboratories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Loading laboratories...</div>
          ) : filteredLaboratories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FlaskConical className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No laboratories found</h3>
              <p className="text-sm">Create your first laboratory to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Head</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Staff/Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLaboratories.map((laboratory) => (
                    <TableRow key={laboratory.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{getTranslation(laboratory.name, locale as string)}</div>
                          {laboratory.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {getTranslation(laboratory.description, locale as string)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {laboratory.head_name ? (
                          <div>
                            <div className="font-medium">{getTranslation(laboratory.head_name, locale as string)}</div>
                            {laboratory.head_title && (
                              <div className="text-sm text-gray-500">{getTranslation(laboratory.head_title, locale as string)}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          {laboratory.department?.name && (
                            <div className="text-sm">{getTranslation(laboratory.department.name, locale as string)}</div>
                          )}
                          {laboratory.section?.name && (
                            <div className="text-xs text-gray-500">{getTranslation(laboratory.section.name, locale as string)}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Badge variant="outline">
                            {laboratory.staff_count} Staff
                          </Badge>
                          <Badge variant="outline">
                            {laboratory.students_count} Students
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Badge variant={laboratory.is_active ? "default" : "secondary"}>
                            {laboratory.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {laboratory.is_featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/admin/laboratories/${laboratory.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => openDeleteDialog(laboratory.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Laboratory</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this laboratory? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}