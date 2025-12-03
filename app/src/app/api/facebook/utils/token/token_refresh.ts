'use server';

import { createClient } from '@/lib/supabase/server';
import { FacebookClient } from '../../client';

/**
 * Exchange a short-lived token for a long-lived token (60 days)
 * Should be called after initial OAuth login
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<string> {
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const apiVersion = process.env.NEXT_PUBLIC_META_API_VERSION;
  
  if (!appId || !appSecret) {
    throw new Error('Facebook app credentials not configured');
  }

  const url = new URL(`https://graph.facebook.com/${apiVersion}/oauth/access_token`);
  url.searchParams.append('grant_type', 'fb_exchange_token');
  url.searchParams.append('client_id', appId);
  url.searchParams.append('client_secret', appSecret);
  url.searchParams.append('fb_exchange_token', shortLivedToken);

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Token exchange failed: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Check if token needs refresh (refresh if expires in less than 7 days)
 */
export async function shouldRefreshToken(tokenExpiresAt: string | null): Promise<boolean> {
  if (!tokenExpiresAt) return true;
  
  const expiresAt = new Date(tokenExpiresAt).getTime();
  const now = Date.now();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  
  return (expiresAt - now) < sevenDaysInMs;
}

/**
 * Refresh the user's access token
 * This exchanges the current token for a new long-lived token
 */
export async function refreshUserAccessToken(): Promise<{
  success: boolean;
  token?: string;
  expiresAt?: string;
  error?: string;
}> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: integration } = await supabase
    .from('social_integrations')
    .select('*')
    .eq('user_id', user.id)
    .eq('platform', 'facebook')
    .single();

  if (!integration) {
    return { success: false, error: 'No Facebook integration found' };
  }

  try {
    console.log('Refreshing user access token...');
    
    // Exchange current token for new long-lived token
    const newToken = await exchangeForLongLivedToken(integration.access_token);
    
    // Long-lived tokens expire in 60 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);
    
    // Update in database
    const { error: updateError } = await supabase
      .from('social_integrations')
      .update({
        access_token: newToken,
        token_expires_at: expiresAt.toISOString(),
        long_lived_token: true,
        last_authenticated_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', integration.id);

    if (updateError) {
      console.error('Error updating token:', updateError);
      return { success: false, error: 'Failed to update token' };
    }

    console.log('User access token refreshed successfully');
    return {
      success: true,
      token: newToken,
      expiresAt: expiresAt.toISOString()
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to refresh token'
    };
  }
}

/**
 * Refresh page access tokens for all pages
 * Page tokens are tied to the user token, so when user token refreshes, page tokens need updating
 */
export async function refreshPageAccessTokens(): Promise<{
  success: boolean;
  pagesRefreshed: number;
  error?: string;
}> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, pagesRefreshed: 0, error: 'Not authenticated' };
  }

  const { data: integration } = await supabase
    .from('social_integrations')
    .select('*')
    .eq('user_id', user.id)
    .eq('platform', 'facebook')
    .single();

  if (!integration) {
    return { success: false, pagesRefreshed: 0, error: 'No Facebook integration found' };
  }

  try {
    console.log('Refreshing page access tokens...');
    
    // Fetch fresh page data with new tokens
    const fbClient = new FacebookClient(integration.access_token);
    const pagesFromAPI = await fbClient.fetchUserFacebookPages();
    
    let pagesRefreshed = 0;
    
    // Update each page's access token
    for (const pageData of pagesFromAPI) {
      const { error: updateError } = await supabase
        .from('facebook_pages')
        .update({
          page_access_token: pageData.access_token,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageData.id)
        .eq('user_id', user.id);

      if (updateError) {
        console.error(`Error updating page ${pageData.id}:`, updateError);
      } else {
        pagesRefreshed++;
      }
    }

    console.log(`Refreshed ${pagesRefreshed} page access tokens`);
    return { success: true, pagesRefreshed };
  } catch (error) {
    console.error('Page token refresh error:', error);
    return {
      success: false,
      pagesRefreshed: 0,
      error: error instanceof Error ? error.message : 'Failed to refresh page tokens'
    };
  }
}

/**
 * Complete token refresh - refreshes both user and page tokens
 * Call this periodically or when tokens are about to expire
 */
export async function refreshAllTokens(): Promise<{
  success: boolean;
  userTokenRefreshed: boolean;
  pagesRefreshed: number;
  error?: string;
}> {
  console.log('Starting complete token refresh...');
  
  // First refresh user token
  const userResult = await refreshUserAccessToken();
  
  if (!userResult.success) {
    return {
      success: false,
      userTokenRefreshed: false,
      pagesRefreshed: 0,
      error: userResult.error
    };
  }

  // Then refresh page tokens
  const pageResult = await refreshPageAccessTokens();
  
  return {
    success: pageResult.success,
    userTokenRefreshed: true,
    pagesRefreshed: pageResult.pagesRefreshed,
    error: pageResult.error
  };
}

/**
 * Check if tokens need refresh and refresh them if needed
 * This is the main function to call periodically
 */
export async function autoRefreshTokensIfNeeded(): Promise<{
  refreshed: boolean;
  message: string;
}> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { refreshed: false, message: 'Not authenticated' };
  }

  const { data: integration } = await supabase
    .from('social_integrations')
    .select('*')
    .eq('user_id', user.id)
    .eq('platform', 'facebook')
    .single();

  if (!integration) {
    return { refreshed: false, message: 'No Facebook integration found' };
  }

  // Check if refresh is needed
  const needsRefresh = await shouldRefreshToken(integration.token_expires_at);
  
  if (!needsRefresh) {
    console.log('Token is still valid, no refresh needed');
    return { refreshed: false, message: 'Token is still valid' };
  }

  console.log('Token needs refresh, refreshing now...');
  const result = await refreshAllTokens();
  
  if (result.success) {
    return {
      refreshed: true,
      message: `Refreshed user token and ${result.pagesRefreshed} page tokens`
    };
  }

  return {
    refreshed: false,
    message: result.error || 'Failed to refresh tokens'
  };
}

/**
 * Get token expiration info
 */
export async function getTokenExpirationInfo(): Promise<{
  expiresAt: string | null;
  daysUntilExpiration: number | null;
  needsRefresh: boolean;
}> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { expiresAt: null, daysUntilExpiration: null, needsRefresh: true };
  }

  const { data: integration } = await supabase
    .from('social_integrations')
    .select('token_expires_at')
    .eq('user_id', user.id)
    .eq('platform', 'facebook')
    .single();

  if (!integration?.token_expires_at) {
    return { expiresAt: null, daysUntilExpiration: null, needsRefresh: true };
  }

  const expiresAt = integration.token_expires_at;
  const expiresAtMs = new Date(expiresAt).getTime();
  const now = Date.now();
  const daysUntilExpiration = Math.floor((expiresAtMs - now) / (1000 * 60 * 60 * 24));
  const needsRefresh = await shouldRefreshToken(expiresAt);

  return {
    expiresAt,
    daysUntilExpiration,
    needsRefresh
  };
}