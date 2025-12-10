'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Star, 
  Share2, 
  Download,
  Play,
  Mic,
  Coffee,
  Wifi,
  Car,
  Plane,
  Hotel,
  Camera,
  Trophy,
  Award,
  BookOpen,
  Globe,
  MessageCircle,
  Heart,
  Bookmark
} from 'lucide-react';
import { PageContainer } from '@/components/page-container';
import { Section } from '@/components/section';
import { AnimatedSection } from '@/components/animated-section';
import { apiClient } from '@/lib/api';

interface Conference {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  capacity: number;
  status: string;
  featured: boolean;
  registration_open: boolean;
  address?: {
    title: string;
    line_1: string;
    city: string;
    country: string;
    map_link?: string;
  };
  categories: Array<{
    category: {
      title: string;
      color: string;
      icon: string;
    };
  }>;
  speakers: Array<{
    id: string;
    name: string;
    title: string;
    bio: string;
    picture?: string;
    topics: string[];
    expertise: string;
    institution: string;
    linkedin?: string;
    twitter?: string;
  }>;
  sponsors: Array<{
    id: string;
    name: string;
    logo: string;
    website: string;
  }>;
  agenda: Array<{
    time: string;
    title: string;
    speaker: string;
    type: 'keynote' | 'presentation' | 'panel' | 'break' | 'networking';
    description: string;
  }>;
}

