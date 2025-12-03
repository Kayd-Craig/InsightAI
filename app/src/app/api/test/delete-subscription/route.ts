import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting test subscription:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Test subscription deleted successfully',
    })
  } catch (error) {
    console.error('Error in test subscription deletion:', error)
    return NextResponse.json(
      { error: 'Failed to delete test subscription' },
      { status: 500 }
    )
  }
}
