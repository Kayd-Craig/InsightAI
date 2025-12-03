'use client'

import { useEffect } from 'react'

/**
 * Facebook OAuth Callback Page
 *
 * This page is where users land after authorizing on Facebook.
 * It immediately calls the API route to exchange the code for a token.
 */
export default function FacebookCallbackPage() {
  useEffect(() => {
    const processCallback = async () => {
      // Get parameters from URL
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const state = urlParams.get('state')
      const error = urlParams.get('error')

      // If user denied, redirect to integrations with error
      if (error) {
        window.location.href = '/settings?error=facebook_denied'
        return
      }

      // Validate we have required parameters
      if (!code || !state) {
        console.error('MISSING PARAMETERS!')
        window.location.href = '/settings?error=missing_parameters'
        return
      }

      // Call the API route to handle token exchange
      try {
        const response = await fetch(
          `/api/auth/facebook/callback?code=${code}&state=${state}`
        )

        // API route handles everything and redirects
        if (response.redirected) {
          window.location.href = response.url
        } else {
          window.location.href = '/settings?error=callback_failed'
        }
      } catch (error) {
        console.error('Callback processing error:', error)
        window.location.href = '/settings?error=unexpected_error'
      }
    }

    processCallback()
  }, [])

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4'></div>
        <p className='text-lg'>Connecting Facebook...</p>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-2'>
          Please wait while we complete the connection.
        </p>
      </div>
    </div>
  )
}
