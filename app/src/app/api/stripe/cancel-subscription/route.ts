import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()
    
    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID required' }, { status: 400 })
    }

    // Get the current user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if this is a test subscription
    const isTestSubscription = subscriptionId.startsWith('sub_test_')

    if (isTestSubscription) {
      // For test subscriptions, just update the database directly
      console.log('Canceling test subscription:', subscriptionId)
      
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
        })
        .eq('stripe_subscription_id', subscriptionId)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Error updating test subscription:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Test subscription canceled successfully'
      })
    }

    // For real subscriptions, cancel with Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    // Update subscription in database
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
      })
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', user.id)

    return NextResponse.json({ 
      success: true, 
      canceled_at: subscription.cancel_at 
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}