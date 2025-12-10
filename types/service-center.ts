export interface ServiceCenterChartPoint {
  label: string
  value: number
}

export interface ServiceCenterActivitySlice {
  label: string
  value: number
}

export interface ServiceCenterEquipment {
  id?: string
  name: string
  details?: string | null
  description?: string | null
  image?: string | null
  specifications?: unknown
}

export interface ServiceCenterProduct {
  name: string
  description?: string
}

export interface ServiceCenterService {
  name: string
  summary?: string
}

export interface ServiceCenterStaffMember {
  id: string
  name: string
  title?: string
  academic_position?: string
  current_admin_position?: string
  picture?: string
  bio?: string
  email?: string
  phone?: string
}

export interface ServiceCenterWorkVolume {
  totalIncomeRate?: number
  currency?: string
  dataPoints?: ServiceCenterChartPoint[]
}

export interface ServiceCenterActivity {
  totalProjects?: number
  activityMix?: ServiceCenterActivitySlice[]
}

export interface ServiceCenterMetrics {
  [key: string]: unknown
}

export interface ServiceCenter {
  id: string
  slug: string
  name: string
  type?: string // "center" or "unit"
  headline?: string | null
  description?: string | null
  image?: string | null
  banner_image?: string | null
  location?: string | null
  contact_phone?: string | null
  contact_email?: string | null
  equipments: ServiceCenterEquipment[]
  products: ServiceCenterProduct[]
  lab_methodology?: string | null
  work_volume?: ServiceCenterWorkVolume | null
  company_activity?: ServiceCenterActivity | null
  future_prospective?: string | null
  services: ServiceCenterService[]
  staff?: ServiceCenterStaffMember[]
  metrics?: ServiceCenterMetrics | null
  gallery?: string[] | null
  is_featured: boolean
  is_published: boolean
  order_index: number
  created_at?: string
  updated_at?: string
}

