// Service-related interfaces and types
export interface Service {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  category: string;
  icon?: string;
  features: string[] | string;
  duration?: string;
  price: number;
  isFree?: boolean;
  is_free?: boolean;
  is_featured?: boolean;
  is_published?: boolean;
  group_name?: string;
  group_order?: number;
  equipment?: ServiceEquipment[];
  centerHead?: ServiceCenterHead;
  center_head?: ServiceCenterHead;
  center_head_id?: string;
  tabs?: ServiceTab[];
  created_at?: string;
  updated_at?: string;
}

export interface ServiceEquipment {
  id: string;
  name: string;
  description?: string;
  image?: string;
  specifications?: string[] | Record<string, unknown> | null;
}

export interface ServiceCenterHead {
  id: string;
  name: string;
  title: string;
  picture?: string;
  bio?: string;
  email?: string;
  phone?: string;
  expertise?: string[];
}

export interface ServiceTab {
  id: string;
  serviceId: string;
  title: string;
  content: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

// Service creation/update types
export interface CreateServiceData {
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  category: string;
  icon?: string;
  features?: string[];
  center_head_id?: string;
  duration?: string;
  price?: number;
  is_free?: boolean;
  is_featured?: boolean;
  is_published?: boolean;
  group_name?: string;
  group_order?: number;
  tabs?: Array<{
    title: string;
    content: string;
    order_index: number;
  }>;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {}

// Service API response types
export interface ServicesResponse {
  services: Service[];
  total: number;
}

export interface ServiceResponse {
  service: Service;
}

export interface ServiceCenterHeadsResponse {
  centerHeads: ServiceCenterHead[];
  total: number;
}

// Service constants
export const SERVICE_CATEGORIES = [
  'Laboratory Services',
  'Engineering Services',
  'Environmental Services',
  'Exploration Services',
  'Protection Services',
  'Materials Services',
  'Inspection Services',
  'Technical Services'
] as const;

export type ServiceCategoryType = typeof SERVICE_CATEGORIES[number];