'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FolderTree, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Hash
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
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface DepartmentSection {
  id: string;
  name: string;
  slug: string;
  order_index: number;
  departments_count: number;
  created_at: string;
  updated_at: string;
}

export default function AdminDepartmentSections() {
  const [sections, setSections] = useState<DepartmentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sectionForm, setSectionForm] = useState({
    name: '',
    slug: '',
    order_index: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const data = await apiClient.getAdminDepartmentSections();
      setSections(data.sections);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load department sections',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async () => {
    if (!sectionForm.name.trim()) {
      toast({
        title: 'Error',
        description: 'Section name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await apiClient.createAdminDepartmentSection({
        name: sectionForm.name,
        slug: sectionForm.slug || undefined,
        order_index: sectionForm.order_index ? parseInt(sectionForm.order_index) : undefined,
      });
      toast({
        title: 'Success',
        description: 'Department section created successfully',
      });
      setShowCreateDialog(false);
      setSectionForm({
        name: '',
        slug: '',
        order_index: '',
      });
      loadSections();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create department section',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section? Departments in this section will need to be reassigned.')) return;
    
    try {
      await apiClient.deleteAdminDepartmentSection(id);
      toast({
        title: 'Success',
        description: 'Department section deleted successfully',
      });
      loadSections();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete department section',
        variant: 'destructive',
      });
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setSectionForm({
      ...sectionForm,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    });
  };

  const filteredSections = sections.filter((section) =>
    section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.slug.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900">Department Sections</h1>
          <p className="text-gray-600 mt-1">Manage department sections that group departments</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Section
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Department Section</DialogTitle>
              <DialogDescription>Add a new section to group departments</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Section Name *</Label>
                <Input
                  id="name"
                  value={sectionForm.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Enter section name"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={sectionForm.slug}
                  onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value })}
                  placeholder="auto-generated-from-name"
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
                  value={sectionForm.order_index}
                  onChange={(e) => setSectionForm({ ...sectionForm, order_index: e.target.value })}
                  placeholder="0"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSection}>Create Section</Button>
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
              placeholder="Search sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Sections ({filteredSections.length})</CardTitle>
          <CardDescription>View and manage all department sections</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSections.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No sections found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Departments</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FolderTree className="h-4 w-4 text-gray-400" />
                        {section.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {section.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <Hash className="h-3 w-3 mr-1" />
                        {section.order_index}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={section.departments_count > 0 ? 'default' : 'secondary'}>
                        {section.departments_count} department{section.departments_count !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(section.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/department-sections/${section.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSection(section.id)}
                          className="text-red-600"
                          disabled={section.departments_count > 0}
                          title={section.departments_count > 0 ? 'Cannot delete section with departments' : 'Delete section'}
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
    </div>
  );
}

