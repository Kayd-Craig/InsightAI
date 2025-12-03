/**
 * Integration Service - Server Side
 * 
 * This service handles user data operations from the SERVER side.
 * Uses the Supabase Admin client with service key.
 * 
 * DATABASE TABLE: users
 * 
 * Table Schema:
 * - id: UUID (Primary Key, auto-generated)
 * - first_name: string
 * - last_name: string
 * - email: string
 * - avatar: string (URL or base64)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface UserMetadata {
  id: string;
  last_name: string;
  first_name: string;
  email: string;
  avatar: string;
}

export const userMetadataServiceServer = {
  /** Fetch all users */
  async getAllUsersMetadata(): Promise<UserMetadata[]> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  /** Fetch a single user by ID */
  async getUserMetadata(id: string): Promise<UserMetadata | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /** Create a new user */
  async createUserMetadata(user: {
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
  }): Promise<UserMetadata> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) throw error;
    return data!;
  },

  /** Update a user by ID */
  async updateUserMetadata(id: string, user: Partial<Omit<UserMetadata, 'id'>>): Promise<UserMetadata> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data!;
  },

  /** Delete a user by ID */
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
