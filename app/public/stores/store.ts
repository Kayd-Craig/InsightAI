import { create } from 'zustand'

import { supabase } from '@/lib/supabase/client'
import {
  userMetadataServiceClient,
  type UserMetadata,
} from '@/lib/userMetadataService/client'
import {
  socialIntegrationService,
  type SocialIntegration,
} from '@/lib/integrationService/client'

// Define what will be stored in state
interface AppState {
  // Data - ADD DATA FROM SERVICES
  user: UserMetadata | null
  socialIntegrations: SocialIntegration[]

  // Loading states
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // Actions - ADD ACTIONS
  initializeApp: () => Promise<void>
  // USER
  updateUser: (updates: Partial<UserMetadata>) => Promise<void>
  updateUserWithAvatar: (
    updates: {
      first_name?: string
      last_name?: string
      phone?: string
      avatar?: string
    },
    avatarFile?: File
  ) => Promise<void>
  refreshUserData: () => Promise<void>
  // SOCIAL INTEGRATIONS
  refreshSocialIntegrations: () => Promise<void>
  deleteSocialIntegration: (
    platform: SocialIntegration['platform']
  ) => Promise<void>
  getSocialIntegration: (
    platform: SocialIntegration['platform']
  ) => SocialIntegration | undefined
  // RESET
  reset: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  socialIntegrations: [],
  isLoading: false,
  isInitialized: false,
  error: null,

  // INITIALIZE APP
  initializeApp: async () => {
    if (get().isLoading) return

    set({ isLoading: true, error: null })

    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        throw new Error('Not authenticated')
      }

      const [userData, socialIntegrationsData] = await Promise.all([
        userMetadataServiceClient.getUserMetadata(authUser.id), // USER
        socialIntegrationService.getUserSocialIntegrations(), // SOCIAL INTEGRATIONS
      ])

      set({
        user: userData,
        socialIntegrations: socialIntegrationsData,
        isLoading: false,
        isInitialized: true,
      })

      // LOCAL STORAGE - Sync to localStorage for offline access
      if (typeof window !== 'undefined' && userData) {
        localStorage.setItem('firstName', userData.first_name)
        localStorage.setItem('lastName', userData.last_name)
      }
      // ERROR
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load data',
        isLoading: false,
        isInitialized: false,
      })
    }
  },

  // UPDATE - REFRESH STATE FUNCTIONS
  // USER FUNCTIONS
  updateUser: async (updates) => {
    const currentUser = get().user // Get current user data
    if (!currentUser) return

    // Update the UI
    set({ user: { ...currentUser, ...updates } })

    try {
      // Update Database
      const updatedUser = await userMetadataServiceClient.saveUserMetadata({
        first_name: updates.first_name,
        last_name: updates.last_name,
        phone: updates.phone,
        email: updates.email,
        avatar_url: updates.avatar_url,
      })

      // Update with the server response
      set({ user: updatedUser })

      // Sync to localStorage
      if (typeof window !== 'undefined') {
        if (updatedUser.first_name) {
          localStorage.setItem('firstName', updatedUser.first_name)
        }
        if (updatedUser.last_name) {
          localStorage.setItem('lastName', updatedUser.last_name)
        }
      }
    } catch (error) {
      // Revert on error
      set({
        user: currentUser,
        error: error instanceof Error ? error.message : 'Update failed',
      })
    }
  },

  // Update user with avatar upload
  updateUserWithAvatar: async (updates, avatarFile) => {
    const currentUser = get().user
    if (!currentUser) throw new Error('No user found')

    try {
      let avatarUrl = updates.avatar || currentUser.avatar_url

      // Upload avatar if file is provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(filePath)

        avatarUrl = publicUrl
      }

      // Update user with new data
      await get().updateUser({
        first_name: updates.first_name,
        last_name: updates.last_name,
        phone: updates.phone,
        avatar_url: avatarUrl,
      })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Update failed' })
      throw error
    }
  },

  // Refresh just the user data
  refreshUserData: async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      if (!authUser) throw new Error('Not authenticated')

      const userData = await userMetadataServiceClient.getUserMetadata(
        authUser.id
      )
      set({ user: userData })
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to refresh user',
      })
    }
  },

  // SOCIAL INTEGRATION FUNCTIONS
  // Refresh social integrations
  refreshSocialIntegrations: async () => {
    try {
      const socialIntegrationsData =
        await socialIntegrationService.getUserSocialIntegrations()
      set({ socialIntegrations: socialIntegrationsData })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to refresh integrations',
      })
      throw error
    }
  },

  // Delete a social integration
  deleteSocialIntegration: async (platform) => {
    try {
      await socialIntegrationService.deleteSocialIntegration(platform)
      // Remove from store immediately
      set({
        socialIntegrations: get().socialIntegrations.filter(
          (i) => i.platform !== platform
        ),
      })
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete integration',
      })
      throw error
    }
  },

  // Get a specific social integration
  getSocialIntegration: (platform) => {
    return get().socialIntegrations.find((i) => i.platform === platform)
  },

  // RESET FOR LOGOUT
  reset: () =>
    set({
      user: null,
      socialIntegrations: [],
      isInitialized: false,
      error: null,
    }),
}))
