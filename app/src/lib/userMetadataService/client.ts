/**
 * Integration Service - Client Side
 *
 * This service handles integration data operations from the CLIENT side (browser/React components).
 * Uses the Supabase client configured for browser environments.
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

import { supabase } from '../supabase/client'

export interface UserMetadata {
  id: string
  last_name: string
  first_name: string
  email: string
  phone: string
  avatar_url: string
}

export const userMetadataServiceClient = {
  /** Fetch all users */
  async getAllUsersMetadata(): Promise<UserMetadata[]> {
    const { data, error } = await supabase.from('users').select('*')

    if (error) throw error
    return data || []
  },

  /** Fetch a single user by ID */
  async getUserMetadata(id: string): Promise<UserMetadata | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  /** Save or update the current authenticated user */
  async saveUserMetadata(user: {
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    avatar_url?: string
  }): Promise<UserMetadata> {
    // Get current authenticated user
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (!authUser) throw new Error('Not authenticated')

    // Update the user record in the users table
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
      })
      .eq('id', authUser.id)
      .select()
      .single()

    if (error) throw error
    return data!
  },

  /** Delete a user by ID */
  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase.from('users').delete().eq('id', id)

    if (error) throw error
  },
}
