'use client'

import { useState } from 'react'
import { useAppStore } from '@/stores/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { oauthService } from '@/lib/oauthService'
import { IconCheck, IconAlertCircle } from '@tabler/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons'

interface IntegrationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IntegrationsModal({
  open,
  onOpenChange,
}: IntegrationsModalProps) {
  const {
    getSocialIntegration,
    deleteSocialIntegration
  } = useAppStore()

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      color: 'bg-black',
      hoverColor: 'hover:bg-green-900',
      icon: faFacebook,
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: 'bg-black',
      hoverColor: 'hover:bg-green-900',
      icon: faInstagram,
    },
  ]

  const getIntegration = (platform: string) => {
    const integration = getSocialIntegration(platform as 'facebook' | 'instagram')
    return integration?.is_active ? integration : null
  }

  const handleConnect = (platform: string) => {
    if (platform === 'facebook') {
      oauthService.initiateFacebookLogin()
    } else if (platform === 'instagram') {
      oauthService.initiateInstagramLogin()
    }
  }

  const handleDisconnect = async (platform: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) return

    setLoading(true)
    setMessage(null)

    try {
      await deleteSocialIntegration(platform as 'facebook' | 'instagram')
      setMessage({
        type: 'success',
        text: `${platform} disconnected successfully`,
      })
      // Auto-close message after a delay
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      setMessage({
        type: 'error',
        text: errorMessage || `Failed to disconnect ${platform}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className='max-w-2xl w-full p-0 overflow-hidden rounded-2xl'>
        <DialogHeader className='p-8 pb-6 text-left'>
          <DialogTitle className='text-3xl font-bold'>Integrations</DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className='px-8 pb-8 space-y-6'>
          {/* Error/Success Message */}
          {message && (
            <div
              className={`mb-6 p-3 rounded-lg flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <IconCheck className='w-5 h-5 text-green-800 dark:text-green-200 flex-shrink-0' />
              ) : (
                <IconAlertCircle className='w-5 h-5 text-red-800 dark:text-red-200 flex-shrink-0' />
              )}
              <span
                className={`text-sm ${
                  message.type === 'success'
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {message.text}
              </span>
            </div>
          )}

          {/* Platform Cards */}
          <div className='flex flex-col gap-4'>
            {platforms.map((platform) => {
              const integration = getIntegration(platform.id)
              const isConnected = !!integration

              return (
                <Card key={platform.id}>
                  <CardHeader className='pb-4'>
                    <div className='flex items-center gap-4'>
                      <div
                        className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <FontAwesomeIcon
                          icon={platform.icon}
                          className='text-white text-xl'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-lg'>
                          {platform.name}
                        </h3>
                        {isConnected ? (
                          <p className='text-sm text-green-600 dark:text-green-400 flex items-center gap-1'>
                            <IconCheck className='w-4 h-4' />
                            Connected
                          </p>
                        ) : (
                          <p className='text-sm text-gray-500'>Not connected</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Connection Details or Connect Button */}
                    {isConnected ? (
                      <div className='space-y-4'>
                        <div className='space-y-2'>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-500'>
                              Account
                            </span>
                            <span className='text-sm font-medium'>
                              {integration.platform_username}
                            </span>
                          </div>
                          <div className='flex justify-between items-center'>
                            <span className='text-sm text-gray-500'>
                              Last authenticated
                            </span>
                            <span className='text-sm font-medium'>
                              {new Date(
                                integration.last_authenticated_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleDisconnect(platform.id)}
                          disabled={loading}
                          variant='destructive'
                          className='w-full bg-red-800 hover:bg-red-700 dark:bg-black dark:text-red-400 dark:hover:bg-red-900 dark:hover:text-white'
                        >
                          {loading ? 'Disconnecting...' : 'Disconnect'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleConnect(platform.id)}
                        disabled={loading}
                        className={`w-full ${platform.color} ${platform.hoverColor} text-white`}
                      >
                        Connect {platform.name}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
