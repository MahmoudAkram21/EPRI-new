'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useUser } from '@/contexts/user-context';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Award,
  Plus,
  Edit,
  Eye,
  Building2,
  GraduationCap,
  BarChart3,
  ShoppingCart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

type TranslationObject = { en: string; ar: string } | string;

function getTranslation(value: TranslationObject | undefined, locale: string): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    return value[locale as 'en' | 'ar'] || value.en || '';
  }
  return '';
}

interface Course {
  id: string;
  title: TranslationObject;
  subtitle?: TranslationObject;
  description?: TranslationObject;
  category: TranslationObject | string;
  price: number;
  is_free: boolean;
  duration_hours: number;
  level: TranslationObject | string;
  is_published: boolean;
  is_featured: boolean;
  enrollment_count: number;
  rating_average: number;
  department_id?: string;
  created_at: string;
}

interface Department {
  id: string;
  name: TranslationObject;
  description?: TranslationObject;
  image?: string;
  icon?: string;
}

export default function DepartmentDashboardPage() {
  const locale = useLocale();
  const t = useTranslations('departmentDashboard');
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<Department | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalEnrollments: 0,
    averageRating: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'DEPARTMENT_MANAGER') {
      router.push('/dashboard');
      return;
    }

    // If department_id is not loaded, try to refresh user data first
    if (!user.department_id) {
      const refreshUser = async () => {
        try {
          const userData = await apiClient.getProfile() as { user: any };
          if (userData.user?.department_id) {
            // Wait a bit for context to update, then reload
            setTimeout(() => {
              loadDepartmentData();
            }, 1000);
            return;
          }
        } catch (error) {
          console.error('Error refreshing user:', error);
        }
        
        // If still no department_id, show helpful error
        toast({
          title: t('departmentAssignmentRequired'),
          description: t('notAssigned'),
          variant: 'destructive',
        });
        setLoading(false);
      };
      
      refreshUser();
      return;
    }

    loadDepartmentData();
  }, [user, router]);

  const loadDepartmentData = async () => {
    try {
      setLoading(true);
      
      if (!user?.department_id) {
        toast({
          title: t('departmentAssignmentRequired'),
          description: t('contactAdministrator'),
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      // Load department info
      try {
        const deptResponse = await apiClient.getAdminDepartment(user.department_id);
        if (deptResponse.department) {
          setDepartment(deptResponse.department);
        } else {
          throw new Error('Department not found');
        }
      } catch (error: any) {
        console.error('Error loading department:', error);
        toast({
          title: t('departmentNotFound'),
          description: error.message || t('unableToLoad'),
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Load department courses (API already filters by department for department managers)
      const coursesResponse = await apiClient.getAdminCourses();
      const allCourses = coursesResponse.courses || [];
      // Filter by department_id if present, otherwise all courses are for this department
      const deptCourses = allCourses.filter(
        (course: any) => !course.department_id || course.department_id === user?.department_id
      );
      setCourses(deptCourses);

      // Calculate stats
      const totalCourses = deptCourses.length;
      const publishedCourses = deptCourses.filter((c: Course) => c.is_published).length;
      const totalEnrollments = deptCourses.reduce((sum: number, c: Course) => sum + (c.enrollment_count || 0), 0);
      const avgRating = deptCourses.length > 0
        ? deptCourses.reduce((sum: number, c: Course) => sum + (c.rating_average || 0), 0) / deptCourses.length
        : 0;

      setStats({
        totalCourses,
        publishedCourses,
        totalEnrollments,
        averageRating: avgRating,
      });
    } catch (error: any) {
      console.error('Error loading department data:', error);
      toast({
        title: t('error'),
        description: error.message || t('failedToLoad'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('departmentNotFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            {getTranslation(department.name, locale)}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('title')}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/department/courses">
            <Plus className="mr-2 h-4 w-4" />
            {t('manageCourses')}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalCourses')}</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedCourses} {t('published')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalEnrollments')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              {t('acrossAllCourses')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('averageRating')}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('courseRatings')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('departmentStatus')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{t('active')}</div>
            <p className="text-xs text-muted-foreground">
              {t('allSystemsOperational')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('departmentCourses')}</CardTitle>
              <CardDescription>
                {t('manageViewCourses')}
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/department/courses">
                <Plus className="mr-2 h-4 w-4" />
                {t('addCourse')}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t('noCoursesFound')}</p>
              <Button asChild>
                <Link href="/dashboard/department/courses">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('createFirstCourse')}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {getTranslation(course.title, locale)}
                      </h3>
                      <Badge variant={course.is_published ? 'default' : 'secondary'}>
                        {course.is_published ? t('published') : t('draft')}
                      </Badge>
                      {course.is_featured && (
                        <Badge variant="outline">{t('featured')}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {getTranslation(course.level, locale)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {course.duration_hours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {course.enrollment_count || 0} {t('enrollments')}
                      </span>
                      {course.rating_average > 0 && (
                        <span className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {course.rating_average.toFixed(1)} ⭐
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/department/courses/${course.id}/lessons`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/department/courses`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quickActions')}</CardTitle>
          <CardDescription>{t('commonTasks')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/dashboard/department/courses">
                <Plus className="h-6 w-6 mb-2" />
                <span>{t('createNewCourse')}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/admin/departments">
                <Building2 className="h-6 w-6 mb-2" />
                <span>{t('viewDepartment')}</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col">
              <Link href="/admin/staff">
                <Users className="h-6 w-6 mb-2" />
                <span>{t('manageStaff')}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

