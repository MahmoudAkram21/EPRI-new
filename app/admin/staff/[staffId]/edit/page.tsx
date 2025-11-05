'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Save, 
  User,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  FileText,
  Eye,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface StaffMember {
  id: string;
  name: string;
  title: string;
  academic_position?: string;
  current_admin_position?: string;
  ex_admin_position?: string;
  scientific_name?: string;
  picture?: string;
  bio?: string;
  research_interests?: string;
  email?: string;
  alternative_email?: string;
  phone?: string;
  mobile?: string;
  website?: string;
  office_location?: string;
  office_hours?: string;
  faculty?: string;
  department?: string;
}

export default function EditStaffPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null);
  
  // Staff form data
  const [staffData, setStaffData] = useState({
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
    office_location: '',
    office_hours: '',
    faculty: '',
    department: '',
    // Social media and academic links
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
    // Publication stats
    publications_count: 0,
    papers_count: 0,
    abstracts_count: 0,
    courses_files_count: 0,
    inlinks_count: 0,
    external_links_count: 0
  });

  useEffect(() => {
    if (params?.staffId) {
      fetchStaffMember(params.staffId as string);
    }
  }, [params?.staffId]);

  const fetchStaffMember = async (staffId: string) => {
    try {
      setFetching(true);
      const response = await apiClient.getStaff(staffId);
      const staff = response.staff;
      
      setStaffMember(staff);
      
      // Populate form data
      setStaffData({
        name: staff.name || '',
        title: staff.title || '',
        academic_position: staff.academic_position || '',
        current_admin_position: staff.current_admin_position || '',
        ex_admin_position: staff.ex_admin_position || '',
        scientific_name: staff.scientific_name || '',
        picture: staff.picture || '',
        bio: staff.bio || '',
        research_interests: staff.research_interests || '',
        news: staff.news || '',
        email: staff.email || '',
        alternative_email: staff.alternative_email || '',
        phone: staff.phone || '',
        mobile: staff.mobile || '',
        website: staff.website || '',
        office_location: staff.office_location || '',
        office_hours: staff.office_hours || '',
        faculty: staff.faculty || '',
        department: staff.department || '',
        // Social media and academic links
        google_scholar: staff.google_scholar || '',
        research_gate: staff.research_gate || '',
        academia_edu: staff.academia_edu || '',
        linkedin: staff.linkedin || '',
        facebook: staff.facebook || '',
        twitter: staff.twitter || '',
        google_plus: staff.google_plus || '',
        youtube: staff.youtube || '',
        wordpress: staff.wordpress || '',
        instagram: staff.instagram || '',
        mendeley: staff.mendeley || '',
        zotero: staff.zotero || '',
        evernote: staff.evernote || '',
        orcid: staff.orcid || '',
        scopus: staff.scopus || '',
        // Publication stats
        publications_count: staff.publications_count || 0,
        papers_count: staff.papers_count || 0,
        abstracts_count: staff.abstracts_count || 0,
        courses_files_count: staff.courses_files_count || 0,
        inlinks_count: staff.inlinks_count || 0,
        external_links_count: staff.external_links_count || 0
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load staff member',
        variant: 'destructive',
      });
      router.push('/admin/staff');
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Handle number fields
    if (['publications_count', 'papers_count', 'abstracts_count', 'courses_files_count', 'inlinks_count', 'external_links_count'].includes(field)) {
      setStaffData(prev => ({ ...prev, [field]: parseInt(value) || 0 }));
    } else {
      setStaffData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    // Validation
    if (!staffData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Staff member name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!staffData.title.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Job title is required',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await apiClient.updateAdminStaff(params?.staffId as string, staffData);

      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });

      router.push('/admin/staff');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update staff member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading staff member...</p>
        </div>
      </div>
    );
  }

  if (!staffMember) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-gray-600">Staff member not found</p>
          <Button asChild className="mt-4">
            <Link href="/admin/staff">Back to Staff</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/staff">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Staff
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Staff Member</h1>
                <p className="text-sm text-gray-500">Update {staffMember.name}'s profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Updating...' : 'Update Staff Member'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Update the core details about the staff member
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={staffData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Dr. John Smith"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={staffData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Senior Petroleum Engineer"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scientific_name">Scientific Name</Label>
                    <Input
                      id="scientific_name"
                      value={staffData.scientific_name}
                      onChange={(e) => handleInputChange('scientific_name', e.target.value)}
                      placeholder="Prof. Dr. John Smith, Ph.D."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="picture">Profile Picture URL</Label>
                    <Input
                      id="picture"
                      value={staffData.picture}
                      onChange={(e) => handleInputChange('picture', e.target.value)}
                      placeholder="/staff/john-smith.jpg"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={staffData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Brief biography and background of the staff member..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="research_interests">Research Interests</Label>
                  <Input
                    id="research_interests"
                    value={staffData.research_interests}
                    onChange={(e) => handleInputChange('research_interests', e.target.value)}
                    placeholder="Comma-separated list of research areas"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic & Administrative Positions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Academic & Administrative Positions
                </CardTitle>
                <CardDescription>
                  Update academic and administrative roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="academic_position">Academic Position</Label>
                    <Input
                      id="academic_position"
                      value={staffData.academic_position}
                      onChange={(e) => handleInputChange('academic_position', e.target.value)}
                      placeholder="Professor, Associate Professor, etc."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current_admin_position">Current Admin Position</Label>
                    <Input
                      id="current_admin_position"
                      value={staffData.current_admin_position}
                      onChange={(e) => handleInputChange('current_admin_position', e.target.value)}
                      placeholder="Department Head, Director, etc."
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ex_admin_position">Former Admin Position</Label>
                    <Input
                      id="ex_admin_position"
                      value={staffData.ex_admin_position}
                      onChange={(e) => handleInputChange('ex_admin_position', e.target.value)}
                      placeholder="Previous administrative roles"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Faculty</Label>
                    <Input
                      id="faculty"
                      value={staffData.faculty}
                      onChange={(e) => handleInputChange('faculty', e.target.value)}
                      placeholder="Faculty name"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={staffData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Department name"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Update contact details and office information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Primary Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={staffData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john.smith@epri.edu"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternative_email">Alternative Email</Label>
                    <Input
                      id="alternative_email"
                      type="email"
                      value={staffData.alternative_email}
                      onChange={(e) => handleInputChange('alternative_email', e.target.value)}
                      placeholder="john.smith@gmail.com"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={staffData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+201234567890"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      value={staffData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="+201234567890"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="office_location">Office Location</Label>
                    <Input
                      id="office_location"
                      value={staffData.office_location}
                      onChange={(e) => handleInputChange('office_location', e.target.value)}
                      placeholder="Building A, Room 101"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="office_hours">Office Hours</Label>
                    <Input
                      id="office_hours"
                      value={staffData.office_hours}
                      onChange={(e) => handleInputChange('office_hours', e.target.value)}
                      placeholder="Sunday-Thursday 9:00-17:00"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    value={staffData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://johnsmith.example.com"
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* News & Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  News & Announcements
                </CardTitle>
                <CardDescription>
                  Staff news, announcements, and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="news">News & Updates</Label>
                  <Textarea
                    id="news"
                    value={staffData.news}
                    onChange={(e) => handleInputChange('news', e.target.value)}
                    placeholder="Recent news, achievements, announcements..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic & Research Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Academic & Research Links
                </CardTitle>
                <CardDescription>
                  Academic profiles and research platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="google_scholar">Google Scholar</Label>
                    <Input
                      id="google_scholar"
                      value={staffData.google_scholar}
                      onChange={(e) => handleInputChange('google_scholar', e.target.value)}
                      placeholder="https://scholar.google.com/citations?user=..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="research_gate">ResearchGate</Label>
                    <Input
                      id="research_gate"
                      value={staffData.research_gate}
                      onChange={(e) => handleInputChange('research_gate', e.target.value)}
                      placeholder="https://www.researchgate.net/profile/..."
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="academia_edu">Academia.edu</Label>
                    <Input
                      id="academia_edu"
                      value={staffData.academia_edu}
                      onChange={(e) => handleInputChange('academia_edu', e.target.value)}
                      placeholder="https://university.academia.edu/..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orcid">ORCID</Label>
                    <Input
                      id="orcid"
                      value={staffData.orcid}
                      onChange={(e) => handleInputChange('orcid', e.target.value)}
                      placeholder="https://orcid.org/0000-0000-0000-0000"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scopus">Scopus</Label>
                    <Input
                      id="scopus"
                      value={staffData.scopus}
                      onChange={(e) => handleInputChange('scopus', e.target.value)}
                      placeholder="https://www.scopus.com/authid/detail.uri?authorId=..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mendeley">Mendeley</Label>
                    <Input
                      id="mendeley"
                      value={staffData.mendeley}
                      onChange={(e) => handleInputChange('mendeley', e.target.value)}
                      placeholder="https://www.mendeley.com/profiles/..."
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zotero">Zotero</Label>
                    <Input
                      id="zotero"
                      value={staffData.zotero}
                      onChange={(e) => handleInputChange('zotero', e.target.value)}
                      placeholder="https://www.zotero.org/..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evernote">Evernote</Label>
                    <Input
                      id="evernote"
                      value={staffData.evernote}
                      onChange={(e) => handleInputChange('evernote', e.target.value)}
                      placeholder="https://www.evernote.com/..."
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Social Media Links
                </CardTitle>
                <CardDescription>
                  Social media and professional networking profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={staffData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="https://www.linkedin.com/in/..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={staffData.facebook}
                      onChange={(e) => handleInputChange('facebook', e.target.value)}
                      placeholder="https://www.facebook.com/..."
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      value={staffData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={staffData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="https://www.instagram.com/..."
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={staffData.youtube}
                      onChange={(e) => handleInputChange('youtube', e.target.value)}
                      placeholder="https://www.youtube.com/..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wordpress">WordPress</Label>
                    <Input
                      id="wordpress"
                      value={staffData.wordpress}
                      onChange={(e) => handleInputChange('wordpress', e.target.value)}
                      placeholder="https://username.wordpress.com"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google_plus">Google Plus (Legacy)</Label>
                  <Input
                    id="google_plus"
                    value={staffData.google_plus}
                    onChange={(e) => handleInputChange('google_plus', e.target.value)}
                    placeholder="https://plus.google.com/..."
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Publication Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Publication Statistics
                </CardTitle>
                <CardDescription>
                  Research output and publication metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="publications_count">Publications Count</Label>
                    <Input
                      id="publications_count"
                      type="number"
                      min="0"
                      value={staffData.publications_count}
                      onChange={(e) => handleInputChange('publications_count', e.target.value)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="papers_count">Papers Count</Label>
                    <Input
                      id="papers_count"
                      type="number"
                      min="0"
                      value={staffData.papers_count}
                      onChange={(e) => handleInputChange('papers_count', e.target.value)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="abstracts_count">Abstracts Count</Label>
                    <Input
                      id="abstracts_count"
                      type="number"
                      min="0"
                      value={staffData.abstracts_count}
                      onChange={(e) => handleInputChange('abstracts_count', e.target.value)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="courses_files_count">Course Files Count</Label>
                    <Input
                      id="courses_files_count"
                      type="number"
                      min="0"
                      value={staffData.courses_files_count}
                      onChange={(e) => handleInputChange('courses_files_count', e.target.value)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inlinks_count">Inlinks Count</Label>
                    <Input
                      id="inlinks_count"
                      type="number"
                      min="0"
                      value={staffData.inlinks_count}
                      onChange={(e) => handleInputChange('inlinks_count', e.target.value)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="external_links_count">External Links Count</Label>
                    <Input
                      id="external_links_count"
                      type="number"
                      min="0"
                      value={staffData.external_links_count}
                      onChange={(e) => handleInputChange('external_links_count', e.target.value)}
                      placeholder="0"
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Current Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {staffMember.picture ? (
                        <img
                          src={staffMember.picture}
                          alt="Profile"
                          className="h-12 w-12 object-cover rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <User className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {staffMember.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {staffMember.title}
                      </p>
                    </div>
                  </div>
                  
                  {staffMember.academic_position && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{staffMember.academic_position}</span>
                    </div>
                  )}
                  
                  {staffMember.current_admin_position && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">{staffMember.current_admin_position}</span>
                    </div>
                  )}
                  
                  {staffMember.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{staffMember.email}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Additional Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/staff/${staffMember.id}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      View Public Profile
                    </Link>
                  </Button>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Available actions:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Manage department assignments</li>
                      <li>Update research publications</li>
                      <li>Configure social media links</li>
                      <li>Set academic credentials</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}