export class UserSocialAnalytics {
  public userId: string
  public lastUpdated: Date

  private data: { [platform: string]: number[] } = {}
  private static readonly METRICS = {
    FOLLOWERS: 0,
    FOLLOWING: 1,
    POSTS: 2,
    LIKES: 3,
    COMMENTS: 4,
    SHARES: 5,
    VIEWS: 6,
    IMPRESSIONS: 7,
    REACH: 8,
    ENGAGEMENT_RATE: 9,
  }

  constructor(userId: string) {
    this.userId = userId
    this.lastUpdated = new Date()
  }

  public set(platform: string, metrics: number[]): void {
    this.data[platform] = metrics
    this.lastUpdated = new Date()
  }

  public get(platform: string, metricIndex: number): number {
    return this.data[platform]?.[metricIndex] ?? 0
  }

  public getPlatform(platform: string): number[] {
    return this.data[platform] ?? []
  }

  public getEngagementRate(platform: string): number {
    const followers = this.get(platform, UserSocialAnalytics.METRICS.FOLLOWERS)
    const likes = this.get(platform, UserSocialAnalytics.METRICS.LIKES)
    const comments = this.get(platform, UserSocialAnalytics.METRICS.COMMENTS)
    const shares = this.get(platform, UserSocialAnalytics.METRICS.SHARES)

    if (followers === 0) return 0
    return Number((((likes + comments + shares) / followers) * 100).toFixed(2))
  }

  // public toJSON(): object {
  //   const summary: any = {
  //     userId: this.userId,
  //     updated: this.lastUpdated.toISOString(),
  //   }

  //   for (const [platform, metrics] of Object.entries(this.data)) {
  //     summary[platform] = {
  //       followers: metrics[0] ?? 0,
  //       engagement: this.getEngagementRate(platform),
  //       metrics: metrics,
  //     }
  //   }

  //   return summary
  // }

  public static getContextPrompt(): string {
    return `Answer the user's question with the help of their analytics if needed, keep your output to max 500 words. Analytics data format: {userId, updated, platform: {followers, engagement%, metrics: [followers,following,posts,likes,comments,shares,views,impressions,reach,eng_rate,platform_specific...]}}.`
  }

  public buildAPIMessage(
    userMessage: string
  ): { role: 'user' | 'assistant'; content: string }[] {
    console.log('build fucntion called ', userMessage)
    return [
      {
        role: 'user',
        content: `User question: ${userMessage}`,
      },
    ]
  }
  static getMETRICS() {
    return UserSocialAnalytics.METRICS
  }
}
