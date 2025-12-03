'use client';

import { useEffect } from 'react';

/**
 * Instagram OAuth Callback Page
 * 
 * This page is where users land after authorizing on Instagram.
 * It immediately calls the API route to exchange the code for a token.
 */
export default function InstagramCallbackPage() {
  useEffect(() => {
    const processCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        window.location.href = '/integrations?error=instagram_denied';
        return;
      }

      if (!code || !state) {
        console.error('MISSING PARAMETERS!');
        window.location.href = '/integrations?error=missing_parameters';
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/instagram/callback?code=${code}&state=${state}`
        );

        if (response.redirected) {
          window.location.href = response.url;
        } else {
          window.location.href = '/integrations?error=callback_failed';
        }
      } catch (error) {
        console.error('Callback processing error:', error);
        window.location.href = '/integrations?error=unexpected_error';
      }
    };

    processCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
        <p className="text-lg">Connecting Instagram...</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Please wait while we complete the connection.
        </p>
      </div>
    </div>
  );
}