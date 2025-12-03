'use client'

import { useState, useEffect } from 'react'
import {
  subscriptionService,
  type Subscription,
} from '@/lib/subscriptionService'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { IconCreditCard, IconCalendar, IconDots } from '@tabler/icons-react'
import PaymentModal from './PaymentModal'

interface SubscriptionManagementProps {
  isSubscribed: boolean
  onSubscriptionChange: () => void
}

export default function SubscriptionManagement({
  isSubscribed,
  onSubscriptionChange,
}: SubscriptionManagementProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (isSubscribed) {
      loadSubscriptionDetails()
    } else {
      setLoading(false)
    }
  }, [isSubscribed])

  const loadSubscriptionDetails = async () => {
    setLoading(true)
    try {
      const sub = await subscriptionService.getSubscription()
      setSubscription(sub)
    } catch (error) {
      console.error('Error loading subscription details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = () => {
    setIsPaymentModalOpen(true)
  }

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.'
      )
    ) {
      return
    }

    if (!subscription?.stripe_subscription_id) {
      console.error('No subscription ID found')
      return
    }

    setActionLoading('cancel')
    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel subscription')
      }

      // Refresh subscription data
      await loadSubscriptionDetails()
      onSubscriptionChange()
    } catch (error) {
      console.error('Error canceling subscription:', error)
      alert('Failed to cancel subscription. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReactivateSubscription = async () => {
    setActionLoading('reactivate')
    try {
      const success = await subscriptionService.reactivateSubscription()

      if (success) {
        // Refresh subscription data
        await loadSubscriptionDetails()
        onSubscriptionChange()
      } else {
        alert('Failed to reactivate subscription. Please try again.')
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      alert('Failed to reactivate subscription. Please try again.')
    } finally {
      setActionLoading(null)
    }
  }

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false)
    onSubscriptionChange()
    loadSubscriptionDetails()
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <h3 className='text-lg font-semibold flex items-center gap-2'>
            <IconCreditCard className='w-5 h-5' />
            Subscription Management
          </h3>
        </CardHeader>
        <CardContent>
          <div className='animate-pulse'>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2'></div>
            <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2'></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!isSubscribed || !subscription) {
    return (
      <>
        <Card>
          <CardHeader>
            <h3 className='text-lg font-semibold flex items-center gap-2'>
              <IconCreditCard className='w-5 h-5' />
              Subscription Management
            </h3>
          </CardHeader>
          <CardContent>
            <div className='text-center py-6'>
              <div className='mb-4'>
                <Badge
                  variant='outline'
                  className='text-orange-600 border-orange-200'
                >
                  No Active Subscription
                </Badge>
              </div>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                Subscribe to access premium features like unlimited social media
                integrations and advanced analytics.
              </p>
              <Button onClick={handleUpgrade} className='w-full sm:w-auto'>
                View Plans & Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>

        {isPaymentModalOpen && (
          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onSubscriptionComplete={handlePaymentSuccess}
          />
        )}
      </>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className='bg-green-100 text-green-800 border-green-200'>
            Active
          </Badge>
        )
      case 'canceled':
        return (
          <Badge
            variant='outline'
            className='text-orange-600 border-orange-200'
          >
            Canceled
          </Badge>
        )
      case 'past_due':
        return <Badge variant='destructive'>Past Due</Badge>
      case 'unpaid':
        return <Badge variant='destructive'>Unpaid</Badge>
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const isPlanActive = subscription.status === 'active'
  const isCanceled = subscription.status === 'canceled'

  return (
    <>
      <Card>
        <CardHeader>
          <h3 className='text-lg font-semibold flex items-center gap-2'>
            <IconCreditCard className='w-5 h-5' />
            Subscription Management
          </h3>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div>
            <h4 className='font-medium mb-3'>Current Plan</h4>
            <div className='flex items-center justify-between p-4 border rounded-lg dark:border-gray-700'>
              <div>
                <div className='flex items-center gap-3 mb-1'>
                  <span className='font-medium capitalize'>
                    {subscription.plan_id} Plan
                  </span>
                  {getStatusBadge(subscription.status)}
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {subscription.plan_id === 'basic'
                    ? '$9.99/month'
                    : '$19.99/month'}
                </p>
              </div>
              <Button variant='outline' size='sm' onClick={handleUpgrade}>
                {subscription.plan_id === 'basic'
                  ? 'Upgrade to Pro'
                  : 'Change Plan'}
              </Button>
            </div>
          </div>

          {/* Billing Information */}
          <div>
            <h4 className='font-medium mb-3'>Billing Information</h4>
            <div className='space-y-3'>
              <div className='flex items-center gap-2 text-sm'>
                <IconCalendar className='w-4 h-4 text-gray-400' />
                <span className='text-gray-600 dark:text-gray-400'>
                  Current period:
                </span>
                <span>
                  {formatDate(subscription.current_period_start)} -{' '}
                  {formatDate(subscription.current_period_end)}
                </span>
              </div>

              {!isCanceled && (
                <div className='flex items-center gap-2 text-sm'>
                  <IconCreditCard className='w-4 h-4 text-gray-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Next charge:
                  </span>
                  <span>{formatDate(subscription.current_period_end)}</span>
                </div>
              )}

              {isCanceled && (
                <div className='flex items-center gap-2 text-sm'>
                  <IconCalendar className='w-4 h-4 text-orange-400' />
                  <span className='text-gray-600 dark:text-gray-400'>
                    Status:
                  </span>
                  <span>Canceled</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className='font-medium mb-3'>Subscription Actions</h4>
            <div className='flex flex-col sm:flex-row gap-3'>
              {isPlanActive && (
                <Button
                  variant='outline'
                  onClick={handleCancelSubscription}
                  disabled={actionLoading === 'cancel'}
                  className='text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950'
                >
                  {actionLoading === 'cancel'
                    ? 'Canceling...'
                    : 'Cancel Subscription'}
                </Button>
              )}

              {isCanceled && (
                <Button
                  onClick={handleReactivateSubscription}
                  disabled={actionLoading === 'reactivate'}
                  className='bg-green-600 hover:bg-green-700'
                >
                  {actionLoading === 'reactivate'
                    ? 'Reactivating...'
                    : 'Reactivate Subscription'}
                </Button>
              )}

              <Button variant='outline' size='sm'>
                <IconDots className='w-4 h-4 mr-2' />
                Manage Billing
              </Button>
            </div>
          </div>

          {isCanceled && (
            <div className='p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg'>
              <p className='text-sm text-orange-800 dark:text-orange-200'>
                <strong>Your subscription is canceled.</strong> You&apos;ll
                continue to have access to premium features until{' '}
                {formatDate(subscription.current_period_end)}.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isPaymentModalOpen && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSubscriptionComplete={handlePaymentSuccess}
        />
      )}
    </>
  )
}
