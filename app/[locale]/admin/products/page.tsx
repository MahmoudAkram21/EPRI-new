'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
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
import Link from 'next/link';

type TranslationObject = { en: string; ar: string } | string;

// Helper function to extract translation value
function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || value.ar || '';
  }
  return '';
}

interface Product {
  id: string;
  name: string | { en: string; ar: string };
  slug: string;
  description?: string | { en: string; ar: string };
  short_description?: string | { en: string; ar: string };
  image?: string;
  images?: string[];
  price?: number;
  original_price?: number;
  category?: string;
  tags?: string[];
  is_featured: boolean;
  is_published: boolean;
  is_available: boolean;
  stock_quantity?: number;
  sku?: string;
  rating_average: number;
  rating_count: number;
  order_index: number;
  service_center?: {
    id: string;
    name: string;
    slug: string;
    type: string;
  };
  created_at: string;
  updated_at: string;
}

export default function AdminProducts() {
  const locale = useLocale();
  const [products, setProducts] = useState<Product[]>([]);
  const [serviceCenters, setServiceCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [centerFilter, setCenterFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, centersData] = await Promise.all([
        apiClient.getAdminProducts(),
        apiClient.getServiceCenters()
      ]);
      setProducts(productsData.products || []);
      setServiceCenters(centersData.centers || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await apiClient.deleteAdminProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const filteredProducts = products.filter((product) => {
    const productName = getTranslation(product.name, locale);
    const productDescription = product.description ? getTranslation(product.description, locale) : '';
    const productSku = product.sku || '';
    
    const matchesSearch = searchTerm === '' || 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productSku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesCenter = centerFilter === 'all' || product.service_center?.id === centerFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && product.is_published) ||
      (statusFilter === 'unpublished' && !product.is_published) ||
      (statusFilter === 'featured' && product.is_featured) ||
      (statusFilter === 'available' && product.is_available) ||
      (statusFilter === 'unavailable' && !product.is_available);
    
    return matchesSearch && matchesCategory && matchesCenter && matchesStatus;
  });

  const categories = Array.from(new Set(products.map(p => p.category).filter((cat): cat is string => Boolean(cat))));

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p>Loading products...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage all products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={centerFilter} onValueChange={setCenterFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Service Center" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Centers</SelectItem>
                {serviceCenters.map((center) => (
                  <SelectItem key={center.id} value={center.id}>
                    {center.name} ({center.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products ({filteredProducts.length})</CardTitle>
          <CardDescription>Manage and edit products</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No products found</p>
              <Button asChild className="mt-4">
                <Link href="/admin/products/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Product
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={getTranslation(product.name, locale)}
                            className="h-12 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{getTranslation(product.name, locale)}</div>
                          {product.sku && (
                            <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.category ? (
                          <Badge variant="outline">{product.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                    {product.service_center ? (
                      <div>
                        <div className="font-medium">{product.service_center.name || '-'}</div>
                        <div className="text-xs text-muted-foreground">{product.service_center.type || '-'}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                      </TableCell>
                      <TableCell>
                        {product.price ? (
                          <div>
                            <div className="font-medium">${Number(product.price).toFixed(2)}</div>
                            {product.original_price && Number(product.original_price) > Number(product.price) && (
                              <div className="text-xs text-muted-foreground line-through">
                                ${Number(product.original_price).toFixed(2)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Contact</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.stock_quantity !== null && product.stock_quantity !== undefined ? (
                          <span className={product.stock_quantity > 0 ? '' : 'text-red-600'}>
                            {product.stock_quantity}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">∞</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {product.is_published ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                          {product.is_featured && (
                            <Badge variant="outline" className="text-xs">Featured</Badge>
                          )}
                          {!product.is_available && (
                            <Badge variant="destructive" className="text-xs">Unavailable</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

