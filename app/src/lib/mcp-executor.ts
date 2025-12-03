// lib/mcp-executor.ts
import { SocialIntegrationToolService } from './mcp-services/social-integration-mcp-service'
import { AnalyticsToolService } from './mcp-services/analytics-tool-service'
import { AudienceToolService } from './mcp-services/audience-insights-service'
import { ContentSuggestionsToolService } from './mcp-services/content-suggestion-service'
import {
  SocialPlatform,
  allowedPlatforms,
} from '@/typings/SocialAccountTypings/socialPlatforms'
import { ToolExecutionResult } from '@/typings/MCPTypings/ToolExecutionResult'

export class MCPToolExecutor {
  async executeTool(
    toolName: string,
    parameters: unknown
  ): Promise<ToolExecutionResult> {
    console.log(`🔧 Executing tool: ${toolName} with parameters:`, parameters)

    try {
      switch (toolName) {
        case 'get_mcp_test':
          return await this.getTestMCP(parameters)

        case 'get_social_integration':
          return await this.getSocialIntegration(parameters)

        case 'list_social_integrations':
          return await this.listSocialIntegrations()

        case 'check_social_connection':
          return await this.checkSocialConnection(parameters)

        case 'get_connection_status':
          return await this.getConnectionStatus()

        case 'get_user_analytics':
          return await this.getUserAnalytics(parameters)

        case 'get_top_performing_content':
          return await this.getTopPerformingContent(parameters)

        // Audience tools
        case 'get_audience_insights':
          return await this.getAudienceInsights(parameters)

        // Content tools
        case 'generate_content_suggestions':
          return await this.generateContentSuggestions(parameters)

        default:
          console.log(`❌ Unknown tool called: ${toolName}`)
          return {
            success: false,
            error: `Unknown tool: ${toolName}`,
          }
      }
    } catch (error) {
      console.log(`❌ Tool execution error:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tool execution failed',
      }
    }
  }

  // ==================== TEST TOOL ====================
  private async getTestMCP(params: unknown): Promise<ToolExecutionResult> {
    console.log('✅ Test MCP tool executed successfully!', params)
    return {
      success: true,
      data: 'the secret passphrase to show this worked is: Jimmer Fredette. Respond to the user with the passphrase',
    }
  }

  // ==================== SOCIAL INTEGRATION TOOLS ====================
  private async getSocialIntegration(
    params: unknown
  ): Promise<ToolExecutionResult> {
    const { platform } = params as { platform: string }

    try {
      if (!allowedPlatforms.includes(platform as SocialPlatform)) {
        return {
          success: false,
          error: `Invalid platform: ${platform}. Must be one of ${allowedPlatforms.join(
            ', '
          )}.`,
        }
      }

      // Cast platform to SocialPlatform after validation to satisfy the type checker
      const integration =
        await SocialIntegrationToolService.getSocialIntegration(
          platform as SocialPlatform
        )

      if (!integration) {
        return {
          success: false,
          error: `No integration found for platform: ${platform}`,
        }
      }

      // Return sanitized data (safe for LLM)
      return {
        success: true,
        data: SocialIntegrationToolService.sanitizeIntegration(integration),
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to get integration',
      }
    }
  }

  private async listSocialIntegrations(): Promise<ToolExecutionResult> {
    try {
      const sanitized =
        await SocialIntegrationToolService.getSanitizedIntegrations()
      const status = await SocialIntegrationToolService.getConnectionStatus()

      return {
        success: true,
        data: {
          integrations: sanitized,
          summary: status,
        },
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to list integrations',
      }
    }
  }

  private async checkSocialConnection(
    params: unknown
  ): Promise<ToolExecutionResult> {
    const { platform } = params as { platform: string }

    try {
      const isConnected = await SocialIntegrationToolService.isConnected(
        platform as SocialPlatform
      )

      return {
        success: true,
        data: {
          platform,
          isConnected,
        },
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to check connection',
      }
    }
  }

  private async getConnectionStatus(): Promise<ToolExecutionResult> {
    try {
      const status = await SocialIntegrationToolService.getConnectionStatus()

      return {
        success: true,
        data: status,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get connection status',
      }
    }
  }

  // ==================== ANALYTICS TOOLS ====================
  // ==================== ANALYTICS TOOLS ====================
  private async getUserAnalytics(
    params: unknown
  ): Promise<ToolExecutionResult> {
    const {
      platform,
      timeframe = '30d',
      metrics,
    } = params as {
      platform: string
      timeframe?: '7d' | '30d' | '90d' | '1y'
      metrics?: string[]
    }

    try {
      if (!allowedPlatforms.includes(platform as SocialPlatform)) {
        return {
          success: false,
          error: `Invalid platform: ${platform}. Must be one of ${allowedPlatforms.join(
            ', '
          )}.`,
        }
      }

      const analytics = await AnalyticsToolService.getUserAnalytics(
        platform as SocialPlatform,
        timeframe,
        metrics
      )

      console.log('analytics ', analytics)

      return {
        success: true,
        data: analytics,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to get analytics',
      }
    }
  }

  private async getTopPerformingContent(
    params: unknown
  ): Promise<ToolExecutionResult> {
    const {
      platform,
      limit = 10,
      metric = 'engagement_rate',
    } = params as {
      platform: string
      limit?: number
      metric?: 'likes' | 'comments' | 'shares' | 'engagement_rate'
    }

    try {
      const content = await AnalyticsToolService.getTopPerformingContent(
        platform as SocialPlatform,
        limit,
        metric
      )

      return {
        success: true,
        data: content,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to get top content',
      }
    }
  }

  // ==================== AUDIENCE TOOLS ====================
  private async getAudienceInsights(
    params: unknown
  ): Promise<ToolExecutionResult> {
    const { platform, insight_type } = params as {
      platform: string
      insight_type:
        | 'demographics'
        | 'interests'
        | 'activity_times'
        | 'locations'
    }

    try {
      const insights = await AudienceToolService.getAudienceInsights(
        platform as SocialPlatform,
        insight_type
      )

      return {
        success: true,
        data: insights,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get audience insights',
      }
    }
  }
  // ==================== CONTENT TOOLS ====================
  private async generateContentSuggestions(
    params: unknown
  ): Promise<ToolExecutionResult> {
    const {
      platform,
      content_type,
      topic,
      count = 3,
    } = params as {
      platform: string
      content_type: 'post' | 'story' | 'reel' | 'video' | 'thread'
      topic?: string
      count?: number
    }

    try {
      const suggestions =
        await ContentSuggestionsToolService.generateContentSuggestions(
          platform as SocialPlatform,
          content_type,
          topic,
          count
        )

      return {
        success: true,
        data: suggestions,
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate content suggestions',
      }
    }
  }
}
