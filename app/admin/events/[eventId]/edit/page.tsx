'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft,
  Save,
  Upload,
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Image as ImageIcon
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

interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  type?: 'keynote' | 'presentation' | 'panel' | 'break' | 'networking';
  description?: string;
}

interface EventForm {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  price: string;
  capacity: string;
  status: string;
  featured: boolean;
  registration_open: boolean;
  is_conference: boolean;
  cover_image: string;
  agenda: AgendaItem[];
  guidelines: string;
  address_id: string;
  category_ids: string[];
  speaker_ids: string[];
}

export default function EditEventPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<EventForm>({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    price: '0',
    capacity: '100',
    status: 'DRAFT',
    featured: false,
    registration_open: true,
    is_conference: false,
    cover_image: '',
    agenda: [],
    guidelines: '',
    address_id: '',
    category_ids: [],
    speaker_ids: [],
  });

  useEffect(() => {
    loadEvent();
  }, [params.eventId]);

  const loadEvent = async () => {
    try {
      const data = await apiClient.getAdminEvents();
      const event = data.events.find((e: any) => e.id === params.eventId);
      
      if (event) {
        setFormData({
          title: event.title || '',
          description: event.description || '',
          start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
          end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
          price: event.price?.toString() || '0',
          capacity: event.capacity?.toString() || '100',
          status: event.status || 'DRAFT',
          featured: event.featured || false,
          registration_open: event.registration_open !== false,
          is_conference: event.is_conference || false,
          cover_image: event.cover_image || '',
          agenda: Array.isArray(event.agenda) ? event.agenda : [],
          guidelines: event.guidelines || '',
          address_id: event.address_id || '',
          category_ids: event.categories?.map((c: any) => c.category_id) || [],
          speaker_ids: event.speakers?.map((s: any) => s.id) || [],
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiClient.updateAdminEvent(params.eventId, {
        title: formData.title,
        description: formData.description,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
        price: parseFloat(formData.price) || 0,
        capacity: parseInt(formData.capacity) || 100,
        status: formData.status,
        featured: formData.featured,
        registration_open: formData.registration_open,
        is_conference: formData.is_conference,
        cover_image: formData.cover_image,
        agenda: formData.agenda,
        guidelines: formData.guidelines,
        address_id: formData.address_id || null,
      });

      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });

      router.push('/admin/events');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update event',
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
          <Link href="/admin/events">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
            <p className="text-gray-600 mt-1">Update event details</p>
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
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Event title and description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Conference Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Conference Settings</CardTitle>
                <CardDescription>Mark this event as a conference</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_conference"
                    checked={formData.is_conference}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_conference: checked as boolean })}
                  />
                  <Label htmlFor="is_conference" className="cursor-pointer">
                    This is a Conference
                  </Label>
                </div>
                {formData.is_conference && (
                  <>
                    <div>
                      <Label htmlFor="cover_image">Cover Image URL</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cover_image"
                          value={formData.cover_image}
                          onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                          placeholder="/conference-image.jpg"
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.cover_image && (
                        <div className="mt-2">
                          <img 
                            src={formData.cover_image} 
                            alt="Cover" 
                            className="w-full h-48 object-cover rounded-md border"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Event Agenda</Label>
                      <div className="space-y-4 mt-2">
                        {formData.agenda.map((item, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border rounded-md">
                            <div className="md:col-span-1">
                              <Label className="text-xs">Time</Label>
                              <Input
                                value={item.time}
                                onChange={(e) => {
                                  const agenda = [...formData.agenda];
                                  agenda[index] = { ...agenda[index], time: e.target.value };
                                  setFormData({ ...formData, agenda });
                                }}
                                placeholder="09:00 - 10:00"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label className="text-xs">Title</Label>
                              <Input
                                value={item.title}
                                onChange={(e) => {
                                  const agenda = [...formData.agenda];
                                  agenda[index] = { ...agenda[index], title: e.target.value };
                                  setFormData({ ...formData, agenda });
                                }}
                                placeholder="Opening Keynote"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label className="text-xs">Speaker</Label>
                              <Input
                                value={item.speaker || ''}
                                onChange={(e) => {
                                  const agenda = [...formData.agenda];
                                  agenda[index] = { ...agenda[index], speaker: e.target.value };
                                  setFormData({ ...formData, agenda });
                                }}
                                placeholder="Dr. Ahmed Ali"
                              />
                            </div>
                            <div className="md:col-span-5">
                              <Label className="text-xs">Description</Label>
                              <Textarea
                                value={item.description || ''}
                                onChange={(e) => {
                                  const agenda = [...formData.agenda];
                                  agenda[index] = { ...agenda[index], description: e.target.value };
                                  setFormData({ ...formData, agenda });
                                }}
                                rows={3}
                                placeholder="Session details..."
                              />
                            </div>
                            <div className="flex justify-between md:col-span-5">
                              <div className="w-40">
                                <Label className="text-xs">Type</Label>
                                <Select
                                  value={item.type || 'presentation'}
                                  onValueChange={(value) => {
                                    const agenda = [...formData.agenda];
                                    agenda[index] = { ...agenda[index], type: value as AgendaItem['type'] };
                                    setFormData({ ...formData, agenda });
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="keynote">Keynote</SelectItem>
                                    <SelectItem value="presentation">Presentation</SelectItem>
                                    <SelectItem value="panel">Panel</SelectItem>
                                    <SelectItem value="break">Break</SelectItem>
                                    <SelectItem value="networking">Networking</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                  const agenda = formData.agenda.filter((_, i) => i !== index);
                                  setFormData({ ...formData, agenda });
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setFormData({
                            ...formData,
                            agenda: [...formData.agenda, { time: '', title: '', type: 'presentation' }]
                          })}
                        >
                          + Add Agenda Item
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="guidelines">Attendee Guidelines</Label>
                      <Textarea
                        id="guidelines"
                        value={formData.guidelines}
                        onChange={(e) => setFormData({ ...formData, guidelines: e.target.value })}
                        rows={4}
                        placeholder="Dress code, what to bring, etc."
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date & Time *</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date & Time</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Capacity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing & Capacity
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (EGP)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="capacity" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    min="1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="PUBLISHED">Published</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked as boolean })}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Featured Event
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="registration_open"
                    checked={formData.registration_open}
                    onCheckedChange={(checked) => setFormData({ ...formData, registration_open: checked as boolean })}
                  />
                  <Label htmlFor="registration_open" className="cursor-pointer">
                    Registration Open
                  </Label>
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
                <Link href="/admin/events">
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
