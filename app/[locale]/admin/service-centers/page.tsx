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
  Filter
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ServiceCenter } from '@/types/service-center';
import Link from 'next/link';

export default function AdminServiceCenters() {
  const [centers, setCenters] = useState<ServiceCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [publishedFilter, setPublishedFilter] = useState<string>('all');

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await apiClient.getAdminServiceCenters({ includeHidden: true });
      setCenters(data.centers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load service centers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this center/unit?')) return;
    
    try {
      await apiClient.deleteAdminServiceCenter(id);
      toast({
        title: 'Success',
        description: 'Center/Unit deleted successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete center/unit',
        variant: 'destructive',
      });
    }
  };

  const filteredCenters = centers.filter((center) => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (center.headline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (center.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || (center.type || 'center') === typeFilter;
    const matchesPublished = publishedFilter === 'all' || 
      (publishedFilter === 'published' && center.is_published) ||
      (publishedFilter === 'unpublished' && !center.is_published);
    
    return matchesSearch && matchesType && matchesPublished;
  });

  const stats = {
    total: centers.length,
    centers: centers.filter(c => (c.type || 'center') === 'center').length,
    units: centers.filter(c => c.type === 'unit').length,
    published: centers.filter(c => c.is_published).length,
    featured: centers.filter(c => c.is_featured).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Centers & Units</h1>
          <p className="text-gray-600 mt-1">Manage all service centers and units</p>
        </div>
        <Button asChild>
          <Link href="/admin/service-centers/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Center/Unit
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center -mt-6">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center -mt-6">
              <Building2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Centers</p>
                <p className="text-2xl font-bold">{stats.centers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center -mt-6">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Units</p>
                <p className="text-2xl font-bold">{stats.units}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center -mt-6">
              <Eye className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold">{stats.published}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center -mt-6">
              <Building2 className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold">{stats.featured}</p>
              </div>
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search centers/units..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="center">Centers</SelectItem>
                <SelectItem value="unit">Units</SelectItem>
              </SelectContent>
            </Select>
            <Select value={publishedFilter} onValueChange={setPublishedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Centers & Units ({filteredCenters.length})</CardTitle>
          <CardDescription>Manage and organize all service centers and units</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCenters.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No centers or units found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCenters.map((center) => (
                  <TableRow key={center.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{center.name}</div>
                        {center.headline && (
                          <div className="text-sm text-gray-500 mt-1">{center.headline}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={(center.type || 'center') === 'center' ? 'default' : 'secondary'}>
                        {(center.type || 'center') === 'center' ? 'Center' : 'Unit'}
                      </Badge>
                    </TableCell>
                    <TableCell>{center.location || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={center.is_published ? 'default' : 'outline'}>
                        {center.is_published ? 'Published' : 'Unpublished'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {center.is_featured && (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{center.order_index || 0}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/service-centers/${center.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/service-centers/${center.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(center.id)}
                          className="text-red-600 hover:text-red-700"
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

