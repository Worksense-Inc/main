// Mock data types
export interface Shift {
  id: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:MM
  end: string; // HH:MM
  employee: string;
  note?: string;
}

export interface ShiftSwapRequest {
  id: string;
  from: string;
  fromYear: number;
  with: string;
  withYear: number;
  note?: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface DayOffRequest {
  id: string;
  employee: string;
  year: number;
  range: string;
  reason?: string;
  status: 'pending' | 'approved' | 'denied';
}

export interface User {
  name: string;
  email: string;
  role: 'employee' | 'manager';
}
