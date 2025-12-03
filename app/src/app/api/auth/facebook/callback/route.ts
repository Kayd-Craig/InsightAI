/**
 * Facebook OAuth Callback API Route
 * 
 * This route handles the server-side token exchange after Facebook redirects back.
 * It exchanges the authorization code for an access token and saves it to Supabase.
 * 
 * FLOW:
 * 1. Receive authorization code from Facebook redirect
 * 2. Exchange code for access token (server-side, secure)
 * 3. Fetch user info from Facebook
 * 4. Save integration to Supabase
 * 5. Redirect to integrations page
 */

import { NextRequest, NextResponse } from 'next/server';
import { socialIntegrationService } from '@/lib/integrationService/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get URL parameters from Facebook redirect
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const api_version = process.env.NEXT_PUBLIC_META_API_VERSION;

    // Handle user denial
    if (error) {
      console.error('Facebook OAuth error:', error);
      return NextResponse.redirect(
        new URL('/settings?error=facebook_denied', request.url)
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/settings?error=missing_parameters', request.url)
      );
    }

    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/?error=not_authenticated', request.url)
      );
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/${api_version}/oauth/access_token?` +
      `client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(`${request.nextUrl.origin}/auth/facebook/callback`)}` +
      `&client_secret=${process.env.FACEBOOK_APP_SECRET}` + // Server-side only
      `&code=${code}`
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/settings?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    // Get user info from Facebook
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name&access_token=${access_token}`
    );

    if (!userResponse.ok) {
      console.error('Failed to fetch Facebook user info');
      return NextResponse.redirect(
        new URL('/settings?error=user_info_failed', request.url)
      );
    }

    const userData = await userResponse.json();

    // Calculate token expiration
    const expiresAt = expires_in 
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : undefined;

    // Save integration to Supabase
    await socialIntegrationService.saveSocialIntegration(user.id, {
      platform: 'facebook',
      access_token,
      token_expires_at: expiresAt,
      platform_user_id: userData.id,
      platform_username: userData.name,
    });

    // Redirect to integrations page
    return NextResponse.redirect(
      new URL('/settings?success=facebook_connected', request.url)
    );

  } catch (error) {
    console.error('Facebook OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/settings?error=unexpected_error', request.url)
    );
  }
}