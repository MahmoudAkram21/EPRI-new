// API client for communicating with the backend
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-erpi.developteam.site:5001/api';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get current locale from localStorage or default to 'en'
    const locale = typeof window !== 'undefined' 
      ? (localStorage.getItem('locale') || 'en')
      : 'en';
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale,
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Generic HTTP methods
  async get<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Auth endpoints
  async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }) {
    const response = await this.request<{
      message: string;
      token: string;
      user: any;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.removeToken();
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async verifyToken() {
    return this.request('/auth/verify');
  }

  // Events endpoints
  async getEvents(params?: {
    status?: string;
    featured?: boolean;
    registration_open?: boolean;
    category?: string;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    
    return this.request(endpoint);
  }

  // Courses endpoints
  async getCourses(params?: {
    category?: string;
    level?: string;
    delivery_type?: string;
    is_featured?: boolean;
    is_published?: boolean;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/courses?${queryString}` : '/courses';
    
    return this.request(endpoint);
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`);
  }

  // Department & Sections endpoints
  async getDepartmentSections(): Promise<{ sections: Array<{ id: string; name: string; slug: string; order_index: number; departments_count: number }> }> {
    return this.request('/department-sections');
  }

  async getDepartments(params?: { sectionId?: string }): Promise<{ departments: Array<{ id: string; name: string; description?: string; image?: string; icon?: string; section_id?: string }> }> {
    const query = params?.sectionId ? `?sectionId=${encodeURIComponent(params.sectionId)}` : '';
    return this.request(`/departments${query}`);
  }

  async getServiceCenters(params?: { featured?: boolean }): Promise<{ centers: any[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.featured !== undefined) {
      queryParams.append('featured', String(params.featured));
    }
    const query = queryParams.toString();
    return this.request(query ? `/service-centers?${query}` : '/service-centers');
  }

  async getServiceCenter(slug: string, options?: { preview?: boolean }): Promise<{ center: any }> {
    const query = options?.preview ? `?preview=${options.preview}` : '';
    return this.request(`/service-centers/${slug}${query}`);
  }

  async getDepartment(id: string): Promise<{ department: any }> {
    return this.request(`/departments/${id}`);
  }

  async getStaff(id: string): Promise<{ staff: any }> {
    return this.request(`/staff/${id}`);
  }

  async getEvent(id: string) {
    return this.request(`/events/${id}`);
  }

  async createEvent(eventData: any) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Admin API methods
  async getAdminEvents(): Promise<{ events: any[], total: number }> {
    return this.request<{ events: any[], total: number }>('/admin/events');
  }

  async getAdminUsers(): Promise<{ users: any[], total: number }> {
    return this.request<{ users: any[], total: number }>('/admin/users');
  }

  async getAdminEventRequests(): Promise<{ requests: any[], total: number }> {
    return this.request<{ requests: any[], total: number }>('/admin/event-requests');
  }

  async getAdminStats(): Promise<{ stats: any }> {
    return this.request<{ stats: any }>('/admin/stats');
  }

  async createAdminEvent(eventData: any): Promise<{ message: string, event: any }> {
    return this.request<{ message: string, event: any }>('/admin/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateAdminEvent(id: string, eventData: any): Promise<{ message: string, event: any }> {
    return this.request<{ message: string, event: any }>(`/admin/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteAdminEvent(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/events/${id}`, {
      method: 'DELETE',
    });
  }

  async updateAdminUserRole(id: string, role: string): Promise<{ message: string, user: any }> {
    return this.request<{ message: string, user: any }>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async updateAdminUserVerification(id: string, is_verified: boolean): Promise<{ message: string, user: any }> {
    return this.request<{ message: string, user: any }>(`/admin/users/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ is_verified }),
    });
  }

  async removeUserPlan(id: string): Promise<{ message: string, user: any }> {
    return this.request<{ message: string, user: any }>(`/admin/users/${id}/plan`, {
      method: 'DELETE',
    });
  }

  async stopUserTrial(id: string): Promise<{ message: string, user: any }> {
    return this.request<{ message: string, user: any }>(`/admin/users/${id}/trial`, {
      method: 'DELETE',
    });
  }

  async createAdminUser(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    phone?: string;
    role?: string;
    is_verified?: boolean;
  }): Promise<{ message: string, user: any }> {
    return this.request<{ message: string, user: any }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateAdminUser(id: string, userData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
    phone?: string;
    role?: string;
    is_verified?: boolean;
  }): Promise<{ message: string, user: any }> {
    return this.request<{ message: string, user: any }>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getAdminUser(id: string): Promise<{ user: any }> {
    return this.request<{ user: any }>(`/admin/users/${id}`);
  }

  async deleteAdminUser(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Departments API methods
  async getAdminDepartments(): Promise<{ departments: any[], total: number }> {
    return this.request<{ departments: any[], total: number }>('/admin/departments');
  }

  async getAdminDepartment(id: string): Promise<{ department: any }> {
    return this.request<{ department: any }>(`/admin/departments/${id}`);
  }

  async createAdminDepartment(departmentData: {
    name: string;
    description?: string;
    image?: string;
    icon?: string;
    section_id?: string;
    manager_id?: string;
  }): Promise<{ message: string, department: any }> {
    return this.request<{ message: string, department: any }>('/admin/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData),
    });
  }

  async updateAdminDepartment(id: string, departmentData: {
    name?: string;
    description?: string;
    image?: string;
    icon?: string;
    section_id?: string;
    manager_id?: string;
  }): Promise<{ message: string, department: any }> {
    return this.request<{ message: string, department: any }>(`/admin/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(departmentData),
    });
  }

  async deleteAdminDepartment(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/departments/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Department Sections API methods
  async getAdminDepartmentSections(): Promise<{ sections: any[], total: number }> {
    return this.request<{ sections: any[], total: number }>('/admin/department-sections');
  }

  async getAdminDepartmentSection(id: string): Promise<{ section: any }> {
    return this.request<{ section: any }>(`/admin/department-sections/${id}`);
  }

  async createAdminDepartmentSection(sectionData: {
    name: string;
    slug?: string;
    order_index?: number;
  }): Promise<{ message: string, section: any }> {
    return this.request<{ message: string, section: any }>('/admin/department-sections', {
      method: 'POST',
      body: JSON.stringify(sectionData),
    });
  }

  async updateAdminDepartmentSection(id: string, sectionData: {
    name?: string;
    slug?: string;
    order_index?: number;
  }): Promise<{ message: string, section: any }> {
    return this.request<{ message: string, section: any }>(`/admin/department-sections/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sectionData),
    });
  }

  async deleteAdminDepartmentSection(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/department-sections/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Staff API methods
  async getAdminStaff(): Promise<{ staff: any[], total: number }> {
    return this.request<{ staff: any[], total: number }>('/admin/staff');
  }

  async getAdminStaffMember(id: string): Promise<{ staff: any }> {
    return this.request<{ staff: any }>(`/admin/staff/${id}`);
  }

  async createAdminStaff(staffData: {
    name: string;
    title: string;
    academic_position?: string;
    current_admin_position?: string;
    ex_admin_position?: string;
    scientific_name?: string;
    picture?: string;
    gallery?: string[];
    bio?: string;
    research_interests?: string;
    news?: string;
    email?: string;
    alternative_email?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    google_scholar?: string;
    research_gate?: string;
    academia_edu?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    google_plus?: string;
    youtube?: string;
    wordpress?: string;
    instagram?: string;
    mendeley?: string;
    zotero?: string;
    evernote?: string;
    orcid?: string;
    scopus?: string;
    publications_count?: number;
    papers_count?: number;
    abstracts_count?: number;
    courses_files_count?: number;
    inlinks_count?: number;
    external_links_count?: number;
    faculty?: string;
    department?: string;
    office_location?: string;
    office_hours?: string;
  }): Promise<{ message: string, staff: any }> {
    return this.request<{ message: string, staff: any }>('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  }

  async updateAdminStaff(id: string, staffData: {
    name?: string;
    title?: string;
    academic_position?: string;
    current_admin_position?: string;
    ex_admin_position?: string;
    scientific_name?: string;
    picture?: string;
    bio?: string;
    research_interests?: string;
    news?: string;
    email?: string;
    alternative_email?: string;
    phone?: string;
    mobile?: string;
    website?: string;
    office_location?: string;
    office_hours?: string;
    faculty?: string;
    department?: string;
    // Social media and academic links
    google_scholar?: string;
    research_gate?: string;
    academia_edu?: string;
    linkedin?: string;
    facebook?: string;
    twitter?: string;
    google_plus?: string;
    youtube?: string;
    wordpress?: string;
    instagram?: string;
    mendeley?: string;
    zotero?: string;
    evernote?: string;
    orcid?: string;
    scopus?: string;
    // Publication stats
    publications_count?: number;
    papers_count?: number;
    abstracts_count?: number;
    courses_files_count?: number;
    inlinks_count?: number;
    external_links_count?: number;
  }): Promise<{ message: string, staff: any }> {
    return this.request<{ message: string, staff: any }>(`/admin/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    });
  }

  async deleteAdminStaff(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/staff/${id}`, {
      method: 'DELETE',
    });
  }

  // Department Staff Assignment API methods
  async getDepartmentStaff(departmentId: string): Promise<{ staff: any[], total: number }> {
    return this.request<{ staff: any[], total: number }>(`/admin/departments/${departmentId}/staff`);
  }

  async assignDepartmentStaff(departmentId: string, staffIds: string[]): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/departments/${departmentId}/staff`, {
      method: 'POST',
      body: JSON.stringify({ staffIds }),
    });
  }

  async removeDepartmentStaff(departmentId: string, staffId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/departments/${departmentId}/staff/${staffId}`, {
      method: 'DELETE',
    });
  }

  // Laboratory API methods
  async getLaboratories(params?: {
    departmentId?: string;
    sectionId?: string;
  }): Promise<{ laboratories: any[] }> {
    const queryParams = new URLSearchParams();
    if (params?.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params?.sectionId) queryParams.append('sectionId', params.sectionId);
    
    const endpoint = `/laboratories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ laboratories: any[] }>(endpoint);
  }

  async getLaboratory(id: string): Promise<{ laboratory: any }> {
    return this.request<{ laboratory: any }>(`/laboratories/${id}`);
  }

  // Admin Laboratory API methods
  async getAdminLaboratories(params?: {
    departmentId?: string;
    sectionId?: string;
    search?: string;
  }): Promise<{ laboratories: any[] }> {
    const queryParams = new URLSearchParams();
    if (params?.departmentId) queryParams.append('departmentId', params.departmentId);
    if (params?.sectionId) queryParams.append('sectionId', params.sectionId);
    if (params?.search) queryParams.append('search', params.search);
    
    const endpoint = `/admin/laboratories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ laboratories: any[] }>(endpoint);
  }

  async createLaboratory(laboratoryData: {
    name: string;
    description?: string;
    image?: string;
    // Head information
    head_name?: string;
    head_title?: string;
    head_academic_title?: string;
    head_picture?: string;
    head_cv_url?: string;
    head_email?: string;
    head_bio?: string;
    // Contact information
    address?: string;
    phone?: string;
    alternative_phone?: string;
    fax?: string;
    email?: string;
    website?: string;
    // Laboratory details
    established_year?: number;
    facilities?: string;
    equipment_list?: string;
    research_areas?: string;
    services_offered?: string;
    staff_count?: number;
    students_count?: number;
    // Organizational info
    department_id?: string;
    section_id?: string;
    building?: string;
    floor?: string;
    room_numbers?: string;
    // Status
    is_active?: boolean;
    is_featured?: boolean;
    display_order?: number;
  }): Promise<{ message: string; laboratory: any }> {
    return this.request<{ message: string; laboratory: any }>('/admin/laboratories', {
      method: 'POST',
      body: JSON.stringify(laboratoryData),
    });
  }

  async updateLaboratory(id: string, laboratoryData: {
    name?: string;
    description?: string;
    image?: string;
    head_name?: string;
    head_title?: string;
    head_academic_title?: string;
    head_picture?: string;
    head_cv_url?: string;
    head_email?: string;
    head_bio?: string;
    address?: string;
    phone?: string;
    alternative_phone?: string;
    fax?: string;
    email?: string;
    website?: string;
    established_year?: number;
    facilities?: string;
    equipment_list?: string;
    research_areas?: string;
    services_offered?: string;
    staff_count?: number;
    students_count?: number;
    department_id?: string;
    section_id?: string;
    building?: string;
    floor?: string;
    room_numbers?: string;
    is_active?: boolean;
    is_featured?: boolean;
    display_order?: number;
  }): Promise<{ message: string; laboratory: any }> {
    return this.request<{ message: string; laboratory: any }>(`/admin/laboratories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(laboratoryData),
    });
  }

  async deleteLaboratory(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/laboratories/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Services API
  async getAdminServices(): Promise<{ services: any[], total: number }> {
    return this.request<{ services: any[], total: number }>('/admin/services');
  }

  async getAdminServiceCenters(params?: { includeHidden?: boolean; featured?: boolean }): Promise<{ centers: any[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.includeHidden !== undefined) {
      queryParams.append('includeHidden', String(params.includeHidden));
    }
    if (params?.featured !== undefined) {
      queryParams.append('featured', String(params.featured));
    }
    const query = queryParams.toString();
    return this.request<{ centers: any[]; total: number }>(query ? `/admin/service-centers?${query}` : '/admin/service-centers');
  }

  async getAdminServiceCenter(id: string): Promise<{ center: any }> {
    return this.request<{ center: any }>(`/admin/service-centers/${id}`);
  }

  async createAdminServiceCenter(centerData: any): Promise<{ message: string; center: any }> {
    return this.request<{ message: string; center: any }>('/admin/service-centers', {
      method: 'POST',
      body: JSON.stringify(centerData),
    });
  }

  async updateAdminServiceCenter(id: string, centerData: any): Promise<{ message: string; center: any }> {
    return this.request<{ message: string; center: any }>(`/admin/service-centers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(centerData),
    });
  }

  async deleteAdminServiceCenter(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/service-centers/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminService(id: string): Promise<{ service: any }> {
    return this.request<{ service: any }>(`/admin/services/${id}`);
  }

  async createAdminService(serviceData: {
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
  }): Promise<{ service: any }> {
    return this.request<{ service: any }>('/admin/services', {
      method: 'POST',
      body: JSON.stringify({
        ...serviceData,
        features: JSON.stringify(serviceData.features || []),
        price: serviceData.price || 0,
        is_free: serviceData.is_free ?? false,
        is_featured: serviceData.is_featured ?? false,
        is_published: serviceData.is_published ?? true,
        group_order: serviceData.group_order || 0,
        tabs: serviceData.tabs || [],
        center_head_id: serviceData.center_head_id === 'none' ? null : serviceData.center_head_id
      })
    });
  }

  async updateAdminService(id: string, serviceData: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    category?: string;
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
  }): Promise<{ service: any }> {
    return this.request<{ service: any }>(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...serviceData,
        features: serviceData.features ? JSON.stringify(serviceData.features) : undefined,
        tabs: serviceData.tabs || [],
        center_head_id: serviceData.center_head_id === 'none' ? null : serviceData.center_head_id
      })
    });
  }

  async deleteAdminService(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/services/${id}`, {
      method: 'DELETE',
    });
  }

  // Service Center Heads API
  async getServiceCenterHeads(): Promise<{ centerHeads: any[], total: number }> {
    return this.request<{ centerHeads: any[], total: number }>('/service-center-heads');
  }

  // Products API (Public)
  async getProducts(params?: {
    service_center_id?: string;
    category?: string;
    featured?: boolean;
    published?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ products: any[], total: number, limit?: number, offset?: number }> {
    const queryParams = new URLSearchParams();
    if (params?.service_center_id) queryParams.append('service_center_id', params.service_center_id);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', String(params.featured));
    if (params?.published !== undefined) queryParams.append('published', String(params.published));
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    const query = queryParams.toString();
    return this.request<{ products: any[], total: number, limit?: number, offset?: number }>(
      `/products${query ? `?${query}` : ''}`
    );
  }

  async getProduct(id: string): Promise<{ product: any }> {
    return this.request<{ product: any }>(`/products/${id}`);
  }

  async getProductBySlug(slug: string): Promise<{ product: any }> {
    return this.request<{ product: any }>(`/products/slug/${slug}`);
  }

  // Admin Products API
  async getAdminProducts(params?: {
    service_center_id?: string;
    category?: string;
    featured?: boolean;
    published?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ products: any[], total: number, limit?: number, offset?: number }> {
    const queryParams = new URLSearchParams();
    if (params?.service_center_id) queryParams.append('service_center_id', params.service_center_id);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.featured !== undefined) queryParams.append('featured', String(params.featured));
    if (params?.published !== undefined) queryParams.append('published', String(params.published));
    if (params?.search) queryParams.append('search', params.search);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));
    
    const query = queryParams.toString();
    return this.request<{ products: any[], total: number, limit?: number, offset?: number }>(
      `/admin/products${query ? `?${query}` : ''}`
    );
  }

  async getAdminProduct(id: string): Promise<{ product: any }> {
    return this.request<{ product: any }>(`/admin/products/${id}`);
  }

  async createAdminProduct(productData: {
    name: string | { en: string; ar: string };
    description?: string | { en: string; ar: string };
    short_description?: string | { en: string; ar: string };
    image?: string;
    images?: string[];
    price?: number;
    original_price?: number;
    category?: string;
    tags?: string[];
    specifications?: any;
    features?: string[];
    sizes?: string[];
    stock_quantity?: number;
    sku?: string;
    is_featured?: boolean;
    is_published?: boolean;
    is_available?: boolean;
    order_index?: number;
    service_center_id?: string;
  }): Promise<{ message: string, product: any }> {
    return this.request<{ message: string, product: any }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateAdminProduct(id: string, productData: {
    name?: string | { en: string; ar: string };
    description?: string | { en: string; ar: string };
    short_description?: string | { en: string; ar: string };
    image?: string;
    images?: string[];
    price?: number;
    original_price?: number;
    category?: string;
    tags?: string[];
    specifications?: any;
    features?: string[];
    sizes?: string[];
    stock_quantity?: number;
    sku?: string;
    is_featured?: boolean;
    is_published?: boolean;
    is_available?: boolean;
    order_index?: number;
    service_center_id?: string;
  }): Promise<{ message: string, product: any }> {
    return this.request<{ message: string, product: any }>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteAdminProduct(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Public Services API
  async getServices(): Promise<{ services: any[], total: number }> {
    return this.request<{ services: any[], total: number }>('/services');
  }

  async getISOCertificates(): Promise<{ certificates: any[], total: number }> {
    return this.request<{ certificates: any[], total: number }>('/iso-certificates');
  }

  async getService(id: string): Promise<{ service: any }> {
    return this.request<{ service: any }>(`/services/${id}`);
  }

  // ============================================================================
  // ADMIN COURSES API METHODS
  // ============================================================================

  // Admin Courses
  async getAdminCourses(params?: {
    search?: string;
    category?: string;
    level?: string;
    delivery_type?: string;
  }): Promise<{ courses: any[], total: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/courses?${queryString}` : '/admin/courses';
    
    return this.request<{ courses: any[], total: number }>(endpoint);
  }

  async getAdminCourse(id: string): Promise<{ course: any }> {
    return this.request<{ course: any }>(`/admin/courses/${id}`);
  }

  async createAdminCourse(courseData: {
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    instructor_name?: string;
    category: string;
    price?: number;
    is_free?: boolean;
    duration_hours?: number;
    duration_weeks?: number;
    level: string;
    language?: string;
    max_students?: number;
    is_published?: boolean;
    is_featured?: boolean;
    delivery_type: string;
    meeting_location?: string;
    room_number?: string;
    building?: string;
    address?: string;
    zoom_link?: string;
    meeting_id?: string;
    meeting_passcode?: string;
    platform?: string;
    start_date?: string;
    end_date?: string;
    schedule_info?: string;
    time_zone?: string;
    objectives?: string[];
    requirements?: string[];
  }): Promise<{ message: string, course: any }> {
    return this.request<{ message: string, course: any }>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateAdminCourse(id: string, courseData: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    instructor_name?: string;
    category?: string;
    price?: number;
    is_free?: boolean;
    duration_hours?: number;
    duration_weeks?: number;
    level?: string;
    language?: string;
    max_students?: number;
    is_published?: boolean;
    is_featured?: boolean;
    delivery_type?: string;
    meeting_location?: string;
    room_number?: string;
    building?: string;
    address?: string;
    zoom_link?: string;
    meeting_id?: string;
    meeting_passcode?: string;
    platform?: string;
    start_date?: string;
    end_date?: string;
    schedule_info?: string;
    time_zone?: string;
    objectives?: string[];
    requirements?: string[];
  }): Promise<{ message: string, course: any }> {
    return this.request<{ message: string, course: any }>(`/admin/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  }

  async deleteAdminCourse(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Course Lessons
  async getAdminCourseLessons(courseId: string): Promise<{ lessons: any[], course: { id: string, title: string } }> {
    return this.request<{ lessons: any[], course: { id: string, title: string } }>(`/admin/courses/${courseId}/lessons`);
  }

  async createAdminLesson(courseId: string, lessonData: {
    title: string;
    description?: string;
    content?: string;
    video_url?: string;
    video_type?: string;
    video_id?: string;
    duration?: number;
    order_index?: number;
    is_free?: boolean;
    is_preview?: boolean;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
      size?: number;
    }>;
    quiz_data?: {
      questions: Array<{
        question: string;
        options: string[];
        correct_answer: number;
        explanation?: string;
      }>;
      passing_score?: number;
      time_limit?: number;
    };
    notes?: string;
  }): Promise<{ message: string, lesson: any }> {
    return this.request<{ message: string, lesson: any }>(`/admin/courses/${courseId}/lessons`, {
      method: 'POST',
      body: JSON.stringify(lessonData),
    });
  }

  async updateAdminLesson(id: string, lessonData: {
    title?: string;
    description?: string;
    content?: string;
    video_url?: string;
    video_type?: string;
    video_id?: string;
    duration?: number;
    order_index?: number;
    is_free?: boolean;
    is_preview?: boolean;
    attachments?: Array<{
      name: string;
      url: string;
      type: string;
      size?: number;
    }>;
    quiz_data?: {
      questions: Array<{
        question: string;
        options: string[];
        correct_answer: number;
        explanation?: string;
      }>;
      passing_score?: number;
      time_limit?: number;
    };
    notes?: string;
  }): Promise<{ message: string, lesson: any }> {
    return this.request<{ message: string, lesson: any }>(`/admin/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lessonData),
    });
  }

  async deleteAdminLesson(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/lessons/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin Course Orders
  async getAdminCourseOrders(params?: {
    payment_status?: string;
    course_id?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<{ orders: any[], total: number }> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/course-orders?${queryString}` : '/admin/course-orders';
    
    return this.request<{ orders: any[], total: number }>(endpoint);
  }

  async updateAdminCourseOrder(id: string, orderData: {
    payment_status?: string;
    verified_at?: string | null;
    notes?: string;
  }): Promise<{ message: string, order: any }> {
    return this.request<{ message: string, order: any }>(`/admin/course-orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  // Create multi-course order
  async createMultiCourseOrder(orderData: {
    courses: Array<{ course_id: string; price: number; currency: string }>;
    total_amount: number;
    currency: string;
    country?: string;
    payment_method: string;
  }): Promise<{ message: string; order: any }> {
    return this.request<{ message: string; order: any }>('/course-orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Visitor Stats Methods
  async trackVisit(sessionId: string, pagePath: string = '/'): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/visitor-stats/track', {
      method: 'POST',
      body: JSON.stringify({
        sessionId,
        pagePath
      }),
    });
  }

  async getVisitorStats(): Promise<{ success: boolean; data: VisitorStats }> {
    return this.request<{ success: boolean; data: VisitorStats }>('/visitor-stats/stats');
  }

  async generateSessionId(): Promise<{ success: boolean; sessionId: string }> {
    return this.request<{ success: boolean; sessionId: string }>('/visitor-stats/session');
  }

  async resetVisitorStats(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/visitor-stats/reset', {
      method: 'POST',
    });
  }

  // Hero Slider API Methods
  async getHeroSliders(): Promise<{ sliders: any[] }> {
    return this.request<{ sliders: any[] }>('/hero-sliders');
  }

  async getAdminHeroSliders(): Promise<{ sliders: any[] }> {
    return this.request<{ sliders: any[] }>('/admin/hero-sliders');
  }

  async getAdminHeroSlider(id: string): Promise<{ slider: any }> {
    return this.request<{ slider: any }>(`/admin/hero-sliders/${id}`);
  }

  async createAdminHeroSlider(sliderData: {
    media_type?: string;
    image?: string;
    video?: string;
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    description: { en: string; ar: string };
    cta: { en: string; ar: string };
    cta_link: string;
    badge: { en: string; ar: string };
    icon?: string;
    stats?: Array<{ value: string; label: { en: string; ar: string } }>;
    is_active?: boolean;
    order_index?: number;
  }): Promise<{ message: string; slider: any }> {
    return this.request<{ message: string; slider: any }>('/admin/hero-sliders', {
      method: 'POST',
      body: JSON.stringify({
        ...sliderData,
        title: JSON.stringify(sliderData.title),
        subtitle: JSON.stringify(sliderData.subtitle),
        description: JSON.stringify(sliderData.description),
        cta: JSON.stringify(sliderData.cta),
        badge: JSON.stringify(sliderData.badge),
        stats: sliderData.stats ? JSON.stringify(sliderData.stats) : null,
      }),
    });
  }

  async updateAdminHeroSlider(id: string, sliderData: {
    media_type?: string;
    image?: string;
    video?: string;
    title?: { en: string; ar: string };
    subtitle?: { en: string; ar: string };
    description?: { en: string; ar: string };
    cta?: { en: string; ar: string };
    cta_link?: string;
    badge?: { en: string; ar: string };
    icon?: string;
    stats?: Array<{ value: string; label: { en: string; ar: string } }>;
    is_active?: boolean;
    order_index?: number;
  }): Promise<{ message: string; slider: any }> {
    const payload: any = { ...sliderData };
    if (sliderData.title) payload.title = JSON.stringify(sliderData.title);
    if (sliderData.subtitle) payload.subtitle = JSON.stringify(sliderData.subtitle);
    if (sliderData.description) payload.description = JSON.stringify(sliderData.description);
    if (sliderData.cta) payload.cta = JSON.stringify(sliderData.cta);
    if (sliderData.badge) payload.badge = JSON.stringify(sliderData.badge);
    if (sliderData.stats) payload.stats = JSON.stringify(sliderData.stats);

    return this.request<{ message: string; slider: any }>(`/admin/hero-sliders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteAdminHeroSlider(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/hero-sliders/${id}`, {
      method: 'DELETE',
    });
  }

  // Page Content API Methods (Generic)
  async getPageContent(pageKey: string, sectionKey?: string): Promise<{ contents: any[] }> {
    const query = sectionKey ? `?sectionKey=${encodeURIComponent(sectionKey)}` : '';
    return this.request<{ contents: any[] }>(`/page-content/${pageKey}${query}`);
  }

  async getAdminPageContent(pageKey: string): Promise<{ contents: any[] }> {
    return this.request<{ contents: any[] }>(`/admin/page-content/${pageKey}`);
  }

  async createOrUpdateAdminPageContent(pageContentData: {
    page_key: string;
    section_key?: string;
    title?: { en: string; ar: string } | null;
    subtitle?: { en: string; ar: string } | null;
    description?: { en: string; ar: string } | null;
    content?: any;
    images?: string[];
    button_text?: { en: string; ar: string } | null;
    button_link?: string | null;
    is_active?: boolean;
    order_index?: number;
    metadata?: any;
  }): Promise<{ message: string; content: any }> {
    return this.request<{ message: string; content: any }>('/admin/page-content', {
      method: 'POST',
      body: JSON.stringify({
        ...pageContentData,
        title: pageContentData.title ? JSON.stringify(pageContentData.title) : null,
        subtitle: pageContentData.subtitle ? JSON.stringify(pageContentData.subtitle) : null,
        description: pageContentData.description ? JSON.stringify(pageContentData.description) : null,
        button_text: pageContentData.button_text ? JSON.stringify(pageContentData.button_text) : null,
        images: pageContentData.images ? JSON.stringify(pageContentData.images) : null,
        content: pageContentData.content ? JSON.stringify(pageContentData.content) : null,
        metadata: pageContentData.metadata ? JSON.stringify(pageContentData.metadata) : null,
      }),
    });
  }

  async updateAdminPageContent(id: string, pageContentData: {
    title?: { en: string; ar: string } | null;
    subtitle?: { en: string; ar: string } | null;
    description?: { en: string; ar: string } | null;
    content?: any;
    images?: string[];
    button_text?: { en: string; ar: string } | null;
    button_link?: string | null;
    is_active?: boolean;
    order_index?: number;
    metadata?: any;
  }): Promise<{ message: string; content: any }> {
    const payload: any = { ...pageContentData };
    if (pageContentData.title !== undefined) payload.title = pageContentData.title ? JSON.stringify(pageContentData.title) : null;
    if (pageContentData.subtitle !== undefined) payload.subtitle = pageContentData.subtitle ? JSON.stringify(pageContentData.subtitle) : null;
    if (pageContentData.description !== undefined) payload.description = pageContentData.description ? JSON.stringify(pageContentData.description) : null;
    if (pageContentData.button_text !== undefined) payload.button_text = pageContentData.button_text ? JSON.stringify(pageContentData.button_text) : null;
    if (pageContentData.images !== undefined) payload.images = pageContentData.images ? JSON.stringify(pageContentData.images) : null;
    if (pageContentData.content !== undefined) payload.content = pageContentData.content ? JSON.stringify(pageContentData.content) : null;
    if (pageContentData.metadata !== undefined) payload.metadata = pageContentData.metadata ? JSON.stringify(pageContentData.metadata) : null;

    return this.request<{ message: string; content: any }>(`/admin/page-content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteAdminPageContent(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/page-content/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export types for TypeScript
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  is_verified: boolean;
  department_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface VisitorStats {
  totalVisits: number;
  uniqueSessions: number;
  since: string;
  lastUpdated: string;
}
