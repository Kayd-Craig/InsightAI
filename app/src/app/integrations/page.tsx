'use client'

import { useEffect, useState } from 'react'
import { socialIntegrationService } from '@/lib/integrationService/client'
import { oauthService } from '@/lib/oauthService'
import { subscriptionService } from '@/lib/subscriptionService'
import PaymentModal from '@/app/components/PaymentModal'
import type { SocialIntegration } from '@/lib/integrationService/client'

export default function SocialIntegrationsPage() {
  const [social_integrations, setSocialIntegrations] = useState<
    SocialIntegration[]
  >([])
  const [loading, setLoading] = useState(true)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    checkSubscriptionAndLoadData()

    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const error = params.get('error')

    if (success === 'facebook_connected') {
      setMessage({ type: 'success', text: 'Facebook connected successfully!' })
    } else if (success === 'instagram_connected') {
      setMessage({ type: 'success', text: 'Instagram connected successfully!' })
    } else if (error) {
      setMessage({ type: 'error', text: `Error: ${error.replace(/_/g, ' ')}` })
    }

    if (success || error) {
      window.history.replaceState({}, '', '/integrations')
    }
  }, [])

  const checkSubscriptionAndLoadData = async () => {
    try {
      const { isSubscribed: subscribed } = await subscriptionService.checkSubscription()
      setIsSubscribed(subscribed)
      
      if (subscribed) {
        await loadSocialIntegrations()
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSocialIntegrations = async () => {
    try {
      const data = await socialIntegrationService.getUserSocialIntegrations()
      setSocialIntegrations(data)
    } catch (error) {
      console.error('Failed to load integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = (platform: 'facebook' | 'instagram') => {
    if (!isSubscribed) {
      setIsPaymentModalOpen(true)
      return
    }

    if (platform === 'facebook') {
      oauthService.initiateFacebookLogin()
    } else {
      oauthService.initiateInstagramLogin()
    }
  }

  const handleSubscriptionComplete = () => {
    setIsSubscribed(true)
    checkSubscriptionAndLoadData()
  }

  const handleDisconnect = async (platform: 'facebook' | 'instagram') => {
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) return

    try {
      await socialIntegrationService.deleteSocialIntegration(platform)
      await loadSocialIntegrations()
      setMessage({ type: 'success', text: `${platform} disconnected` })
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to disconnect ${platform}` })
      console.error('Error ', error)
    }
  }

  const getSocialIntegration = (platform: 'facebook' | 'instagram') => {
    return social_integrations.find((i) => i.platform === platform)
  }

  if (loading) {
    return <div className='p-8'>Loading...</div>
  }

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Integrations</h1>

      {message && (
        <div
          className={`p-4 mb-6 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <IntegrationCard
          platform='Facebook'
          integration={getSocialIntegration('facebook')}
          onConnect={() => handleConnect('facebook')}
          onDisconnect={() => handleDisconnect('facebook')}
        />

        <IntegrationCard
          platform='Instagram'
          integration={getSocialIntegration('instagram')}
          onConnect={() => handleConnect('instagram')}
          onDisconnect={() => handleDisconnect('instagram')}
        />
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubscriptionComplete={handleSubscriptionComplete}
      />
    </div>
  )
}

function IntegrationCard({
  platform,
  integration,
  onConnect,
  onDisconnect,
}: {
  platform: string
  integration?: SocialIntegration
  onConnect: () => void
  onDisconnect: () => void
}) {
  const isConnected = !!integration

  return (
    <div className='border rounded-lg p-6 bg-white dark:bg-gray-800'>
      <h2 className='text-xl font-semibold mb-4'>{platform}</h2>

      {isConnected ? (
        <div>
          <div className='mb-4'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>Status</p>
            <p className='text-green-600 font-semibold'>Connected</p>
          </div>

          <div className='mb-4'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              Last Authenticated
            </p>
            <p className='text-sm'>
              {new Date(integration.last_authenticated_at).toLocaleDateString()}
            </p>
          </div>

          {integration.platform_username && (
            <div className='mb-4'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                Account
              </p>
              <p className='text-sm'>{integration.platform_username}</p>
            </div>
          )}

          <button
            onClick={onDisconnect}
            className='w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div>
          <p className='text-gray-600 dark:text-gray-400 mb-4'>
            Connect your {platform} account.
          </p>
          <button
            onClick={onConnect}
            className='w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Connect
          </button>
        </div>
      )}
    </div>
  )
}
