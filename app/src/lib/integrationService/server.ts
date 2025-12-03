/**
 * Integration Service - Server Side
 *
 * This service handles integration data operations from the SERVER side (API routes, Server Components).
 * Uses the Supabase client configured for server environments with cookie-based auth.
 *
 * DATABASE TABLE: integrations
 *
 * Table Schema:
 * - id: UUID (Primary Key, auto-generated)
 * - user_id: UUID (Foreign Key to auth.users, required)
 * - platform: VARCHAR(50) (Values: 'facebook' or 'instagram', required)
 * - access_token: TEXT (OAuth access token, required)
 * - refresh_token: TEXT (OAuth refresh token, optional)
 * - token_expires_at: TIMESTAMPTZ (Token expiration timestamp, optional)
 * - platform_user_id: VARCHAR(255) (User's ID on the platform, optional)
 * - platform_username: VARCHAR(255) (User's username on the platform, optional)
 * - last_authenticated_at: TIMESTAMPTZ (Last successful auth timestamp, auto-updated)
 * - created_at: TIMESTAMPTZ (Record creation timestamp, auto-generated)
 * - updated_at: TIMESTAMPTZ (Last update timestamp, auto-updated via trigger)
 *
 * UNIQUE CONSTRAINT: (user_id, platform) - One integration per platform per user
 *
 * HOW TO MODIFY FOR YOUR DATABASE:
 * 1. If the table name is different, update 'integrations' in .from() calls
 * 2. If column names differ, update the field names in queries:
 *    - Replace 'platform' with your column name for platform type
 *    - Replace 'access_token' with your column name for OAuth tokens
 *    - Update all field names in select(), insert(), update() operations
 * 3. If you add new columns, update the Integration interface and queries:
 *    - Add new fields to the Integration interface
 *    - Include them in select() queries
 *    - Add them to insert/update operations as needed
 * 4. If you use different platform values, update the type:
 *    - Change 'facebook' | 'instagram' to match your platforms
 * 5. If the user reference is different:
 *    - Update user_id references to match the auth structure
 *
 * KEY DIFFERENCE FROM CLIENT VERSION:
 * Server-side methods require userId to be passed explicitly (no automatic auth context).
 * This is more secure and explicit for API routes.
 *
 * USAGE:
 * Import this in API ROUTES and SERVER COMPONENTS (default in Next.js App Router)
 * Example: import { integrationService } from '@/lib/integrationService/server';
 */
import { createClient } from '../supabase/server'

export interface SocialIntegration {
  id: string
  user_id: string
  platform:
    | 'facebook'
    | 'instagram'
    | 'twitter'
    | 'tiktok'
    | 'linkedin'
    | 'youtube'
  platform_user_id: string
  platform_username?: string
  platform_email?: string
  access_token: string
  refresh_token?: string
  token_expires_at?: string
  scopes?: string[]
  is_active: boolean
  connection_status:
    | 'connected'
    | 'disconnected'
    | 'expired'
    | 'error'
    | 'revoked'
  last_sync_at?: string
  last_authenticated_at: string
  last_error?: string
  sync_frequency_hours?: number
  // eslint-disable-next-line
  platform_data?: any
  // eslint-disable-next-line
  metadata?: any
  created_at: string
  updated_at: string
}

export const socialIntegrationService = {
  async getUserSocialIntegrations(): Promise<SocialIntegration[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('social_integrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getSocialIntegration(
    platform: SocialIntegration['platform']
  ): Promise<SocialIntegration | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('social_integrations')
      .select('*')
      .eq('platform', platform)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  },

  async saveSocialIntegration(
    userId: string,
    integration: {
      platform: SocialIntegration['platform']
      access_token: string
      refresh_token?: string
      token_expires_at?: string
      platform_user_id: string
      platform_username?: string
      platform_email?: string
      scopes?: string[]
      // eslint-disable-next-line
      platform_data?: any
    }
  ): Promise<SocialIntegration> {
    const supabase = await createClient()

    const { data: existing } = await supabase
      .from('social_integrations')
      .select('id')
      .eq('user_id', userId)
      .eq('platform', integration.platform)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('social_integrations')
        .update({
          ...integration,
          last_authenticated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      return data
    } else {
      const { data, error } = await supabase
        .from('social_integrations')
        .insert({
          user_id: userId,
          ...integration,
        })
        .select()
        .single()

      if (error) throw error
      return data
    }
  },

  async deleteIntegration(
    userId: string,
    platform: SocialIntegration['platform']
  ): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('social_integrations')
      .delete()
      .eq('user_id', userId)
      .eq('platform', platform)

    if (error) throw error
  },
}
