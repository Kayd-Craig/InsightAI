// lib/mcp-services/social-integration-tool-service.ts
import {
  socialIntegrationService,
  type SocialIntegration,
} from '@/lib/integrationService/server'

/**
 * Tool-friendly wrapper around the social integration service
 * Adds convenience methods for MCP tools without modifying the original service
 */
export class SocialIntegrationToolService {
  /**
   * Get a specific social integration by platform
   */
  static async getSocialIntegration(platform: SocialIntegration['platform']) {
    return await socialIntegrationService.getSocialIntegration(platform)
  }

  /**
   * Get all social integrations for the authenticated user
   */
  static async getAllSocialIntegrations() {
    return await socialIntegrationService.getUserSocialIntegrations()
  }

  /**
   * Check if a platform is connected and active
   */
  static async isConnected(platform: SocialIntegration['platform']) {
    const integration = await this.getSocialIntegration(platform)
    return !!integration && integration.is_active
  }

  /**
   * Get connection status summary
   */
  static async getConnectionStatus() {
    const integrations = await this.getAllSocialIntegrations()
    const active = integrations.filter((i) => i.is_active)

    return {
      connected: active.map((i) => i.platform),
      total: active.length,
      allIntegrations: integrations.length,
      byStatus: this.groupByStatus(integrations),
    }
  }

  /**
   * Get sanitized integration data (safe for LLM)
   * Removes sensitive tokens and credentials
   */
  static sanitizeIntegration(integration: SocialIntegration) {
    return {
      platform: integration.platform,
      platform_username: integration.platform_username,
      platform_email: integration.platform_email,
      is_active: integration.is_active,
      connection_status: integration.connection_status,
      last_authenticated_at: integration.last_authenticated_at,
      last_sync_at: integration.last_sync_at,
      last_error: integration.last_error,
      created_at: integration.created_at,
    }
  }

  /**
   * Get sanitized list of all integrations
   */
  static async getSanitizedIntegrations() {
    const integrations = await this.getAllSocialIntegrations()
    return integrations.map((i) => this.sanitizeIntegration(i))
  }

  /**
   * Helper: Group integrations by status
   */
  private static groupByStatus(integrations: SocialIntegration[]) {
    return integrations.reduce((acc, integration) => {
      const status = integration.connection_status
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(integration.platform)
      return acc
    }, {} as Record<string, string[]>)
  }
}
