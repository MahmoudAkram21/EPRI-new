export type UserRole =
    | 'SUPER_ADMIN'
    | 'ADMIN'
    | 'EMPLOYEE'
    | 'DEPARTMENT_MANAGER'
    | 'GUEST'
    | 'INSTRUCTOR';

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: UserRole;
    is_verified: boolean;
    department_id?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

export interface AdminPermission {
    id: string;
    admin_id: string;
    resource: string;
    can_view: boolean;
    can_create: boolean;
    can_edit: boolean;
    can_delete: boolean;
    can_approve: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface Employee {
    id: string;
    user_id: string;
    employee_number?: string;
    hire_date?: Date;
    position?: { en: string; ar: string };
    salary?: number;
    contract_type?: 'full_time' | 'part_time' | 'contractor';
    emergency_contact?: {
        name: string;
        phone: string;
        relation: string;
    };
}

export interface DepartmentManagerInfo {
    id: string;
    user_id: string;
    manager_since?: Date;
    responsibilities?: { en: string; ar: string };
    qualifications?: string[];
    performance_metrics?: Record<string, any>;
    budget_authority?: number;
}
