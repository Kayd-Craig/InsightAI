import {
    FacebookPageFromAPI,
    FacebookInsightFromAPI,
    FacebookPostFromAPI
} from './types/api'
import {
    FieldType, 
    FacebookFieldsHelper
} from './utils/fields/fields_helper'

// This will be used to get all metrics we can get
// Metrics we can get are established in './fields/facebook_fields.json'
const facebookFieldsHelper = new FacebookFieldsHelper();

// CLASS
export class FacebookClient {
  private accessToken: string;
  private baseUrl = 'https://graph.facebook.com';
  private helper: FacebookFieldsHelper;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
    this.helper = facebookFieldsHelper;
  }

  // fetch METHOD
  private async fetch<T>(endpoint: string, params: Record<string, string> = {}, accessTokenOverride?: string): Promise<T> {
    const apiVersion = process.env.NEXT_PUBLIC_META_API_VERSION;
    const url = new URL(`${this.baseUrl}/${apiVersion}/${endpoint}`);
    const tokenToUse = accessTokenOverride || this.accessToken;
    url.searchParams.append('access_token', tokenToUse);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Facebook API Error: ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  // DEFINE ALL GET FUNCTIONS
  // Get the pages a User has
  async fetchUserFacebookPages(): Promise<FacebookPageFromAPI[]> {
    const response = await this.fetch<{ data: FacebookPageFromAPI[] }>('/me/accounts', {
      fields: 'id,name,access_token,category,follower_count'
    });
    return response.data;
  }


  async fetchPageInsights(
    pageId: string, 
    pageAccessToken: string,
    period: string = 'day',
    fields?: string[],
    fieldType: FieldType = 'facebook_page_insights'
  ): Promise<FacebookInsightFromAPI[]> {
    // If fields not specified, get all fields for this type and period
    const fieldsToFetch = fields || this.helper.getFieldsByPeriod(fieldType, period);
    
    if (fieldsToFetch.length === 0) {
      throw new Error(`No fields available for period: ${period}`);
    }

    // Chunk metrics if there are too many (Facebook API limits)
    const fieldChunks = this.helper.chunkFields(fieldsToFetch, 50);
    const allResults: FacebookInsightFromAPI[] = [];

    // Fetch each chunk
    for (const chunk of fieldChunks) {
      const response = await this.fetch<{ data: FacebookInsightFromAPI[] }>(`/${pageId}/insights`,
        {
          metric: chunk.join(','),
          period: period
        },
        pageAccessToken
      );
      allResults.push(...response.data);
    }
    return allResults;
  }

  // Get all user's posts
  async fetchFacebookUserPosts(
    userId: string
  ): Promise<FacebookPostFromAPI> {
    const response = await this.fetch<FacebookPostFromAPI>(`/${userId}/posts`, {
    });

    return response;
  }

  // Get Posts
  async fetchFacebookPostMetadata(
    postId: string,
    fields?: string[],
    fieldType: FieldType = 'facebook_post_metadata'
  ): Promise<FacebookPostFromAPI> {
    // If fields not specified, get all fields for this field type
    const fieldsToFetch = fields || this.helper.getFieldNames(fieldType);
    
    if (fieldsToFetch.length === 0) {
      throw new Error(`No fields available for field type: ${fieldType}`);
    }

    const response = await this.fetch<FacebookPostFromAPI>(`/${postId}`, 
      {
        fields: fieldsToFetch.join(',')
      }
    );
    return response;
  }

  // Get posts from a page
  async fetchFacebookPagePosts(
    pageId: string,
    pageAccessToken: string,
    limit: number = 25,
    fields?: string[],
    fieldType: FieldType = 'facebook_post_metadata'
  ): Promise<FacebookPostFromAPI[]> {
    // If fields not specified, get all fields for this field type
    const fieldsToFetch = fields || this.helper.getFieldNames(fieldType);
    
    if (fieldsToFetch.length === 0) {
      throw new Error(`No fields available for field type: ${fieldType}`);
    }

    const response = await this.fetch<{ data: FacebookPostFromAPI[] }>(`/${pageId}/posts`, 
      { limit: limit.toString() },
      pageAccessToken
    );

    return response.data;
  }

  async fetchFacebookPagePostMetadata(
    postId: string,
    pageAccessToken: string,
    fields?: string[],
    fieldType: FieldType = 'facebook_post_metadata'
  ): Promise<FacebookPostFromAPI> {
    // If fields not specified, get all fields for this field type
    const fieldsToFetch = fields || this.helper.getFieldNames(fieldType);
    
    if (fieldsToFetch.length === 0) {
      throw new Error(`No fields available for field type: ${fieldType}`);
    }

    const response = await this.fetch<FacebookPostFromAPI>(`/${postId}`, 
      {
        fields: fieldsToFetch.join(',')
      },
      pageAccessToken
    );
    return response;
  }

  // Get Post Insights
  async fetchPagePostInsights(
    postId: string,
    pageAccessToken: string,
    period: string = 'day',
    fields?: string[],
    fieldType: FieldType = 'facebook_page_posts_insights'
  ): Promise<FacebookInsightFromAPI[]> {
    // If metrics not specified, get all metrics for posts and period
    const fieldsToFetch = fields || this.helper.getFieldsByPeriod(fieldType, period);
    
    if (fieldsToFetch.length === 0) {
      throw new Error(`No fields available for period: ${period}`);
    }

    // Chunk metrics if there are too many
    const fieldChunks = this.helper.chunkFields(fieldsToFetch, 50);
    const allResults: FacebookInsightFromAPI[] = [];

    // Fetch each chunk
    for (const chunk of fieldChunks) {
      const response = await this.fetch<{ data: FacebookInsightFromAPI[] }>(`/${postId}/insights`, {
        metric: chunk.join(','),
        period: period
      },
      pageAccessToken
    );
      allResults.push(...response.data);
    }
    return allResults;
  }
}