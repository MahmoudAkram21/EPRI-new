// API client for communicating with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-erpi.developteam.site:5001/api';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

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
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
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

  // Public Services API
  async getServices(): Promise<{ services: any[], total: number }> {
    return this.request<{ services: any[], total: number }>('/services');
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
