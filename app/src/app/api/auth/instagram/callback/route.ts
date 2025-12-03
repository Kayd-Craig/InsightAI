/**
 * Instagram OAuth Callback API Route
 * 
 * Handles Instagram Basic Display OAuth flow.
 * Similar to Facebook but with different API endpoints.
 */

import { NextRequest, NextResponse } from 'next/server';
import { socialIntegrationService } from '@/lib/integrationService/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Instagram OAuth error:', error);
      return NextResponse.redirect(
        new URL('/integrations?error=instagram_denied', request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/integrations?error=missing_parameters', request.url)
      );
    }

    // Verify user is authenticated
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(
        new URL('/login?error=not_authenticated', request.url)
      );
    }

    // Exchange code for access token (Instagram requires POST with form data)
    const formData = new FormData();
    formData.append('client_id', process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID!);
    formData.append('client_secret', process.env.INSTAGRAM_APP_SECRET!);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', `${request.nextUrl.origin}/auth/instagram/callback`);
    formData.append('code', code);

    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: formData,
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Instagram token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/integrations?error=token_exchange_failed', request.url)
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, user_id } = tokenData;

    // Save integration to Supabase
    await socialIntegrationService.saveSocialIntegration(user.id, {
      platform: 'instagram',
      access_token,
      platform_user_id: user_id.toString(),
      platform_username: user_id.toString(), // Instagram Basic Display doesn't provide username
    });

    // Redirect to integrations page
    return NextResponse.redirect(
      new URL('/integrations?success=instagram_connected', request.url)
    );

  } catch (error) {
    console.error('Instagram OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/integrations?error=unexpected_error', request.url)
    );
  }
}