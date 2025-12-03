/* eslint-disable */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    console.log('Retrieved session:', {
      id: session.id,
      mode: session.mode,
      payment_status: session.payment_status,
      subscription: session.subscription
        ? (session.subscription as any).id
        : null,
      customer: session.customer,
      metadata: session.metadata,
    })

    if (session.mode === 'subscription' && session.subscription) {
      const subscription = session.subscription as any

      const fullSubscription = await stripe.subscriptions.retrieve(
        subscription.id || subscription
      )

      console.log('Full subscription details:', {
        id: fullSubscription.id,
        status: fullSubscription.status,
        current_period_start: (fullSubscription as any).current_period_start,
        current_period_end: (fullSubscription as any).current_period_end,
        created: (fullSubscription as any).created,
      })

      const periodStart = (fullSubscription as any).current_period_start
      const periodEnd = (fullSubscription as any).current_period_end

      console.log('Creating subscription record:', {
        user_id: user.id,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: fullSubscription.id,
        plan_id: session.metadata?.plan || 'basic',
        status: 'active',
        current_period_start: periodStart
          ? new Date(periodStart * 1000).toISOString()
          : 'null',
        current_period_end: periodEnd
          ? new Date(periodEnd * 1000).toISOString()
          : 'null',
      })

      console.log('Deleting existing subscriptions for user:', user.id)
      const deleteResult = await supabase
        .from('subscriptions')
        .delete()
        .eq('user_id', user.id)

      console.log('Delete result:', deleteResult)

      await new Promise((resolve) => setTimeout(resolve, 100))

      const subscriptionData: any = {
        user_id: user.id,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: fullSubscription.id,
        plan_id: session.metadata?.plan || 'basic',
        status: 'active',
      }

      if (periodStart) {
        subscriptionData.current_period_start = new Date(
          periodStart * 1000
        ).toISOString()
      }
      if (periodEnd) {
        subscriptionData.current_period_end = new Date(
          periodEnd * 1000
        ).toISOString()
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'user_id',
          ignoreDuplicates: false,
        })
        .select()

      if (error) {
        console.error('Error creating subscription:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('Subscription created successfully:', data)

      return NextResponse.json({
        success: true,
        message: 'Subscription created successfully',
        subscription: data?.[0],
      })
    } else {
      return NextResponse.json(
        {
          error: 'Session is not a completed subscription',
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error simulating webhook:', error)
    return NextResponse.json(
      { error: 'Failed to simulate webhook' },
      { status: 500 }
    )
  }
}
