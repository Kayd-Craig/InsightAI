export const oauthService = {
    // Initiates Facebook login, redirecting back to auth/facebook/callback
    initiateFacebookLogin() {
        const redirectUri = `${window.location.origin}/auth/facebook/callback`;
        // all the permissions for user to grant
        const scope = process.env.NEXT_PUBLIC_META_SCOPE || 'public_profile,email,pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_insights,pages_read_user_content';
        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
        const api_version = process.env.NEXT_PUBLIC_META_API_VERSION;

        // build the auth url
        const authUrl = `https://www.facebook.com/${api_version}/dialog/oauth?` +
            `client_id=${appId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&response_type=code` +
            `&state=${this.generateState()}`; // random state

        window.location.href = authUrl;
    },

    // Initiates Instagram login, redirecting back to auth/instagrma/callback
    initiateInstagramLogin() {
        const redirectUri = `${window.location.origin}/auth/instagram/callback`;
        // all the permissions for user to grant
        const scope = 'user_profile,user_media';
        const appId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;

        // build the auth url
        const authUrl = `https://api.instagram.com/oauth/authorize?` +
            `client_id=${appId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&response_type=code` +
            `&state=${this.generateState()}`; // random state

        window.location.href = authUrl;
    },

    // Generates random state for oauth for security
    generateState(): string {
        const state = Math.random().toString(36).substring(7);
        sessionStorage.setItem('oauth_state', state);
        return state;
    },

    // Ensures user knows random state
    validateState(state: string): boolean {
        const savedState = sessionStorage.getItem('oauth_state');
        sessionStorage.removeItem('oauth_state');
        return state === savedState;
    },
};