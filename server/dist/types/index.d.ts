import { Request } from 'express';
export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'manager' | 'employee';
    created_at: string;
    updated_at: string;
}
export interface CreateUserInput {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'manager' | 'employee';
}
export interface LoginInput {
    email: string;
    password: string;
}
export interface Shift {
    id: string;
    assigned_to: string | null;
    shift_date: string;
    start_time: string;
    end_time: string;
    position: string;
    status: 'scheduled' | 'open' | 'completed' | 'cancelled';
    notes?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}
export interface CreateShiftInput {
    assigned_to?: string;
    shift_date: string;
    start_time: string;
    end_time: string;
    position: string;
    notes?: string;
}
export interface UpdateShiftInput {
    assigned_to?: string;
    shift_date?: string;
    start_time?: string;
    end_time?: string;
    position?: string;
    status?: 'scheduled' | 'open' | 'completed' | 'cancelled';
    notes?: string;
}
export interface TimeOffRequest {
    id: string;
    employee_id: string;
    start_date: string;
    end_date: string;
    reason?: string;
    status: 'pending' | 'approved' | 'denied';
    reviewed_by?: string;
    reviewed_at?: string;
    created_at: string;
    updated_at: string;
}
export interface CreateTimeOffInput {
    start_date: string;
    end_date: string;
    reason?: string;
}
export interface UpdateTimeOffInput {
    status: 'approved' | 'denied';
}
export interface ShiftSwapRequest {
    id: string;
    shift_id: string;
    requesting_employee_id: string;
    original_employee_id?: string;
    status: 'pending' | 'approved' | 'denied' | 'cancelled';
    approved_by?: string;
    approved_at?: string;
    created_at: string;
}
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: 'manager' | 'employee';
    };
}
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map