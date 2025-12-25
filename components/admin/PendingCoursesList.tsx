'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseSubmission } from '@/types/course';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { CourseApprovalModal } from './CourseApprovalModal';

export function PendingCoursesList() {
    const t = useTranslations('admin');
    const [courses, setCourses] = useState<CourseSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingCourses();
    }, []);

    const fetchPendingCourses = async () => {
        try {
            const response = await fetch('/api/courses/pending', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setCourses(data.courses || []);
        } catch (error) {
            console.error('Error fetching pending courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (courseId: string) => {
        try {
            await fetch(`/api/courses/${courseId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            fetchPendingCourses(); // Refresh list
        } catch (error) {
            console.error('Error approving course:', error);
        }
    };

    const handleReject = async (courseId: string, reason: string) => {
        try {
            await fetch(`/api/courses/${courseId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rejection_reason: reason })
            });
            fetchPendingCourses(); // Refresh list
        } catch (error) {
            console.error('Error rejecting course:', error);
        }
    };

    const getTranslation = (value: any) => {
        if (typeof value === 'string') return value;
        return value?.en || value?.ar || '';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Clock className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <CardHeader className="px-0">
                <CardTitle className="text-2xl font-bold">Pending Course Approvals</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Review and approve courses submitted by department managers
                </p>
            </CardHeader>

            {courses.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-xl mb-2">No Pending Courses</h3>
                        <p className="text-muted-foreground">All courses have been reviewed</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {courses.map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-lg">{getTranslation(course.title)}</h3>
                                            <Badge variant="secondary">
                                                <Clock className="h-3 w-3 mr-1" />
                                                Pending
                                            </Badge>
                                        </div>

                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            {course.submitted_by && (
                                                <p>
                                                    Submitted by: {course.submitted_by.first_name} {course.submitted_by.last_name}
                                                </p>
                                            )}
                                            {course.department && (
                                                <p>Department: {getTranslation(course.department.name)}</p>
                                            )}
                                            <p>
                                                Submitted: {new Date(course.submitted_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleApprove(course.id)}
                                            variant="default"
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            Approve
                                        </Button>
                                        <Button
                                            onClick={() => setSelectedCourse(course.id)}
                                            variant="destructive"
                                            size="sm"
                                            className="gap-1"
                                        >
                                            <XCircle className="h-4 w-4" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <CourseApprovalModal
                courseId={selectedCourse || ''}
                isOpen={!!selectedCourse}
                onClose={() => setSelectedCourse(null)}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
}
