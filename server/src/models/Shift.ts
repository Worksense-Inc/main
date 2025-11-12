import supabase from '../config/supabase';

export interface Shift {
  id: string;
  shift_date: string;
  start_time: string;
  end_time: string;
  position: string;
  status: 'scheduled' | 'open' | 'completed' | 'cancelled';
  notes: string | null;
  created_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateShiftData {
  shift_date: string;
  start_time: string;
  end_time: string;
  position: string;
  status?: 'scheduled' | 'open' | 'completed' | 'cancelled';
  notes?: string;
  created_by: string;
  assigned_to?: string;
}

export interface UpdateShiftData {
  shift_date?: string;
  start_time?: string;
  end_time?: string;
  position?: string;
  status?: 'scheduled' | 'open' | 'completed' | 'cancelled';
  notes?: string;
  assigned_to?: string | null;
}

export interface ShiftFilters {
  status?: string;
  assigned_to?: string;
  created_by?: string;
  position?: string;
}

/**
 * Find a shift by ID
 */
export const findById = async (id: string): Promise<Shift | null> => {
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to find shift: ${error.message}`);
  }

  return data;
};

/**
 * Create a new shift
 */
export const create = async (shiftData: CreateShiftData): Promise<Shift> => {
  const { data, error } = await supabase
    .from('shifts')
    .insert(shiftData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create shift: ${error.message}`);
  }

  return data;
};

/**
 * Update a shift by ID
 */
export const update = async (
  id: string,
  updates: UpdateShiftData
): Promise<Shift> => {
  const { data, error } = await supabase
    .from('shifts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update shift: ${error.message}`);
  }

  return data;
};

/**
 * Delete a shift by ID
 */
export const deleteShift = async (id: string): Promise<void> => {
  const { error } = await supabase.from('shifts').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete shift: ${error.message}`);
  }
};

/**
 * Get shifts by date range with optional filters
 */
export const getByDateRange = async (
  startDate: string,
  endDate: string,
  filters?: ShiftFilters
): Promise<Shift[]> => {
  let query = supabase
    .from('shifts')
    .select('*')
    .gte('shift_date', startDate)
    .lte('shift_date', endDate);

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }
  if (filters?.created_by) {
    query = query.eq('created_by', filters.created_by);
  }
  if (filters?.position) {
    query = query.eq('position', filters.position);
  }

  query = query
    .order('shift_date', { ascending: true })
    .order('start_time', { ascending: true });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch shifts: ${error.message}`);
  }

  return data || [];
};

/**
 * Get all shifts with optional filters
 */
export const findAll = async (filters?: ShiftFilters): Promise<Shift[]> => {
  let query = supabase.from('shifts').select('*');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }
  if (filters?.created_by) {
    query = query.eq('created_by', filters.created_by);
  }
  if (filters?.position) {
    query = query.eq('position', filters.position);
  }

  query = query
    .order('shift_date', { ascending: true })
    .order('start_time', { ascending: true });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch shifts: ${error.message}`);
  }

  return data || [];
};
