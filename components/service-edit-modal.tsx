'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Service, ServiceCenterHead, SERVICE_CATEGORIES } from '@/lib/services';

interface ServiceEditModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  centerHeads: ServiceCenterHead[];
}

export default function ServiceEditModal({ 
  service, 
  isOpen, 
  onClose, 
  onSave, 
  centerHeads 
}: ServiceEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    category: '',
    icon: '',
    features: '',
    center_head_id: '',
    duration: '',
    price: 0,
    is_free: false,
  });
  
  const { toast } = useToast();

  // Populate form when service changes
  useEffect(() => {
    if (service) {
      const featuresString = Array.isArray(service.features) 
        ? service.features.join('\n')
        : typeof service.features === 'string' 
          ? service.features 
          : '';

      setServiceForm({
        title: service.title || '',
        subtitle: service.subtitle || '',
        description: service.description || '',
        image: service.image || '',
        category: service.category || '',
        icon: service.icon || '',
        features: featuresString,
        center_head_id: service.center_head_id || '',
        duration: service.duration || '',
        price: service.price || 0,
        is_free: service.is_free || false,
      });
    } else {
      // Reset form for new service
      setServiceForm({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        category: '',
        icon: '',
        features: '',
        center_head_id: '',
        duration: '',
        price: 0,
        is_free: false,
      });
    }
  }, [service]);

  const handleSave = async () => {
    if (!serviceForm.title.trim() || !serviceForm.description.trim()) {
      toast({
        title: 'Error',
        description: 'Service title and description are required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const featuresArray = serviceForm.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);

      const serviceData = {
        title: serviceForm.title,
        subtitle: serviceForm.subtitle || undefined,
        description: serviceForm.description,
        image: serviceForm.image || undefined,
        category: serviceForm.category,
        icon: serviceForm.icon || undefined,
        features: featuresArray,
        center_head_id: serviceForm.center_head_id || undefined,
        duration: serviceForm.duration || undefined,
        price: serviceForm.price,
        is_free: serviceForm.is_free,
      };

      if (service) {
        // Update existing service
        await apiClient.updateAdminService(service.id, serviceData);
        toast({
          title: 'Success',
          description: 'Service updated successfully',
        });
      } else {
        // Create new service
        await apiClient.createAdminService(serviceData);
        toast({
          title: 'Success',
          description: 'Service created successfully',
        });
      }

      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${service ? 'update' : 'create'} service`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {service ? 'Edit Service' : 'Create New Service'}
          </DialogTitle>
          <DialogDescription>
            {service ? 'Update the service information' : 'Add a new service to the EPRI catalog'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Service Title *</Label>
              <Input
                id="title"
                value={serviceForm.title}
                onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                placeholder="Enter service title"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={serviceForm.subtitle}
                onChange={(e) => setServiceForm({ ...serviceForm, subtitle: e.target.value })}
                placeholder="Enter service subtitle"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={serviceForm.description}
              onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              placeholder="Enter detailed service description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={serviceForm.category}
                onValueChange={(value) => setServiceForm({ ...serviceForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input
                id="icon"
                value={serviceForm.icon}
                onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                placeholder="🔬"
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={serviceForm.duration}
                onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                placeholder="2-5 business days"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={serviceForm.image}
                onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                placeholder="/petroleum-lab-testing.jpg"
              />
            </div>
            <div>
              <Label htmlFor="center_head_id">Center Head</Label>
              <Select
                value={serviceForm.center_head_id || "none"}
                onValueChange={(value) => setServiceForm({ ...serviceForm, center_head_id: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select center head" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {centerHeads.map((head) => (
                    <SelectItem key={head.id} value={head.id}>
                      {head.name} - {head.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="features">Features (one per line)</Label>
            <Textarea
              id="features"
              value={serviceForm.features}
              onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
              placeholder="Crude oil assay and characterization&#10;Petroleum product quality testing&#10;Fuel specifications analysis"
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={serviceForm.price}
                onChange={(e) => setServiceForm({ ...serviceForm, price: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_free"
                checked={serviceForm.is_free}
                onCheckedChange={(checked) => setServiceForm({ ...serviceForm, is_free: checked })}
              />
              <Label htmlFor="is_free">Free Service</Label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}