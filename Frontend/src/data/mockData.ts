import { Shift, ShiftSwapRequest, DayOffRequest, User } from '../types/data';

// Demo shifts data
export const demoShifts: Shift[] = [
  {
    id: 's1',
    date: '2025-11-10',
    start: '09:00',
    end: '13:00',
    employee: 'Alex',
    note: 'Front desk',
  },
  {
    id: 's2',
    date: '2025-11-10',
    start: '12:00',
    end: '18:00',
    employee: 'Sam',
    note: 'Kitchen',
  },
  {
    id: 's3',
    date: '2025-11-11',
    start: '10:00',
    end: '16:00',
    employee: 'Alex',
    note: 'Register',
  },
  {
    id: 's4',
    date: '2025-11-12',
    start: '08:00',
    end: '12:00',
    employee: 'Jamie',
    note: 'Inventory',
  },
  {
    id: 's5',
    date: '2025-11-13',
    start: '14:00',
    end: '20:00',
    employee: 'Sam',
    note: 'Closing shift',
  },
  {
    id: 's6',
    date: '2025-11-14',
    start: '09:00',
    end: '17:00',
    employee: 'Alex',
    note: 'Full day',
  },
];

// Demo swap requests
export const demoSwapRequests: ShiftSwapRequest[] = [
  {
    id: 'sw1',
    from: 'Jorge',
    fromYear: 2026,
    with: 'Tucker',
    withYear: 2027,
    note: 'Swap 11/14 10–16 with 12–18',
    status: 'pending',
  },
  {
    id: 'sw2',
    from: 'Jamie',
    fromYear: 2025,
    with: 'Alex',
    withYear: 2026,
    note: 'Both evening shifts',
    status: 'pending',
  },
];

// Demo day off requests
export const demoDayOffRequests: DayOffRequest[] = [
  {
    id: 'do1',
    employee: 'Jorge',
    year: 2026,
    range: 'Nov 18 (all day)',
    reason: 'Family event',
    status: 'pending',
  },
  {
    id: 'do2',
    employee: 'Sam',
    year: 2027,
    range: 'Nov 20 · 09:00–13:00',
    reason: 'Dentist',
    status: 'pending',
  },
];

// Demo user
export const demoUser: User = {
  name: 'Alex',
  email: 'alex@worksense.com',
  role: 'employee',
};