export default function ConferencePage() {
  const params = useParams();
  const conferenceId = params.conferenceId as string;
  
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    loadConference();
  }, [conferenceId]);

  const loadConference = async () => {
    try {
      const data = await apiClient.getAdminEvents();
      const event = data.events.find((e: any) => e.id === conferenceId && e.is_conference);
      
      if (event) {
                 // Parse agenda from text
         let agenda: Array<{
           time: string;
           title: string;
           speaker: string;
           type: 'keynote' | 'presentation' | 'panel' | 'break' | 'networking';
           description: string;
         }> = [];
        if (Array.isArray(event.agenda)) {
          agenda = event.agenda as any;
        }

        const conferenceData: Conference & { cover_image?: string } = {
          id: event.id,
          title: event.title,
          description: event.description || '',
          start_date: event.start_date,
          end_date: event.end_date || event.start_date,
          price: parseFloat(event.price?.toString() || '0'),
          capacity: event.capacity || 100,
          status: event.status,
          featured: event.featured || false,
          registration_open: event.registration_open !== false,
          cover_image: event.cover_image,
          address: event.address ? {
            title: event.address.title || '',
            line_1: event.address.line_1 || '',
            city: event.address.city || '',
            country: event.address.country || 'Egypt',
            map_link: event.address.map_link
          } : undefined,
          categories: event.categories || [],
          speakers: event.speakers || [],
          sponsors: [], // Will be empty for now
          agenda: agenda
        };
        
        setConference(conferenceData);
      }
    } catch (error) {
      console.error('Failed to load conference:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Section>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading conference details...</p>
          </div>
        </Section>
      </PageContainer>
    );
  }

  if (!conference) {
    return (
      <PageContainer>
        <Section>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Conference Not Found</h1>
            <p className="text-gray-600">The conference you're looking for doesn't exist.</p>
          </div>
        </Section>
      </PageContainer>
    );
  }

  const startDate = new Date(conference.start_date);
  const endDate = new Date(conference.end_date);
  const isUpcoming = startDate > new Date();

  return (
    <PageContainer>
      {/* Hero Section */}
      <Section className="relative overflow-hidden">
        {/* Background with gradient */}
        {conference && (conference as any).cover_image ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
              style={{
                backgroundImage: `url(${(conference as any).cover_image})`,
                transform: 'scale(1.05)',
                filter: 'brightness(0.6) contrast(1.1) saturate(1.2)'
              }}
            ></div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800"></div>
          </>
        )}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-blue-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-purple-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>

        <div className="relative z-10 py-20">
          <div className="max-w-6xl mx-auto">
            <AnimatedSection animation="fade-up">
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="flex-1">
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {conference.categories.map((cat, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                        {cat.category.title}
                      </Badge>
                    ))}
                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                      <Star className="w-3 h-3 mr-1" />
                      Featured Conference
                    </Badge>
                  </div>

                  {/* Title */}
                  <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                    {conference.title}
                  </h1>

                  {/* Description */}
                  <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl">
                    {conference.description}
                  </p>

                  {/* Quick Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="flex items-center gap-3 text-white/90">
                      <Calendar className="h-5 w-5 text-blue-300" />
                      <div>
                        <p className="text-sm text-white/70">Date</p>
                        <p className="font-medium">{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <MapPin className="h-5 w-5 text-green-300" />
                      <div>
                        <p className="text-sm text-white/70">Location</p>
                        <p className="font-medium">{conference.address?.city}, {conference.address?.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Users className="h-5 w-5 text-purple-300" />
                      <div>
                        <p className="text-sm text-white/70">Capacity</p>
                        <p className="font-medium">{conference.capacity} attendees</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <DollarSign className="h-5 w-5 text-yellow-300" />
                      <div>
                        <p className="text-sm text-white/70">Price</p>
                        <p className="font-medium">${conference.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                      <Calendar className="w-5 h-5 mr-2" />
                      {isUpcoming ? 'Register Now' : 'View Details'}
                    </Button>
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <Share2 className="w-5 h-5 mr-2" />
                      Share Event
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                    >
                      <Bookmark className={`w-5 h-5 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white/30 text-white hover:bg-white/10"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                      {isLiked ? 'Liked' : 'Like'}
                    </Button>
                  </div>
                </div>

                {/* Conference Stats Card */}
                <div className="w-full lg:w-80">
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Conference Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Duration</span>
                        <span className="text-white font-medium">
                          {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Speakers</span>
                        <span className="text-white font-medium">{conference.speakers.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Sponsors</span>
                        <span className="text-white font-medium">{conference.sponsors.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Status</span>
                        <Badge variant={conference.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                          {conference.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* Main Content */}
      <Section className="py-16">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="speakers">Speakers</TabsTrigger>
              <TabsTrigger value="agenda">Agenda</TabsTrigger>
              <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                  {/* About Conference */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        About This Conference
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {conference.description}
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        This conference brings together industry leaders, researchers, and practitioners to share knowledge, 
                        discuss challenges, and explore innovative solutions in petroleum engineering. Join us for an 
                        enriching experience filled with insightful presentations, networking opportunities, and hands-on workshops.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Key Topics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Enhanced Oil Recovery', 'Digital Transformation', 'Environmental Sustainability', 'Advanced Drilling Technologies', 'Reservoir Management', 'Industry 4.0 Applications'].map((topic, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Event Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Date & Time</p>
                          <p className="text-sm text-gray-600">
                            {startDate.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {startDate.toLocaleTimeString()} - {endDate.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Venue</p>
                          <p className="text-sm text-gray-600">{conference.address?.title}</p>
                          <p className="text-sm text-gray-600">{conference.address?.line_1}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Expected Attendance</p>
                          <p className="text-sm text-gray-600">{conference.capacity} professionals</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* What's Included */}
                  <Card>
                    <CardHeader>
                      <CardTitle>What's Included</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { icon: Coffee, text: "Welcome coffee & refreshments" },
                        { icon: BookOpen, text: "Conference materials & proceedings" },
                        { icon: Wifi, text: "High-speed WiFi access" },
                        { icon: Car, text: "Parking facilities" },
                        { icon: Camera, text: "Professional photography" },
                        { icon: Trophy, text: "Certificate of attendance" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{item.text}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Speakers Tab */}
            <TabsContent value="speakers" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conference.speakers.map((speaker) => (
                  <Card key={speaker.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="text-center">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={speaker.picture} alt={speaker.name} />
                        <AvatarFallback>{speaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <CardTitle className="text-lg">{speaker.name}</CardTitle>
                      <CardDescription>{speaker.title}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{speaker.bio}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">Expertise:</span>
                          <span className="text-sm text-gray-600">{speaker.expertise}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Institution:</span>
                          <span className="text-sm text-gray-600">{speaker.institution}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {speaker.linkedin && (
                          <Button size="sm" variant="outline">
                            <Globe className="h-4 w-4" />
                          </Button>
                        )}
                        {speaker.twitter && (
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Agenda Tab */}
            <TabsContent value="agenda" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Conference Agenda</CardTitle>
                  <CardDescription>Detailed schedule of events and sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conference.agenda.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-24">
                          <p className="text-sm font-medium text-blue-600">{item.time}</p>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge variant={
                              item.type === 'keynote' ? 'default' :
                              item.type === 'presentation' ? 'secondary' :
                              item.type === 'panel' ? 'destructive' :
                              'outline'
                            }>
                              {item.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{item.speaker}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {item.type === 'keynote' && <Mic className="h-5 w-5 text-blue-500" />}
                          {item.type === 'presentation' && <Play className="h-5 w-5 text-green-500" />}
                          {item.type === 'panel' && <Users className="h-5 w-5 text-purple-500" />}
                          {item.type === 'break' && <Coffee className="h-5 w-5 text-orange-500" />}
                          {item.type === 'networking' && <MessageCircle className="h-5 w-5 text-indigo-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sponsors Tab */}
            <TabsContent value="sponsors" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Our Sponsors</CardTitle>
                  <CardDescription>Thank you to our valued partners and sponsors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {conference.sponsors.map((sponsor) => (
                      <Card key={sponsor.id} className="text-center hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                            <img src={sponsor.logo} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <h4 className="font-medium mb-2">{sponsor.name}</h4>
                          <Button size="sm" variant="outline" asChild>
                            <a href={sponsor.website} target="_blank" rel="noopener noreferrer">
                              Visit Website
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Section>
    </PageContainer>
  );
}
