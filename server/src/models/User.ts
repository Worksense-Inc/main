import supabase from '../config/supabase';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'manager' | 'employee';
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  first_name: string;
  last_name: string;
  role: 'manager' | 'employee';
  password_hash: string;
}

export interface UpdateUserData {
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'manager' | 'employee';
  password_hash?: string;
}

/**
 * Find a user by email address
 */
export const findByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    throw new Error(`Failed to find user by email: ${error.message}`);
  }

  return data;
};

/**
 * Find a user by ID
 */
export const findById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to find user by ID: ${error.message}`);
  }

  return data;
};

/**
 * Create a new user
 */
export const create = async (userData: CreateUserData): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return data;
};

/**
 * Update a user by ID
 */
export const update = async (
  id: string,
  updates: UpdateUserData
): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  return data;
};

/**
 * Delete a user by ID
 */
export const deleteUser = async (id: string): Promise<void> => {
  const { error } = await supabase.from('users').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Get all users with optional role filter
 */
export const findAll = async (
  role?: 'manager' | 'employee'
): Promise<User[]> => {
  let query = supabase.from('users').select('*');

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return data || [];
};
