import { supabase } from './supabase/client'

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'
  plan_id: string
  current_period_start: string
  current_period_end: string
  created_at: string
  updated_at: string
}

export const subscriptionService = {
  /**
   * Check if user has an active subscription
   */
  async checkSubscription(): Promise<{ 
    isSubscribed: boolean
    subscription?: Subscription 
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('No user found')
        return { isSubscribed: false }
      }

      console.log('Checking subscription for user:', user.id)

      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      console.log('Subscription query result:', { subscription, error })

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking subscription:', error)
        return { isSubscribed: false }
      }

      const result = {
        isSubscribed: !!subscription,
        subscription: subscription || undefined
      }
      
      console.log('checkSubscription result:', result)
      return result
    } catch (error) {
      console.error('Error in checkSubscription:', error)
      return { isSubscribed: false }
    }
  },

  /**
   * Get user's subscription details
   */
  async getSubscription(): Promise<Subscription | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return null

      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) {
        console.error('Error fetching subscription:', error)
        return null
      }

      return subscription
    } catch (error) {
      console.error('Error in getSubscription:', error)
      return null
    }
  },

  /**
   * Cancel user's subscription
   */
  async cancelSubscription(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return false

      // TODO: Integrate with Stripe to cancel subscription
      // For now, just update the local database
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error canceling subscription:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in cancelSubscription:', error)
      return false
    }
  },

  /**
   * Reactivate user's subscription
   */
  async reactivateSubscription(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return false

      // TODO: Integrate with Stripe to reactivate subscription
      // For now, just update the local database
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error reactivating subscription:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in reactivateSubscription:', error)
      return false
    }
  },

  /**
   * Update subscription plan
   */
  async updateSubscriptionPlan(newPlanId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return false

      // TODO: Integrate with Stripe to update subscription plan
      // For now, just update the local database
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          plan_id: newPlanId,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating subscription plan:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateSubscriptionPlan:', error)
      return false
    }
  }
}