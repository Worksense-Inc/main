export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ msg: string; param?: string }>;
}

const API_BASE: string = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export const setAuthToken = (token?: string) => {
  if (token) localStorage.setItem('auth_token', token);
  else localStorage.removeItem('auth_token');
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>);
};

type ApiRequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

async function request<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method,
    headers,
    body: options.body,
  });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json() : undefined;

  if (!res.ok) {
    return (
      body || {
        success: false,
        message: `Request failed with status ${res.status}`,
      }
    );
  }

  return body as ApiResponse<T>;
}

export interface UserDto {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'manager' | 'employee';
}

export interface ShiftDto {
  id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  position: string;
  status: 'scheduled' | 'open' | 'completed' | 'cancelled';
  notes?: string | null;
  created_by: string;
  assigned_to?: string | null;
}

export interface TimeOffDto {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  reason?: string | null;
  status: 'pending' | 'approved' | 'denied';
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  created_at?: string;
}

export interface ShiftSwapDto {
  id: string;
  shift_id: string;
  requesting_employee_id: string;
  original_employee_id?: string | null;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
}

export const api = {
  // Auth
  async login(email: string, password: string) {
    return request<{ user: UserDto; token: string }>(`/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  async register(input: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'manager' | 'employee';
  }) {
    return request<{ user: UserDto; token: string }>(`/auth/register`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  async me() {
    return request<UserDto>(`/auth/me`);
  },
  async updateProfile(input: {
    first_name?: string;
    last_name?: string;
    email?: string;
    current_password?: string;
    new_password?: string;
  }) {
    return request<UserDto>(`/auth/profile`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },
  // Shifts
  async getShifts(params?: Record<string, string>) {
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    return request<ShiftDto[]>(`/shifts${qs}`);
  },
  async getWeeklySchedule(date: string) {
    return request<{ week_start: string; week_end: string; shifts: ShiftDto[] }>(
      `/shifts/week/${date}`,
    );
  },
  // Time Off
  async getTimeOff(params?: Record<string, string>) {
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    return request<TimeOffDto[]>(`/time-off${qs}`);
  },
  async createTimeOff(input: Omit<TimeOffDto, 'id' | 'status'>) {
    return request<TimeOffDto>(`/time-off`, { method: 'POST', body: JSON.stringify(input) });
  },
  async updateTimeOffStatus(id: string, status: 'approved' | 'denied') {
    return request<TimeOffDto>(`/time-off/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  // Shift Swaps
  async getShiftSwaps(params?: Record<string, string>) {
    const qs = params ? `?${new URLSearchParams(params)}` : '';
    return request<ShiftSwapDto[]>(`/shift-swaps${qs}`);
  },
  async requestShiftPickup(input: { shift_id: string }) {
    return request<ShiftSwapDto>(`/shift-swaps`, { method: 'POST', body: JSON.stringify(input) });
  },
  async approveShiftSwap(id: string, status: 'approved' | 'denied') {
    return request<ShiftSwapDto>(`/shift-swaps/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  // Users
  async getUsers() {
    return request<UserDto[]>(`/users`);
  },
};
