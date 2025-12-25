'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseSubmission } from '@/types/course';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MyCoursesSubmissions() {
    const [submissions, setSubmissions] = useState<CourseSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await fetch('/api/courses/my-submissions', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setSubmissions(data.courses || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="secondary" className="gap-1">
                        <Clock className="h-3 w-3" />
                        Pending Review
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3" />
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="destructive" className="gap-1">
                        <XCircle className="h-3 w-3" />
                        Rejected
                    </Badge>
                );
            default:
                return null;
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
                <CardTitle className="text-2xl font-bold">My Course Submissions</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Track the status of your submitted courses
                </p>
            </CardHeader>

            {submissions.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-xl mb-2">No Submissions Yet</h3>
                        <p className="text-muted-foreground">
                            Courses you submit for approval will appear here
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {submissions.map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-1">
                                                {getTranslation(course.title)}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Submitted: {new Date(course.submitted_at).toLocaleDateString()}
                                            </p>
                                            {course.approved_at && (
                                                <p className="text-sm text-muted-foreground">
                                                    {course.approval_status === 'approved' ? 'Approved' : 'Reviewed'}: {new Date(course.approved_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                        {getStatusBadge(course.approval_status)}
                                    </div>

                                    {course.rejection_reason && (
                                        <Alert variant="destructive">
                                            <XCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                <strong>Rejection Reason:</strong> {course.rejection_reason}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
