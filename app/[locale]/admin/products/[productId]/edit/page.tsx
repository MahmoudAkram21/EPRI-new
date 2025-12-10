'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2,
  Package
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const locale = useLocale();
  const productId = params.productId as string;
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serviceCenters, setServiceCenters] = useState<any[]>([]);
  
  // Store original multilingual data
  const [originalMultilingualData, setOriginalMultilingualData] = useState<{
    name?: TranslationObject;
    description?: TranslationObject;
    short_description?: TranslationObject;
  }>({});
  
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    short_description: '',
    image: '',
    price: '',
    original_price: '',
    category: '',
    sku: '',
    stock_quantity: '',
    is_featured: false,
    is_published: true,
    is_available: true,
    order_index: 0,
    service_center_id: 'none',
  });
  
  const [images, setImages] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);
  const [features, setFeatures] = useState<string[]>(['']);
  const [sizes, setSizes] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    try {
      const [productResponse, centersResponse] = await Promise.all([
        apiClient.getAdminProduct(productId),
        apiClient.getServiceCenters()
      ]);
      
      const product = productResponse.product;
      setServiceCenters(centersResponse.centers || []);
      
      // Store original multilingual data
      setOriginalMultilingualData({
        name: product.name,
        description: product.description,
        short_description: product.short_description,
      });
      
      setProductData({
        name: getTranslation(product.name, locale),
        description: getTranslation(product.description, locale),
        short_description: getTranslation(product.short_description, locale),
        image: product.image || '',
        price: product.price ? product.price.toString() : '',
        original_price: product.original_price ? product.original_price.toString() : '',
        category: product.category || '',
        sku: product.sku || '',
        stock_quantity: product.stock_quantity !== null ? product.stock_quantity.toString() : '',
        is_featured: product.is_featured || false,
        is_published: product.is_published !== false,
        is_available: product.is_available !== false,
        order_index: product.order_index || 0,
        service_center_id: product.service_center_id || 'none',
      });
      
      setImages(product.images && product.images.length > 0 ? product.images : ['']);
      setTags(product.tags && product.tags.length > 0 ? product.tags : ['']);
      setFeatures(product.features && product.features.length > 0 ? product.features : ['']);
      setSizes(product.sizes && product.sizes.length > 0 ? product.sizes : ['']);
      
      if (product.specifications && typeof product.specifications === 'object') {
        const specs = Object.entries(product.specifications).map(([key, value]) => ({
          key,
          value: String(value)
        }));
        setSpecifications(specs.length > 0 ? specs : [{ key: '', value: '' }]);
      } else {
        setSpecifications([{ key: '', value: '' }]);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load product',
        variant: 'destructive',
      });
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (setter: any, current: string[]) => {
    setter([...current, '']);
  };

  const updateArrayItem = (setter: any, current: string[], index: number, value: string) => {
    const newArray = [...current];
    newArray[index] = value;
    setter(newArray);
  };

  const removeArrayItem = (setter: any, current: string[], index: number) => {
    if (current.length > 1) {
      setter(current.filter((_, i) => i !== index));
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setSpecifications(newSpecs);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!productData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Product name is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      // Build multilingual objects for name, description, and short_description
      const buildMultilingualValue = (currentValue: string, originalValue?: TranslationObject): TranslationObject => {
        if (!currentValue.trim()) {
          return originalValue || '';
        }
        
        // If original was a multilingual object, preserve the other language
        if (originalValue && typeof originalValue === 'object' && originalValue !== null) {
          return {
            ...originalValue,
            [locale]: currentValue,
          };
        }
        
        // If original was a string or doesn't exist, create new multilingual object
        return {
          en: locale === 'en' ? currentValue : (typeof originalValue === 'string' ? originalValue : ''),
          ar: locale === 'ar' ? currentValue : (typeof originalValue === 'string' ? originalValue : ''),
        };
      };
      
      const payload = {
        name: buildMultilingualValue(productData.name, originalMultilingualData.name),
        description: productData.description 
          ? buildMultilingualValue(productData.description, originalMultilingualData.description)
          : undefined,
        short_description: productData.short_description
          ? buildMultilingualValue(productData.short_description, originalMultilingualData.short_description)
          : undefined,
        image: productData.image || undefined,
        images: images.filter(img => img.trim()),
        price: productData.price ? parseFloat(productData.price) : undefined,
        original_price: productData.original_price ? parseFloat(productData.original_price) : undefined,
        category: productData.category || undefined,
        tags: tags.filter(tag => tag.trim()),
        features: features.filter(f => f.trim()),
        sizes: sizes.filter(s => s.trim()),
        specifications: specifications.reduce((acc, spec) => {
          if (spec.key && spec.value) {
            acc[spec.key] = spec.value;
          }
          return acc;
        }, {} as Record<string, string>),
        stock_quantity: productData.stock_quantity ? parseInt(productData.stock_quantity, 10) : undefined,
        sku: productData.sku || undefined,
        is_featured: productData.is_featured,
        is_published: productData.is_published,
        is_available: productData.is_available,
        order_index: productData.order_index,
        service_center_id: productData.service_center_id !== 'none' ? productData.service_center_id : undefined,
      };

      await apiClient.updateAdminProduct(productId, payload);
      
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
      
      router.push('/admin/products');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p>Loading product...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_description">Short Description</Label>
                <Textarea
                  id="short_description"
                  value={productData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Brief description for cards"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  value={productData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed product description"
                  rows={6}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={productData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Equipment, Software"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={productData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Stock Keeping Unit"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_center">Service Center</Label>
                <Select
                  value={productData.service_center_id}
                  onValueChange={(value) => handleInputChange('service_center_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service center" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {serviceCenters.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name} ({center.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={productData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={productData.original_price}
                    onChange={(e) => handleInputChange('original_price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={productData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                  placeholder="Leave empty for unlimited"
                />
                <p className="text-sm text-muted-foreground">Leave empty for unlimited stock</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateArrayItem(setFeatures, features, index, e.target.value)}
                    placeholder="Enter feature"
                  />
                  {features.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem(setFeatures, features, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={() => addArrayItem(setFeatures, features)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => updateArrayItem(setTags, tags, index, e.target.value)}
                    placeholder="Enter tag"
                  />
                  {tags.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem(setTags, tags, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={() => addArrayItem(setTags, tags)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Tag
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sizes.map((size, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={size}
                    onChange={(e) => updateArrayItem(setSizes, sizes, index, e.target.value)}
                    placeholder="Enter size"
                  />
                  {sizes.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeArrayItem(setSizes, sizes, index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={() => addArrayItem(setSizes, sizes)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Size
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                    placeholder="Key"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    placeholder="Value"
                  />
                  {specifications.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSpecification(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addSpecification}>
                <Plus className="mr-2 h-4 w-4" />
                Add Specification
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Main Image URL</Label>
                <Input
                  id="image"
                  value={productData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label>Additional Images</Label>
                {images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={img}
                      onChange={(e) => updateArrayItem(setImages, images, index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    {images.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeArrayItem(setImages, images, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" onClick={() => addArrayItem(setImages, images)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Published</Label>
                  <p className="text-sm text-muted-foreground">Make product visible to users</p>
                </div>
                <Switch
                  checked={productData.is_published}
                  onCheckedChange={(checked) => handleInputChange('is_published', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Featured</Label>
                  <p className="text-sm text-muted-foreground">Highlight this product</p>
                </div>
                <Switch
                  checked={productData.is_featured}
                  onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Available</Label>
                  <p className="text-sm text-muted-foreground">Product is available for purchase</p>
                </div>
                <Switch
                  checked={productData.is_available}
                  onCheckedChange={(checked) => handleInputChange('is_available', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">Display Order</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={productData.order_index}
                  onChange={(e) => handleInputChange('order_index', parseInt(e.target.value, 10) || 0)}
                />
                <p className="text-sm text-muted-foreground">Lower numbers appear first</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

