import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await supabase.from('subscriptions').delete().eq('user_id', user.id)

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        stripe_customer_id: 'cus_test_' + Date.now(),
        stripe_subscription_id: 'sub_test_' + Date.now(),
        status: 'active',
        plan_id: 'basic',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // 30 days from now
      })
      .select()

    if (error) {
      console.error('Error creating test subscription:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Test subscription created successfully',
      subscription: data?.[0],
    })
  } catch (error) {
    console.error('Error in test subscription creation:', error)
    return NextResponse.json(
      { error: 'Failed to create test subscription' },
      { status: 500 }
    )
  }
}
