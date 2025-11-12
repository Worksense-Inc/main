import supabase from '../config/supabase';

export interface TimeOffRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: 'pending' | 'approved' | 'denied';
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTimeOffData {
  employee_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  status?: 'pending' | 'approved' | 'denied';
}

export interface UpdateTimeOffData {
  start_date?: string;
  end_date?: string;
  reason?: string;
  status?: 'pending' | 'approved' | 'denied';
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface TimeOffFilters {
  employee_id?: string;
  status?: string;
}

/**
 * Find a time off request by ID
 */
export const findById = async (id: string): Promise<TimeOffRequest | null> => {
  const { data, error } = await supabase
    .from('time_off_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to find time off request: ${error.message}`);
  }

  return data;
};

/**
 * Create a new time off request
 */
export const create = async (
  requestData: CreateTimeOffData
): Promise<TimeOffRequest> => {
  const { data, error } = await supabase
    .from('time_off_requests')
    .insert(requestData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create time off request: ${error.message}`);
  }

  return data;
};

/**
 * Update a time off request by ID
 */
export const update = async (
  id: string,
  updates: UpdateTimeOffData
): Promise<TimeOffRequest> => {
  const { data, error } = await supabase
    .from('time_off_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update time off request: ${error.message}`);
  }

  return data;
};

/**
 * Delete a time off request by ID
 */
export const deleteTimeOffRequest = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('time_off_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete time off request: ${error.message}`);
  }
};

/**
 * Get all time off requests with optional filters
 */
export const findAll = async (
  filters?: TimeOffFilters
): Promise<TimeOffRequest[]> => {
  let query = supabase.from('time_off_requests').select('*');

  if (filters?.employee_id) {
    query = query.eq('employee_id', filters.employee_id);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch time off requests: ${error.message}`);
  }

  return data || [];
};

/**
 * Approve a time off request
 */
export const approve = async (
  id: string,
  reviewedBy: string
): Promise<TimeOffRequest> => {
  return update(id, {
    status: 'approved',
    reviewed_by: reviewedBy,
    reviewed_at: new Date().toISOString(),
  });
};

/**
 * Deny a time off request
 */
export const deny = async (
  id: string,
  reviewedBy: string
): Promise<TimeOffRequest> => {
  return update(id, {
    status: 'denied',
    reviewed_by: reviewedBy,
    reviewed_at: new Date().toISOString(),
  });
};
