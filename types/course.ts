export type CourseApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Course {
    id: string;
    title: string | { en: string; ar: string };
    subtitle?: string | { en: string; ar: string };
    description?: string | { en: string; ar: string };
    image?: string;
    instructor_id?: string;
    instructor_name?: { en: string; ar: string };
    department_id?: string;
    category: string | { en: string; ar: string };
    price: number;
    is_free: boolean;
    duration_hours: number;
    duration_weeks: number;
    level: string | { en: string; ar: string };
    language: string | { en: string; ar: string };
    max_students: number;
    is_published: boolean;
    is_featured: boolean;

    // Approval Workflow Fields
    approval_status: CourseApprovalStatus;
    submitted_by_id?: string;
    approved_by_id?: string;
    submitted_at?: Date;
    approved_at?: Date;
    rejection_reason?: string;

    // Stats
    rating_average: number;
    rating_count: number;
    enrollment_count: number;

    created_at: Date;
    updated_at: Date;
}

export interface CourseSubmission {
    id: string;
    title: string | { en: string; ar: string };
    approval_status: CourseApprovalStatus;
    submitted_at: Date;
    approved_at?: Date;
    rejection_reason?: string;
    submitted_by?: {
        id: string;
        first_name: string;
        last_name: string;
    };
    department?: {
        id: string;
        name: string | { en: string; ar: string };
    };
}
