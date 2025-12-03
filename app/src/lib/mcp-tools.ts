export interface MCPTool {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export const MCP_TOOLS: MCPTool[] = [
  {
    name: 'get_mcp_test',
    description:
      'A test function to make sure our tools work. If the prompt is just the word: test, then use this rule',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_user_analytics',
    description:
      'Get social media analytics for a specific platform and time period',
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['instagram', 'twitter', 'tiktok', 'youtube', 'facebook'],
          description: 'Social media platform to get analytics for',
        },
        timeframe: {
          type: 'string',
          enum: ['7d', '30d', '90d', '1y'],
          description: 'Time period for analytics',
          default: '30d',
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['followers', 'engagement', 'reach', 'impressions', 'clicks'],
          },
          description: 'Specific metrics to retrieve',
        },
      },
      required: ['platform'],
    },
  },
  {
    name: 'get_top_performing_content',
    description: "Get the user's top performing content by engagement",
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['instagram', 'twitter', 'tiktok', 'youtube', 'facebook'],
        },
        limit: {
          type: 'number',
          description: 'Number of top posts to return',
          default: 10,
          minimum: 1,
          maximum: 50,
        },
        metric: {
          type: 'string',
          enum: ['likes', 'comments', 'shares', 'engagement_rate'],
          default: 'engagement_rate',
        },
      },
      required: ['platform'],
    },
  },
  {
    name: 'get_audience_insights',
    description: 'Get detailed audience demographics and interests',
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['instagram', 'twitter', 'tiktok', 'youtube', 'facebook'],
        },
        insight_type: {
          type: 'string',
          enum: ['demographics', 'interests', 'activity_times', 'locations'],
          description: 'Type of audience insight to retrieve',
        },
      },
      required: ['platform', 'insight_type'],
    },
  },
  {
    name: 'generate_content_suggestions',
    description:
      'Generate content suggestions based on current trends and user performance',
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['instagram', 'twitter', 'tiktok', 'youtube', 'facebook'],
        },
        content_type: {
          type: 'string',
          enum: ['post', 'story', 'reel', 'video', 'thread'],
          description: 'Type of content to suggest',
        },
        topic: {
          type: 'string',
          description: 'Optional topic or theme for content suggestions',
        },
        count: {
          type: 'number',
          default: 5,
          minimum: 1,
          maximum: 20,
        },
      },
      required: ['platform', 'content_type'],
    },
  },
  {
    name: 'get_social_integration',
    description: 'Get details about a specific connected social media platform',
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: [
            'facebook',
            'instagram',
            'twitter',
            'tiktok',
            'linkedin',
            'youtube',
          ],
          description: 'The social media platform to check',
        },
      },
      required: ['platform'],
    },
  },
  {
    name: 'list_social_integrations',
    description: 'List all connected social media integrations for the user',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'check_social_connection',
    description:
      'Check if a specific social media platform is connected and active',
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: [
            'facebook',
            'instagram',
            'twitter',
            'tiktok',
            'linkedin',
            'youtube',
          ],
          description: 'The social media platform to check',
        },
      },
      required: ['platform'],
    },
  },
  {
    name: 'get_connection_status',
    description: 'Get a summary of all social media connection statuses',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
]
