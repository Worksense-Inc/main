import supabase from '../config/supabase';

export interface ShiftSwapRequest {
  id: string;
  shift_id: string;
  requesting_employee_id: string;
  original_employee_id: string | null;
  status: 'pending' | 'approved' | 'denied' | 'cancelled';
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface CreateShiftSwapData {
  shift_id: string;
  requesting_employee_id: string;
  original_employee_id?: string;
  status?: 'pending' | 'approved' | 'denied' | 'cancelled';
}

export interface UpdateShiftSwapData {
  status?: 'pending' | 'approved' | 'denied' | 'cancelled';
  approved_by?: string;
  approved_at?: string;
}

export interface ShiftSwapFilters {
  shift_id?: string;
  requesting_employee_id?: string;
  original_employee_id?: string;
  status?: string;
}

/**
 * Find a shift swap request by ID
 */
export const findById = async (
  id: string
): Promise<ShiftSwapRequest | null> => {
  const { data, error } = await supabase
    .from('shift_swap_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to find shift swap request: ${error.message}`);
  }

  return data;
};

/**
 * Create a new shift swap request
 */
export const create = async (
  requestData: CreateShiftSwapData
): Promise<ShiftSwapRequest> => {
  const { data, error } = await supabase
    .from('shift_swap_requests')
    .insert(requestData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create shift swap request: ${error.message}`);
  }

  return data;
};

/**
 * Update a shift swap request by ID
 */
export const update = async (
  id: string,
  updates: UpdateShiftSwapData
): Promise<ShiftSwapRequest> => {
  const { data, error } = await supabase
    .from('shift_swap_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update shift swap request: ${error.message}`);
  }

  return data;
};

/**
 * Delete a shift swap request by ID
 */
export const deleteShiftSwapRequest = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('shift_swap_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete shift swap request: ${error.message}`);
  }
};

/**
 * Get all shift swap requests with optional filters
 */
export const findAll = async (
  filters?: ShiftSwapFilters
): Promise<ShiftSwapRequest[]> => {
  let query = supabase.from('shift_swap_requests').select('*');

  if (filters?.shift_id) {
    query = query.eq('shift_id', filters.shift_id);
  }
  if (filters?.requesting_employee_id) {
    query = query.eq('requesting_employee_id', filters.requesting_employee_id);
  }
  if (filters?.original_employee_id) {
    query = query.eq('original_employee_id', filters.original_employee_id);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch shift swap requests: ${error.message}`);
  }

  return data || [];
};

/**
 * Approve a shift swap request
 */
export const approve = async (
  id: string,
  approvedBy: string
): Promise<ShiftSwapRequest> => {
  return update(id, {
    status: 'approved',
    approved_by: approvedBy,
    approved_at: new Date().toISOString(),
  });
};

/**
 * Deny a shift swap request
 */
export const deny = async (
  id: string,
  approvedBy: string
): Promise<ShiftSwapRequest> => {
  return update(id, {
    status: 'denied',
    approved_by: approvedBy,
    approved_at: new Date().toISOString(),
  });
};

/**
 * Cancel a shift swap request (by the requester)
 */
export const cancel = async (id: string): Promise<ShiftSwapRequest> => {
  return update(id, {
    status: 'cancelled',
  });
};

/**
 * Get shift swap requests for a specific employee
 */
export const findByEmployee = async (
  employeeId: string
): Promise<ShiftSwapRequest[]> => {
  const { data, error } = await supabase
    .from('shift_swap_requests')
    .select('*')
    .or(
      `requesting_employee_id.eq.${employeeId},original_employee_id.eq.${employeeId}`
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(
      `Failed to fetch shift swap requests for employee: ${error.message}`
    );
  }

  return data || [];
};
