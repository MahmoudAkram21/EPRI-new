'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  Eye
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function CreateStaffPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  
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
    // Publication stats (these might be auto-calculated but allow manual entry)
    publications_count: 0,
    papers_count: 0,
    abstracts_count: 0,
    courses_files_count: 0,
    inlinks_count: 0,
    external_links_count: 0
  });

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
      await apiClient.createAdminStaff(staffData);

      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });

      router.push('/admin/staff');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create staff member',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-xl font-semibold text-gray-900">Add New Staff Member</h1>
                <p className="text-sm text-gray-500">Create a new staff profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleSave}
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Creating...' : 'Create Staff Member'}
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
                  Enter the core details about the staff member
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
                  Specify academic and administrative roles
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
                  Contact details and office information
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
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {staffData.picture ? (
                        <img
                          src={staffData.picture}
                          alt="Preview"
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
                        {staffData.name || 'Staff Name'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {staffData.title || 'Job Title'}
                      </p>
                    </div>
                  </div>
                  
                  {staffData.academic_position && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{staffData.academic_position}</span>
                    </div>
                  )}
                  
                  {staffData.current_admin_position && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">{staffData.current_admin_position}</span>
                    </div>
                  )}
                  
                  {staffData.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{staffData.email}</span>
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
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">After creating the staff member, you can:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Assign to departments</li>
                    <li>Set up research profile</li>
                    <li>Configure publication details</li>
                    <li>Add social media links</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}